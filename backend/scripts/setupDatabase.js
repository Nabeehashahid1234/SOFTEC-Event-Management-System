#!/usr/bin/env node

/**
 * Database Setup Script
 * Creates the new SOFTEC schema from schema.sql
 */
// This script is intended to be run once to set up the initial database schema. It will drop and recreate the database specified in the .env file, so use with caution. 
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const readline = require("readline");
// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log(`${YELLOW}🗄️  SOFTEC Database Setup${RESET}`);
  console.log(`Database: ${process.env.DB_NAME}`);
  console.log(`Host: ${process.env.DB_HOST}:${process.env.DB_PORT}\n`);

  const confirmed = await prompt(
    `${RED}⚠️  This will DROP and recreate the '${process.env.DB_NAME}' database. Continue? (yes/no): ${RESET}`
  );

  if (confirmed.toLowerCase() !== "yes") {
    console.log(`${YELLOW}Setup cancelled.${RESET}`);
    rl.close();
    process.exit(0);
  }

  const schemaPath = path.resolve(__dirname, "../database/schema.sql");
  if (!fs.existsSync(schemaPath)) {
    console.error(`${RED}Schema file not found: ${schemaPath}${RESET}`);
    rl.close();
    process.exit(1);
  }

  let connection;
  try {
    // Connect without database first to create/drop the database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true,
    });

    console.log(`${YELLOW}Reading schema file...${RESET}`);
    let sql = fs.readFileSync(schemaPath, "utf8");

    console.log(`${YELLOW}Executing schema setup...${RESET}`);
    await connection.query(sql);
    console.log(`${GREEN}✓ Schema created successfully!${RESET}`);

    // Now validate connection to the new database
    await connection.end();
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
    });

    const testConn = await pool.getConnection();
    const [tables] = await testConn.query(
      `SELECT COUNT(*) AS count FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?`,
      [process.env.DB_NAME]
    );
    testConn.release();

    console.log(`${GREEN}✓ Database connected: ${tables[0].count} tables created${RESET}`);
    console.log(`\n${GREEN}Setup complete! You can now start the backend.${RESET}`);
  } catch (error) {
    console.error(`${RED}✗ Setup failed: ${error.message}${RESET}`);
    if (error.sql) console.error(`SQL: ${error.sql}`);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
    rl.close();
  }
}

main();
