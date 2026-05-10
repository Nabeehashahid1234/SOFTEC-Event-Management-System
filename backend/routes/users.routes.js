const express = require("express");
const { body, param, query, validationResult } = require("express-validator");
const pool = require("../config/db");
const { authRequired } = require("../middleware/auth");
const { requireRole } = require("../middleware/rbac");

const router = express.Router();

router.get(
  "/",
  authRequired,
  requireRole(["admin"]),
  [query("role").optional().isString(), query("q").optional().isString()],
  async (req, res, next) => {
    try {
      const { role, q } = req.query;
      const where = [];
      const params = [];

      if (role && role !== "all") {
        where.push("u.role = ?");
        params.push(role);
      }
      if (q) {
        where.push("(u.name LIKE ? OR u.email LIKE ?)");
        params.push(`%${q}%`, `%${q}%`);
      }

      const sql = `
        SELECT u.user_id, u.name, u.email, u.role, u.status, u.created_at
        FROM users u
        ${where.length ? "WHERE " + where.join(" AND ") : ""}
        ORDER BY u.created_at DESC
        LIMIT 200
      `;

      const [rows] = await pool.query(sql, params);
      return res.json({ success: true, data: rows });
    } catch (err) {
      return next(err);
    }
  }
);

router.patch(
  "/:id",
  authRequired,
  requireRole(["admin"]),
  [
    param("id").isInt(),
    body("status").optional().isIn(["active", "inactive"]),
    body("role").optional().isIn(["admin", "participant", "organizer", "judge", "sponsor"]),
    body("name").optional().isString().trim().isLength({ min: 2, max: 120 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

      const userId = Number(req.params.id);
      const fields = [];
      const params = [];

      for (const key of ["status", "role", "name"]) {
        if (Object.prototype.hasOwnProperty.call(req.body, key)) {
          fields.push(`${key} = ?`);
          params.push(req.body[key]);
        }
      }
      if (!fields.length) return res.status(400).json({ success: false, error: "No fields to update" });

      params.push(userId);
      const [result] = await pool.query(`UPDATE users SET ${fields.join(", ")} WHERE user_id = ?`, params);
      if (!result.affectedRows) return res.status(404).json({ success: false, error: "User not found" });

      return res.json({ success: true, data: { user_id: userId } });
    } catch (err) {
      return next(err);
    }
  }
);

router.delete(
  "/:id",
  authRequired,
  requireRole(["admin"]),
  [param("id").isInt()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, error: "Invalid id" });

      const userId = Number(req.params.id);
      if (userId === req.user.user_id) {
        return res.status(400).json({ success: false, error: "Cannot delete your own account" });
      }

      const [result] = await pool.query("DELETE FROM users WHERE user_id = ?", [userId]);
      if (!result.affectedRows) return res.status(404).json({ success: false, error: "User not found" });

      return res.json({ success: true, data: { deleted: true } });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;