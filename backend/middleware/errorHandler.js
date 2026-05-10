function errorHandler(err, _req, res, _next) {
  console.error("Error:", err);
  // Map MySQL trigger/procedure SIGNAL and common constraint errors.
  const msg = err?.message ? String(err.message) : "Server error";
  const code = err?.code ? String(err.code) : "";

  if (code === "ER_DUP_ENTRY") {
    return res.status(409).json({ success: false, error: msg });
  }

  // SIGNAL SQLSTATE '45000' from triggers/procs usually surfaces as ER_SIGNAL_EXCEPTION
  if (code === "ER_SIGNAL_EXCEPTION") {
    return res.status(409).json({ success: false, error: msg });
  }

  return res.status(500).json({ success: false, error: "Server error" });
}

module.exports = { errorHandler };

