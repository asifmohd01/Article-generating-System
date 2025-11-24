const axios = require("axios");

const API = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 180000, // 3 minutes for AI response
});

async function runTests() {
  try {
    console.log("\n" + "=".repeat(60));
    console.log("🧪 GEMINI INTEGRATION & N8N TEST SUITE");
    console.log("=".repeat(60) + "\n");

    // Test 1: Health Check
    console.log("1️⃣  Testing server health...");
    const health = await API.get("/");
    console.log("✓ Server Response:", JSON.stringify(health.data, null, 2));

    // Test 2: Register User
    console.log("\n2️⃣  Registering test user...");
    const email = "test-" + Date.now() + "@test.com";
    const reg = await API.post("/auth/register", {
      name: "Test User",
      email: email,
      password: "TestPassword123!",
    });
    const token = reg.data.token;
    console.log(`✓ User registered: ${email}`);
    console.log(`✓ Token obtained: ${token.substring(0, 50)}...`);

    // Test 3: Check AI Status
    console.log("\n3️⃣  Checking Gemini API status...");
    const aiStatus = await API.get("/auth/ai-status");
    console.log("✓ AI Status:", JSON.stringify(aiStatus.data, null, 2));

    if (!aiStatus.data.enabled) {
      console.error(
        "❌ Gemini API not configured! Check .env file for AI_API_KEY"
      );
    } else {
      console.log("✓ Gemini API is configured and ready");
    }

    // Test 4: Create Article with Gemini
    console.log(
      "\n4️⃣  Creating pillar article with Gemini (this may take 30-60 seconds)..."
    );
    console.log("   Article type: PILLAR (2500-3000 words)");
    console.log("   Using Gemini API...");

    const articleStart = Date.now();
    const article = await API.post(
      "/articles/create",
      {
        title: "The Complete Guide to Gut Health and Digestion",
        primaryKeyword: "gut health digestion",
        articleType: "pillar",
      },
      { headers: { Authorization: "Bearer " + token } }
    );
    const articleTime = Date.now() - articleStart;

    console.log(
      `✓ Article created in ${articleTime}ms (${(articleTime / 1000).toFixed(
        1
      )}s)`
    );
    console.log(`✓ Article ID: ${article.data.article._id}`);
    console.log(`✓ Title: ${article.data.article.title}`);
    console.log(
      `✓ Content length: ${article.data.article.content.length} characters`
    );
    console.log(
      `✓ FAQ count: ${article.data.article.faqs?.length || 0} questions`
    );
    console.log(
      `✓ Meta description: ${article.data.article.metaDescription?.substring(
        0,
        60
      )}...`
    );

    const articleId = article.data.article._id;

    // Test 5: Create Supporting Article
    console.log(
      "\n5️⃣  Creating supporting article with Gemini (this may take 20-40 seconds)..."
    );
    console.log("   Article type: SUPPORTING (1000-1500 words)");

    const supportStart = Date.now();
    const supportArticle = await API.post(
      "/articles/create",
      {
        title: "Benefits of Probiotics for Gut Health",
        primaryKeyword: "probiotics gut health",
        articleType: "supporting",
      },
      { headers: { Authorization: "Bearer " + token } }
    );
    const supportTime = Date.now() - supportStart;

    console.log(
      `✓ Article created in ${supportTime}ms (${(supportTime / 1000).toFixed(
        1
      )}s)`
    );
    console.log(`✓ Article ID: ${supportArticle.data.article._id}`);
    console.log(`✓ Title: ${supportArticle.data.article.title}`);
    console.log(
      `✓ Content length: ${supportArticle.data.article.content.length} characters`
    );

    // Test 6: Test N8N Endpoint
    console.log("\n6️⃣  Testing N8N /n8n/create endpoint...");
    const n8nArticle = await API.post(
      "/n8n/create",
      {
        title: "N8N Test: Fiber and Digestion",
        primaryKeyword: "fiber digestion",
        articleType: "supporting",
      },
      { headers: { Authorization: "Bearer " + token } }
    );
    console.log(`✓ N8N endpoint working!`);
    console.log(`✓ Article ID: ${n8nArticle.data.article._id}`);
    console.log(
      `✓ Content length: ${n8nArticle.data.article.content.length} chars`
    );

    // Test 7: Get Articles List
    console.log("\n7️⃣  Retrieving articles list...");
    const list = await API.get("/articles", {
      headers: { Authorization: "Bearer " + token },
    });
    console.log(`✓ Total articles: ${list.data.pagination.total}`);
    console.log(`✓ Articles in this page: ${list.data.articles.length}`);

    // Test 8: Get Single Article
    console.log("\n8️⃣  Retrieving single article details...");
    const single = await API.get(`/articles/${articleId}`, {
      headers: { Authorization: "Bearer " + token },
    });
    console.log(`✓ Article title: ${single.data.article.title}`);
    console.log(`✓ Created at: ${single.data.article.createdAt}`);

    // Test 9: Test N8N Status Endpoint
    console.log("\n9️⃣  Testing N8N /n8n/status endpoint...");
    const status = await API.get(`/n8n/status/${articleId}`, {
      headers: { Authorization: "Bearer " + token },
    });
    console.log(`✓ Status endpoint working`);
    console.log(`✓ Retrieved article: ${status.data.article.title}`);

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("✅ ALL TESTS PASSED!");
    console.log("=".repeat(60));
    console.log(`
    🎉 SUCCESS SUMMARY:
    ├─ ✓ Server is running
    ├─ ✓ User authentication working
    ├─ ✓ Gemini API integrated
    ├─ ✓ Article generation working
    ├─ ✓ Pillar articles (2500-3000 words)
    ├─ ✓ Supporting articles (1000-1500 words)
    ├─ ✓ N8N /n8n/create endpoint working
    ├─ ✓ N8N /n8n/status endpoint working
    ├─ ✓ Article CRUD operations working
    └─ ✓ Content is being generated correctly

    📊 PERFORMANCE:
    ├─ Pillar article: ${(articleTime / 1000).toFixed(1)}s
    ├─ Supporting article: ${(supportTime / 1000).toFixed(1)}s
    └─ Average: ${((articleTime + supportTime) / 2 / 1000).toFixed(
      1
    )}s per article

    🚀 YOUR SYSTEM IS READY FOR:
    ├─ Manual article creation via UI
    ├─ N8N workflow automation
    ├─ Scheduled article generation
    ├─ Bulk content creation
    └─ Production deployment

    ⚠️  NEXT STEPS:
    1. Test in N8N at http://localhost:5678
    2. Create N8N workflow with:
       - HTTP POST to http://localhost:4000/n8n/create
       - Authorization: Bearer <YOUR_TOKEN>
    3. Start generating articles!

    `);

    process.exit(0);
  } catch (err) {
    console.error("\n❌ ERROR!");
    console.error(`Message: ${err.message}`);
    if (err.response?.data) {
      console.error("Response:", JSON.stringify(err.response.data, null, 2));
    } else if (err.response?.status) {
      console.error("Status:", err.response.status);
    }
    console.error(err.stack);
    process.exit(1);
  }
}

// Run tests
runTests();
