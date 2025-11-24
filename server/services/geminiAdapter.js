// Gemini adapter: calls Google Generative AI API using REST (no npm package needed)
const axios = require("axios");

const GEMINI_MODEL = "gemini-1.5-flash"; // Fast and efficient model
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

async function callGemini(prompt, apiKey) {
  try {
    const url = `${GEMINI_ENDPOINT}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    console.log(`[Gemini Adapter] Calling: ${url.split("?")[0]}`);
    console.log(`[Gemini Adapter] Model: ${GEMINI_MODEL}`);

    const response = await axios.post(
      url,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8000,
          topP: 0.95,
          topK: 40,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_UNSPECIFIED", threshold: "BLOCK_NONE" },
        ],
      },
      { timeout: 120000 }
    );

    if (!response.data.candidates || response.data.candidates.length === 0) {
      console.error("[Gemini Adapter] No candidates in response");
      throw new Error("No response from Gemini");
    }

    const candidate = response.data.candidates[0];
    if (!candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
      console.error("[Gemini Adapter] Invalid response structure", candidate);
      throw new Error("Invalid response structure from Gemini");
    }

    const text = candidate.content.parts[0].text;
    console.log(`[Gemini Adapter] ✓ Response received (${text.length} chars)`);
    return text;
  } catch (err) {
    console.error("[Gemini API] Error:", err.message);
    if (err.response?.data) {
      console.error("[Gemini API] Error details:", err.response.data);
    } else if (err.response?.status) {
      console.error("[Gemini API] Status code:", err.response.status);
    }
    throw err;
  }
}

module.exports = { callGemini };
