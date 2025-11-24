const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  primaryKeyword: { type: String, required: true },
  metaDescription: { type: String },
  content: { type: String },
  faqs: { type: Array, default: [] },
  jsonLd: { type: String },
  slug: { type: String, required: true, index: true },
  articleType: {
    type: String,
    enum: ["pillar", "supporting"],
    default: "pillar",
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Article", ArticleSchema);
