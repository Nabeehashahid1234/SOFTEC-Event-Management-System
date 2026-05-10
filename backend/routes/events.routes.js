const express = require("express");
const { body, param, query, validationResult } = require("express-validator");
const pool = require("../config/db");
const { authRequired } = require("../middleware/auth");
const { requireRole } = require("../middleware/rbac");

const router = express.Router();

router.get(
  "/",
  [
    query("category").optional().isString(),
    query("from").optional().isISO8601(),
    query("to").optional().isISO8601(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, error: "Invalid filters" });

      const { category, from, to } = req.query;
      const where = [];
      const params = [];

      if (category) {
        where.push("e.category = ?");
        params.push(category);
      }
      if (from) {
        where.push("e.event_date >= ?");
        params.push(String(from).slice(0, 10));
      }
      if (to) {
        where.push("e.event_date <= ?");
        params.push(String(to).slice(0, 10));
      }

      const sql = `
        SELECT
          e.event_id,
          e.event_name,
          e.description,
          e.category,
          e.event_date,
          e.max_participants,
          e.registered_participants,
          e.registration_fee,
          COALESCE(e.prize_pool, 0) AS prize_pool,
          v.venue_id,
          v.venue_name
        FROM events e
        LEFT JOIN venues v ON v.venue_id = e.venue_id
        ${where.length ? "WHERE " + where.join(" AND ") : ""}
        ORDER BY e.event_date ASC
      `;

      const [rows] = await pool.query(sql, params);
      return res.json({ success: true, data: rows });
    } catch (err) {
      return next(err);
    }
  }
);

router.get(
  "/:id",
  [param("id").isInt()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, error: "Invalid id" });

      const eventId = Number(req.params.id);
      const [events] = await pool.query(
        `
        SELECT
          e.*,
          v.venue_name,
          v.capacity AS venue_capacity
        FROM events e
        LEFT JOIN venues v ON v.venue_id = e.venue_id
        WHERE e.event_id = ?
        LIMIT 1
        `,
        [eventId]
      );

      if (!events.length) return res.status(404).json({ success: false, error: "Event not found" });

      const [rounds] = await pool.query(
        "SELECT * FROM event_rounds WHERE event_id = ? ORDER BY round_date ASC",
        [eventId]
      );

      const [leaderboard] = await pool.query("CALL sp_get_leaderboard(?)", [eventId]);

      return res.json({
        success: true,
        data: {
          event: events[0],
          rounds,
          leaderboard: leaderboard[0] || [],
        },
      });
    } catch (err) {
      return next(err);
    }
  }
);

