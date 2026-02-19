const jwt = require("jsonwebtoken");
const config = require("../config");

/**
 * Protect admin routes — verifies JWT token from Authorization header
 */
const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized — no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized — invalid token" });
  }
};

module.exports = adminAuth;
