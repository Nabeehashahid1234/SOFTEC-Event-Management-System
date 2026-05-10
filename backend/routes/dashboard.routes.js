const express = require("express");
const pool = require("../config/db");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

router.get("/admin", authRequired, async (_req, res, next) => {
  try {
    // KPI metrics
    const [[{ total_users }]] = await pool.query("SELECT COUNT(*) AS total_users FROM users");
    const [[{ active_users }]] = await pool.query("SELECT COUNT(*) AS active_users FROM users WHERE status = 'active'");
    const [[{ total_events }]] = await pool.query("SELECT COUNT(*) AS total_events FROM events");
    const [[{ total_registrations }]] = await pool.query("SELECT COUNT(*) AS total_registrations FROM registrations");
    const [[{ revenue_completed }]] = await pool.query(
      "SELECT COALESCE(SUM(amount),0) AS revenue_completed FROM payments WHERE status='completed'"
    );
    const [[{ pending_revenue }]] = await pool.query(
      "SELECT COALESCE(SUM(amount),0) AS pending_revenue FROM payments WHERE status='pending'"
    );

    // Role distribution
    const [roleData] = await pool.query(
      "SELECT role, COUNT(*) as count FROM users GROUP BY role"
    );

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
      LIMIT 5
      `
    );

    // Revenue breakdown by type
    const [revBreakdown] = await pool.query(
      `
      SELECT payment_type, SUM(amount) as total 
      FROM payments 
      WHERE status = 'completed'
      GROUP BY payment_type
      `
    );

    // Sponsor tier distribution
    const [sponsorTiers] = await pool.query(
      `
      SELECT tier as sponsorship_tier, COUNT(*) as count
      FROM sponsors
      GROUP BY tier
      `
    );

    // Recent activity
    const [recentActivity] = await pool.query(
      `
      SELECT u.user_id, u.name, r.registration_id, e.event_name, r.registered_at AS registration_date, p.status
      FROM registrations r
      JOIN users u ON r.user_id = u.user_id
      JOIN events e ON r.event_id = e.event_id
      LEFT JOIN payments p ON p.registration_id = r.registration_id
      ORDER BY r.registered_at DESC
      LIMIT 15
      `
    );

    // Payment status breakdown
    const [paymentStatus] = await pool.query(
      `
      SELECT status, COUNT(*) as count
      FROM payments
      GROUP BY status
      `
    );

    return res.json({
      success: true,
      data: {
        kpi: { total_users, active_users, total_events, total_registrations, revenue_completed, pending_revenue },
        roleDistribution: roleData,
        categoryDistribution: categoryData,
        venueUtilization: venueUtil,
        topPrograms,
        revenueBreakdown: revBreakdown,
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

    // My registered events
    const [myEvents] = await pool.query(
      `
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
      ORDER BY e.event_date ASC
      `,
      [userId]
    );

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
      ORDER BY e.event_date ASC
      LIMIT 10
      `,
      [userId]
    );

    // Payment history
    const [payments] = await pool.query(
      `
      SELECT p.payment_id, e.event_name, p.amount, p.payment_type,
             p.status, p.created_at AS payment_date, p.event_id
      FROM payments p
      LEFT JOIN registrations r ON p.registration_id = r.registration_id
      LEFT JOIN events e ON p.event_id = e.event_id
      WHERE py.user_id = ?
      ORDER BY py.payment_date DESC
      LIMIT 20
      `,
      [userId]
    );

    // Accommodation bookings
    const [accommodation] = await pool.query(
      `
      SELECT ua.accommodation_id, a.room_type, ua.check_in, ua.check_out, 
             DATEDIFF(ua.check_out, ua.check_in) as nights, a.price_per_night, 
             DATEDIFF(ua.check_out, ua.check_in) * a.price_per_night as total_cost
      FROM user_accommodations ua
      JOIN accommodations a ON ua.accommodation_id = a.accommodation_id
      WHERE ua.user_id = ?
      ORDER BY ua.check_in DESC
      `,
      [userId]
    );

    // Team memberships
    const [teams] = await pool.query(
      `
      SELECT DISTINCT t.team_id, t.team_name, e.event_name,
             COUNT(DISTINCT tm.user_id) AS member_count
      FROM team_members tm
      JOIN teams t ON tm.team_id = t.team_id
      LEFT JOIN events e ON t.event_id = e.event_id
      WHERE tm.user_id = ?
      GROUP BY t.team_id
      ORDER BY t.team_id DESC
      `,
      [userId]
    );

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
      [userId]
    );

    return res.json({
      success: true,
      data: {
        myEvents,
        upcomingEvents,
        payments,
        accommodation,
        teams,
        stats: { registered_count, paid_count, pending_payment },
      },
    });
  } catch (err) {
    return next(err);
  }
});

