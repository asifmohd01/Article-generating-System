const http = require("http");

// Use the token from the previous registration
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjJlNGI3MTQwNmEyZjM4MWQ0NzU1ZiIsImVtYWlsIjoidGVzdHVzZXIxNzYzODk0NDU1MjQ2QGV4YW1wbGUuY29tIiwiaWF0IjoxNzYzODk0NDU1LCJleHAiOjE3NjQ0OTkyNTV9.AF7pOsEyneZPo3Np9YghN2wQc3nlhyBnvOlde-nCwxs";

const testData = JSON.stringify({
  title: "Benefits of Probiotics for Gut Health",
  primaryKeyword: "probiotics for gut health",
  articleType: "pillar",
});

const options = {
  hostname: "127.0.0.1",
  port: 4000,
  path: "/articles/create",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(testData),
    Authorization: `Bearer ${token}`,
  },
};

console.log("[TEST] Creating article with Gemini...");
console.log("[TEST] Title:", "Benefits of Probiotics for Gut Health");
console.log("[TEST] Type: pillar");
console.log("");

const req = http.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    const response = JSON.parse(data);
    console.log("✓ Create Status:", res.statusCode);
    console.log("✓ Article ID:", response.article?._id || "N/A");
    console.log(
      "✓ Content Length:",
      response.article?.content?.length || 0,
      "characters"
    );
    console.log("✓ FAQs Count:", response.article?.faqs?.length || 0);
    console.log("");
    if (response.article?.content) {
      console.log("✓ Content Preview (first 200 chars):");
      console.log(response.article.content.substring(0, 200) + "...");
    }
  });
});

req.on("error", (err) => {
  console.error("✗ Error:", err.message);
  process.exit(1);
});

req.write(testData);
req.end();
