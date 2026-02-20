/**
 * Vercel Cron endpoint — called on a schedule to process
 * auto-reveal and auto-complete logic for debates.
 *
 * Can also be hit manually: GET /api/cron
 */
const connectDB = require("../config/db");
const { processDebateAutomation } = require("../utils/debateAutomation");

module.exports = async (req, res) => {
  try {
    await connectDB();
    await processDebateAutomation();
    res.json({ success: true, message: "Debate automation processed" });
  } catch (error) {
    console.error("Cron error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
