function errorHandler(err, _req, res, _next) {
  console.error("[api:error]", {
    code: err?.code,
    errno: err?.errno,
    sqlState: err?.sqlState,
    message: err?.message,
  });

  const msg = err?.message ? String(err.message) : "Server error";
  const code = err?.code ? String(err.code) : "";

  if (code === "ER_DUP_ENTRY") {
    return res.status(409).json({ success: false, error: "Duplicate record", details: msg });
  }

  if (code === "ER_SIGNAL_EXCEPTION") {
    return res.status(409).json({ success: false, error: msg });
  }

  if (code === "ER_NO_REFERENCED_ROW_2" || code === "ER_ROW_IS_REFERENCED_2") {
    return res.status(409).json({ success: false, error: "Related record is missing or still in use", details: msg });
  }

  if (code === "ER_BAD_FIELD_ERROR" || code === "ER_NO_SUCH_TABLE") {
    return res.status(500).json({
      success: false,
      error: "Something went wrong on our end. Please try again or contact support.",
    });
  }

  if (code === "ER_ACCESS_DENIED_ERROR" || code === "ECONNREFUSED" || code === "ENOTFOUND") {
    return res.status(503).json({
      success: false,
      error: "Database is unavailable. Check DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME.",
    });
  }

  if (err?.status || err?.statusCode) {
    return res.status(err.status || err.statusCode).json({ success: false, error: msg });
  }

  return res.status(500).json({ success: false, error: "Server error", details: msg });
}

module.exports = { errorHandler };

