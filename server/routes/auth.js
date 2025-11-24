const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/verify", authController.verify);

// AI status endpoint (returns whether AI config exists; does NOT return the key)
router.get("/ai-status", (req, res) => {
  const hasKey = !!process.env.AI_API_KEY;
  const provider = process.env.AI_API_PROVIDER || null;
  res.json({
    enabled: hasKey,
    provider: provider ? provider : null,
    status: hasKey ? "ready" : "not configured",
    apiKeyConfigured: hasKey,
    hasEndpoint: !!process.env.AI_ENDPOINT,
  });
});

module.exports = router;
