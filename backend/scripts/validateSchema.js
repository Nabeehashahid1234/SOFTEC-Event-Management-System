#!/usr/bin/env node

/**
 * Database Schema Validation Script
 * Validates the new SOFTEC schema and checks for consistency
 */

const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 5,
});

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

let passCount = 0;
let failCount = 0;

async function log(status, message) {
  const icon = status === "pass" ? `${GREEN}✓${RESET}` : status === "warn" ? `${YELLOW}⚠${RESET}` : `${RED}✗${RESET}`;
  console.log(`${icon} ${message}`);
  if (status === "pass") passCount++;
  else if (status === "fail") failCount++;
}

async function checkTableExists(tableName) {
  const [rows] = await pool.query(
    `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
    [process.env.DB_NAME, tableName]
  );
  return rows.length > 0;
}

async function checkViewExists(viewName) {
  const [rows] = await pool.query(
    `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'VIEW' AND TABLE_NAME = ?`,
    [process.env.DB_NAME, viewName]
  );
  return rows.length > 0;
}

async function checkColumnExists(tableName, columnName) {
  const [rows] = await pool.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [process.env.DB_NAME, tableName, columnName]
  );
  return rows.length > 0;
}

async function checkIndexExists(tableName, indexName) {
  const [rows] = await pool.query(
    `SELECT INDEX_NAME FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [process.env.DB_NAME, tableName, indexName]
  );
  return rows.length > 0;
}

async function validateTables() {
  console.log(`\n${YELLOW}=== Table Validation ===${RESET}`);

  const tables = [
    "users",
    "venues",
    "events",
    "registrations",
    "payments",
    "judge_assignments",
    "event_rounds",
    "sponsorships",
    "sponsors",
    "teams",
    "team_members",
    "accommodations",
    "user_accommodations",
    "notifications",
    "event_passes",
  ];

  for (const table of tables) {
    const exists = await checkTableExists(table);
    await log(exists ? "pass" : "fail", `Table '${table}' exists`);
  }
}

async function validateColumns() {
  console.log(`\n${YELLOW}=== Column Validation ===${RESET}`);

  const columnChecks = [
    { table: "events", column: "assigned_judge_id" },
    { table: "events", column: "event_status" },
    { table: "events", column: "prize_pool" },
    { table: "registrations", column: "user_id" },
    { table: "registrations", column: "status" },
    { table: "registrations", column: "registered_at" },
    { table: "payments", column: "registration_id" },
    { table: "payments", column: "sponsor_id" },
    { table: "judge_assignments", column: "judge_id" },
    { table: "event_rounds", column: "round_type" },
    { table: "sponsorships", column: "tier" },
  ];

  for (const check of columnChecks) {
    const exists = await checkColumnExists(check.table, check.column);
    await log(exists ? "pass" : "fail", `Column '${check.table}.${check.column}' exists`);
  }
}

async function validateViews() {
  console.log(`\n${YELLOW}=== View Validation ===${RESET}`);

  const views = ["vw_event_leaderboard", "vw_judge_workload", "vw_sponsorship_totals"];

  for (const view of views) {
    const exists = await checkViewExists(view);
    await log(exists ? "pass" : "fail", `View '${view}' exists`);
  }
}

async function validateIndexes() {
  console.log(`\n${YELLOW}=== Index Validation ===${RESET}`);

  const indexChecks = [
    { table: "users", index: "idx_users_email" },
    { table: "users", index: "idx_users_role" },
    { table: "events", index: "idx_events_organizer" },
    { table: "events", index: "idx_events_category" },
    { table: "registrations", index: "idx_registrations_event" },
    { table: "payments", index: "idx_payments_user" },
  ];

  for (const check of indexChecks) {
    const exists = await checkIndexExists(check.table, check.index);
    await log(exists ? "pass" : "warn", `Index '${check.table}.${check.index}' exists`);
  }
}

async function validateSampleQueries() {
  console.log(`\n${YELLOW}=== Sample Query Validation ===${RESET}`);

  // Test registrations query
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS count FROM registrations WHERE status = 'confirmed'`
    );
    await log("pass", "Query: Registrations by status works");
  } catch (error) {
    await log("fail", `Query: Registrations by status failed - ${error.message}`);
  }

  // Test judge assignments query
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(DISTINCT judge_id) AS judges FROM judge_assignments WHERE active = 1`
    );
    await log("pass", "Query: Judge assignments works");
  } catch (error) {
    await log("fail", `Query: Judge assignments failed - ${error.message}`);
  }

  // Test sponsorships query
  try {
    const [rows] = await pool.query(
      `SELECT SUM(amount) AS total FROM sponsorships WHERE status = 'approved'`
    );
    await log("pass", "Query: Sponsorship totals works");
  } catch (error) {
    await log("fail", `Query: Sponsorship totals failed - ${error.message}`);
  }

  // Test event with judge info
  try {
    const [rows] = await pool.query(`
      SELECT e.event_id, e.event_name, u.name AS judge_name
      FROM events e
      LEFT JOIN users u ON u.user_id = e.assigned_judge_id
      LIMIT 1
    `);
    await log("pass", "Query: Events with judge info works");
  } catch (error) {
    await log("fail", `Query: Events with judge info failed - ${error.message}`);
  }
}

async function validateForeignKeys() {
  console.log(`\n${YELLOW}=== Foreign Key Validation ===${RESET}`);

  try {
    const [rows] = await pool.query(`
      SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = ? AND REFERENCED_TABLE_NAME IS NOT NULL
      ORDER BY TABLE_NAME
    `, [process.env.DB_NAME]);

    await log("pass", `Found ${rows.length} foreign key relationships`);
    if (rows.length > 0) {
      rows.slice(0, 5).forEach(fk => {
        console.log(`  • ${fk.TABLE_NAME}.${fk.COLUMN_NAME}`);
      });
      if (rows.length > 5) console.log(`  ... and ${rows.length - 5} more`);
    }
  } catch (error) {
    await log("fail", `Foreign key check failed - ${error.message}`);
  }
}

async function main() {
  console.log(`${YELLOW}🔍 SOFTEC Database Schema Validation${RESET}`);
  console.log(`Database: ${process.env.DB_NAME}`);
  console.log(`Host: ${process.env.DB_HOST}:${process.env.DB_PORT}\n`);

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query("SELECT 1");
    await log("pass", "Database connection successful");
  } catch (error) {
    console.error(`${RED}Cannot connect to database: ${error.message}${RESET}`);
    process.exit(1);
  } finally {
    if (connection) connection.release();
  }

  try {
    await validateTables();
    await validateColumns();
    await validateViews();
    await validateIndexes();
    await validateSampleQueries();
    await validateForeignKeys();

    console.log(`\n${YELLOW}=== Summary ===${RESET}`);
    console.log(`${GREEN}Passed: ${passCount}${RESET}`);
    console.log(`${RED}Failed: ${failCount}${RESET}`);

    if (failCount === 0) {
      console.log(`\n${GREEN}✓ All validations passed!${RESET}`);
      process.exit(0);
    } else {
      console.log(`\n${RED}✗ Some validations failed. Check the schema.${RESET}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`${RED}Error during validation: ${error.message}${RESET}`);
    process.exit(1);
  }
}

main();
