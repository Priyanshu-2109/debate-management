const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const clerkAuth = require("../middleware/clerkAuth");

router.post("/sync", userController.syncUser);
router.get("/me", clerkAuth, userController.getProfile);

module.exports = router;
