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

    return res.status(200).json({
      success: true,
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    return res.status(500).json({
      success: false,
      error: "Database connection failed",
    });
  }
});

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
  app._router?.stack?.forEach((middleware) => {
    if (!middleware.route || !middleware.route.path) return;
    const methods = Object.keys(middleware.route.methods)
      .filter((m) => middleware.route.methods[m])
      .map((m) => m.toUpperCase());
    methods.forEach((method) => routes.push(`${method} ${middleware.route.path}`));
  });
  console.log("Mounted top-level routes:", routes);
}

async function startServer() {
  try {
    await pool.testConnection();
    printMountedRoutes();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup aborted because MySQL connection failed.");
    process.exit(1);
  }
}

startServer();
