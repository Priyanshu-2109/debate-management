const User = require("../models/User");

/**
 * Middleware to verify Clerk user and attach user document to req.
 * Expects clerkId in the request header (set by frontend after Clerk auth).
 */
const clerkAuth = async (req, res, next) => {
  try {
    const clerkId = req.headers["x-clerk-user-id"];
    if (!clerkId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized — no Clerk ID" });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message: "User not found. Please sync your account.",
        });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication failed" });
  }
};

module.exports = clerkAuth;
