#!/usr/bin/env node
/**
 * Simple API Test - Tests core functionality without external dependencies
 */

const axios = require("axios");

const BASE_URL = "http://localhost:4000";
let testToken = null;
let testsPassed = 0;
let testsFailed = 0;

// Simple logging
function test(name) {
  process.stdout.write(`Testing: ${name}... `);
}

function pass(msg = "OK") {
  console.log(`✓ ${msg}`);
  testsPassed++;
}

function fail(msg = "FAILED") {
  console.log(`✗ ${msg}`);
  testsFailed++;
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runTests() {
  console.log("\n========================================");
  console.log("Article Generator - API Test Suite");
  console.log("========================================\n");

  // TEST 1: Health Check
  test("Health Check");
  try {
    const res = await axios.get(`${BASE_URL}/`);
    if (res.data.ok) {
      pass(`Version ${res.data.version}`);
    } else {
      fail("Not OK");
    }
  } catch (err) {
    fail(err.message);
  }

  // TEST 2: Register User
  test("Register User");
  try {
    const email = `test${Date.now()}@test.com`;
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name: "Test User",
      email: email,
      password: "TestPass123!",
    });
    if (res.data.token) {
      testToken = res.data.token;
      pass(`Email: ${email}`);
    } else {
      fail("No token received");
    }
  } catch (err) {
    fail(err.response?.data?.message || err.message);
  }

  if (!testToken) {
    console.log("\n❌ Cannot continue without token\n");
    return;
  }

  // TEST 3: AI Status
  test("Check AI Status");
  try {
    const res = await axios.get(`${BASE_URL}/auth/ai-status`);
    if (res.data.provider === "gemini") {
      pass(`${res.data.provider} - ${res.data.status}`);
    } else {
      fail(`Wrong provider: ${res.data.provider}`);
    }
  } catch (err) {
    fail(err.message);
  }

  // TEST 4: Create Supporting Article
  test("Create Supporting Article");
  try {
    console.log("\n   [Waiting for Gemini API - may take 20-30 seconds]\n");
    const start = Date.now();
    const res = await axios.post(
      `${BASE_URL}/articles/create`,
      {
        title: "Probiotics and Gut Health",
        primaryKeyword: "probiotics",
        articleType: "supporting",
      },
      {
        headers: { Authorization: `Bearer ${testToken}` },
        timeout: 120000,
      }
    );
    const duration = Math.round((Date.now() - start) / 1000);
    if (res.data.article?.content) {
      const wordCount = Math.round(res.data.article.content.length / 4.7);
      pass(`${duration}s - ${wordCount} words`);
    } else {
      fail("No content generated");
    }
  } catch (err) {
    fail(`${err.response?.status || err.code} - ${err.message}`);
  }

  // TEST 5: Get User Articles
  test("Get User Articles");
  try {
    const res = await axios.get(`${BASE_URL}/articles/`, {
      headers: { Authorization: `Bearer ${testToken}` },
    });
    if (Array.isArray(res.data.articles)) {
      pass(`${res.data.articles.length} articles found`);
    } else {
      fail("Invalid response format");
    }
  } catch (err) {
    fail(err.message);
  }

  // SUMMARY
  console.log("\n========================================");
  console.log(`Results: ${testsPassed} passed, ${testsFailed} failed`);
  console.log("========================================\n");

  if (testsFailed === 0) {
    console.log("✅ All tests passed! System is working.\n");
    process.exit(0);
  } else {
    console.log("❌ Some tests failed. Check errors above.\n");
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("\nFATAL ERROR:", err.message);
  process.exit(1);
});
