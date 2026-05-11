const express = require("express");
const { param, validationResult } = require("express-validator");
const pool = require("../config/db");
const { authRequired } = require("../middleware/auth");
const { requireRole } = require("../middleware/rbac");

const router = express.Router();

// Get my passes
router.get("/", authRequired, async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    let rows = [];
    try {
      [rows] = await pool.query(
        `
        SELECT p.pass_id, p.participant_id, p.event_id, p.issued_at, p.status, p.qr_code, e.event_name, e.event_date
        FROM passes p
        JOIN participants pa ON pa.participant_id = p.participant_id
        JOIN events e ON e.event_id = p.event_id
        WHERE pa.user_id = ?
        ORDER BY p.issued_at DESC
        `,
        [userId]
      );
    } catch (err) {
      if (err.code === "ER_NO_SUCH_TABLE") {
        rows = [];
      } else {
        throw err;
      }
    }
    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
});

// Get pass by id (owner or admin)
router.get("/:id", authRequired, [param("id").isString().isLength({ min: 8 })], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: "Invalid pass id" });
    const passId = req.params.id;

    const [[passRow]] = await pool.query(
      `SELECT p.*, pa.user_id FROM passes p JOIN participants pa ON pa.participant_id = p.participant_id WHERE p.pass_id = ? LIMIT 1`,
      [passId]
    );
    if (!passRow) return res.status(404).json({ success: false, error: "Pass not found" });

    if (passRow.user_id !== req.user.user_id && req.user.role !== "admin") return res.status(403).json({ success: false, error: "Forbidden" });

    return res.json({ success: true, data: passRow });
  } catch (err) {
    return next(err);
  }
});

// Redeem a pass (mark as redeemed) - only judges/admin/organizer can redeem for safety
router.patch("/:id/redeem", authRequired, requireRole(["admin", "organizer", "judge"]), [param("id").isString().isLength({ min: 8 })], async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: "Invalid pass id" });

    const passId = req.params.id;
    await conn.beginTransaction();

    const [[pass]] = await conn.query("SELECT pass_id, status FROM passes WHERE pass_id = ? FOR UPDATE", [passId]);
    if (!pass) {
      await conn.rollback();
      return res.status(404).json({ success: false, error: "Pass not found" });
    }
    if (pass.status === "redeemed") {
      await conn.rollback();
      return res.status(400).json({ success: false, error: "Pass already redeemed" });
    }

    await conn.query("UPDATE passes SET status = 'redeemed' WHERE pass_id = ?", [passId]);
    await conn.commit();
    return res.json({ success: true, data: { pass_id: passId, status: "redeemed" } });
  } catch (err) {
    await conn.rollback();
    return next(err);
  } finally {
    conn.release();
  }
});

module.exports = router;
