const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");
const { protect } = require("../middleware/auth");

router.post("/create", protect, articleController.createArticle);
router.get("/", protect, articleController.getArticles);
router.get("/:id", protect, articleController.getArticle);
router.put("/:id", protect, articleController.updateArticle);
router.delete("/:id", protect, articleController.deleteArticle);

module.exports = router;
