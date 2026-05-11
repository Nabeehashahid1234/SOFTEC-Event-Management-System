const express = require("express");
const { body, param, query, validationResult } = require("express-validator");
const pool = require("../config/db");
const { authRequired } = require("../middleware/auth");
const { requireRole } = require("../middleware/rbac");

const router = express.Router();

async function assignLeastBusyJudge(connection, eventId) {
  const [[judge]] = await connection.query(
    `
    SELECT j.judge_id, COUNT(ej.event_judge_id) AS assigned_count
    FROM judges j
    LEFT JOIN event_judges ej ON ej.judge_id = j.judge_id
    GROUP BY j.judge_id
    ORDER BY COUNT(ej.event_judge_id) ASC, j.judge_id ASC
    LIMIT 1
    `
  );

  if (!judge) return null;

  const [assignment] = await connection.query("INSERT IGNORE INTO event_judges (event_id, judge_id) VALUES (?, ?)", [eventId, judge.judge_id]);
  if (assignment.affectedRows > 0) {
    // Note: If assigned_events_count column exists, update it; otherwise, rely on count
    // For now, assuming we remove the column, so no update needed
  }
  return judge.judge_id;
}

router.get(
  "/",
  [query("category").optional().isString(), query("from").optional().isISO8601(), query("to").optional().isISO8601()],
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

      const [rows] = await pool.query(
        `
        SELECT
          e.event_id,
          e.event_name,
          e.description,
          e.category,
          e.event_date,
          e.event_status,
          e.max_participants,
          e.registered_participants,
          e.registration_fee,
          COALESCE(e.prize_pool, 0) AS prize_pool,
          COALESCE(e.total_prize_pool, e.prize_pool, 0) AS total_prize_pool,
          v.venue_id,
          v.venue_name
        FROM events e
        LEFT JOIN venues v ON v.venue_id = e.venue_id
        ${where.length ? "WHERE " + where.join(" AND ") : ""}
        ORDER BY e.event_date ASC
        `,
        params
      );

      // Format event_date as YYYY-MM-DD in the response
      return res.json({ success: true, data: rows });
    } catch (err) {
      return next(err);
    }
  }
);
// Get event details, rounds, and leaderboard
router.get("/:id", [param("id").isInt()], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: "Invalid id" });

    const eventId = Number(req.params.id);
    const [events] = await pool.query(
      `
      SELECT e.*, v.venue_name, v.capacity AS venue_capacity
      FROM events e
      LEFT JOIN venues v ON v.venue_id = e.venue_id
      WHERE e.event_id = ?
      LIMIT 1
      `,
      [eventId]
    );

    if (!events.length) return res.status(404).json({ success: false, error: "Event not found" });

    const [rounds] = await pool.query("SELECT * FROM event_rounds WHERE event_id = ? ORDER BY round_date ASC", [eventId]);
    const [leaderboardRows] = await pool.query(
      `
      SELECT
        p.participant_id,
        u.name AS name,
        ROUND(AVG(jg.score), 2) AS avg_score
      FROM judging jg
      JOIN participants p ON p.participant_id = jg.participant_id
      JOIN users u ON u.user_id = p.user_id
      WHERE jg.event_id = ?
      GROUP BY p.participant_id, u.name
      ORDER BY avg_score DESC, u.name ASC
      LIMIT 25
      `,
      [eventId]
    );
    const leaderboard = leaderboardRows.map((row, index) => ({ ...row, rank: index + 1 }));

    return res.json({ success: true, data: { event: events[0], rounds, leaderboard } });
  } catch (err) {
    return next(err);
  }
});

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
    body("registration_fee").isFloat({ min: 0 }),
    body("prize_pool").optional().isFloat({ min: 0 }),
  ],
  async (req, res, next) => {
    let conn;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

      const b = req.body;
      conn = await pool.getConnection();
      await conn.beginTransaction();

      const [result] = await conn.query(
        `
        INSERT INTO events (event_name, description, category, event_date, max_participants, venue_id, organizer_id, registration_fee, prize_pool, sponsorship_total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          b.event_name,
          b.description || null,
          b.category,
          String(b.event_date).slice(0, 10),
          b.max_participants,
          b.venue_id ?? null,
          req.user.user_id,
          b.registration_fee,
          b.prize_pool ?? 0,
          0,
        ]
      );

      let assignedJudgeId = null;
      try {
        assignedJudgeId = await assignLeastBusyJudge(conn, result.insertId);
      } catch (assignErr) {
        console.error("Automatic judge assignment failed:", assignErr);
      }

      await conn.commit();
      return res.status(201).json({ success: true, data: { event_id: result.insertId, assigned_judge_id: assignedJudgeId } });
    } catch (err) {
      if (conn) await conn.rollback();
      if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ success: false, error: "Venue already booked for this date" });
      return next(err);
    } finally {
      if (conn) conn.release();
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
    body("prize_pool").optional().isFloat({ min: 0 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

      const eventId = Number(req.params.id);
      const fields = [];
      const params = [];
      const allowed = ["event_name", "description", "category", "event_date", "max_participants", "venue_id", "registration_fee", "prize_pool"];
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(req.body, key)) {
          fields.push(`${key} = ?`);
          params.push(key === "event_date" ? String(req.body[key]).slice(0, 10) : req.body[key]);
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

router.delete("/:id", authRequired, requireRole(["admin", "organizer"]), [param("id").isInt()], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: "Invalid id" });
    const [result] = await pool.query("DELETE FROM events WHERE event_id = ?", [Number(req.params.id)]);
    if (!result.affectedRows) return res.status(404).json({ success: false, error: "Event not found" });
    return res.json({ success: true, data: { deleted: true } });
  } catch (err) {
    return next(err);
  }
});

router.post(
  "/:id/rounds",
  authRequired,
  requireRole(["admin", "organizer"]),
  [param("id").isInt(), body("prelim_date").isISO8601(), body("semi_date").isISO8601(), body("final_date").isISO8601(), body("venue_id").isInt()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });
      const eventId = Number(req.params.id);
      const { prelim_date, semi_date, final_date, venue_id } = req.body;
      await pool.query("INSERT INTO event_rounds (event_id, round_type, round_date, venue_id) VALUES (?, 'Prelims', ?, ?), (?, 'Semi-Finals', ?, ?), (?, 'Finals', ?, ?)", [eventId, prelim_date, venue_id, eventId, semi_date, venue_id, eventId, final_date, venue_id]);
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
      const judgeIds = req.body.judge_ids.map((value) => Number(value)).filter((value) => Number.isInteger(value));
      if (!judgeIds.length) return res.status(400).json({ success: false, error: "No valid judge ids" });

      for (const judgeId of judgeIds) {
        const [assignment] = await pool.query("INSERT IGNORE INTO event_judges (event_id, judge_id) VALUES (?, ?)", [eventId, judgeId]);
        if (assignment.affectedRows > 0) {
          await pool.query("UPDATE judges SET assigned_events_count = assigned_events_count + 1 WHERE judge_id = ?", [judgeId]);
        }
      }

      return res.status(201).json({ success: true, data: { assigned: judgeIds.length } });
    } catch (err) {
      return next(err);
    }
  }
);

router.get("/:id/leaderboard", [param("id").isInt()], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: "Invalid id" });
    const [rows] = await pool.query(
      `
      SELECT
        p.participant_id,
        u.name AS participant,
        ROUND(AVG(jg.score), 2) AS avg_score
      FROM judging jg
      JOIN participants p ON p.participant_id = jg.participant_id
      JOIN users u ON u.user_id = p.user_id
      WHERE jg.event_id = ?
      GROUP BY p.participant_id, u.name
      ORDER BY avg_score DESC, u.name ASC
      `,
      [Number(req.params.id)]
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
