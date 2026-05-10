const express = require("express");
const pool = require("../config/db");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

router.get("/admin", authRequired, async (_req, res, next) => {
  try {
    const [[{ total_users }]] = await pool.query("SELECT COUNT(*) AS total_users FROM users");
    const [[{ active_users }]] = await pool.query("SELECT COUNT(*) AS active_users FROM users WHERE status = 'active'");
    const [[{ total_events }]] = await pool.query("SELECT COUNT(*) AS total_events FROM events");
    const [[{ total_registrations }]] = await pool.query("SELECT COUNT(*) AS total_registrations FROM participants");
    const [[{ revenue_completed }]] = await pool.query("SELECT COALESCE(SUM(amount), 0) AS revenue_completed FROM payments WHERE status = 'completed'");
    const [[{ pending_revenue }]] = await pool.query("SELECT COALESCE(SUM(amount), 0) AS pending_revenue FROM payments WHERE status = 'pending'");

    const [roleDistribution] = await pool.query("SELECT role, COUNT(*) AS count FROM users GROUP BY role ORDER BY count DESC");
    const [categoryDistribution] = await pool.query("SELECT category, COUNT(*) AS count FROM events GROUP BY category ORDER BY count DESC");
    const [venueUtilization] = await pool.query(
      `
      SELECT v.venue_id, v.venue_name, COUNT(e.event_id) AS total_events, COALESCE(SUM(e.max_participants), 0) AS total_capacity_used
      FROM venues v
      LEFT JOIN events e ON e.venue_id = v.venue_id
      GROUP BY v.venue_id, v.venue_name
      ORDER BY total_events DESC, v.venue_name ASC
      `
    );
    const [topPrograms] = await pool.query(
      `
      SELECT e.event_id, e.event_name, e.category, e.event_date, e.max_participants, e.registered_participants, v.venue_name
      FROM events e
      LEFT JOIN venues v ON v.venue_id = e.venue_id
      ORDER BY e.registered_participants DESC, e.event_date ASC
      LIMIT 5
      `
    );
    const [revenueBreakdown] = await pool.query(
      `SELECT payment_type, SUM(amount) AS total FROM payments WHERE status = 'completed' GROUP BY payment_type ORDER BY total DESC`
    );
    const [pendingSponsorships] = await pool.query(
      `
      SELECT sp.sponsorship_id, sp.amount, sp.sponsorship_type, sp.created_at, sp.status,
             e.event_id, e.event_name, e.event_date,
             s.sponsor_id, s.company_name, s.sponsorship_level,
             u.name AS sponsor_user_name, u.email AS sponsor_email
      FROM sponsorships sp
      JOIN sponsors s ON s.sponsor_id = sp.sponsor_id
      JOIN events e ON e.event_id = sp.event_id
      LEFT JOIN users u ON u.user_id = sp.user_id
      WHERE sp.status = 'pending'
      ORDER BY sp.created_at ASC
      LIMIT 25
      `
    );
    const [sponsorshipHistory] = await pool.query(
      `
      SELECT sp.sponsorship_id, sp.amount, sp.sponsorship_type, sp.status, sp.created_at, sp.approved_at, sp.rejection_reason, sp.admin_notes,
             e.event_id, e.event_name, s.company_name, u.name AS sponsor_user_name
      FROM sponsorships sp
      JOIN sponsors s ON s.sponsor_id = sp.sponsor_id
      JOIN events e ON e.event_id = sp.event_id
      LEFT JOIN users u ON u.user_id = sp.user_id
      ORDER BY sp.created_at DESC
      LIMIT 50
      `
    );
    const [recentActivity] = await pool.query(
      `
      SELECT p.participant_id, u.user_id, u.name, e.event_id, e.event_name, p.registration_date, COALESCE(py.status, 'pending') AS payment_status
      FROM participants p
      JOIN users u ON p.user_id = u.user_id
      JOIN events e ON p.event_id = e.event_id
      LEFT JOIN payments py ON py.user_id = p.user_id AND py.event_id = p.event_id AND py.payment_type = 'registration'
      ORDER BY p.registration_date DESC
      LIMIT 15
      `
    );
    const [paymentStatus] = await pool.query("SELECT status, COUNT(*) AS count FROM payments GROUP BY status ORDER BY count DESC");

    return res.json({ success: true, data: { kpi: { total_users, active_users, total_events, total_registrations, revenue_completed, pending_revenue }, roleDistribution, categoryDistribution, venueUtilization, topPrograms, revenueBreakdown, pendingSponsorships, sponsorshipHistory, recentActivity, paymentStatus } });
  } catch (err) {
    return next(err);
  }
});

