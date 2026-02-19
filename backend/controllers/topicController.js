const Topic = require("../models/Topic");

// POST /api/topics
exports.createTopic = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Title and description are required",
        });
    }

    const topic = await Topic.create({
      title,
      description,
      createdBy: req.adminId,
    });

    res.status(201).json({ success: true, topic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/topics
exports.getTopics = async (req, res) => {
  try {
    const topics = await Topic.find().sort({ createdAt: -1 });
    res.json({ success: true, topics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/topics/:id
exports.getTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res
        .status(404)
        .json({ success: false, message: "Topic not found" });
    }
    res.json({ success: true, topic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/topics/:id
exports.deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) {
      return res
        .status(404)
        .json({ success: false, message: "Topic not found" });
    }
    res.json({ success: true, message: "Topic deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
