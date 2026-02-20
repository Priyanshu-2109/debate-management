const Debate = require("../models/Debate");
const Topic = require("../models/Topic");
const sendEmail = require("./sendEmail");
const { topicRevealedTemplate } = require("./emailTemplates");

/**
 * Convert a debate's date + time (IST) into a UTC Date object.
 * debate.date  → stored as midnight-UTC for the chosen calendar date
 * debate.time  → "HH:MM" in 24-hour IST
 */
function getDebateUTCTime(debate) {
  const dateStr = new Date(debate.date).toISOString().split("T")[0]; // e.g. "2025-03-15"
  const [hours, minutes] = debate.time.split(":").map(Number);

  // Build the datetime as if it were UTC, then subtract IST offset (5 h 30 m)
  const dt = new Date(
    `${dateStr}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00.000Z`,
  );
  dt.setMinutes(dt.getMinutes() - 330); // IST → UTC
  return dt;
}

/**
 * Run once per request (or via cron). Handles:
 *   1. Auto-reveal — assign a random unused topic when the scheduled IST time arrives
 *   2. Auto-complete — mark debate "completed" 1 hour after reveal
 */
async function processDebateAutomation() {
  const now = new Date();

  /* ── 1. Auto-reveal upcoming debates whose time has arrived ──────── */
  const upcomingDebates = await Debate.find({
    status: "upcoming",
    revealStatus: false,
  }).populate("participants", "name email");

  for (const debate of upcomingDebates) {
    const debateTime = getDebateUTCTime(debate);
    if (now < debateTime) continue; // not yet

    const unusedTopics = await Topic.find({ isUsed: false });
    if (unusedTopics.length === 0) continue; // no topics available — skip silently

    const randomIndex = Math.floor(Math.random() * unusedTopics.length);
    const selectedTopic = unusedTopics[randomIndex];

    selectedTopic.isUsed = true;
    await selectedTopic.save();

    debate.topicId = selectedTopic._id;
    debate.revealStatus = true;
    debate.status = "active";
    await debate.save();

    // Notify participants
    const emailPromises = debate.participants.map((p) =>
      sendEmail(
        p.email,
        "🎤 Topic Revealed! Time to Prepare",
        topicRevealedTemplate({
          userName: p.name,
          topicTitle: selectedTopic.title,
          topicDescription: selectedTopic.description,
          date: debate.date,
          time: debate.time,
          location: debate.location,
        }),
      ),
    );
    await Promise.allSettled(emailPromises);
  }

  /* ── 2. Auto-complete active debates 1 hour after scheduled time ── */
  const activeDebates = await Debate.find({ status: "active" });

  for (const debate of activeDebates) {
    const debateTime = getDebateUTCTime(debate);
    const completionTime = new Date(debateTime.getTime() + 60 * 60 * 1000); // +1 h
    if (now >= completionTime) {
      debate.status = "completed";
      await debate.save();
    }
  }
}

module.exports = { processDebateAutomation, getDebateUTCTime };
