const User = require("../models/User");

// POST /api/users/sync — Sync Clerk user with MongoDB
exports.syncUser = async (req, res) => {
  try {
    const { clerkId, name, email, avatar } = req.body;

    if (!clerkId || !name || !email) {
      return res
        .status(400)
        .json({
          success: false,
          message: "clerkId, name, and email are required",
        });
    }

    let user = await User.findOne({ clerkId });

    if (user) {
      // Update existing user
      user.name = name;
      user.email = email;
      user.avatar = avatar || user.avatar;
      await user.save();
    } else {
      // Create new user
      user = await User.create({ clerkId, name, email, avatar });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/me — Get current user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "joinedDebates",
      populate: { path: "topicId" },
    });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