router.get("/participant", authRequired, async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    const [myEvents] = await pool.query(
      `
      SELECT e.event_id, e.event_name, e.category, e.event_date, e.registration_fee, e.max_participants, e.registered_participants AS current_registrations, v.venue_name, p.registration_date, py.payment_id, py.amount, py.status AS payment_status
      FROM participants p
      JOIN events e ON e.event_id = p.event_id
      LEFT JOIN venues v ON v.venue_id = e.venue_id
      LEFT JOIN payments py ON py.user_id = p.user_id AND py.event_id = p.event_id AND py.payment_type = 'registration'
      WHERE p.user_id = ?
      ORDER BY e.event_date ASC
      `,
      [userId]
    );

    const [upcomingEvents] = await pool.query(
      `
      SELECT e.event_id, e.event_name, e.category, e.event_date, e.registration_fee, e.max_participants, e.registered_participants, v.venue_name, TIMESTAMPDIFF(DAY, CURRENT_DATE(), e.event_date) AS days_until
      FROM events e
      LEFT JOIN venues v ON v.venue_id = e.venue_id
      WHERE e.event_date > CURRENT_DATE()
        AND NOT EXISTS (SELECT 1 FROM participants p WHERE p.user_id = ? AND p.event_id = e.event_id)
      ORDER BY e.event_date ASC
      LIMIT 10
      `,
      [userId]
    );

    const [payments] = await pool.query(
      `SELECT py.payment_id, e.event_name, py.amount, py.payment_type, py.status, py.payment_date, py.event_id FROM payments py LEFT JOIN events e ON py.event_id = e.event_id WHERE py.user_id = ? ORDER BY py.payment_date DESC LIMIT 20`,
      [userId]
    );

    const [accommodation] = await pool.query(
      `
      SELECT ua.accommodation_id, a.room_type, ua.check_in, ua.check_out, DATEDIFF(ua.check_out, ua.check_in) AS nights, a.price_per_night, DATEDIFF(ua.check_out, ua.check_in) * a.price_per_night AS total_cost
      FROM user_accommodations ua
      JOIN accommodations a ON ua.accommodation_id = a.accommodation_id
      WHERE ua.user_id = ?
      ORDER BY ua.check_in DESC
      `,
      [userId]
    );

    const [teams] = await pool.query(
      `SELECT t.team_id, t.team_name, e.event_name, COUNT(tm.user_id) AS member_count FROM team_members tm JOIN teams t ON tm.team_id = t.team_id LEFT JOIN events e ON t.event_id = e.event_id WHERE tm.user_id = ? GROUP BY t.team_id, t.team_name, e.event_name ORDER BY t.team_id DESC`,
      [userId]
    );

    const [passes] = await pool.query(
      `SELECT p.pass_id, p.event_id, p.issued_at, p.status, p.qr_code, e.event_name FROM passes p JOIN participants pa ON pa.participant_id = p.participant_id JOIN events e ON e.event_id = p.event_id WHERE pa.user_id = ? ORDER BY p.issued_at DESC`,
      [userId]
    );

    const [[{ registered_count }]] = await pool.query("SELECT COUNT(*) AS registered_count FROM participants WHERE user_id = ?", [userId]);
    const [[{ paid_count }]] = await pool.query("SELECT COUNT(*) AS paid_count FROM payments WHERE user_id = ? AND status = 'completed'", [userId]);
    const [[{ pending_payment }]] = await pool.query("SELECT COUNT(*) AS pending_payment FROM payments WHERE user_id = ? AND status = 'pending'", [userId]);

    return res.json({ success: true, data: { myEvents, upcomingEvents, payments, accommodation, teams, passes, leaderboards: [], stats: { registered_count, paid_count, pending_payment } } });
  } catch (err) {
    return next(err);
  }
});

