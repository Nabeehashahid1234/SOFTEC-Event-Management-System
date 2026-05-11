const express = require("express");
const crypto = require("crypto");
const { param, validationResult } = require("express-validator");
const pool = require("../config/db");
const { authRequired } = require("../middleware/auth");
const { requireRole } = require("../middleware/rbac");

const router = express.Router();
// hey new commit
router.get("/events/:id/my-registration", authRequired, [param("id").isInt()], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: "Invalid event id" });

    const eventId = Number(req.params.id);
    const userId = req.user.user_id;

    const [[registration]] = await pool.query(
      `
      SELECT
        p.participant_id,
        p.registration_date,
        py.payment_id,
        py.amount,
        py.status AS payment_status,
        e.event_id,
        e.event_name,
        e.max_participants,
        e.registered_participants,
        e.registration_fee
      FROM participants p
      JOIN events e ON e.event_id = p.event_id
      LEFT JOIN payments py
        ON py.user_id = p.user_id
       AND py.event_id = p.event_id
       AND py.payment_type = 'registration'
      WHERE p.user_id = ? AND p.event_id = ?
      LIMIT 1
      `,
      [userId, eventId]
    );

    return res.json({
      success: true,
      data: registration
        ? { registered: true, registration }
        : { registered: false, registration: null },
    });
  } catch (err) {
    return next(err);
  }
});

router.post("/events/:id/register", authRequired, [param("id").isInt()], async (req, res, next) => {
  let conn;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: "Invalid event id" });

    const eventId = Number(req.params.id);
    const userId = req.user.user_id;

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [[event]] = await conn.query(
      "SELECT event_id, event_name, max_participants, registered_participants, registration_fee FROM events WHERE event_id = ? FOR UPDATE",
      [eventId]
    );

    if (!event) {
      await conn.rollback();
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    // NULL or 0 max_participants means unlimited capacity — only block when an explicit cap is set
    const cap = event.max_participants != null ? Number(event.max_participants) : null;
    if (cap !== null && cap > 0 && Number(event.registered_participants || 0) >= cap) {
      await conn.rollback();
      return res.status(409).json({ success: false, error: "Event is full" });
    }

    const [[existing]] = await conn.query(
      "SELECT participant_id FROM participants WHERE user_id = ? AND event_id = ? LIMIT 1",
      [userId, eventId]
    );

    if (existing) {
      await conn.rollback();
      return res.status(409).json({ success: false, error: "You are already registered for this event" });
    }

    const [participantResult] = await conn.query("INSERT INTO participants (user_id, event_id) VALUES (?, ?)", [userId, eventId]);

    const fee = Number(event.registration_fee || 0);
    const paymentStatus = fee > 0 ? "pending" : "completed";
    const [paymentResult] = await conn.query(
      "INSERT INTO payments (user_id, event_id, amount, payment_type, status) VALUES (?, ?, ?, 'registration', ?)",
      [userId, eventId, fee, paymentStatus]
    );

    await conn.query("UPDATE events SET registered_participants = registered_participants + 1 WHERE event_id = ?", [eventId]);

    // For free events, the payment is already 'completed' on insert so the AFTER UPDATE
    // trigger won't fire. Generate the pass here explicitly.
    if (fee === 0) {
      const participantId = participantResult.insertId;
      const passId = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : crypto.createHash("sha1").update(String(participantId) + Date.now()).digest("hex");
      await conn.query(
        "INSERT IGNORE INTO passes (pass_id, participant_id, event_id, qr_code) VALUES (?, ?, ?, ?)",
        [passId, participantId, eventId, `SOFTEC-${eventId}-${participantId}`]
      );
    }

    await conn.commit();

    return res.status(201).json({
      success: true,
      data: { participant_id: participantResult.insertId, payment_id: paymentResult.insertId, payment_status: paymentStatus },
    });
  } catch (err) {
    if (conn) await conn.rollback();
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ success: false, error: "You are already registered for this event" });
    }
    return next(err);
  } finally {
    if (conn) conn.release();
  }
});

router.delete("/events/:id/register", authRequired, [param("id").isInt()], async (req, res, next) => {
  let conn;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: "Invalid event id" });

    const eventId = Number(req.params.id);
    const userId = req.user.user_id;

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [[registration]] = await conn.query(
      "SELECT participant_id FROM participants WHERE user_id = ? AND event_id = ? FOR UPDATE",
      [userId, eventId]
    );

    if (!registration) {
      await conn.rollback();
      return res.status(404).json({ success: false, error: "Registration not found" });
    }

    await conn.query("DELETE FROM payments WHERE user_id = ? AND event_id = ? AND payment_type = 'registration'", [userId, eventId]);
    await conn.query("DELETE FROM participants WHERE user_id = ? AND event_id = ?", [userId, eventId]);
    await conn.query("UPDATE events SET registered_participants = GREATEST(0, registered_participants - 1) WHERE event_id = ?", [eventId]);

    await conn.commit();
    return res.json({ success: true, data: { deleted: true } });
  } catch (err) {
    if (conn) await conn.rollback();
    return next(err);
  } finally {
    if (conn) conn.release();
  }
});

router.get("/events/:id/registrations", authRequired, requireRole(["admin", "organizer"]), [param("id").isInt()], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: "Invalid event id" });

    const eventId = Number(req.params.id);
    const [rows] = await pool.query(
      `
      SELECT
        p.participant_id,
        p.registration_date,
        u.user_id,
        u.name,
        u.email,
        py.status AS payment_status,
        py.amount
      FROM participants p
      JOIN users u ON u.user_id = p.user_id
      LEFT JOIN payments py
        ON py.user_id = p.user_id
       AND py.event_id = p.event_id
       AND py.payment_type = 'registration'
      WHERE p.event_id = ?
      ORDER BY p.registration_date DESC
      `,
      [eventId]
    );

    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
