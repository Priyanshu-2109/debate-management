const express = require("express");
const router = express.Router();
const { handleClerkWebhook } = require("../controllers/webhookController");

// Use raw body for webhook signature verification
router.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  handleClerkWebhook,
);

module.exports = router;
