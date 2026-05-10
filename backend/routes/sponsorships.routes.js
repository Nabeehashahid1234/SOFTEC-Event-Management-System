const express = require("express");
const { body, param, validationResult } = require("express-validator");
const pool = require("../config/db");
const { authRequired } = require("../middleware/auth");
const { requireRole } = require("../middleware/rbac");

const router = express.Router();

router.get("/", authRequired, async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const isAdmin = req.user.role === "admin";

    const [rows] = await pool.query(
      `
      SELECT
        sp.sponsorship_id,
        sp.sponsor_id,
        sp.event_id,
        sp.sponsorship_type,
        sp.amount,
        sp.status,
        sp.created_at,
        e.event_name,
        e.event_date,
        e.category,
        s.company_name,
        u.name AS sponsor_user_name
      FROM sponsorships sp
      LEFT JOIN events e ON sp.event_id = e.event_id
      LEFT JOIN sponsors s ON sp.sponsor_id = s.sponsor_id
      LEFT JOIN users u ON s.user_id = u.user_id
      ${isAdmin ? "" : "WHERE s.user_id = ?"}
      ORDER BY sp.created_at DESC
      `,
      isAdmin ? [] : [userId]
    );

    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
});

router.get("/sponsors", async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        s.sponsor_id,
        s.company_name,
        s.contact_person,
        s.email,
        s.phone,
        s.sponsorship_level,
        s.amount,
        COALESCE(SUM(sp.amount), 0) AS total_sponsored,
        COUNT(DISTINCT sp.event_id) AS events_count
      FROM sponsors s
      LEFT JOIN sponsorships sp ON sp.sponsor_id = s.sponsor_id
      GROUP BY s.sponsor_id, s.company_name, s.contact_person, s.email, s.phone, s.sponsorship_level, s.amount
      ORDER BY s.sponsorship_level ASC, total_sponsored DESC
      `
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
});

router.post(
  "/",
  authRequired,
  requireRole(["sponsor", "admin"]),
  [body("event_id").isInt(), body("sponsorship_type").isIn(["Gold", "Silver", "Title"]), body("amount").isFloat({ min: 1 })],
  async (req, res, next) => {
    let conn;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

      const { event_id, sponsorship_type, amount } = req.body;
      const userId = req.user.user_id;

      conn = await pool.getConnection();
      await conn.beginTransaction();

      const [[sponsorRow]] = await conn.query("SELECT sponsor_id FROM sponsors WHERE user_id = ? LIMIT 1", [userId]);
      if (!sponsorRow) {
        await conn.rollback();
        return res.status(400).json({ success: false, error: "Sponsor profile not found. Please complete your sponsor profile first." });
      }

      const [[event]] = await conn.query("SELECT event_id FROM events WHERE event_id = ? LIMIT 1", [event_id]);
      if (!event) {
        await conn.rollback();
        return res.status(404).json({ success: false, error: "Event not found" });
      }

      const [spResult] = await conn.query(
        "INSERT INTO sponsorships (sponsor_id, user_id, event_id, sponsorship_type, amount, status) VALUES (?, ?, ?, ?, ?, 'pending')",
        [sponsorRow.sponsor_id, userId, event_id, sponsorship_type, amount]
      );

      const [paymentResult] = await conn.query(
        "INSERT INTO payments (user_id, event_id, amount, payment_type, status) VALUES (?, ?, ?, 'sponsorship', 'pending')",
        [userId, event_id, amount]
      );

      await conn.commit();

      return res.status(201).json({ success: true, data: { sponsorship_id: spResult.insertId, sponsor_id: sponsorRow.sponsor_id, payment_id: paymentResult.insertId } });
    } catch (err) {
      if (conn) await conn.rollback();
      return next(err);
    } finally {
      if (conn) conn.release();
    }
  }
);

router.patch("/:id/approve", authRequired, requireRole(["admin"]), [param("id").isInt(), body("admin_notes").optional().isString().trim().isLength({ max: 1000 })], async (req, res, next) => {
  let conn;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: "Invalid id" });

    const sponsorshipId = Number(req.params.id);
    const adminId = req.user.user_id;
    const adminNotes = req.body.admin_notes || null;

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [[sp]] = await conn.query(
      "SELECT sponsorship_id, user_id, event_id, amount, status FROM sponsorships WHERE sponsorship_id = ? FOR UPDATE",
      [sponsorshipId]
    );
    if (!sp) {
      await conn.rollback();
      return res.status(404).json({ success: false, error: "Sponsorship not found" });
    }
    if (sp.status === "approved") {
      await conn.rollback();
      return res.status(400).json({ success: false, error: "Sponsorship already approved" });
    }

    await conn.query(
      "UPDATE sponsorships SET status = 'approved', approved_by = ?, approved_at = CURRENT_TIMESTAMP, admin_notes = ? WHERE sponsorship_id = ?",
      [adminId, adminNotes, sponsorshipId]
    );

    await conn.query(
      "UPDATE payments SET status = 'completed' WHERE user_id = ? AND event_id = ? AND payment_type = 'sponsorship' AND status = 'pending'",
      [sp.user_id, sp.event_id]
    );

    if (sp.event_id) {
      await conn.query(
        "UPDATE events SET sponsorship_total = sponsorship_total + ? WHERE event_id = ?",
        [sp.amount || 0, sp.event_id]
      );
    }

    await conn.commit();
    return res.json({ success: true, data: { sponsorship_id: sponsorshipId, status: "approved" } });
  } catch (err) {
    if (conn) await conn.rollback();
    return next(err);
  } finally {
    if (conn) conn.release();
  }
});

router.patch("/:id/reject", authRequired, requireRole(["admin"]),
  [param("id").isInt(), body("rejection_reason").optional().isString().trim().isLength({ max: 500 }), body("admin_notes").optional().isString().trim().isLength({ max: 1000 })],
  async (req, res, next) => {
    let conn;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, error: "Invalid id" });

      const sponsorshipId = Number(req.params.id);
      const adminId = req.user.user_id;
      const rejection_reason = req.body.rejection_reason || null;
      const adminNotes = req.body.admin_notes || null;

      conn = await pool.getConnection();
      await conn.beginTransaction();

      const [[sp]] = await conn.query(
        "SELECT sponsorship_id, user_id, event_id, status FROM sponsorships WHERE sponsorship_id = ? FOR UPDATE",
        [sponsorshipId]
      );
      if (!sp) {
        await conn.rollback();
        return res.status(404).json({ success: false, error: "Sponsorship not found" });
      }
      if (sp.status !== "pending") {
        await conn.rollback();
        return res.status(400).json({ success: false, error: `Sponsorship is already ${sp.status}` });
      }

      await conn.query(
        "UPDATE sponsorships SET status = 'rejected', approved_by = ?, approved_at = CURRENT_TIMESTAMP, rejection_reason = ?, admin_notes = ? WHERE sponsorship_id = ?",
        [adminId, rejection_reason, adminNotes, sponsorshipId]
      );

      await conn.query(
        "UPDATE payments SET status = 'failed' WHERE user_id = ? AND event_id = ? AND payment_type = 'sponsorship' AND status = 'pending'",
        [sp.user_id, sp.event_id]
      );

      await conn.commit();
      return res.json({ success: true, data: { sponsorship_id: sponsorshipId, status: "rejected" } });
    } catch (err) {
      if (conn) await conn.rollback();
      return next(err);
    } finally {
      if (conn) conn.release();
    }
  }
);

router.post(
  "/profile",
  authRequired,
  requireRole(["sponsor", "admin"]),
  [
    body("company_name").isString().trim().isLength({ min: 2, max: 160 }),
    body("contact_person").isString().trim().isLength({ min: 2, max: 120 }),
    body("email").isEmail().normalizeEmail(),
    body("phone").optional().isString(),
    body("sponsorship_level").isIn(["Gold", "Silver", "Bronze"]),
    body("amount").isFloat({ min: 0 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

      const userId = req.user.user_id;
      const { company_name, contact_person, email, phone, sponsorship_level, amount } = req.body;

      const [[existing]] = await pool.query("SELECT sponsor_id FROM sponsors WHERE user_id = ? LIMIT 1", [userId]);

      if (existing) {
        await pool.query(
          "UPDATE sponsors SET company_name = ?, contact_person = ?, email = ?, phone = ?, sponsorship_level = ?, amount = ? WHERE sponsor_id = ?",
          [company_name, contact_person, email, phone ?? null, sponsorship_level, amount, existing.sponsor_id]
        );
        return res.json({ success: true, data: { sponsor_id: existing.sponsor_id } });
      }

      const [result] = await pool.query(
        "INSERT INTO sponsors (company_name, contact_person, email, phone, sponsorship_level, amount, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [company_name, contact_person, email, phone ?? null, sponsorship_level, amount, userId]
      );

      return res.status(201).json({ success: true, data: { sponsor_id: result.insertId } });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ success: false, error: "A sponsor with that email already exists" });
      }
      return next(err);
    }
  }
);

router.get("/my-profile", authRequired, requireRole(["sponsor"]), async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const [[profile]] = await pool.query("SELECT * FROM sponsors WHERE user_id = ? LIMIT 1", [userId]);
    return res.json({ success: true, data: profile || null });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
