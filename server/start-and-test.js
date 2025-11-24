#!/usr/bin/env node
/**
 * Server Manager - Starts server and runs tests
 */

const { spawn } = require("child_process");
const path = require("path");

console.log("\n📌 Article Generator - Server Manager\n");

// Kill existing node processes on Windows
const killCommand = `Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue`;
console.log("Stopping existing processes...");

const serverDir = path.resolve(__dirname);
console.log(`Working directory: ${serverDir}\n`);

// Start server
console.log("Starting server...");
const server = spawn("node", ["index.js"], {
  cwd: serverDir,
  stdio: "inherit",
});

// Wait for server to start
console.log("Waiting for server to initialize (5 seconds)...\n");

setTimeout(() => {
  // Run tests after server starts
  console.log("Running tests...\n");
  const tester = spawn("node", ["simple-test.js"], {
    cwd: serverDir,
    stdio: "inherit",
  });

  tester.on("exit", (code) => {
    console.log("\nTests completed. Keeping server running...");
    console.log("Server is accessible at http://localhost:4000\n");
  });
}, 5000);

// Handle server errors
server.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});