router.get("/judge", authRequired, async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const [[judge]] = await pool.query("SELECT judge_id, name, email FROM judges WHERE email = (SELECT email FROM users WHERE user_id = ?) LIMIT 1", [userId]);
    if (!judge) return res.json({ success: true, data: { assigned: [], submitted: [], pending: [], leaderboard: [], stats: {} } });

    const [assigned] = await pool.query(
      `SELECT e.event_id, e.event_name, e.category, e.event_date, v.venue_name, COUNT(DISTINCT er.round_id) AS total_rounds, COUNT(DISTINCT p.participant_id) AS participant_count FROM event_judges ej JOIN events e ON ej.event_id = e.event_id LEFT JOIN venues v ON v.venue_id = e.venue_id LEFT JOIN event_rounds er ON er.event_id = e.event_id LEFT JOIN participants p ON p.event_id = e.event_id WHERE ej.judge_id = ? GROUP BY e.event_id, e.event_name, e.category, e.event_date, v.venue_name ORDER BY e.event_date ASC`,
      [judge.judge_id]
    );
    const [submitted] = await pool.query(
      `SELECT jg.judging_id, e.event_id, e.event_name, p.participant_id, u.name AS participant_name, jg.score, jg.comments, jg.judged_at FROM judging jg JOIN participants p ON jg.participant_id = p.participant_id JOIN users u ON p.user_id = u.user_id JOIN events e ON jg.event_id = e.event_id WHERE jg.judge_id = ? ORDER BY jg.judged_at DESC LIMIT 20`,
      [judge.judge_id]
    );
    const [pending] = await pool.query(
      `SELECT e.event_id, e.event_name, COUNT(DISTINCT p.participant_id) AS teams_pending FROM event_judges ej JOIN events e ON ej.event_id = e.event_id JOIN participants p ON p.event_id = e.event_id LEFT JOIN judging jg ON jg.event_id = e.event_id AND jg.participant_id = p.participant_id AND jg.judge_id = ej.judge_id WHERE ej.judge_id = ? AND jg.judging_id IS NULL GROUP BY e.event_id, e.event_name HAVING teams_pending > 0 ORDER BY e.event_date ASC`,
      [judge.judge_id]
    );
    const [leaderboard] = await pool.query(
      `SELECT p.participant_id, u.name AS participant, ROUND(AVG(jg.score), 2) AS score, e.event_name, e.event_id FROM judging jg JOIN participants p ON jg.participant_id = p.participant_id JOIN users u ON p.user_id = u.user_id JOIN events e ON jg.event_id = e.event_id WHERE jg.event_id IN (SELECT event_id FROM event_judges WHERE judge_id = ?) GROUP BY p.participant_id, u.name, e.event_name, e.event_id ORDER BY score DESC, u.name ASC LIMIT 25`,
      [judge.judge_id]
    );
    const [[{ assigned_count }]] = await pool.query("SELECT COUNT(DISTINCT event_id) AS assigned_count FROM event_judges WHERE judge_id = ?", [judge.judge_id]);
    const [[{ submitted_count }]] = await pool.query("SELECT COUNT(*) AS submitted_count FROM judging WHERE judge_id = ?", [judge.judge_id]);
    const [[{ pending_count }]] = await pool.query(
      `SELECT COUNT(*) AS pending_count FROM (SELECT DISTINCT e.event_id, p.participant_id FROM event_judges ej JOIN events e ON ej.event_id = e.event_id JOIN participants p ON p.event_id = e.event_id LEFT JOIN judging jg ON jg.event_id = e.event_id AND jg.participant_id = p.participant_id AND jg.judge_id = ej.judge_id WHERE ej.judge_id = ? AND jg.judging_id IS NULL) AS pending`,
      [judge.judge_id]
    );

    return res.json({ success: true, data: { assigned, submitted, pending, leaderboard, stats: { assigned_count, submitted_count, pending_count } } });
  } catch (err) {
    return next(err);
  }
});

