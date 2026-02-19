const Debate = require("../models/Debate");
const User = require("../models/User");
const Topic = require("../models/Topic");
const sendEmail = require("../utils/sendEmail");
const {
  debateJoinedTemplate,
  topicRevealedTemplate,
} = require("../utils/emailTemplates");

// POST /api/debates  (Admin)
exports.createDebate = async (req, res) => {
  try {
    const { topicId, date, time, location } = req.body;

    if (!date || !time || !location) {
      return res.status(400).json({
        success: false,
        message: "Date, time, and location are required",
      });
    }

    const debate = await Debate.create({
      topicId: topicId || null,
      date,
      time,
      location,
    });

    res.status(201).json({ success: true, debate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/debates
exports.getDebates = async (req, res) => {
  try {
    const debates = await Debate.find()
      .populate("topicId")
      .populate("participants", "name email")
      .sort({ date: 1 });

    res.json({ success: true, debates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/debates/:id
exports.getDebate = async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id)
      .populate("topicId")
      .populate("participants", "name email");

    if (!debate) {
      return res
        .status(404)
        .json({ success: false, message: "Debate not found" });
    }

    res.json({ success: true, debate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/debates/join  (User)
exports.joinDebate = async (req, res) => {
  try {
    const { debateId } = req.body;
    const user = req.user;

    const debate = await Debate.findById(debateId);
    if (!debate) {
      return res
        .status(404)
        .json({ success: false, message: "Debate not found" });
    }

    if (debate.status === "cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "This debate has been cancelled" });
    }

    if (debate.participants.includes(user._id)) {
      return res
        .status(400)
        .json({ success: false, message: "Already joined this debate" });
    }

    debate.participants.push(user._id);
    await debate.save();

    user.joinedDebates.push(debate._id);
    await user.save();

    // Send email notification
    sendEmail(
      user.email,
      "Debate Joined Successfully",
      debateJoinedTemplate({
        userName: user.name,
        date: debate.date,
        time: debate.time,
        location: debate.location,
      }),
    );

    res.json({ success: true, message: "Successfully joined the debate" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/debates/leave  (User)
exports.leaveDebate = async (req, res) => {
  try {
    const { debateId } = req.body;
    const user = req.user;

    const debate = await Debate.findById(debateId);
    if (!debate) {
      return res
        .status(404)
        .json({ success: false, message: "Debate not found" });
    }

    if (!debate.participants.includes(user._id)) {
      return res
        .status(400)
        .json({ success: false, message: "You have not joined this debate" });
    }

    if (debate.status === "active" || debate.status === "completed") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Cannot leave an active or completed debate",
        });
    }

    debate.participants = debate.participants.filter(
      (p) => p.toString() !== user._id.toString(),
    );
    await debate.save();

    user.joinedDebates = user.joinedDebates.filter(
      (d) => d.toString() !== debate._id.toString(),
    );
    await user.save();

    res.json({ success: true, message: "Successfully left the debate" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/debates/reveal/:id  (Admin)
exports.revealTopic = async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id).populate(
      "participants",
      "name email",
    );

    if (!debate) {
      return res
        .status(404)
        .json({ success: false, message: "Debate not found" });
    }

    if (debate.revealStatus) {
      return res
        .status(400)
        .json({ success: false, message: "Topic already revealed" });
    }

    // Auto-pick a random unused topic
    const unusedTopics = await Topic.find({ isUsed: false });
    if (unusedTopics.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "No unused topics available. Add more topics first.",
        });
    }

    const randomIndex = Math.floor(Math.random() * unusedTopics.length);
    const selectedTopic = unusedTopics[randomIndex];

    // Mark topic as used
    selectedTopic.isUsed = true;
    await selectedTopic.save();

    // Assign topic to debate and reveal
    debate.topicId = selectedTopic._id;
    debate.revealStatus = true;
    await debate.save();

    // Re-populate topicId for email templates
    await debate.populate("topicId");

    // Send email to all participants
    const emailPromises = debate.participants.map((participant) =>
      sendEmail(
        participant.email,
        "Debate Topic Revealed",
        topicRevealedTemplate({
          userName: participant.name,
          topicTitle: selectedTopic.title,
          topicDescription: selectedTopic.description,
          date: debate.date,
          time: debate.time,
          location: debate.location,
        }),
      ),
    );

    await Promise.allSettled(emailPromises);

    res.json({
      success: true,
      message: `Topic "${selectedTopic.title}" revealed and participants notified`,
      debate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/debates/:id  (Admin — update debate)
exports.updateDebate = async (req, res) => {
  try {
    const { topicId, date, time, location, status } = req.body;
    const debate = await Debate.findByIdAndUpdate(
      req.params.id,
      { topicId, date, time, location, status },
      { new: true, runValidators: true },
    )
      .populate("topicId")
      .populate("participants", "name email");

    if (!debate) {
      return res
        .status(404)
        .json({ success: false, message: "Debate not found" });
    }

    res.json({ success: true, debate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/debates/:id  (Admin)
exports.deleteDebate = async (req, res) => {
  try {
    const debate = await Debate.findByIdAndDelete(req.params.id);
    if (!debate) {
      return res
        .status(404)
        .json({ success: false, message: "Debate not found" });
    }

    // Remove debate from users' joinedDebates
    await User.updateMany(
      { joinedDebates: debate._id },
      { $pull: { joinedDebates: debate._id } },
    );

    res.json({ success: true, message: "Debate deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
