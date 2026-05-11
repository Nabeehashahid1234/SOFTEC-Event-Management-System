const express = require("express");
const { body, param, validationResult } = require("express-validator");
const pool = require("../config/db");
const { authRequired } = require("../middleware/auth");
const { requireRole } = require("../middleware/rbac");

const crypto = require("crypto");
const router = express.Router();

router.get("/", authRequired, async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const [rows] = await pool.query(
      `
      SELECT py.payment_id, py.event_id, py.amount, py.payment_type,
             py.status, py.payment_date, e.event_name
      FROM payments py
      LEFT JOIN events e ON py.event_id = e.event_id
      WHERE py.user_id = ?
      ORDER BY py.payment_date DESC
      `,
      [userId]
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id/confirm", authRequired, [param("id").isInt()], async (req, res, next) => {
  let conn;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: "Invalid payment id" });

    const paymentId = Number(req.params.id);
    const userId = req.user.user_id;

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [[payment]] = await conn.query(
      "SELECT payment_id, user_id, status, event_id, payment_type, amount FROM payments WHERE payment_id = ? FOR UPDATE",
      [paymentId]
    );

    if (!payment) {
      await conn.rollback();
      return res.status(404).json({ success: false, error: "Payment not found" });
    }

    if (payment.user_id !== userId && req.user.role !== "admin") {
      await conn.rollback();
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    if (payment.status === "completed") {
      await conn.rollback();
      return res.status(400).json({ success: false, error: "Payment already completed" });
    }

    if (payment.status === "failed") {
      await conn.rollback();
      return res.status(400).json({ success: false, error: "Payment failed, cannot confirm" });
    }

    await conn.query("UPDATE payments SET status = 'completed' WHERE payment_id = ?", [paymentId]);

    if (payment.payment_type === "registration" && payment.event_id != null) {
      const [participantInsert] = await conn.query("INSERT IGNORE INTO participants (user_id, event_id) VALUES (?, ?)", [payment.user_id, payment.event_id]);
      let participantId = null;
      if (participantInsert.affectedRows > 0) {
        participantId = participantInsert.insertId;
        await conn.query("UPDATE events SET registered_participants = registered_participants + 1 WHERE event_id = ?", [payment.event_id]);
      } else {
        const [[existingParticipant]] = await conn.query("SELECT participant_id FROM participants WHERE user_id = ? AND event_id = ? LIMIT 1", [payment.user_id, payment.event_id]);
        participantId = existingParticipant ? existingParticipant.participant_id : null;
      }

      // Generate a pass/ticket if we have a participant record
      // Generate a pass/ticket if we have a participant record
      if (participantId) {
        // 1. Generate the unique ID (UUID)
        const passId = (crypto.randomUUID && typeof crypto.randomUUID === "function") 
          ? crypto.randomUUID() 
          : crypto.createHash('sha1').update(String(participantId) + Date.now()).digest('hex');

        // 2. Generate a readable pass_code (THIS FIXES THE ER_NO_DEFAULT_FOR_FIELD)
        const passCode = `PASS-${participantId}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
        
        const qrCode = passId; 

        await conn.query(
          // Added 'pass_code' to the column list and values
          "INSERT INTO passes (pass_id, participant_id, event_id, qr_code, pass_code) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status)",
          [passId, participantId, payment.event_id, qrCode, passCode]
        );
      }
    }

    await conn.commit();
    return res.json({ success: true, data: { payment_id: paymentId, status: "completed" } });
  } catch (err) {
    if (conn) await conn.rollback();
    return next(err);
  } finally {
    if (conn) conn.release();
  }
});

router.post(
  "/",
  authRequired,
  [body("event_id").optional({ nullable: true }).isInt(), body("amount").isFloat({ min: 0 }), body("payment_type").isIn(["registration", "accommodation", "sponsorship"])],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

      const userId = req.user.user_id;
      const { event_id, amount, payment_type } = req.body;

      const [result] = await pool.query(
        "INSERT INTO payments (user_id, event_id, amount, payment_type, status) VALUES (?, ?, ?, ?, 'pending')",
        [userId, event_id ?? null, amount, payment_type]
      );

      return res.status(201).json({ success: true, data: { payment_id: result.insertId } });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ success: false, error: "Payment already exists for this event" });
      }
      return next(err);
    }
  }
);

router.get("/all", authRequired, requireRole(["admin"]), async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT py.payment_id, py.user_id, u.name, py.event_id, e.event_name,
             py.amount, py.payment_type, py.status, py.payment_date
      FROM payments py
      JOIN users u ON py.user_id = u.user_id
      LEFT JOIN events e ON py.event_id = e.event_id
      ORDER BY py.payment_date DESC
      LIMIT 100
      `
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
