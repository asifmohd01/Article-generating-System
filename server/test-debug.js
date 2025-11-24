const http = require("http");

// Use the token from the previous registration
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjJlNGI3MTQwNmEyZjM4MWQ0NzU1ZiIsImVtYWlsIjoidGVzdHVzZXIxNzYzODk0NDU1MjQ2QGV4YW1wbGUuY29tIiwiaWF0IjoxNzYzODk0NDU1LCJleHAiOjE3NjQ0OTkyNTV9.AF7pOsEyneZPo3Np9YghN2wQc3nlhyBnvOlde-nCwxs";

// First, test AI status
const statusOptions = {
  hostname: "127.0.0.1",
  port: 4000,
  path: "/auth/ai-status",
  method: "GET",
};

const statusReq = http.request(statusOptions, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    const response = JSON.parse(data);
    console.log("=== AI Status ===");
    console.log("Enabled:", response.enabled);
    console.log("Provider:", response.provider);
    console.log("");

    // Now test article creation
    const testData = JSON.stringify({
      title: "Debug: Gemini API Test",
      primaryKeyword: "gemini api test",
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

    console.log("=== Creating Article ===");
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        const response = JSON.parse(data);
        console.log("Status:", res.statusCode);
        console.log(
          "Content snippet:",
          response.article?.content?.substring(0, 150)
        );
      });
    });

    req.on("error", (err) => {
      console.error("✗ Error:", err.message);
      process.exit(1);
    });

    req.write(testData);
    req.end();
  });
});

statusReq.on("error", (err) => {
  console.error("✗ Status Error:", err.message);
  process.exit(1);
});

statusReq.end();
