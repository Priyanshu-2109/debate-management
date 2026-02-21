const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const config = require("./config");

// Route imports
const adminRoutes = require("./routes/adminRoutes");
const topicRoutes = require("./routes/topicRoutes");
const debateRoutes = require("./routes/debateRoutes");
const userRoutes = require("./routes/userRoutes");
const webhookRoutes = require("./routes/webhookRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = config.clientUrl
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, server-to-server, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }),
);

// Webhook route needs raw body — mount BEFORE express.json()
app.use("/api/webhooks", webhookRoutes);

app.use(express.json());

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/debates", debateRoutes);
app.use("/api/users", userRoutes);

// Cron endpoint — also usable locally via GET /api/cron
const cronHandler = require("./api/cron");
app.get("/api/cron", cronHandler);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Only start the HTTP server when running locally (not on Vercel serverless)
if (!process.env.VERCEL) {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

module.exports = app;
