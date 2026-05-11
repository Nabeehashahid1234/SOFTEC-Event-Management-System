const express = require("express");
const { body, validationResult } = require("express-validator");
const pool = require("../config/db");
const { signToken } = require("../utils/jwt");
const { hashPassword, verifyPassword } = require("../utils/password");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "admin_secret";

router.post(
  "/register",
  [
    body("name").isString().trim().isLength({ min: 2, max: 120 }),
    body("email").isEmail().normalizeEmail(),
    body("password").isString().isLength({ min: 6, max: 72 }),
    body("role").isIn(["participant", "organizer", "judge", "sponsor", "admin"]),
    body("admin_key").optional().isString(),
  ],
  async (req, res, next) => {
    try {
      console.log("[AUTH] POST /api/auth/register hit", { email: req.body?.email, role: req.body?.role });
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array()[0].msg });
      }

      const { name, email, password, role, admin_key } = req.body;

      // Admin accounts require the secret key
      if (role === "admin") {
        if (!admin_key || admin_key !== ADMIN_SECRET) {
          return res.status(403).json({ success: false, error: "Invalid admin secret key" });
        }
      }

      const passwordHash = await hashPassword(password);

      const [result] = await pool.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
        [name, email, passwordHash, role]
      );
      console.log("[AUTH] register insert result", { insertId: result.insertId, affectedRows: result.affectedRows });

      const userId = result.insertId;
      const user = { user_id: userId, name, email, role, status: "active" };
      const token = signToken({ user_id: userId, role });
      console.log("[AUTH] register JWT generated", { user_id: userId, role });

      return res.status(201).json({ success: true, data: { token, user } });
    } catch (err) {
      return next(err);
    }
  }
);

router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").isString().isLength({ min: 1 })],
  async (req, res, next) => {
    try {
      console.log("[AUTH] POST /api/auth/login hit", { email: req.body?.email });
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: "Invalid credentials" });
      }

      const { email, password } = req.body;
      const [rows] = await pool.query(
        "SELECT user_id, name, email, role, status, password_hash FROM users WHERE email = ? LIMIT 1",
        [email]
      );

      if (!rows.length) return res.status(401).json({ success: false, error: "Invalid credentials" });
      const row = rows[0];
      if (row.status !== "active") return res.status(403).json({ success: false, error: "Account inactive" });

      const ok = await verifyPassword(password, row.password_hash);
      if (!ok) return res.status(401).json({ success: false, error: "Invalid credentials" });

      const token = signToken({ user_id: row.user_id, role: row.role });
      const user = { user_id: row.user_id, name: row.name, email: row.email, role: row.role, status: row.status };
      console.log("[AUTH] login success", { user_id: row.user_id, role: row.role });

      return res.json({ success: true, data: { token, user } });
    } catch (err) {
      return next(err);
    }
  }
);

router.get("/me", authRequired, async (req, res, next) => {
  try {
    console.log("[AUTH] GET /api/auth/me hit", { user_id: req.user?.user_id });
    const [rows] = await pool.query(
      "SELECT user_id, name, email, role, status, created_at FROM users WHERE user_id = ? LIMIT 1",
      [req.user.user_id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
