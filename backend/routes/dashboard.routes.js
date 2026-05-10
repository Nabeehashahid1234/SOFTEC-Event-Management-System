const express = require("express");
const pool = require("../config/db");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

router.get("/admin", authRequired, async (_req, res, next) => {
  try {
    const [[{ total_users }]] = await pool.query("SELECT COUNT(*) AS total_users FROM users");
    const [[{ active_users }]] = await pool.query("SELECT COUNT(*) AS active_users FROM users WHERE status = 'active'");
    const [[{ total_events }]] = await pool.query("SELECT COUNT(*) AS total_events FROM events");
<<<<<<< HEAD
    const [[{ total_registrations }]] = await pool.query("SELECT COUNT(*) AS total_registrations FROM registrations");
    const [[{ revenue_completed }]] = await pool.query(
      "SELECT COALESCE(SUM(amount),0) AS revenue_completed FROM payments WHERE status='completed'"
    );
    const [[{ pending_revenue }]] = await pool.query(
      "SELECT COALESCE(SUM(amount),0) AS pending_revenue FROM payments WHERE status='pending'"
    );
=======
    const [[{ total_registrations }]] = await pool.query("SELECT COUNT(*) AS total_registrations FROM participants");
    const [[{ revenue_completed }]] = await pool.query("SELECT COALESCE(SUM(amount), 0) AS revenue_completed FROM payments WHERE status = 'completed'");
    const [[{ pending_revenue }]] = await pool.query("SELECT COALESCE(SUM(amount), 0) AS pending_revenue FROM payments WHERE status = 'pending'");
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5

    const [roleDistribution] = await pool.query("SELECT role, COUNT(*) AS count FROM users GROUP BY role ORDER BY count DESC");
    const [categoryDistribution] = await pool.query("SELECT category, COUNT(*) AS count FROM events GROUP BY category ORDER BY count DESC");
    const [venueUtilization] = await pool.query(
      `
      SELECT venue_id, venue_name, events_hosted AS total_events, total_capacity_used
      FROM venue_utilization_stats
      ORDER BY events_hosted DESC, venue_name ASC
      `
    );
<<<<<<< HEAD

    // Category distribution
    const [categoryData] = await pool.query(
      "SELECT category, COUNT(*) as count FROM events GROUP BY category ORDER BY count DESC"
    );

    // Venue utilization
    const [venueUtil] = await pool.query("SELECT * FROM venue_utilization_stats");

    // Top programs by confirmed registration
    const [topPrograms] = await pool.query(
      `
      SELECT e.event_id, e.event_name, e.category,
             COALESCE(COUNT(r.registration_id), 0) AS registered,
             e.max_participants,
             v.venue_name
      FROM events e
      LEFT JOIN registrations r ON r.event_id = e.event_id AND r.status = 'confirmed'
      LEFT JOIN venues v ON e.venue_id = v.venue_id
      GROUP BY e.event_id
      ORDER BY registered DESC
=======
    const [topPrograms] = await pool.query(
      `
      SELECT
        e.event_id,
        e.event_name,
        e.category,
        e.event_date,
        e.max_participants,
        e.registered_participants,
        v.venue_name
      FROM events e
      LEFT JOIN venues v ON v.venue_id = e.venue_id
      ORDER BY e.registered_participants DESC, e.event_date ASC
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      LIMIT 5
      `
    );
    const [revenueBreakdown] = await pool.query(
      `
      SELECT payment_type, SUM(amount) AS total
      FROM payments
      WHERE status = 'completed'
      GROUP BY payment_type
      ORDER BY total DESC
      `
    );
    const [sponsorTiers] = await pool.query(
      `
<<<<<<< HEAD
      SELECT tier as sponsorship_tier, COUNT(*) as count
      FROM sponsors
      GROUP BY tier
=======
      SELECT sponsorship_level AS tier, COUNT(*) AS count
      FROM sponsors
      GROUP BY sponsorship_level
      ORDER BY count DESC
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      `
    );
    const [recentActivity] = await pool.query(
      `
<<<<<<< HEAD
      SELECT u.user_id, u.name, r.registration_id, e.event_name, r.registered_at AS registration_date, p.status
      FROM registrations r
      JOIN users u ON r.user_id = u.user_id
      JOIN events e ON r.event_id = e.event_id
      LEFT JOIN payments p ON p.registration_id = r.registration_id
      ORDER BY r.registered_at DESC
=======
      SELECT
        p.participant_id,
        u.user_id,
        u.name,
        e.event_id,
        e.event_name,
        p.registration_date,
        COALESCE(py.status, 'pending') AS payment_status
      FROM participants p
      JOIN users u ON p.user_id = u.user_id
      JOIN events e ON p.event_id = e.event_id
      LEFT JOIN payments py
        ON py.user_id = p.user_id
       AND py.event_id = p.event_id
       AND py.payment_type = 'registration'
      ORDER BY p.registration_date DESC
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      LIMIT 15
      `
    );
    const [paymentStatus] = await pool.query("SELECT status, COUNT(*) AS count FROM payments GROUP BY status ORDER BY count DESC");

    return res.json({
      success: true,
      data: {
        kpi: { total_users, active_users, total_events, total_registrations, revenue_completed, pending_revenue },
        roleDistribution,
        categoryDistribution,
        venueUtilization,
        topPrograms,
        revenueBreakdown,
        sponsorTiers,
        recentActivity,
        paymentStatus,
      },
    });
  } catch (err) {
    return next(err);
  }
});

router.get("/participant", authRequired, async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    const [myEvents] = await pool.query(
      `
<<<<<<< HEAD
      SELECT e.event_id, e.event_name, e.category, e.event_date,
             e.registration_fee, v.venue_name, r.status,
             COALESCE(COUNT(DISTINCT r2.registration_id), 0) AS current_registrations,
             e.max_participants
      FROM registrations r
      JOIN events e ON e.event_id = r.event_id
      LEFT JOIN venues v ON v.venue_id = e.venue_id
      LEFT JOIN registrations r2 ON r2.event_id = e.event_id AND r2.status = 'confirmed'
      WHERE r.user_id = ?
      GROUP BY e.event_id
=======
      SELECT
        e.event_id,
        e.event_name,
        e.category,
        e.event_date,
        e.registration_fee,
        e.max_participants,
        e.registered_participants AS current_registrations,
        v.venue_name,
        p.registration_date,
        py.payment_id,
        py.amount,
        py.status AS payment_status
      FROM participants p
      JOIN events e ON e.event_id = p.event_id
      LEFT JOIN venues v ON v.venue_id = e.venue_id
      LEFT JOIN payments py
        ON py.user_id = p.user_id
       AND py.event_id = p.event_id
       AND py.payment_type = 'registration'
      WHERE p.user_id = ?
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      ORDER BY e.event_date ASC
      `,
      [userId]
    );

<<<<<<< HEAD
    // Upcoming events (not yet registered)
    const [upcomingEvents] = await pool.query(
      `
      SELECT e.event_id, e.event_name, e.category, e.event_date,
             e.registration_fee, v.venue_name,
             TIMESTAMPDIFF(DAY, NOW(), e.event_date) AS days_until
      FROM events e
      LEFT JOIN venues v ON v.venue_id = e.venue_id
      WHERE e.event_date > NOW()
      AND e.event_id NOT IN (
        SELECT r.event_id FROM registrations r
        WHERE r.user_id = ?
      )
=======
    const [upcomingEvents] = await pool.query(
      `
      SELECT
        e.event_id,
        e.event_name,
        e.category,
        e.event_date,
        e.registration_fee,
        e.max_participants,
        e.registered_participants,
        v.venue_name,
        TIMESTAMPDIFF(DAY, CURRENT_DATE(), e.event_date) AS days_until
      FROM events e
      LEFT JOIN venues v ON v.venue_id = e.venue_id
      WHERE e.event_date > CURRENT_DATE()
        AND NOT EXISTS (
          SELECT 1 FROM participants p WHERE p.user_id = ? AND p.event_id = e.event_id
        )
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      ORDER BY e.event_date ASC
      LIMIT 10
      `,
      [userId]
    );

    const [payments] = await pool.query(
      `
<<<<<<< HEAD
      SELECT p.payment_id, e.event_name, p.amount, p.payment_type,
             p.status, p.created_at AS payment_date, p.event_id
      FROM payments p
      LEFT JOIN registrations r ON p.registration_id = r.registration_id
      LEFT JOIN events e ON p.event_id = e.event_id
=======
      SELECT
        py.payment_id,
        e.event_name,
        py.amount,
        py.payment_type,
        py.status,
        py.payment_date,
        py.event_id
      FROM payments py
      LEFT JOIN events e ON py.event_id = e.event_id
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      WHERE py.user_id = ?
      ORDER BY py.payment_date DESC
      LIMIT 20
      `,
      [userId]
    );

    const [accommodation] = await pool.query(
      `
      SELECT
        ua.accommodation_id,
        a.room_type,
        ua.check_in,
        ua.check_out,
        DATEDIFF(ua.check_out, ua.check_in) AS nights,
        a.price_per_night,
        DATEDIFF(ua.check_out, ua.check_in) * a.price_per_night AS total_cost
      FROM user_accommodations ua
      JOIN accommodations a ON ua.accommodation_id = a.accommodation_id
      WHERE ua.user_id = ?
      ORDER BY ua.check_in DESC
      `,
      [userId]
    );

    const [teams] = await pool.query(
      `
<<<<<<< HEAD
      SELECT DISTINCT t.team_id, t.team_name, e.event_name,
             COUNT(DISTINCT tm.user_id) AS member_count
=======
      SELECT DISTINCT
        t.team_id,
        t.team_name,
        e.event_name,
        COUNT(tm.user_id) AS member_count
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      FROM team_members tm
      JOIN teams t ON tm.team_id = t.team_id
      LEFT JOIN events e ON t.event_id = e.event_id
      WHERE tm.user_id = ?
      GROUP BY t.team_id, t.team_name, e.event_name
      ORDER BY t.team_id DESC
      `,
      [userId]
    );

<<<<<<< HEAD
    // Statistics
    const [[{ registered_count }]] = await pool.query(
      `SELECT COUNT(*) AS registered_count
       FROM registrations r
       WHERE r.user_id = ?`,
      [userId]
    );
    const [[{ paid_count }]] = await pool.query(
      "SELECT COUNT(*) AS paid_count FROM payments WHERE user_id = ? AND status = 'completed'",
      [userId]
    );
    const [[{ pending_payment }]] = await pool.query(
      "SELECT COUNT(*) AS pending_payment FROM payments WHERE user_id = ? AND status = 'pending'",
=======
    const leaderboards = [];

    // Fetch issued passes for the participant
    const [passes] = await pool.query(
      `
      SELECT p.pass_id, p.event_id, p.issued_at, p.status, p.qr_code, e.event_name
      FROM passes p
      JOIN participants pa ON pa.participant_id = p.participant_id
      JOIN events e ON e.event_id = p.event_id
      WHERE pa.user_id = ?
      ORDER BY p.issued_at DESC
      `,
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      [userId]
    );

    const [[{ registered_count }]] = await pool.query("SELECT COUNT(*) AS registered_count FROM participants WHERE user_id = ?", [userId]);
    const [[{ paid_count }]] = await pool.query("SELECT COUNT(*) AS paid_count FROM payments WHERE user_id = ? AND status = 'completed'", [userId]);
    const [[{ pending_payment }]] = await pool.query("SELECT COUNT(*) AS pending_payment FROM payments WHERE user_id = ? AND status = 'pending'", [userId]);

    return res.json({
      success: true,
<<<<<<< HEAD
      data: {
        myEvents,
        upcomingEvents,
        payments,
        accommodation,
        teams,
        stats: { registered_count, paid_count, pending_payment },
      },
=======
      data: { myEvents, upcomingEvents, payments, accommodation, teams, passes, leaderboards, stats: { registered_count, paid_count, pending_payment } },
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
    });
  } catch (err) {
    return next(err);
  }
});

router.get("/judge", authRequired, async (req, res, next) => {
  try {
    const userId = req.user.user_id;

<<<<<<< HEAD
    // Confirm judge identity
    const [judgeRows] = await pool.query(
      "SELECT user_id AS judge_id FROM users WHERE user_id = ? AND role = 'judge' LIMIT 1",
      [userId]
    );
    const judgeId = judgeRows[0]?.judge_id;
=======
    const [[judge]] = await pool.query(
      `
      SELECT j.judge_id, j.name, j.email
      FROM judges j
      JOIN users u ON u.email = j.email
      WHERE u.user_id = ?
      LIMIT 1
      `,
      [userId]
    );
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5

    if (!judge) {
      return res.json({ success: true, data: { assigned: [], submitted: [], pending: [], leaderboard: [], stats: {} } });
    }

    const [assigned] = await pool.query(
      `
<<<<<<< HEAD
      SELECT DISTINCT ja.event_id, e.event_name, e.category,
             e.event_date, COUNT(er.round_id) AS total_rounds
      FROM judge_assignments ja
      JOIN events e ON ja.event_id = e.event_id
      LEFT JOIN event_rounds er ON e.event_id = er.event_id
      WHERE ja.judge_id = ?
      GROUP BY ja.event_id
=======
      SELECT
        e.event_id,
        e.event_name,
        e.category,
        e.event_date,
        v.venue_name,
        COUNT(DISTINCT er.round_id) AS total_rounds,
        COUNT(DISTINCT p.participant_id) AS participant_count
      FROM event_judges ej
      JOIN events e ON ej.event_id = e.event_id
      LEFT JOIN venues v ON v.venue_id = e.venue_id
      LEFT JOIN event_rounds er ON er.event_id = e.event_id
      LEFT JOIN participants p ON p.event_id = e.event_id
      WHERE ej.judge_id = ?
      GROUP BY e.event_id, e.event_name, e.category, e.event_date, v.venue_name
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      ORDER BY e.event_date ASC
      `,
      [judge.judge_id]
    );

    const [submitted] = await pool.query(
      `
<<<<<<< HEAD
      SELECT s.score_id, e.event_name, t.team_name, s.score,
             s.comments, s.created_at AS submission_date, er.round_type AS round_name
      FROM scores s
      JOIN events e ON s.event_id = e.event_id
      LEFT JOIN teams t ON s.participant_id = t.team_id
      LEFT JOIN event_rounds er ON er.event_id = e.event_id
      WHERE s.judge_id = ?
      ORDER BY s.created_at DESC
=======
      SELECT
        jg.judging_id,
        e.event_id,
        e.event_name,
        p.participant_id,
        u.name AS participant_name,
        jg.score,
        jg.comments,
        jg.judged_at
      FROM judging jg
      JOIN participants p ON jg.participant_id = p.participant_id
      JOIN users u ON p.user_id = u.user_id
      JOIN events e ON jg.event_id = e.event_id
      WHERE jg.judge_id = ?
      ORDER BY jg.judged_at DESC
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      LIMIT 20
      `,
      [judge.judge_id]
    );

    const [pending] = await pool.query(
      `
<<<<<<< HEAD
      SELECT er.round_id, er.round_type AS round_name, e.event_name,
             COUNT(DISTINCT t.team_id) AS teams_pending
      FROM event_rounds er
      JOIN events e ON er.event_id = e.event_id
      LEFT JOIN teams t ON e.event_id = t.event_id
      LEFT JOIN scores s ON s.event_id = e.event_id AND s.participant_id = t.team_id AND s.judge_id = ?
      WHERE e.event_id IN (
        SELECT event_id FROM judge_assignments WHERE judge_id = ?
      )
      AND er.status = 'ongoing'
      AND s.score_id IS NULL
      GROUP BY er.round_id, e.event_name
=======
      SELECT
        e.event_id,
        e.event_name,
        COUNT(DISTINCT p.participant_id) AS teams_pending
      FROM event_judges ej
      JOIN events e ON ej.event_id = e.event_id
      JOIN participants p ON p.event_id = e.event_id
      LEFT JOIN judging jg
        ON jg.event_id = e.event_id
       AND jg.participant_id = p.participant_id
       AND jg.judge_id = ej.judge_id
      WHERE ej.judge_id = ?
        AND jg.judging_id IS NULL
      GROUP BY e.event_id, e.event_name
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      HAVING teams_pending > 0
      ORDER BY e.event_date ASC
      `,
      [judge.judge_id]
    );

    const [leaderboard] = await pool.query(
      `
<<<<<<< HEAD
      SELECT rank, participant_name AS participant, average_score AS score, e.event_name, event_id
      FROM vw_event_leaderboard
      JOIN events e ON vw_event_leaderboard.event_id = e.event_id
      WHERE e.event_id IN (
        SELECT event_id FROM judge_assignments WHERE judge_id = ?
      )
      ORDER BY event_id, rank
=======
      SELECT
        p.participant_id,
        u.name AS participant,
        ROUND(AVG(jg.score), 2) AS score,
        e.event_name,
        e.event_id
      FROM judging jg
      JOIN participants p ON jg.participant_id = p.participant_id
      JOIN users u ON p.user_id = u.user_id
      JOIN events e ON jg.event_id = e.event_id
      WHERE jg.event_id IN (
        SELECT event_id FROM event_judges WHERE judge_id = ?
      )
      GROUP BY p.participant_id, u.name, e.event_name, e.event_id
      ORDER BY score DESC, u.name ASC
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      LIMIT 25
      `,
      [judge.judge_id]
    );

<<<<<<< HEAD
    // Statistics
    const [[{ assigned_count }]] = await pool.query(
      "SELECT COUNT(DISTINCT event_id) AS assigned_count FROM judge_assignments WHERE judge_id = ?",
      [judgeId]
    );
    const [[{ submitted_count }]] = await pool.query(
      "SELECT COUNT(*) AS submitted_count FROM scores WHERE judge_id = ?",
      [judgeId]
    );
=======
    const [[{ assigned_count }]] = await pool.query("SELECT COUNT(DISTINCT event_id) AS assigned_count FROM event_judges WHERE judge_id = ?", [judge.judge_id]);
    const [[{ submitted_count }]] = await pool.query("SELECT COUNT(*) AS submitted_count FROM judging WHERE judge_id = ?", [judge.judge_id]);
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
    const [[{ pending_count }]] = await pool.query(
      `
      SELECT COUNT(*) AS pending_count
      FROM (
<<<<<<< HEAD
        SELECT DISTINCT er.round_id, t.team_id
        FROM event_rounds er
        JOIN events e ON er.event_id = e.event_id
        JOIN teams t ON e.event_id = t.event_id
        LEFT JOIN scores s ON s.event_id = e.event_id AND s.participant_id = t.team_id AND s.judge_id = ?
        WHERE e.event_id IN (
          SELECT event_id FROM judge_assignments WHERE judge_id = ?
        )
        AND er.status = 'ongoing'
        AND s.score_id IS NULL
=======
        SELECT DISTINCT e.event_id, p.participant_id
        FROM event_judges ej
        JOIN events e ON ej.event_id = e.event_id
        JOIN participants p ON p.event_id = e.event_id
        LEFT JOIN judging jg
          ON jg.event_id = e.event_id
         AND jg.participant_id = p.participant_id
         AND jg.judge_id = ej.judge_id
        WHERE ej.judge_id = ?
          AND jg.judging_id IS NULL
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      ) AS pending
      `,
      [judge.judge_id]
    );

    return res.json({
      success: true,
      data: { assigned, submitted, pending, leaderboard, stats: { assigned_count, submitted_count, pending_count } },
    });
  } catch (err) {
    return next(err);
  }
});

router.get("/organizer", authRequired, async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    const [events] = await pool.query(
      `
<<<<<<< HEAD
      SELECT e.event_id, e.event_name, e.category, e.event_date,
             e.registration_fee, v.venue_name, e.event_status,
             COALESCE(SUM(CASE WHEN r.status = 'confirmed' THEN 1 ELSE 0 END), 0) AS registered_participants,
             e.max_participants,
             ROUND((COALESCE(SUM(CASE WHEN r.status = 'confirmed' THEN 1 ELSE 0 END), 0) / e.max_participants * 100), 1) AS fill_rate
      FROM events e
      LEFT JOIN venues v ON v.venue_id = e.venue_id
      LEFT JOIN registrations r ON e.event_id = r.event_id
=======
      SELECT
        e.event_id,
        e.event_name,
        e.category,
        e.event_date,
        e.registration_fee,
        v.venue_name,
        COUNT(DISTINCT p.participant_id) AS registered_participants,
        e.max_participants,
        ROUND((COUNT(DISTINCT p.participant_id) / NULLIF(e.max_participants, 0)) * 100, 1) AS fill_rate
      FROM events e
      LEFT JOIN venues v ON v.venue_id = e.venue_id
      LEFT JOIN participants p ON p.event_id = e.event_id
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      WHERE e.organizer_id = ?
      GROUP BY e.event_id, e.event_name, e.category, e.event_date, e.registration_fee, v.venue_name, e.max_participants
      ORDER BY e.event_date ASC
      `,
      [userId]
    );

    const [judges] = await pool.query(
      `
<<<<<<< HEAD
      SELECT u.user_id AS judge_id, u.name, u.email,
             COUNT(ja.event_id) AS assigned_events
      FROM users u
      LEFT JOIN judge_assignments ja ON u.user_id = ja.judge_id AND ja.active = 1
      WHERE u.role = 'judge'
      GROUP BY u.user_id
=======
      SELECT
        j.judge_id,
        j.name,
        j.email,
        COUNT(DISTINCT ej.event_id) AS assigned_events
      FROM event_judges ej
      JOIN events e ON ej.event_id = e.event_id
      JOIN judges j ON j.judge_id = ej.judge_id
      WHERE e.organizer_id = ?
      GROUP BY j.judge_id, j.name, j.email
      ORDER BY assigned_events DESC, j.name ASC
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      `,
      [userId]
    );

    const [rounds] = await pool.query(
      `
<<<<<<< HEAD
      SELECT er.round_id, er.event_id, e.event_name, er.round_type AS round_name,
             er.round_date, er.status AS round_status, v.venue_name
      FROM event_rounds er
      JOIN events e ON er.event_id = e.event_id
      LEFT JOIN venues v ON er.venue_id = v.venue_id
=======
      SELECT
        r.round_id,
        r.event_id,
        e.event_name,
        r.round_type AS round_name,
        r.round_date,
        r.status AS round_status,
        v.venue_name
      FROM event_rounds r
      JOIN events e ON r.event_id = e.event_id
      LEFT JOIN venues v ON r.venue_id = v.venue_id
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      WHERE e.organizer_id = ?
      ORDER BY er.round_date ASC
      `,
      [userId]
    );

    const [venueConflicts] = await pool.query(
      `
<<<<<<< HEAD
      SELECT v.venue_id, v.venue_name,
             GROUP_CONCAT(DISTINCT e.event_name SEPARATOR ', ') AS conflicting_events,
             COUNT(DISTINCT er1.round_id) AS total_rounds
      FROM venues v
      JOIN event_rounds er1 ON v.venue_id = er1.venue_id
      JOIN events e ON er1.event_id = e.event_id
      WHERE e.organizer_id = ?
      AND EXISTS (
        SELECT 1 FROM event_rounds er2
        WHERE er2.venue_id = v.venue_id
          AND er2.round_date = er1.round_date
          AND er2.round_id != er1.round_id
      )
      GROUP BY v.venue_id
=======
      SELECT
        v.venue_id,
        v.venue_name,
        GROUP_CONCAT(DISTINCT e.event_name ORDER BY e.event_name SEPARATOR ', ') AS conflicting_events,
        COUNT(DISTINCT e.event_id) AS total_rounds
      FROM events e
      JOIN venues v ON e.venue_id = v.venue_id
      JOIN events other_event
        ON other_event.venue_id = e.venue_id
       AND other_event.event_date = e.event_date
       AND other_event.event_id <> e.event_id
      WHERE e.organizer_id = ?
      GROUP BY v.venue_id, v.venue_name
      ORDER BY total_rounds DESC
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      LIMIT 10
      `,
      [userId]
    );

    const [[{ total_events }]] = await pool.query("SELECT COUNT(*) AS total_events FROM events WHERE organizer_id = ?", [userId]);
    const [[{ total_registrations }]] = await pool.query(
      `
<<<<<<< HEAD
      SELECT COUNT(r.registration_id) as total_registrations
      FROM events e
      JOIN registrations r ON r.event_id = e.event_id
=======
      SELECT COUNT(DISTINCT p.participant_id) AS total_registrations
      FROM events e
      LEFT JOIN participants p ON p.event_id = e.event_id
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      WHERE e.organizer_id = ?
      `,
      [userId]
    );
    const [[{ avg_fill_rate }]] = await pool.query(
      `
      SELECT COALESCE(ROUND(AVG(fill_rate), 1), 0) AS avg_fill_rate
      FROM (
<<<<<<< HEAD
        SELECT ROUND((COUNT(CASE WHEN r.status = 'confirmed' THEN 1 END) / e.max_participants * 100), 1) as fill_rate
        FROM events e
        LEFT JOIN registrations r ON e.event_id = r.event_id
=======
        SELECT ROUND((COUNT(DISTINCT p.participant_id) / NULLIF(e.max_participants, 0)) * 100, 1) AS fill_rate
        FROM events e
        LEFT JOIN participants p ON p.event_id = e.event_id
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
        WHERE e.organizer_id = ?
        GROUP BY e.event_id, e.max_participants
      ) AS rates
      `,
      [userId]
    );

    return res.json({ success: true, data: { events, judges, rounds, venueConflicts, stats: { total_events, total_registrations, avg_fill_rate } } });
  } catch (err) {
    return next(err);
  }
});

