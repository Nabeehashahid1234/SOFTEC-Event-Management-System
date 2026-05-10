const express = require("express");
const { body, param, validationResult } = require("express-validator");
const pool = require("../config/db");
const { authRequired } = require("../middleware/auth");
const { requireRole } = require("../middleware/rbac");

const router = express.Router();

router.post(
  "/",
  authRequired,
  requireRole(["judge", "admin"]),
  [body("event_id").isInt(), body("participant_id").isInt(), body("score").isFloat({ min: 0, max: 10 }), body("comments").optional().isString()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

      const userId = req.user.user_id;
      const { event_id, participant_id, score, comments } = req.body;

      const [[judgeRow]] = await pool.query(
        `
        SELECT j.judge_id
        FROM judges j
        JOIN users u ON u.email = j.email
        WHERE u.user_id = ?
        LIMIT 1
        `,
        [userId]
      );

      if (!judgeRow && req.user.role !== "admin") {
        return res.status(400).json({ success: false, error: "Judge profile not found for this user" });
      }

      const judgeId = judgeRow?.judge_id;
      if (!judgeId) {
        return res.status(400).json({ success: false, error: "No judge profile associated with this account" });
      }

      const [[assignment]] = await pool.query(
        "SELECT event_judge_id FROM event_judges WHERE judge_id = ? AND event_id = ? LIMIT 1",
        [judgeId, event_id]
      );

      if (!assignment) {
        return res.status(403).json({ success: false, error: "You are not assigned to judge this event" });
      }

      const [result] = await pool.query(
        `
        INSERT INTO judging (event_id, judge_id, participant_id, score, comments)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE score = VALUES(score), comments = VALUES(comments), judged_at = CURRENT_TIMESTAMP
        `,
        [event_id, judgeId, participant_id, score, comments ?? null]
      );

      return res.status(201).json({ success: true, data: { judging_id: result.insertId || null, score } });
    } catch (err) {
      return next(err);
    }
  }
);

router.get("/:eventId", authRequired, requireRole(["judge", "organizer", "admin"]), [param("eventId").isInt()], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: "Invalid event id" });

    const eventId = Number(req.params.eventId);
    const [rows] = await pool.query(
      `
      SELECT
        j.judging_id,
        j.score,
        j.comments,
        j.judged_at,
        jg.judge_id,
        jg.name AS judge_name,
        p.participant_id,
        u.name AS participant_name,
        u.email
      FROM judging j
      JOIN judges jg ON j.judge_id = jg.judge_id
      JOIN participants p ON j.participant_id = p.participant_id
      JOIN users u ON p.user_id = u.user_id
      WHERE j.event_id = ?
      ORDER BY j.judged_at DESC
      `,
      [eventId]
    );

    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;