const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT venue_id, venue_name, capacity, facilities, location FROM venues ORDER BY venue_name ASC"
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

