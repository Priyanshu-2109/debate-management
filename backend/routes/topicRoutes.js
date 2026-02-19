const express = require("express");
const router = express.Router();
const topicController = require("../controllers/topicController");
const adminAuth = require("../middleware/adminAuth");

router.post("/", adminAuth, topicController.createTopic);
router.get("/", adminAuth, topicController.getTopics);
router.get("/:id", adminAuth, topicController.getTopic);
router.delete("/:id", adminAuth, topicController.deleteTopic);

module.exports = router;
