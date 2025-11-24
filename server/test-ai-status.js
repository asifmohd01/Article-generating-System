const http = require("http");

const options = {
  hostname: "127.0.0.1",
  port: 4000,
  path: "/auth/ai-status",
  method: "GET",
};

const req = http.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    console.log("✓ AI Status Response:", JSON.parse(data));
  });
});

req.on("error", (err) => {
  console.error("✗ Error:", err.message);
  process.exit(1);
});

req.end();
