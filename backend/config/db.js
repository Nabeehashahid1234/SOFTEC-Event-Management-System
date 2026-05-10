const path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

async function testConnection() {
  let connection;

  try {
    connection = await pool.getConnection();
    await connection.query("SELECT 1 AS connected");
    console.log("[db] MySQL connected successfully");
  } catch (error) {
    console.error("[db] MySQL connection failed:", error?.code || error?.message || error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

module.exports = pool;
module.exports.testConnection = testConnection;