router.get("/sponsor", authRequired, async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    const [[sponsorInfo]] = await pool.query(
      `
<<<<<<< HEAD
      SELECT s.sponsor_id, u.name, s.tier as sponsorship_tier, s.company_name,
             s.email, s.phone, u.email as user_email
      FROM sponsors s
      LEFT JOIN users u ON s.user_id = u.user_id
      WHERE s.sponsor_id = ?
=======
      SELECT sponsor_id, company_name AS name, contact_person, email, phone, sponsorship_level, amount
      FROM sponsors
      WHERE user_id = ?
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      LIMIT 1
      `,
      [userId]
    );

    if (!sponsorInfo) {
      return res.json({ success: true, data: { sponsorInfo: null, sponsoredEvents: [], payments: [], history: [], stats: {} } });
    }

    const sponsorId = sponsorInfo.sponsor_id;

    const [sponsoredEvents] = await pool.query(
      `
<<<<<<< HEAD
      SELECT s.event_id, e.event_name, e.category, e.event_date,
             COALESCE(COUNT(r.registration_id), 0) as participants_reached,
             COALESCE(SUM(sp.amount), 0) as sponsorship_contribution
      FROM sponsorships sp
      JOIN events e ON sp.event_id = e.event_id
      LEFT JOIN registrations r ON r.event_id = e.event_id AND r.status = 'confirmed'
      WHERE sp.sponsor_id = ?
      GROUP BY s.event_id, e.event_name, e.category, e.event_date
=======
      SELECT
        e.event_id,
        e.event_name,
        e.category,
        e.event_date,
        COUNT(DISTINCT p.participant_id) AS participants_reached,
        COALESCE(SUM(sp.amount), 0) AS sponsorship_contribution
      FROM sponsorships sp
      JOIN events e ON sp.event_id = e.event_id
      LEFT JOIN participants p ON p.event_id = e.event_id
      WHERE sp.sponsor_id = ?
      GROUP BY e.event_id, e.event_name, e.category, e.event_date
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      ORDER BY e.event_date DESC
      `,
      [sponsorId]
    );

    const [payments] = await pool.query(
      `
<<<<<<< HEAD
      SELECT py.payment_id, py.amount, py.created_at AS payment_date, py.status,
             e.event_name, py.payment_type
      FROM payments py
      LEFT JOIN events e ON py.event_id = e.event_id
      WHERE py.user_id = ?
      ORDER BY py.created_at DESC
=======
      SELECT
        py.payment_id,
        py.amount,
        py.payment_date,
        py.status,
        e.event_name,
        py.payment_type
      FROM payments py
      LEFT JOIN events e ON py.event_id = e.event_id
      WHERE py.user_id = ?
        AND py.payment_type = 'sponsorship'
      ORDER BY py.payment_date DESC
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      LIMIT 30
      `,
      [userId]
    );

    const [history] = await pool.query(
      `
<<<<<<< HEAD
      SELECT sp.sponsorship_id, e.event_name, sp.amount, sp.sponsored_at AS sponsorship_date,
             sp.status AS sponsorship_status, sp.tier
      FROM sponsorships sp
      LEFT JOIN events e ON sp.event_id = e.event_id
      WHERE sp.sponsor_id = ?
      ORDER BY sp.sponsored_at DESC
=======
      SELECT
        sp.sponsorship_id,
        e.event_name,
        sp.amount,
        sp.status,
        sp.created_at
      FROM sponsorships sp
      LEFT JOIN events e ON sp.event_id = e.event_id
      WHERE sp.sponsor_id = ?
      ORDER BY sp.created_at DESC
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      `,
      [sponsorId]
    );

    const [[{ total_contribution }]] = await pool.query(
<<<<<<< HEAD
      `SELECT COALESCE(SUM(amount), 0) AS total_contribution FROM sponsorships WHERE sponsor_id = ? AND status = 'confirmed'`,
      [sponsorId]
    );
    const [[{ events_sponsored }]] = await pool.query(
      `SELECT COUNT(DISTINCT event_id) AS events_sponsored FROM sponsorships WHERE sponsor_id = ?`,
=======
      "SELECT COALESCE(SUM(amount), 0) AS total_contribution FROM sponsorships WHERE sponsor_id = ? AND status = 'confirmed'",
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      [sponsorId]
    );
    const [[{ events_sponsored }]] = await pool.query("SELECT COUNT(DISTINCT event_id) AS events_sponsored FROM sponsorships WHERE sponsor_id = ?", [sponsorId]);
    const [[{ total_reach }]] = await pool.query(
      `
<<<<<<< HEAD
      SELECT COALESCE(COUNT(DISTINCT r.registration_id), 0) AS total_reach
      FROM sponsorships sp
      LEFT JOIN registrations r ON r.event_id = sp.event_id AND r.status = 'confirmed'
=======
      SELECT COALESCE(COUNT(DISTINCT p.participant_id), 0) AS total_reach
      FROM sponsorships sp
      LEFT JOIN participants p ON p.event_id = sp.event_id
>>>>>>> bd4ef49a5689b2be6e725836cf4b366c52976df5
      WHERE sp.sponsor_id = ?
      `,
      [sponsorId]
    );

    return res.json({ success: true, data: { sponsorInfo, sponsoredEvents, payments, history, stats: { total_contribution, events_sponsored, total_reach } } });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

