const pool = require("./config/db");

async function fixSchema() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("Connected to DB. Applying fixes...");

    // Fix 1: Sponsorships created_at
    try {
      await connection.query("ALTER TABLE sponsorships ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
      console.log("Added created_at to sponsorships.");
    } catch (err) {
      if (err.code === 'ER_DUP_COLUMN_NAME') {
        console.log("Column created_at already exists in sponsorships.");
      } else {
        throw err;
      }
    }

    // Fix 2: Judges assigned_events_count
    try {
      await connection.query("ALTER TABLE judges ADD COLUMN assigned_events_count INT DEFAULT 0");
      console.log("Added assigned_events_count to judges.");
    } catch (err) {
      if (err.code === 'ER_DUP_COLUMN_NAME') {
        console.log("Column assigned_events_count already exists in judges.");
      } else {
        throw err;
      }
    }

    console.log("Schema fixes applied successfully.");
  } catch (error) {
    console.error("Error applying schema fixes:", error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

fixSchema();
