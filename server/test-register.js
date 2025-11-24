const http = require("http");

const testData = JSON.stringify({
  name: "Test User",
  email: `testuser${Date.now()}@example.com`,
  password: "TestPass123!",
});

const options = {
  hostname: "127.0.0.1",
  port: 4000,
  path: "/auth/register",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(testData),
  },
};

const req = http.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    console.log("✓ Register Status:", res.statusCode);
    console.log("✓ Response:", JSON.parse(data));
  });
});

req.on("error", (err) => {
  console.error("✗ Error:", err.message);
  process.exit(1);
});

req.write(testData);
req.end();
