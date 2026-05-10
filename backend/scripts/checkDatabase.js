const pool = require("../config/db");

const requiredTables = ["users", "events", "participants", "payments", "venues"];

async function checkDatabase() {
  try {
    const [rows] = await pool.query("SHOW TABLES");
    const tableNames = rows.map((row) => Object.values(row)[0]);
    const missingTables = requiredTables.filter((table) => !tableNames.includes(table));

    console.log("Database tables:");
    tableNames.forEach((table) => console.log(`- ${table}`));

    if (missingTables.length > 0) {
      console.error("\nMissing required tables:");
      missingTables.forEach((table) => console.error(`- ${table}`));
      process.exitCode = 1;
      return;
    }

    console.log("\nAll required tables exist.");
  } catch (error) {
    console.error("Database verification failed:");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

checkDatabase();
