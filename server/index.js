const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const articleRoutes = require("./routes/articles");
const n8nRoutes = require("./routes/n8n");
const rateLimiter = require("./middleware/rateLimit");
const { errorHandler } = require("./middleware/errorHandler");

// Load env from explicit path
dotenv.config({ path: path.resolve(__dirname, ".env") });
const app = express();

// CORS configuration - more permissive for development
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5678",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(rateLimiter);

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Healthy Gut AI API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      articles: "/articles",
      auth: "/auth",
      n8n: "/n8n",
    },
  });
});

app.use("/auth", authRoutes);
app.use("/articles", articleRoutes);
app.use("/n8n", n8nRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

// Async startup function
(async () => {
  try {
    console.log("[STARTUP] Connecting to MongoDB...");
    await connectDB();
    console.log("[STARTUP] MongoDB connected, starting Express server...");

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`✓ Listening on http://localhost:${PORT}`);
    });

    server.on("error", (err) => {
      console.error("[ERROR] Server error:", err.message);
      process.exit(1);
    });
  } catch (err) {
    console.error("✗ Failed to start server:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
})();
