#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });
// This script applies the SQL files in the correct order to set up the database schema, triggers, procedures, views, events, permissions, and seed data.
async function main() {
  // Define the SQL files to execute in order (based on README copy.md)
  const sqlFiles = [
    { name: 'schema.sql', description: 'Base schema' },
    { name: 'triggers.sql', description: 'Database triggers' },
    { name: 'procedures.sql', description: 'Stored procedures' },
    { name: 'views.sql', description: 'Database views' },
    { name: 'events_scheduler.sql', description: 'Scheduled events' },
    { name: 'dcl_permissions.sql', description: 'Permissions and security' },
    { name: 'seed.sql', description: 'Initial data' }
  ];

  // Resolve the path to the database directory
  const databaseDir = path.resolve(__dirname, "../database");

  // Check if all required SQL files exist
  const missingFiles = sqlFiles.filter(file => !fs.existsSync(path.join(databaseDir, file.name)));
  if (missingFiles.length > 0) {
    throw new Error(
      `Missing required SQL files: ${missingFiles.map(f => f.name).join(', ')}\n` +
      `Please ensure all SQL files are present in backend/database/`
    );
  }
  // Connect to the database

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  // Check if database has tables (schema already applied)
  const [tableCountRows] = await connection.query(
    `SELECT COUNT(*) AS count FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?`,
    [process.env.DB_NAME]
  );

  const hasExistingTables = tableCountRows[0].count > 0;

  console.log(`Database has ${tableCountRows[0].count} existing tables.`);

  if (hasExistingTables) {
    console.log("⚠️  WARNING: Database already has tables. Applying schema.sql may fail on existing tables.");
    console.log("   If you want a clean schema, run: node scripts/setupDatabase.js (drops everything first)");
    console.log("");
  }

  // this loop applies the SQL files in order, with special handling for schema.sql if tables already exist, and skips triggers.sql and procedures.sql with a warning about DELIMITER syntax. It also provides detailed logging and troubleshooting tips if any migration fails.
  try {
    for (const file of sqlFiles) {
      const filePath = path.join(databaseDir, file.name);
      const sql = fs.readFileSync(filePath, "utf8");

      if (!sql.trim()) {
        console.log(`Skipping empty file: ${file.name}`);
        continue;
      }

      console.log(`Applying ${file.name} (${file.description})...`);

      // Handle files with DELIMITER syntax (triggers.sql, procedures.sql) - skip with warning
      if (file.name === 'triggers.sql' || file.name === 'procedures.sql') {
        console.log(`⚠️  Skipping ${file.name} (${file.description}) - contains DELIMITER syntax`);
        console.log(`   Please apply this file manually in MySQL Workbench or command line:`);
        console.log(`   mysql -u ${process.env.DB_USER} -p ${process.env.DB_NAME} < ${filePath}`);
        continue;
      }

      try {
        await connection.query(sql);
      } catch (error) {
        if (file.name === 'schema.sql' && hasExistingTables) {
          console.log(`❌ Failed to apply ${file.name}: ${error.message}`);
          console.log(`   This is expected if tables already exist. Consider running setupDatabase.js for a clean start.`);
          continue;
        }
        throw error; // Re-throw for other files or unexpected errors
      }
    }

    console.log("All applicable database files applied successfully.");
  } catch (error) {
    console.error("Migration failed:", error.message);
    console.log("");
    console.log("💡 TROUBLESHOOTING:");
    console.log("   • For a complete fresh database: node scripts/setupDatabase.js");
    console.log("   • To apply DELIMITER files manually: Use MySQL Workbench or command line");
    console.log("   • Check backend/database/ files for your schema changes");
    throw error;
  } finally {
    await connection.end();
  }
}
// Run the main function and catch any errors
main().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exit(1);
});
