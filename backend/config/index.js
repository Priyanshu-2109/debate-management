const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  clerkWebhookSecret: process.env.CLERK_WEBHOOK_SECRET,
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  emailFrom: process.env.EMAIL_FROM || "noreply@debatemanagement.com",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};