router.get("/judge", authRequired, async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    // Confirm judge identity
    const [judgeRows] = await pool.query(
      "SELECT user_id AS judge_id FROM users WHERE user_id = ? AND role = 'judge' LIMIT 1",
      [userId]
    );
    const judgeId = judgeRows[0]?.judge_id;

    if (!judgeId) {
      return res.json({ success: true, data: { assigned: [], submitted: [], pending: [], leaderboard: [], stats: {} } });
    }

    // Assigned events
    const [assigned] = await pool.query(
      `
      SELECT DISTINCT ja.event_id, e.event_name, e.category,
             e.event_date, COUNT(er.round_id) AS total_rounds
      FROM judge_assignments ja
      JOIN events e ON ja.event_id = e.event_id
      LEFT JOIN event_rounds er ON e.event_id = er.event_id
      WHERE ja.judge_id = ?
      GROUP BY ja.event_id
      ORDER BY e.event_date ASC
      `,
      [judgeId]
    );

    // Submitted scores
    const [submitted] = await pool.query(
      `
      SELECT s.score_id, e.event_name, t.team_name, s.score,
             s.comments, s.created_at AS submission_date, er.round_type AS round_name
      FROM scores s
      JOIN events e ON s.event_id = e.event_id
      LEFT JOIN teams t ON s.participant_id = t.team_id
      LEFT JOIN event_rounds er ON er.event_id = e.event_id
      WHERE s.judge_id = ?
      ORDER BY s.created_at DESC
      LIMIT 20
      `,
      [judgeId]
    );

    // Pending evaluations
    const [pending] = await pool.query(
      `
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
      HAVING teams_pending > 0
      `,
      [judgeId, judgeId]
    );

    // Leaderboard snapshots
    const [leaderboard] = await pool.query(
      `
      SELECT rank, participant_name AS participant, average_score AS score, e.event_name, event_id
      FROM vw_event_leaderboard
      JOIN events e ON vw_event_leaderboard.event_id = e.event_id
      WHERE e.event_id IN (
        SELECT event_id FROM judge_assignments WHERE judge_id = ?
      )
      ORDER BY event_id, rank
      LIMIT 25
      `,
      [judgeId]
    );

    // Statistics
    const [[{ assigned_count }]] = await pool.query(
      "SELECT COUNT(DISTINCT event_id) AS assigned_count FROM judge_assignments WHERE judge_id = ?",
      [judgeId]
    );
    const [[{ submitted_count }]] = await pool.query(
      "SELECT COUNT(*) AS submitted_count FROM scores WHERE judge_id = ?",
      [judgeId]
    );
    const [[{ pending_count }]] = await pool.query(
      `
      SELECT COUNT(*) AS pending_count
      FROM (
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
      ) AS pending
      `,
      [judgeId, judgeId]
    );

    return res.json({
      success: true,
      data: {
        assigned,
        submitted,
        pending,
        leaderboard,
        stats: { assigned_count, submitted_count, pending_count },
      },
    });
  } catch (err) {
    return next(err);
  }
});

router.get("/organizer", authRequired, async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    // My events
    const [events] = await pool.query(
      `
      SELECT e.event_id, e.event_name, e.category, e.event_date,
             e.registration_fee, v.venue_name, e.event_status,
             COALESCE(SUM(CASE WHEN r.status = 'confirmed' THEN 1 ELSE 0 END), 0) AS registered_participants,
             e.max_participants,
             ROUND((COALESCE(SUM(CASE WHEN r.status = 'confirmed' THEN 1 ELSE 0 END), 0) / e.max_participants * 100), 1) AS fill_rate
      FROM events e
      LEFT JOIN venues v ON v.venue_id = e.venue_id
      LEFT JOIN registrations r ON e.event_id = r.event_id
      WHERE e.organizer_id = ?
      GROUP BY e.event_id
      ORDER BY e.event_date ASC
      `,
      [userId]
    );

    // Judge assignments
    const [judges] = await pool.query(
      `
      SELECT u.user_id AS judge_id, u.name, u.email,
             COUNT(ja.event_id) AS assigned_events
      FROM users u
      LEFT JOIN judge_assignments ja ON u.user_id = ja.judge_id AND ja.active = 1
      WHERE u.role = 'judge'
      GROUP BY u.user_id
      `,
      [userId]
    );

    // Event rounds
    const [rounds] = await pool.query(
      `
      SELECT er.round_id, er.event_id, e.event_name, er.round_type AS round_name,
             er.round_date, er.status AS round_status, v.venue_name
      FROM event_rounds er
      JOIN events e ON er.event_id = e.event_id
      LEFT JOIN venues v ON er.venue_id = v.venue_id
      WHERE e.organizer_id = ?
      ORDER BY er.round_date ASC
      `,
      [userId]
    );

    // Venue conflicts (if any)
    const [venueConflicts] = await pool.query(
      `
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
      LIMIT 10
      `,
      [userId]
    );

    // Statistics
    const [[{ total_events }]] = await pool.query(
      "SELECT COUNT(*) as total_events FROM events WHERE organizer_id = ?",
      [userId]
    );
    const [[{ total_registrations }]] = await pool.query(
      `
      SELECT COUNT(r.registration_id) as total_registrations
      FROM events e
      JOIN registrations r ON r.event_id = e.event_id
      WHERE e.organizer_id = ?
      `,
      [userId]
    );
    const [[{ avg_fill_rate }]] = await pool.query(
      `
      SELECT ROUND(AVG(fill_rate), 1) as avg_fill_rate
      FROM (
        SELECT ROUND((COUNT(CASE WHEN r.status = 'confirmed' THEN 1 END) / e.max_participants * 100), 1) as fill_rate
        FROM events e
        LEFT JOIN registrations r ON e.event_id = r.event_id
        WHERE e.organizer_id = ?
        GROUP BY e.event_id
      ) as rates
      `,
      [userId]
    );

    return res.json({
      success: true,
      data: {
        events,
        judges,
        rounds,
        venueConflicts,
        stats: { total_events, total_registrations, avg_fill_rate },
      },
    });
  } catch (err) {
    return next(err);
  }
});

