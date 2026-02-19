const express = require("express");
const router = express.Router();
const debateController = require("../controllers/debateController");
const adminAuth = require("../middleware/adminAuth");
const clerkAuth = require("../middleware/clerkAuth");

// Public
router.get("/", debateController.getDebates);
router.get("/:id", debateController.getDebate);

// User (Clerk auth)
router.post("/join", clerkAuth, debateController.joinDebate);
router.post("/leave", clerkAuth, debateController.leaveDebate);

// Admin
router.post("/", adminAuth, debateController.createDebate);
router.patch("/reveal/:id", adminAuth, debateController.revealTopic);
router.patch("/:id", adminAuth, debateController.updateDebate);
router.delete("/:id", adminAuth, debateController.deleteDebate);

module.exports = router;
