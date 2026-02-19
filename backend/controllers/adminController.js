const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Debate = require("../models/Debate");
const config = require("../config");

// POST /api/admin/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, config.jwtSecret, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      admin: { id: admin._id, email: admin.email, name: admin.name },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalDebates, upcomingDebates] = await Promise.all([
      User.countDocuments(),
      Debate.countDocuments(),
      Debate.countDocuments({ status: "upcoming" }),
    ]);

    // Active users = users who joined at least one debate
    const activeUsers = await User.countDocuments({
      "joinedDebates.0": { $exists: true },
    });

    res.json({
      success: true,
      stats: { totalUsers, totalDebates, upcomingDebates, activeUsers },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("joinedDebates")
      .sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
