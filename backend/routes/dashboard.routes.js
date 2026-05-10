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
    const [[{ total_registrations }]] = await pool.query("SELECT COUNT(*) AS total_registrations FROM participants");
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

    // Top programs by registration
    const [topPrograms] = await pool.query(
      `
      SELECT e.event_id, e.event_name, e.category, 
             COUNT(p.participant_id) as registered,
             e.max_participants,
             v.venue_name
      FROM events e
      LEFT JOIN participants p ON e.event_id = p.event_id
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
      SELECT sponsorship_tier, COUNT(*) as count
      FROM sponsors
      GROUP BY sponsorship_tier
      `
    );

    // Recent activity
    const [recentActivity] = await pool.query(
      `
      SELECT u.user_id, u.name, p.participant_id, e.event_name, p.registration_date, py.status
      FROM participants p
      JOIN users u ON p.user_id = u.user_id
      JOIN events e ON p.event_id = e.event_id
      LEFT JOIN payments py ON py.user_id = u.user_id AND py.event_id = e.event_id
      ORDER BY p.registration_date DESC
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
             e.registration_fee, v.venue_name,
             COUNT(p.participant_id) as current_registrations,
             e.max_participants
      FROM participants p
      JOIN events e ON e.event_id = p.event_id
      LEFT JOIN venues v ON v.venue_id = e.venue_id
      WHERE p.user_id = ?
      GROUP BY e.event_id
      ORDER BY e.event_date ASC
      `,
      [userId]
    );

    // Upcoming events
    const [upcomingEvents] = await pool.query(
      `
      SELECT e.event_id, e.event_name, e.category, e.event_date, 
             e.registration_fee, v.venue_name,
             TIMESTAMPDIFF(DAY, NOW(), e.event_date) as days_until
      FROM events e
      LEFT JOIN venues v ON v.venue_id = e.venue_id
      WHERE e.event_date > NOW()
      AND e.event_id NOT IN (
        SELECT event_id FROM participants WHERE user_id = ?
      )
      ORDER BY e.event_date ASC
      LIMIT 10
      `,
      [userId]
    );

    // Payment history
    const [payments] = await pool.query(
      `
      SELECT py.payment_id, e.event_name, py.amount, py.payment_type, 
             py.status, py.payment_date, py.event_id
      FROM payments py
      LEFT JOIN events e ON py.event_id = e.event_id
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
             COUNT(*) as member_count
      FROM team_members tm
      JOIN teams t ON tm.team_id = t.team_id
      LEFT JOIN events e ON t.event_id = e.event_id
      WHERE tm.user_id = ?
      GROUP BY t.team_id
      ORDER BY t.team_id DESC
      `,
      [userId]
    );

    // Leaderboard positions
    // const [leaderboards] = await pool.query(
    //   `
    //   SELECT le.event_id, e.event_name, le.rank, le.score, le.team_id
    //   FROM leaderboards le
    //   JOIN events e ON le.event_id = e.event_id
    //   WHERE le.user_id = ?
    //   ORDER BY le.event_id, le.rank
    //   LIMIT 10
    //   `,
    //   [userId]
    // );
    const leaderboards = []; // Placeholder until leaderboards table is created

    // Statistics
    const [[{ registered_count }]] = await pool.query(
      "SELECT COUNT(*) as registered_count FROM participants WHERE user_id = ?",
      [userId]
    );
    const [[{ paid_count }]] = await pool.query(
      "SELECT COUNT(*) as paid_count FROM payments WHERE user_id = ? AND status = 'completed'",
      [userId]
    );
    const [[{ pending_payment }]] = await pool.query(
      "SELECT COUNT(*) as pending_payment FROM payments WHERE user_id = ? AND status = 'pending'",
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
        leaderboards,
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

    // Get judge ID
    const [judgeRows] = await pool.query("SELECT judge_id FROM judges WHERE user_id = ? LIMIT 1", [userId]);
    const judgeId = judgeRows[0]?.judge_id;

    if (!judgeId) {
      return res.json({ success: true, data: { assigned: [], submitted: [], pending: [], leaderboard: [], stats: {} } });
    }

    // Assigned events
    const [assigned] = await pool.query(
      `
      SELECT DISTINCT je.event_id, e.event_name, e.category, 
             e.event_date, COUNT(r.round_id) as total_rounds
      FROM judge_events je
      JOIN events e ON je.event_id = e.event_id
      LEFT JOIN rounds r ON e.event_id = r.event_id
      WHERE je.judge_id = ?
      GROUP BY je.event_id
      ORDER BY e.event_date ASC
      `,
      [judgeId]
    );

    // Submitted scores
    const [submitted] = await pool.query(
      `
      SELECT s.score_id, e.event_name, t.team_name, s.score, 
             s.comments, s.submission_date, r.round_name
      FROM scores s
      JOIN rounds r ON s.round_id = r.round_id
      JOIN events e ON r.event_id = e.event_id
      LEFT JOIN teams t ON s.team_id = t.team_id
      WHERE s.judge_id = ?
      ORDER BY s.submission_date DESC
      LIMIT 20
      `,
      [judgeId]
    );

    // Pending evaluations
    const [pending] = await pool.query(
      `
      SELECT DISTINCT r.round_id, r.round_name, e.event_name, 
             COUNT(DISTINCT CASE WHEN s.score_id IS NULL THEN t.team_id END) as teams_pending
      FROM rounds r
      JOIN events e ON r.event_id = e.event_id
      LEFT JOIN teams t ON e.event_id = t.event_id
      LEFT JOIN scores s ON r.round_id = s.round_id AND t.team_id = s.team_id AND s.judge_id = ?
      WHERE e.event_id IN (
        SELECT event_id FROM judge_events WHERE judge_id = ?
      )
      AND r.round_status = 'ongoing'
      GROUP BY r.round_id
      HAVING teams_pending > 0
      `,
      [judgeId, judgeId]
    );

    // Leaderboard snapshots
    const [leaderboard] = await pool.query(
      `
      SELECT le.rank, COALESCE(t.team_name, u.name) as participant,
             le.score, e.event_name, le.event_id
      FROM leaderboards le
      JOIN events e ON le.event_id = e.event_id
      LEFT JOIN teams t ON le.team_id = t.team_id
      LEFT JOIN users u ON le.user_id = u.user_id
      WHERE e.event_id IN (
        SELECT event_id FROM judge_events WHERE judge_id = ?
      )
      ORDER BY le.event_id, le.rank
      LIMIT 25
      `,
      [judgeId]
    );

    // Statistics
    const [[{ assigned_count }]] = await pool.query(
      "SELECT COUNT(DISTINCT event_id) as assigned_count FROM judge_events WHERE judge_id = ?",
      [judgeId]
    );
    const [[{ submitted_count }]] = await pool.query(
      "SELECT COUNT(*) as submitted_count FROM scores WHERE judge_id = ?",
      [judgeId]
    );
    const [[{ pending_count }]] = await pool.query(
      `
      SELECT COUNT(*) as pending_count
      FROM (
        SELECT DISTINCT r.round_id, t.team_id
        FROM rounds r
        JOIN events e ON r.event_id = e.event_id
        JOIN teams t ON e.event_id = t.event_id
        LEFT JOIN scores s ON r.round_id = s.round_id AND t.team_id = s.team_id AND s.judge_id = ?
        WHERE e.event_id IN (
          SELECT event_id FROM judge_events WHERE judge_id = ?
        )
        AND r.round_status = 'ongoing'
        AND s.score_id IS NULL
      ) as pending
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
             COUNT(p.participant_id) as registered_participants,
             e.max_participants,
             ROUND((COUNT(p.participant_id) / e.max_participants * 100), 1) as fill_rate
      FROM events e
      LEFT JOIN venues v ON v.venue_id = e.venue_id
      LEFT JOIN participants p ON e.event_id = p.event_id
      WHERE e.organizer_id = ?
      GROUP BY e.event_id
      ORDER BY e.event_date ASC
      `,
      [userId]
    );

    // Judge assignments
    const [judges] = await pool.query(
      `
      SELECT DISTINCT j.judge_id, u.name, u.email, 
             COUNT(je.event_id) as assigned_events
      FROM judges j
      JOIN users u ON j.user_id = u.user_id
      LEFT JOIN judge_events je ON j.judge_id = je.judge_id
      WHERE j.organizer_id = ?
      GROUP BY j.judge_id
      `,
      [userId]
    );

    // Event rounds
    const [rounds] = await pool.query(
      `
      SELECT r.round_id, r.event_id, e.event_name, r.round_name, 
             r.round_date, r.round_status, v.venue_name
      FROM rounds r
      JOIN events e ON r.event_id = e.event_id
      LEFT JOIN venues v ON r.venue_id = v.venue_id
      WHERE e.organizer_id = ?
      ORDER BY r.round_date ASC
      `,
      [userId]
    );

    // Venue conflicts (if any)
    const [venueConflicts] = await pool.query(
      `
      SELECT v.venue_id, v.venue_name, 
             GROUP_CONCAT(e.event_name SEPARATOR ', ') as conflicting_events,
             COUNT(DISTINCT r1.round_id) as total_rounds
      FROM venues v
      JOIN rounds r1 ON v.venue_id = r1.venue_id
      JOIN events e ON r1.event_id = e.event_id
      WHERE e.organizer_id = ?
      AND EXISTS (
        SELECT 1 FROM rounds r2 
        WHERE r2.venue_id = v.venue_id 
        AND r2.round_date = r1.round_date 
        AND r2.round_id != r1.round_id
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
      SELECT COALESCE(SUM(COUNT(p.participant_id)), 0) as total_registrations
      FROM events e
      LEFT JOIN participants p ON e.event_id = p.event_id
      WHERE e.organizer_id = ?
      `,
      [userId]
    );
    const [[{ avg_fill_rate }]] = await pool.query(
      `
      SELECT ROUND(AVG(fill_rate), 1) as avg_fill_rate
      FROM (
        SELECT ROUND((COUNT(p.participant_id) / e.max_participants * 100), 1) as fill_rate
        FROM events e
        LEFT JOIN participants p ON e.event_id = p.event_id
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
      SELECT s.sponsor_id, u.name, s.sponsorship_tier, s.contribution_amount,
             s.start_date, s.end_date, s.contract_status, u.email
      FROM sponsors s
      JOIN users u ON s.user_id = u.user_id
      WHERE s.sponsor_id = ?
      LIMIT 1
      `,
      [sponsorId]
    );

    // Sponsored events
    const [sponsoredEvents] = await pool.query(
      `
      SELECT se.event_id, e.event_name, e.category, e.event_date,
             COUNT(p.participant_id) as participants_reached,
             COALESCE(SUM(py.amount), 0) as sponsorship_contribution
      FROM sponsor_events se
      JOIN events e ON se.event_id = e.event_id
      LEFT JOIN participants p ON e.event_id = p.event_id
      LEFT JOIN payments py ON e.event_id = py.event_id AND py.payment_type = 'sponsorship'
      WHERE se.sponsor_id = ?
      GROUP BY se.event_id
      ORDER BY e.event_date DESC
      `,
      [sponsorId]
    );

    // Payment records
    const [payments] = await pool.query(
      `
      SELECT py.payment_id, py.amount, py.payment_date, py.status,
             e.event_name, py.payment_type
      FROM payments py
      LEFT JOIN events e ON py.event_id = e.event_id
      WHERE py.sponsor_id = ?
      ORDER BY py.payment_date DESC
      LIMIT 30
      `,
      [sponsorId]
    );

    // Sponsorship history/summary
    const [history] = await pool.query(
      `
      SELECT s.sponsorship_id, e.event_name, s.amount, s.sponsorship_date,
             s.sponsorship_status
      FROM sponsorships s
      LEFT JOIN events e ON s.event_id = e.event_id
      WHERE s.sponsor_id = ?
      ORDER BY s.sponsorship_date DESC
      `,
      [sponsorId]
    );

    // Statistics
    const [[{ total_contribution }]] = await pool.query(
      "SELECT COALESCE(SUM(contribution_amount), 0) as total_contribution FROM sponsors WHERE sponsor_id = ?",
      [sponsorId]
    );
    const [[{ events_sponsored }]] = await pool.query(
      "SELECT COUNT(*) as events_sponsored FROM sponsor_events WHERE sponsor_id = ?",
      [sponsorId]
    );
    const [[{ total_reach }]] = await pool.query(
      `
      SELECT COALESCE(SUM(COUNT(DISTINCT p.participant_id)), 0) as total_reach
      FROM sponsor_events se
      LEFT JOIN events e ON se.event_id = e.event_id
      LEFT JOIN participants p ON e.event_id = p.event_id
      WHERE se.sponsor_id = ?
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

