const express = require("express");
const { body, validationResult } = require("express-validator");
const pool = require("../config/db");
const { authRequired } = require("../middleware/auth");
const { requireRole } = require("../middleware/rbac");

const router = express.Router();

// List judges with assigned counts
router.get("/", authRequired, requireRole(["admin", "organizer"]), async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT j.judge_id, j.name, j.email, j.contact, j.assigned_events_count,
        COUNT(ej.event_judge_id) AS assigned_now
      FROM judges j
      LEFT JOIN event_judges ej ON ej.judge_id = j.judge_id
      GROUP BY j.judge_id, j.name, j.email, j.contact, j.assigned_events_count
      ORDER BY j.assigned_events_count ASC, j.judge_id ASC
      `
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
});

// Create a judge and optionally auto-assign pending events
router.post(
  "/",
  authRequired,
  requireRole(["admin", "organizer"]),
  [body("name").isString().trim().isLength({ min: 2 }), body("email").isEmail().normalizeEmail(), body("contact").optional().isString()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

      const { name, email, contact } = req.body;

      const [insertRes] = await pool.query("INSERT INTO judges (name, email, contact) VALUES (?, ?, ?)", [name, email, contact ?? null]);
      const newJudgeId = insertRes.insertId;

      // Auto-assign pending unassigned events: iterate unassigned events and assign least-busy judge
      try {
        const [unassigned] = await pool.query(
          `SELECT e.event_id FROM events e WHERE NOT EXISTS (SELECT 1 FROM event_judges ej WHERE ej.event_id = e.event_id) ORDER BY e.event_date ASC`
        );

        for (const ev of unassigned) {
          // pick least-busy judge (current)
          const [[leastBusy]] = await pool.query(
            `
            SELECT j.judge_id, j.assigned_events_count
            FROM judges j
            LEFT JOIN event_judges ej ON ej.judge_id = j.judge_id
            GROUP BY j.judge_id
            ORDER BY j.assigned_events_count ASC, COUNT(ej.event_judge_id) ASC, j.judge_id ASC
            LIMIT 1
            `
          );
          if (leastBusy && leastBusy.judge_id) {
            await pool.query("INSERT IGNORE INTO event_judges (event_id, judge_id) VALUES (?, ?)", [ev.event_id, leastBusy.judge_id]);
            await pool.query("UPDATE judges SET assigned_events_count = assigned_events_count + 1 WHERE judge_id = ?", [leastBusy.judge_id]);
          }
        }
      } catch (assignErr) {
        console.error("Error assigning unassigned events after judge creation:", assignErr);
      }

      return res.status(201).json({ success: true, data: { judge_id: newJudgeId } });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