router.post(
  "/",
  authRequired,
  requireRole(["admin", "organizer"]),
  [
    body("event_name").isString().trim().isLength({ min: 2, max: 160 }),
    body("description").optional().isString(),
    body("category").isIn(["Tech Events", "Business Competitions", "Gaming Tournaments", "General Events"]),
    body("event_date").isISO8601(),
    body("max_participants").isInt({ min: 1 }),
    body("venue_id").optional({ nullable: true }).isInt(),
    body("organizer_id").optional({ nullable: true }).isInt(),
    body("registration_fee").isFloat({ min: 0 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

      const b = req.body;
      const [result] = await pool.query(
        `
        INSERT INTO events (event_name, description, category, event_date, max_participants, venue_id, organizer_id, registration_fee)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          b.event_name,
          b.description || null,
          b.category,
          String(b.event_date).slice(0, 10),
          b.max_participants,
          b.venue_id ?? null,
          b.organizer_id ?? req.user.user_id,
          b.registration_fee,
        ]
      );

      // Attempt automatic judge assignment: pick least-busy judge
      try {
        const [[leastBusy]] = await pool.query(
          `
          SELECT j.judge_id, COUNT(ej.event_judge_id) AS assigned_count
          FROM judges j
          LEFT JOIN event_judges ej ON ej.judge_id = j.judge_id
          GROUP BY j.judge_id
          ORDER BY assigned_count ASC, j.judge_id ASC
          LIMIT 1
          `
        );

        if (leastBusy && leastBusy.judge_id) {
          await pool.query("INSERT IGNORE INTO event_judges (event_id, judge_id) VALUES (?, ?)", [result.insertId, leastBusy.judge_id]);
          await pool.query("UPDATE judges SET assigned_events_count = assigned_events_count + 1 WHERE judge_id = ?", [leastBusy.judge_id]);
        }
      } catch (assignErr) {
        console.error("Automatic judge assignment failed:", assignErr);
      }

      return res.status(201).json({ success: true, data: { event_id: result.insertId } });
    } catch (err) {
      return next(err);
    }
  }
);

router.patch(
  "/:id",
  authRequired,
  requireRole(["admin", "organizer"]),
  [
    param("id").isInt(),
    body("event_name").optional().isString().trim().isLength({ min: 2, max: 160 }),
    body("description").optional({ nullable: true }).isString(),
    body("category").optional().isIn(["Tech Events", "Business Competitions", "Gaming Tournaments", "General Events"]),
    body("event_date").optional().isISO8601(),
    body("max_participants").optional().isInt({ min: 1 }),
    body("venue_id").optional({ nullable: true }).isInt(),
    body("registration_fee").optional().isFloat({ min: 0 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

      const eventId = Number(req.params.id);
      const fields = [];
      const params = [];
      const allowed = ["event_name", "description", "category", "event_date", "max_participants", "venue_id", "registration_fee"];
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(req.body, key)) {
          fields.push(`${key} = ?`);
          if (key === "event_date") params.push(String(req.body[key]).slice(0, 10));
          else params.push(req.body[key]);
        }
      }
      if (!fields.length) return res.status(400).json({ success: false, error: "No fields to update" });

      params.push(eventId);
      const [result] = await pool.query(`UPDATE events SET ${fields.join(", ")} WHERE event_id = ?`, params);
      if (!result.affectedRows) return res.status(404).json({ success: false, error: "Event not found" });

      return res.json({ success: true, data: { event_id: eventId } });
    } catch (err) {
      return next(err);
    }
  }
);

router.delete(
  "/:id",
  authRequired,
  requireRole(["admin", "organizer"]),
  [param("id").isInt()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, error: "Invalid id" });
      const [result] = await pool.query("DELETE FROM events WHERE event_id = ?", [Number(req.params.id)]);
      if (!result.affectedRows) return res.status(404).json({ success: false, error: "Event not found" });
      return res.json({ success: true, data: { deleted: true } });
    } catch (err) {
      return next(err);
    }
  }
);

router.post(
  "/:id/rounds",
  authRequired,
  requireRole(["admin", "organizer"]),
  [
    param("id").isInt(),
    body("prelim_date").isISO8601(),
    body("semi_date").isISO8601(),
    body("final_date").isISO8601(),
    body("venue_id").isInt(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });
      const eventId = Number(req.params.id);
      const { prelim_date, semi_date, final_date, venue_id } = req.body;
      await pool.query("CALL sp_schedule_event_rounds(?, ?, ?, ?, ?)", [
        eventId,
        prelim_date,
        semi_date,
        final_date,
        venue_id,
      ]);
      return res.status(201).json({ success: true, data: { event_id: eventId } });
    } catch (err) {
      return next(err);
    }
  }
);

router.post(
  "/:id/judges",
  authRequired,
  requireRole(["admin", "organizer"]),
  [param("id").isInt(), body("judge_ids").isArray({ min: 1 })],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });
      const eventId = Number(req.params.id);
      const judgeIds = req.body.judge_ids.map((x) => Number(x)).filter((x) => Number.isInteger(x));
      if (!judgeIds.length) return res.status(400).json({ success: false, error: "No valid judge ids" });

      const values = judgeIds.map((jid) => [eventId, jid]);
      const [result] = await pool.query(
        "INSERT IGNORE INTO event_judges (event_id, judge_id) VALUES ?",
        [values]
      );
      return res.status(201).json({ success: true, data: { assigned: result.affectedRows } });
    } catch (err) {
      return next(err);
    }
  }
);

router.get("/:id/leaderboard", [param("id").isInt()], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: "Invalid id" });
    const [rows] = await pool.query("CALL sp_get_leaderboard(?)", [Number(req.params.id)]);
    return res.json({ success: true, data: rows[0] || [] });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
