const express = require("express");
const { param, validationResult } = require("express-validator");
const pool = require("../config/db");
const { authRequired } = require("../middleware/auth");
const { requireRole } = require("../middleware/rbac");

const router = express.Router();

router.get("/event-participation", authRequired, requireRole(["admin"]), async (_req, res, next) => {
  try {
    // Q1: LEFT JOIN + GROUP BY + COUNT
    const [rows] = await pool.query(
      `
      SELECT
        e.event_id,
        e.event_name,
        e.category,
        e.event_date,
        COUNT(p.participant_id) AS total_participants
      FROM events e
      LEFT JOIN participants p ON p.event_id = e.event_id
      GROUP BY e.event_id, e.event_name, e.category, e.event_date
      ORDER BY e.event_date ASC, total_participants DESC
      `
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
});

router.get("/high-quality-events", authRequired, requireRole(["admin"]), async (_req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM high_quality_events ORDER BY avg_score DESC");
    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
});

router.get("/venue-utilization", authRequired, requireRole(["admin"]), async (_req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM venue_utilization_stats ORDER BY events_hosted DESC");
    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
});

router.get("/leaderboard/:eventId", authRequired, [param("eventId").isInt()], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: "Invalid eventId" });
    const eventId = Number(req.params.eventId);
    const [rows] = await pool.query("CALL sp_get_leaderboard(?)", [eventId]);
    return res.json({ success: true, data: rows[0] || [] });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

