const User = require("../models/User");

/**
 * Clerk Webhook handler — syncs user data on user.created / user.updated events.
 * Mounted BEFORE express.json() so we get raw body for signature verification.
 */
exports.handleClerkWebhook = async (req, res) => {
  try {
    const evt = JSON.parse(req.body.toString());
    const { type, data } = evt;

    if (type === "user.created" || type === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = data;
      const email = email_addresses?.[0]?.email_address;
      const name = [first_name, last_name].filter(Boolean).join(" ") || "User";

      await User.findOneAndUpdate(
        { clerkId: id },
        { clerkId: id, name, email, avatar: image_url || "" },
        { upsert: true, new: true },
      );
    }

    if (type === "user.deleted") {
      await User.findOneAndDelete({ clerkId: data.id });
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(400).json({ error: "Webhook processing failed" });
  }
};
