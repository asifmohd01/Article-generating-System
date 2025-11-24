// aiService: integrates with Gemini API and falls back to simulator if needed
const { callGemini } = require("./geminiAdapter");
const { getPromptForType } = require("./promptTemplates");

const generateMetaDescription = (keyword) =>
  `${keyword} - Learn diet, symptoms, FAQs and clinical guidance for a healthy gut.`;

const makeParagraph = (keyword, count = 80) => {
  const base = `This section explores ${keyword} in detail. `;
  return base.repeat(Math.max(1, Math.floor(count / base.length)));
};

const generateFAQs = (keyword) => {
  const q = [
    `What is ${keyword}?`,
    `How does ${keyword} affect digestion?`,
    `What foods support ${keyword}?`,
    `When should I see a doctor about ${keyword}?`,
    `Are there supplements for ${keyword}?`,
  ];
  return q.map((question, i) => ({
    question,
    answer: `Answer ${i + 1}: ${question} — ${makeParagraph(keyword, 120)}`,
  }));
};

// Try to parse JSON response from Gemini
function parseGeminiResponse(text) {
  try {
    // Remove markdown code blocks if present
    let cleanText = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/, "").trim();
    
    // Try to extract JSON from the text (in case there's extra text)
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[Parse] No JSON found in response");
      console.error("[Parse] Response preview:", cleanText.substring(0, 200));
      throw new Error("No JSON found in response");
    }
    
    const jsonStr = jsonMatch[0];
    console.log(`[Parse] Parsing JSON of ${jsonStr.length} characters`);
    const parsed = JSON.parse(jsonStr);
    
    // Validate required fields
    if (!parsed.content) {
      console.error("[Parse] Missing 'content' field in response");
      throw new Error("Missing 'content' field in JSON");
    }
    if (!parsed.title) {
      parsed.title = "Article";
    }
    
    console.log("[Parse] ✓ JSON parsed successfully");
    return parsed;
  } catch (err) {
    console.error("[Parse] Failed to parse Gemini JSON:", err.message);
    console.error("[Parse] Text preview:", text.substring(0, 500));
    return null;
  }
}

exports.generateArticle = async ({ primaryKeyword, title, articleType }) => {
  // Try Gemini API if key is configured
  if (process.env.AI_API_KEY && process.env.AI_API_PROVIDER === "gemini") {
    try {
      console.log(`[AI Service] Generating ${articleType} article: "${title}"`);
      console.log(`[AI Service] API Key present: ${!!process.env.AI_API_KEY}`);
      console.log(`[AI Service] Provider: ${process.env.AI_API_PROVIDER}`);

      const prompt = getPromptForType(primaryKeyword, title, articleType);
      console.log(`[AI Service] Prompt length: ${prompt.length} characters`);
      console.log(`[AI Service] Article type: ${articleType}`);

      const response = await callGemini(prompt, process.env.AI_API_KEY);
      console.log(`[AI Service] Response received: ${response.length} characters`);

      const parsed = parseGeminiResponse(response);
      if (parsed && parsed.content) {
        console.log("[AI Service] ✓ Successfully generated article from Gemini");
        return {
          title: parsed.title || title,
          content: parsed.content,
          faqs: parsed.faqs || generateFAQs(primaryKeyword),
          jsonLd: parsed.jsonLd || {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: parsed.title || title,
            keywords: primaryKeyword,
            author: { "@type": "Person", name: "Healthy Gut AI" },
          },
          metaDescription:
            parsed.metaDescription || generateMetaDescription(primaryKeyword),
        };
      } else {
        console.log("[AI Service] Parsed response is invalid, using simulator");
      }
    } catch (err) {
      console.error("[AI Service] Gemini generation failed:", err.message);
      if (err.response?.data) {
        console.error("[AI Service] Response data:", err.response.data);
      }
      console.log("[AI Service] Falling back to simulator...");
      // Fall through to simulator
    }
  } else {
    console.log(
      `[AI Service] Gemini not configured (KEY: ${!!process.env
        .AI_API_KEY}, PROVIDER: ${process.env.AI_API_PROVIDER})`
    );
  }

  // Simulator fallback
  console.log(`[Simulator] Generating ${articleType} article: "${title}"`);
  await new Promise((r) => setTimeout(r, 600));
  const isPillar = articleType === "pillar";
  const wordTarget = isPillar ? 2500 : 1200;
  const content = makeParagraph(primaryKeyword, wordTarget);
  const faqs = generateFAQs(primaryKeyword);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    keywords: primaryKeyword,
    author: { "@type": "Person", name: "Healthy Gut AI" },
  };
  const metaDescription = generateMetaDescription(primaryKeyword);
  return { title, content, faqs, jsonLd, metaDescription };
};
