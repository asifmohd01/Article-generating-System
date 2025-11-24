require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });

const { callGemini } = require("./services/geminiAdapter");
const { getPromptForType } = require("./services/promptTemplates");

async function test() {
  try {
    console.log("[TEST] Starting Gemini test...");
    console.log(
      "[TEST] API Key:",
      process.env.AI_API_KEY ? "✓ Present" : "✗ Missing"
    );

    const prompt = getPromptForType("probiotics", "Probiotics Guide", "pillar");
    console.log("[TEST] Prompt length:", prompt.length);

    console.log("[TEST] Calling Gemini API...");
    const response = await callGemini(prompt, process.env.AI_API_KEY);

    console.log("[TEST] ✓ Response received!");
    console.log("[TEST] Response length:", response.length);
    console.log("[TEST] First 200 chars:", response.substring(0, 200));
  } catch (err) {
    console.error("[ERROR]:", err.message);
    if (err.response?.data) {
      console.error("[ERROR] Response Data:", err.response.data);
    }
    console.error("[ERROR] Stack:", err.stack);
  }
}

test();
