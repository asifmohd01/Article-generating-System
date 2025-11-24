const Article = require("../models/Article");
const slugify = require("slugify");
const aiService = require("../services/aiService");

exports.createArticle = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { primaryKeyword, title, articleType } = req.body;

    if (!primaryKeyword || !title) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: primaryKeyword and title",
      });
    }

    console.log(`[ARTICLE] Creating article: "${title}" for user: ${userId}`);

    // Call AI service to generate article
    const aiResult = await aiService.generateArticle({
      primaryKeyword,
      title,
      articleType,
    });

    const slug = require("slugify")(title, { lower: true, strict: true }).slice(
      0,
      200
    );

    const article = await Article.create({
      title: aiResult.title || title,
      primaryKeyword,
      metaDescription: aiResult.metaDescription,
      content: aiResult.content,
      faqs: aiResult.faqs,
      jsonLd: JSON.stringify(aiResult.jsonLd),
      slug,
      articleType: articleType || "supporting",
      user: userId,
    });

    console.log(`[ARTICLE] Article created successfully: ${article._id}`);

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      article,
    });
  } catch (err) {
    console.error(`[ARTICLE] Error creating article:`, err.message);
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = { user: userId, title: { $regex: search, $options: "i" } };
    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      articles,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getArticle = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const article = await Article.findOne({ _id: id, user: userId });
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }
    res.json({ success: true, article });
  } catch (err) {
    next(err);
  }
};

exports.updateArticle = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const article = await Article.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true }
    );
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }
    res.json({ success: true, message: "Article updated", article });
  } catch (err) {
    next(err);
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const article = await Article.findOneAndDelete({ _id: id, user: userId });
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }
    res.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