router.get("/organizer", authRequired, async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const [events] = await pool.query(
      `SELECT e.event_id, e.event_name, e.category, e.event_date, e.registration_fee, v.venue_name, COUNT(DISTINCT p.participant_id) AS registered_participants, e.max_participants, ROUND((COUNT(DISTINCT p.participant_id) / NULLIF(e.max_participants, 0)) * 100, 1) AS fill_rate FROM events e LEFT JOIN venues v ON v.venue_id = e.venue_id LEFT JOIN participants p ON p.event_id = e.event_id WHERE e.organizer_id = ? GROUP BY e.event_id, e.event_name, e.category, e.event_date, e.registration_fee, v.venue_name, e.max_participants ORDER BY e.event_date ASC`,
      [userId]
    );
    const [judges] = await pool.query(
      `SELECT j.judge_id, j.name, j.email, COUNT(DISTINCT ej.event_id) AS assigned_events FROM event_judges ej JOIN events e ON ej.event_id = e.event_id JOIN judges j ON j.judge_id = ej.judge_id WHERE e.organizer_id = ? GROUP BY j.judge_id, j.name, j.email ORDER BY assigned_events DESC, j.name ASC`,
      [userId]
    );
    const [rounds] = await pool.query(
      `SELECT r.round_id, r.event_id, e.event_name, r.round_type AS round_name, r.round_date, r.status AS round_status, v.venue_name FROM event_rounds r JOIN events e ON r.event_id = e.event_id LEFT JOIN venues v ON r.venue_id = v.venue_id WHERE e.organizer_id = ? ORDER BY r.round_date ASC`,
      [userId]
    );
    const [venueConflicts] = await pool.query(
      `SELECT v.venue_id, v.venue_name, COUNT(DISTINCT e.event_id) AS total_rounds FROM events e JOIN venues v ON e.venue_id = v.venue_id JOIN events other_event ON other_event.venue_id = e.venue_id AND other_event.event_date = e.event_date AND other_event.event_id <> e.event_id WHERE e.organizer_id = ? GROUP BY v.venue_id, v.venue_name ORDER BY total_rounds DESC LIMIT 10`,
      [userId]
    );
    const [[{ total_events }]] = await pool.query("SELECT COUNT(*) AS total_events FROM events WHERE organizer_id = ?", [userId]);
    const [[{ total_registrations }]] = await pool.query("SELECT COUNT(DISTINCT p.participant_id) AS total_registrations FROM events e LEFT JOIN participants p ON p.event_id = e.event_id WHERE e.organizer_id = ?", [userId]);
    const [[{ avg_fill_rate }]] = await pool.query(
      `SELECT COALESCE(ROUND(AVG(fill_rate), 1), 0) AS avg_fill_rate FROM (SELECT ROUND((COUNT(DISTINCT p.participant_id) / NULLIF(e.max_participants, 0)) * 100, 1) AS fill_rate FROM events e LEFT JOIN participants p ON p.event_id = e.event_id WHERE e.organizer_id = ? GROUP BY e.event_id, e.max_participants) AS rates`,
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
    const [[sponsorInfo]] = await pool.query("SELECT sponsor_id, company_name AS name, contact_person, email, phone, sponsorship_level, amount FROM sponsors WHERE user_id = ? LIMIT 1", [userId]);
    if (!sponsorInfo) return res.json({ success: true, data: { sponsorInfo: null, sponsoredEvents: [], payments: [], history: [], stats: {} } });

    const sponsorId = sponsorInfo.sponsor_id;
    const [sponsoredEvents] = await pool.query(
      `SELECT e.event_id, e.event_name, e.category, e.event_date, COUNT(DISTINCT p.participant_id) AS participants_reached, COALESCE(SUM(CASE WHEN sp.status = 'approved' THEN sp.amount ELSE 0 END), 0) AS sponsorship_contribution FROM sponsorships sp JOIN events e ON sp.event_id = e.event_id LEFT JOIN participants p ON p.event_id = e.event_id WHERE sp.sponsor_id = ? GROUP BY e.event_id, e.event_name, e.category, e.event_date ORDER BY e.event_date DESC`,
      [sponsorId]
    );
    const [payments] = await pool.query(
      `SELECT py.payment_id, py.amount, py.payment_date, py.status, e.event_name, py.payment_type FROM payments py LEFT JOIN events e ON py.event_id = e.event_id WHERE py.user_id = ? AND py.payment_type = 'sponsorship' ORDER BY py.payment_date DESC LIMIT 30`,
      [userId]
    );
    const [history] = await pool.query(
      `SELECT sp.sponsorship_id, e.event_name, sp.amount, sp.status, sp.created_at, sp.approved_at, sp.rejection_reason, sp.admin_notes FROM sponsorships sp LEFT JOIN events e ON sp.event_id = e.event_id WHERE sp.sponsor_id = ? ORDER BY sp.created_at DESC`,
      [sponsorId]
    );
    const [[{ total_contribution }]] = await pool.query("SELECT COALESCE(SUM(amount), 0) AS total_contribution FROM sponsorships WHERE sponsor_id = ? AND status = 'approved'", [sponsorId]);
    const [[{ events_sponsored }]] = await pool.query("SELECT COUNT(DISTINCT event_id) AS events_sponsored FROM sponsorships WHERE sponsor_id = ? AND status = 'approved'", [sponsorId]);
    const [[{ total_reach }]] = await pool.query("SELECT COALESCE(COUNT(DISTINCT p.participant_id), 0) AS total_reach FROM sponsorships sp LEFT JOIN participants p ON p.event_id = sp.event_id WHERE sp.sponsor_id = ? AND sp.status = 'approved'", [sponsorId]);

    return res.json({ success: true, data: { sponsorInfo, sponsoredEvents, payments, history, stats: { total_contribution, events_sponsored, total_reach } } });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
