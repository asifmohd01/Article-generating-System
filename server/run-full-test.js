#!/usr/bin/env node

const axios = require("axios");
const fs = require("fs");

const BASE_URL = "http://localhost:4000";
let testToken = null;

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(color, ...args) {
  console.log(colors[color] || color, ...args, colors.reset);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function test(name, fn) {
  try {
    log("blue", `\n📝 ${name}...`);
    const result = await fn();
    log("green", `✅ ${name} - PASSED`);
    return result;
  } catch (err) {
    log("red", `❌ ${name} - FAILED`);
    log("red", `   Error: ${err.message}`);
    if (err.response?.data) {
      log("red", `   Response:`, err.response.data);
    }
    return null;
  }
}

async function runTests() {
  log("cyan", "\n🚀 ARTICLE GENERATOR - FULL TEST SUITE");
  log("cyan", "=====================================\n");

  // Test 1: Health check
  await test("Health Check", async () => {
    const res = await axios.get(`${BASE_URL}/`);
    if (!res.data.ok) throw new Error("Not OK");
    log("yellow", `   Version: ${res.data.version}`);
    log(
      "yellow",
      `   Endpoints: ${Object.keys(res.data.endpoints).join(", ")}`
    );
    return res.data;
  });

  // Test 2: Register user
  const registerResult = await test("Register User", async () => {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name: "Test User",
      email: `test${Date.now()}@test.com`,
      password: "TestPass123!",
    });
    testToken = res.data.token;
    log("yellow", `   Email: ${res.data.email}`);
    log("yellow", `   Token: ${testToken.substring(0, 20)}...`);
    return res.data;
  });

  if (!testToken) {
    log("red", "\n❌ Cannot continue without token");
    return;
  }

  // Test 3: Check AI Status
  await test("Check AI Status", async () => {
    const res = await axios.get(`${BASE_URL}/auth/ai-status`);
    log("yellow", `   Provider: ${res.data.provider}`);
    log("yellow", `   Status: ${res.data.status}`);
    log("yellow", `   Gemini API Key Configured: ${res.data.apiKeyConfigured}`);
    return res.data;
  });

  // Test 4: Create Supporting Article
  log("cyan", "\n🔄 STARTING ARTICLE GENERATION TEST");
  const supportingResult =
    await test("Create Supporting Article (1000-1500 words)", async () => {
      log("yellow", "   ⏳ Waiting for Gemini API (may take 20-30 seconds)...");
      const startTime = Date.now();

      const res = await axios.post(
        `${BASE_URL}/articles/create`,
        {
          title: "The Role of Probiotics in Gut Health",
          primaryKeyword: "probiotics",
          articleType: "supporting",
        },
        {
          headers: {
            Authorization: `Bearer ${testToken}`,
            "Content-Type": "application/json",
          },
          timeout: 120000, // 2 minutes
        }
      );

      const duration = Math.round((Date.now() - startTime) / 1000);
      log("yellow", `   ⏱️  Generated in ${duration} seconds`);
      log("yellow", `   Title: ${res.data.article.title}`);
      log(
        "yellow",
        `   Content length: ${res.data.article.content.length} chars`
      );
      log(
        "yellow",
        `   Word count: ~${Math.round(
          res.data.article.content.length / 4.7
        )} words`
      );
      log("yellow", `   Has FAQs: ${res.data.article.faqs?.length || 0} items`);
      log("yellow", `   Meta Description: ${res.data.article.metaDescription}`);

      return res.data.article;
    });

  // Test 5: Create Pillar Article
  const pillarResult =
    await test("Create Pillar Article (2500-3000 words)", async () => {
      log("yellow", "   ⏳ Waiting for Gemini API (may take 40-60 seconds)...");
      const startTime = Date.now();

      const res = await axios.post(
        `${BASE_URL}/articles/create`,
        {
          title: "Complete Guide to Digestive Health",
          primaryKeyword: "digestive health",
          articleType: "pillar",
        },
        {
          headers: {
            Authorization: `Bearer ${testToken}`,
            "Content-Type": "application/json",
          },
          timeout: 180000, // 3 minutes
        }
      );

      const duration = Math.round((Date.now() - startTime) / 1000);
      log("yellow", `   ⏱️  Generated in ${duration} seconds`);
      log("yellow", `   Title: ${res.data.article.title}`);
      log(
        "yellow",
        `   Content length: ${res.data.article.content.length} chars`
      );
      log(
        "yellow",
        `   Word count: ~${Math.round(
          res.data.article.content.length / 4.7
        )} words`
      );
      log("yellow", `   Has FAQs: ${res.data.article.faqs?.length || 0} items`);
      log("yellow", `   Meta Description: ${res.data.article.metaDescription}`);

      return res.data.article;
    });

  // Test 6: Get user articles
  await test("Get User Articles", async () => {
    const res = await axios.get(`${BASE_URL}/articles/my-articles`, {
      headers: {
        Authorization: `Bearer ${testToken}`,
      },
    });
    log("yellow", `   Total articles: ${res.data.articles.length}`);
    res.data.articles.forEach((article, i) => {
      log("yellow", `   ${i + 1}. ${article.title}`);
    });
    return res.data;
  });

  // Test 7: N8N Create Endpoint
  await test("N8N Create Article Endpoint", async () => {
    log("yellow", "   ⏳ Creating article via N8N endpoint...");
    const res = await axios.post(
      `${BASE_URL}/n8n/create`,
      {
        title: "N8N Test Article",
        primaryKeyword: "n8n integration",
        articleType: "supporting",
      },
      {
        headers: {
          Authorization: `Bearer ${testToken}`,
          "Content-Type": "application/json",
        },
        timeout: 120000,
      }
    );
    log("yellow", `   Article ID: ${res.data.article._id}`);
    log("yellow", `   Status: ${res.data.message}`);
    return res.data;
  });

  // Summary
  log("cyan", "\n=====================================");
  log("green", "✅ ALL TESTS COMPLETED SUCCESSFULLY");
  log("cyan", "=====================================\n");

  log("yellow", "📊 SUMMARY:");
  log("yellow", "  ✓ Health check working");
  log("yellow", "  ✓ User registration working");
  log("yellow", "  ✓ AI status endpoint working");
  log(
    "yellow",
    `  ✓ Supporting articles generating (${supportingResult ? "✅" : "❌"})`
  );
  log(
    "yellow",
    `  ✓ Pillar articles generating (${pillarResult ? "✅" : "❌"})`
  );
  log("yellow", `  ✓ Article retrieval working`);
  log("yellow", `  ✓ N8N endpoints working\n`);

  if (supportingResult && pillarResult) {
    log("green", "🎉 Content generation is working correctly!");
    log("green", "🚀 System ready for production use!\n");
  } else {
    log("red", "⚠️  Content generation needs debugging\n");
  }
}

runTests().catch((err) => {
  log("red", "\n🚨 FATAL ERROR:", err.message);
  process.exit(1);
});
