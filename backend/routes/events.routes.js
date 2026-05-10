const express = require("express");
const { body, param, query, validationResult } = require("express-validator");
const pool = require("../config/db");
const { authRequired } = require("../middleware/auth");
const { requireRole } = require("../middleware/rbac");
const {
  createEvent,
  autoAssignJudge,
  updateEventStatus,
  refreshEventStatus,
} = require("../services/event.service");

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
          COALESCE(SUM(CASE WHEN r.status = 'confirmed' THEN 1 ELSE 0 END), 0) AS registered_participants,
          e.registration_fee,
          e.prize_pool,
          e.sponsorship_total,
          e.total_prize_pool,
          e.event_status,
          e.assigned_judge_id,
          v.venue_id,
          v.venue_name
        FROM events e
        LEFT JOIN registrations r ON r.event_id = e.event_id
        LEFT JOIN venues v ON v.venue_id = e.venue_id
        ${where.length ? "WHERE " + where.join(" AND ") : ""}
        GROUP BY e.event_id, v.venue_id, v.venue_name
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
          v.capacity AS venue_capacity,
          j.user_id AS assigned_judge_id,
          j.name AS assigned_judge_name,
          j.email AS assigned_judge_email
        FROM events e
        LEFT JOIN venues v ON v.venue_id = e.venue_id
        LEFT JOIN users j ON j.user_id = e.assigned_judge_id
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
    body("start_time").optional().isString().matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    body("end_time").optional().isString().matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    body("max_participants").isInt({ min: 1 }),
    body("venue_id").optional({ nullable: true }).isInt(),
    body("registration_fee").isFloat({ min: 0 }),
    body("prize_pool").optional().isFloat({ min: 0 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

      const b = req.body;
      const payload = {
        event_name: b.event_name,
        description: b.description || null,
        category: b.category,
        event_date: String(b.event_date).slice(0, 10),
        start_time: b.start_time || null,
        end_time: b.end_time || null,
        max_participants: b.max_participants,
        venue_id: b.venue_id ?? null,
        registration_fee: b.registration_fee,
        prize_pool: b.prize_pool ?? 0,
      };

      const result = await createEvent(payload, req.user.user_id);
      return res.status(201).json({ success: true, data: result });
    } catch (err) {
      if (err.code === "VENUE_CONFLICT") {
        return res.status(409).json({ success: false, error: err.message });
      }
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
    body("start_time").optional().isString().matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    body("end_time").optional().isString().matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    body("max_participants").optional().isInt({ min: 1 }),
    body("venue_id").optional({ nullable: true }).isInt(),
    body("registration_fee").optional().isFloat({ min: 0 }),
    body("prize_pool").optional().isFloat({ min: 0 }),
    body("event_status").optional().isIn(["draft","open","full","ongoing","completed","cancelled"]),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

      const eventId = Number(req.params.id);
      const fields = [];
      const params = [];
      const allowed = [
        "event_name",
        "description",
        "category",
        "event_date",
        "start_time",
        "end_time",
        "max_participants",
        "venue_id",
        "registration_fee",
        "prize_pool",
        "event_status",
      ];
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

      if (req.body.max_participants || req.body.event_status) {
        await refreshEventStatus(eventId);
      }

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
