const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const pool = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = Number(process.env.PORT || 5000);
const REQUIRED_ENV = ["DB_HOST", "DB_USER", "DB_NAME", "JWT_SECRET"];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
let dbReady = false;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
console.log("CORS origin:", process.env.FRONTEND_URL || "http://localhost:5173");
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/api/health/db", async (_req, res) => {
  try {
    await pool.query("SELECT 1 AS connected");
    dbReady = true;

    return res.status(200).json({
      success: true,
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    return res.status(500).json({
      success: false,
      error: "Database connection failed",
      code: error?.code,
    });
  }
});

app.get("/api/health", (_req, res) => {
  res.status(dbReady ? 200 : 503).json({
    success: dbReady,
    service: "softec-backend",
    database: dbReady ? "connected" : "unavailable",
    missingEnv,
  });
});
// commmit
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/events", require("./routes/events.routes"));
app.use("/api/venues", require("./routes/venues.routes"));
app.use("/api/payments", require("./routes/payments.routes"));
app.use("/api/judging", require("./routes/judging.routes"));
app.use("/api/sponsorships", require("./routes/sponsorships.routes"));
app.use("/api/judges", require("./routes/judges.routes"));
app.use("/api", require("./routes/registrations.routes"));
app.use("/api/passes", require("./routes/passes.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/reports", require("./routes/reports.routes"));

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

app.use(errorHandler);

function printMountedRoutes() {
  const routes = [];
  app._router?.stack?.forEach((layer) => {
    if (layer.route && layer.route.path) {
      const methods = Object.keys(layer.route.methods)
        .filter((m) => layer.route.methods[m])
        .map((m) => m.toUpperCase());
      methods.forEach((method) => routes.push(`${method} ${layer.route.path}`));
      return;
    }
    if (layer.name === "router" && layer.regexp) {
      routes.push(`MOUNT ${layer.regexp}`);
    }
  });
  console.log("[startup] Mounted routes:", routes.length ? routes : "(route stack unavailable)");
}

async function startServer() {
  if (missingEnv.length) {
    console.warn("[startup] Missing environment variables:", missingEnv.join(", "));
  }

  try {
    await pool.testConnection();
    dbReady = true;
  } catch (error) {
    dbReady = false;
    console.warn("[startup] Continuing without a live database. API routes will return readable DB errors until credentials/schema are fixed.");
    if (String(process.env.REQUIRE_DB_ON_START || "").toLowerCase() === "true") {
      console.error("[startup] REQUIRE_DB_ON_START=true, aborting.");
      process.exit(1);
    }
  }

  printMountedRoutes();
  app.listen(PORT, () => {
    console.log(`[startup] Server running on port ${PORT}`);
  });
}

startServer();
