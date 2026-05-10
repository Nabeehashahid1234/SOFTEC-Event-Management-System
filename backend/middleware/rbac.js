function requireRole(roles) {
  const set = new Set(Array.isArray(roles) ? roles : [roles]);
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) return res.status(401).json({ success: false, error: "Unauthorized" });
    if (!set.has(role)) return res.status(403).json({ success: false, error: "Forbidden" });
    return next();
  };
}

module.exports = { requireRole };

