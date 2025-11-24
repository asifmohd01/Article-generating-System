// N8N INTEGRATION ENDPOINT
// This endpoint is specifically designed for N8N workflow automation

const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");
const { protect } = require("../middleware/auth");

// ============================================
// N8N SPECIFIC ENDPOINTS
// ============================================

/**
 * Create Article via N8N
 * Used by N8N workflows to generate articles
 *
 * Headers Required:
 *   - Authorization: Bearer <JWT_TOKEN>
 *   - Content-Type: application/json
 *
 * Body:
 *   {
 *     "title": "Article Title",
 *     "primaryKeyword": "main keyword",
 *     "articleType": "pillar" | "supporting"
 *   }
 *
 * Response:
 *   {
 *     "success": true,
 *     "article": { ... }
 *   }
 */
router.post("/create", protect, articleController.createArticle);

/**
 * Get Article Status for N8N
 * Check if article was created successfully
 */
router.get("/status/:id", protect, articleController.getArticle);

/**
 * Webhook for N8N
 * Allows N8N to get articles without token (optional - use with caution)
 * Include apiKey in query: ?apiKey=your_secret_key
 */
router.post("/webhook", async (req, res) => {
  try {
    // Optional: Validate API key
    const apiKey = req.query.apiKey;
    if (apiKey && apiKey !== process.env.N8N_API_KEY) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    // Return success message - for proper webhook functionality, modify to work without auth
    res.status(200).json({
      success: true,
      message:
        "N8N webhook received. Use /n8n/create with Authorization header.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
