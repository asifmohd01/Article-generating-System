const axios = require("axios");

const API = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 10000,
});

async function runTests() {
  try {
    console.log("\n========== QUICK TEST SUITE ==========\n");

    // Test 1: Health check
    console.log("1️⃣  Testing server health...");
    const health = await API.get("/");
    console.log("✓ Server Response:");
    console.log(JSON.stringify(health.data, null, 2));

    // Test 2: Register
    console.log("\n2️⃣  Testing user registration...");
    const user = {
      name: "Test User",
      email: "test-" + Date.now() + "@test.com",
      password: "TestPassword123!",
    };
    const reg = await API.post("/auth/register", user);
    const token = reg.data.token;
    console.log(`✓ User Registered: ${user.email}`);
    console.log(`✓ Token: ${token.substring(0, 30)}...`);

    // Test 3: Create Article
    console.log("\n3️⃣  Testing article creation via /articles/create...");
    const article = await API.post(
      "/articles/create",
      {
        title: "The Complete Guide to Gut Health",
        primaryKeyword: "gut health",
        articleType: "pillar",
      },
      { headers: { Authorization: "Bearer " + token } }
    );
    console.log(`✓ Article Created!`);
    console.log(`  - ID: ${article.data.article._id}`);
    console.log(`  - Title: ${article.data.article.title}`);
    console.log(
      `  - Content Length: ${article.data.article.content.length} chars`
    );

    // Test 4: N8N Endpoint
    console.log("\n4️⃣  Testing N8N endpoint /n8n/create...");
    const n8n = await API.post(
      "/n8n/create",
      {
        title: "Benefits of Probiotics",
        primaryKeyword: "probiotics",
        articleType: "supporting",
      },
      { headers: { Authorization: "Bearer " + token } }
    );
    console.log(`✓ N8N Endpoint Working!`);
    console.log(`  - ID: ${n8n.data.article._id}`);
    console.log(`  - Title: ${n8n.data.article.title}`);
    console.log(`  - Type: ${n8n.data.article.articleType}`);

    // Test 5: N8N Webhook
    console.log("\n5️⃣  Testing N8N webhook endpoint...");
    const webhook = await API.post("/n8n/webhook", {});
    console.log(`✓ Webhook Response:`);
    console.log(JSON.stringify(webhook.data, null, 2));

    console.log("\n" + "=".repeat(50));
    console.log("✅ ALL TESTS PASSED!");
    console.log("=".repeat(50));
    console.log(`
    🎉 Your N8N Integration is WORKING!
    
    ✓ Server is running on http://localhost:4000
    ✓ Authentication is working
    ✓ Article creation is functional
    ✓ N8N endpoints are ready
    
    N8N Configuration:
    URL: http://localhost:4000/n8n/create
    Method: POST
    Auth: Bearer <TOKEN>
    Body: {
      "title": "Article Title",
      "primaryKeyword": "main keyword",
      "articleType": "pillar" or "supporting"
    }
    `);

    process.exit(0);
  } catch (err) {
    console.error("\n❌ ERROR!");
    console.error(`Message: ${err.message}`);
    if (err.response?.data) {
      console.error("Response:", JSON.stringify(err.response.data, null, 2));
    }
    console.error(err.stack);
    process.exit(1);
  }
}

runTests();
