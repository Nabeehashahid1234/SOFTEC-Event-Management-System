#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function main() {
  const migrationDir = path.resolve(__dirname, "../database/migrations");
  const files = fs
    .readdirSync(migrationDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  if (!files.length) {
    console.log("No migration files found.");
    return;
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  const [tableCountRows] = await connection.query(
    `SELECT COUNT(*) AS count FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?`,
    [process.env.DB_NAME]
  );

  if (!tableCountRows[0].count) {
    throw new Error(
      "Database appears empty. Run node scripts/setupDatabase.js to create the base schema before applying migrations."
    );
  }
// Apply each migration file in order
  try {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationDir, file), "utf8");
      if (!sql.trim()) continue;
      console.log(`Applying ${file}...`);
      await connection.query(sql);
    }
    console.log("All migrations applied successfully.");
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exit(1);
});