router.get("/sponsor", authRequired, async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    // Get sponsor ID
    const [sponsorRows] = await pool.query("SELECT sponsor_id FROM sponsors WHERE user_id = ? LIMIT 1", [userId]);
    const sponsorId = sponsorRows[0]?.sponsor_id;

    if (!sponsorId) {
      return res.json({ success: true, data: { sponsorInfo: null, sponsoredEvents: [], payments: [], stats: {} } });
    }

    // Sponsor information
    const [sponsorInfo] = await pool.query(
      `
      SELECT s.sponsor_id, u.name, s.tier as sponsorship_tier, s.company_name,
             s.email, s.phone, u.email as user_email
      FROM sponsors s
      LEFT JOIN users u ON s.user_id = u.user_id
      WHERE s.sponsor_id = ?
      LIMIT 1
      `,
      [sponsorId]
    );

    // Sponsored events
    const [sponsoredEvents] = await pool.query(
      `
      SELECT s.event_id, e.event_name, e.category, e.event_date,
             COALESCE(COUNT(r.registration_id), 0) as participants_reached,
             COALESCE(SUM(sp.amount), 0) as sponsorship_contribution
      FROM sponsorships sp
      JOIN events e ON sp.event_id = e.event_id
      LEFT JOIN registrations r ON r.event_id = e.event_id AND r.status = 'confirmed'
      WHERE sp.sponsor_id = ?
      GROUP BY s.event_id, e.event_name, e.category, e.event_date
      ORDER BY e.event_date DESC
      `,
      [sponsorId]
    );

    // Payment records
    const [payments] = await pool.query(
      `
      SELECT py.payment_id, py.amount, py.created_at AS payment_date, py.status,
             e.event_name, py.payment_type
      FROM payments py
      LEFT JOIN events e ON py.event_id = e.event_id
      WHERE py.user_id = ?
      ORDER BY py.created_at DESC
      LIMIT 30
      `,
      [userId]
    );

    // Sponsorship history/summary
    const [history] = await pool.query(
      `
      SELECT sp.sponsorship_id, e.event_name, sp.amount, sp.sponsored_at AS sponsorship_date,
             sp.status AS sponsorship_status, sp.tier
      FROM sponsorships sp
      LEFT JOIN events e ON sp.event_id = e.event_id
      WHERE sp.sponsor_id = ?
      ORDER BY sp.sponsored_at DESC
      `,
      [sponsorId]
    );

    // Statistics
    const [[{ total_contribution }]] = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_contribution FROM sponsorships WHERE sponsor_id = ? AND status = 'confirmed'`,
      [sponsorId]
    );
    const [[{ events_sponsored }]] = await pool.query(
      `SELECT COUNT(DISTINCT event_id) AS events_sponsored FROM sponsorships WHERE sponsor_id = ?`,
      [sponsorId]
    );
    const [[{ total_reach }]] = await pool.query(
      `
      SELECT COALESCE(COUNT(DISTINCT r.registration_id), 0) AS total_reach
      FROM sponsorships sp
      LEFT JOIN registrations r ON r.event_id = sp.event_id AND r.status = 'confirmed'
      WHERE sp.sponsor_id = ?
      `,
      [sponsorId]
    );

    return res.json({
      success: true,
      data: {
        sponsorInfo: sponsorInfo[0] || null,
        sponsoredEvents,
        payments,
        history,
        stats: { total_contribution, events_sponsored, total_reach },
      },
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

