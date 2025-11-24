#!/usr/bin/env node
/**
 * Content Quality Test - Verifies no repetition and unique content generation
 */

const axios = require("axios");

const BASE_URL = "http://localhost:4000";

async function checkContentQuality(content, keyword) {
  console.log("\n📊 CONTENT QUALITY ANALYSIS");
  console.log("=====================================\n");

  // Word count
  const wordCount = content.split(/\s+/).length;
  console.log(`📝 Word Count: ${wordCount} words`);

  // Check for repetition - look for repeated sentences
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 20);
  const uniqueSentences = new Set(sentences.map((s) => s.trim().toLowerCase()));

  const repetitionRate = (
    ((sentences.length - uniqueSentences.size) / sentences.length) *
    100
  ).toFixed(2);
  console.log(
    `🔄 Unique Sentences: ${uniqueSentences.size}/${sentences.length} (${repetitionRate}% repetition)`
  );

  if (repetitionRate > 10) {
    console.log("   ⚠️  WARNING: High repetition detected");
  } else {
    console.log("   ✅ Good: Low repetition");
  }

  // Check for placeholder patterns
  const placeholderPatterns = [
    /this section explores/gi,
    /answer \d+:/gi,
    /repeat\(/gi,
    /placeholder/gi,
  ];

  let placeholderCount = 0;
  placeholderPatterns.forEach((pattern) => {
    const matches = content.match(pattern);
    if (matches) {
      placeholderCount += matches.length;
    }
  });

  console.log(`\n🎯 Placeholder Text: ${placeholderCount} instances`);
  if (placeholderCount === 0) {
    console.log("   ✅ Good: No placeholder patterns found");
  } else {
    console.log("   ⚠️  WARNING: Placeholder patterns detected");
  }

  // Check keyword density
  const keywordMatches = content.match(new RegExp(keyword, "gi")) || [];
  const keywordDensity = ((keywordMatches.length / wordCount) * 100).toFixed(2);
  console.log(`\n🔑 Keyword "${keyword}" Density: ${keywordDensity}%`);
  if (keywordDensity >= 0.8 && keywordDensity <= 1.2) {
    console.log("   ✅ Good: Optimal keyword density");
  } else {
    console.log("   ⚠️  Note: Outside optimal range (0.8-1.2%)");
  }

  // Sentence length variety
  const sentenceLengths = sentences
    .map((s) => s.trim().split(/\s+/).length)
    .filter((len) => len > 0);
  const avgLength = (
    sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length
  ).toFixed(1);
  const minLength = Math.min(...sentenceLengths);
  const maxLength = Math.max(...sentenceLengths);

  console.log(`\n📏 Sentence Length Variety:`);
  console.log(`   Average: ${avgLength} words`);
  console.log(`   Range: ${minLength}-${maxLength} words`);
  if (maxLength - minLength > 15) {
    console.log("   ✅ Good: Natural sentence length variation");
  } else {
    console.log("   ⚠️  Note: Limited sentence length variety");
  }

  // Check for unique paragraphs
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim().length > 50);
  const uniqueParagraphs = new Set(
    paragraphs.map((p) => p.trim().substring(0, 50))
  );
  console.log(
    `\n📄 Paragraph Uniqueness: ${uniqueParagraphs.size}/${paragraphs.length} unique starts`
  );

  // Overall quality score
  let qualityScore = 100;
  if (repetitionRate > 10) qualityScore -= 30;
  if (placeholderCount > 0) qualityScore -= 20;
  if (keywordDensity < 0.8 || keywordDensity > 1.2) qualityScore -= 10;
  if (maxLength - minLength < 15) qualityScore -= 10;

  console.log(`\n✨ OVERALL QUALITY SCORE: ${qualityScore}/100`);

  if (qualityScore >= 80) {
    console.log("   🟢 EXCELLENT: High-quality, unique content");
  } else if (qualityScore >= 60) {
    console.log("   🟡 GOOD: Acceptable content with minor issues");
  } else {
    console.log("   🔴 POOR: Significant issues detected");
  }

  console.log("\n=====================================\n");
  return qualityScore;
}

async function runTest() {
  console.log("\n🧪 ARTICLE CONTENT QUALITY TEST");
  console.log("Testing both Gemini and Simulator content\n");

  try {
    // Register user
    console.log("Registering test user...");
    const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: "Quality Test User",
      email: `test${Date.now()}@test.com`,
      password: "TestPass123!",
    });

    const token = registerRes.data.token;
    console.log("✅ User registered\n");

    // Test 1: Supporting Article (Simulator)
    console.log("TEST 1: SUPPORTING ARTICLE (Simulator Fallback)");
    console.log("----------------------------------------------");
    const supportRes = await axios.post(
      `${BASE_URL}/articles/create`,
      {
        title: "Supporting Article Quality Test",
        primaryKeyword: "digestive health",
        articleType: "supporting",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 120000,
      }
    );

    const supportScore = await checkContentQuality(
      supportRes.data.article.content,
      "digestive health"
    );

    // Test 2: Check Gemini (will try, may fall back to simulator)
    console.log("\nTEST 2: PILLAR ARTICLE (Gemini Integration)");
    console.log("-------------------------------------------");
    const pillarRes = await axios.post(
      `${BASE_URL}/articles/create`,
      {
        title: "Pillar Article Quality Test",
        primaryKeyword: "gut microbiome",
        articleType: "pillar",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 180000,
      }
    );

    const pillarScore = await checkContentQuality(
      pillarRes.data.article.content,
      "gut microbiome"
    );

    // Summary
    console.log("\n📋 TEST SUMMARY");
    console.log("=====================================");
    console.log(`Supporting Article Score: ${supportScore}/100`);
    console.log(`Pillar Article Score: ${pillarScore}/100`);
    console.log(
      `Average Quality: ${((supportScore + pillarScore) / 2).toFixed(1)}/100`
    );

    if (supportScore >= 80 && pillarScore >= 80) {
      console.log("\n✅ PASS: All content meets quality standards");
      console.log("✨ Content is unique, varied, and well-structured");
    } else {
      console.log("\n⚠️  WARNING: Some content quality issues detected");
      console.log("Review the analysis above for specific improvements");
    }

    console.log("\n=====================================\n");
  } catch (err) {
    console.error("\n❌ TEST FAILED:", err.message);
    if (err.response?.data) {
      console.error("Response:", err.response.data);
    }
    process.exit(1);
  }
}

runTest();
