const { verifyToken } = require("../utils/jwt");

function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
}

module.exports = { authRequired };

