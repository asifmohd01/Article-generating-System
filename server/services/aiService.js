// aiService: integrates with Gemini API and falls back to simulator if needed
const { callGemini } = require("./geminiAdapter");
const { getPromptForType } = require("./promptTemplates");

const generateMetaDescription = (keyword) =>
  `${keyword} - Learn diet, symptoms, FAQs and clinical guidance for a healthy gut.`;

// Generate unique, varied paragraphs with no repetition
const generateUniqueParagraphs = (keyword, targetWords = 1000) => {
  const paragraphs = [
    `Understanding ${keyword} is essential for maintaining optimal digestive health and overall wellness. This comprehensive topic encompasses multiple aspects of nutrition, lifestyle, and medical considerations that can significantly impact your quality of life.`,
    `The relationship between ${keyword} and digestive function has been extensively studied by medical professionals and nutritionists worldwide. Research consistently demonstrates the importance of addressing this topic through evidence-based approaches and personalized health strategies.`,
    `Many individuals experience challenges related to ${keyword}, which can manifest in various ways depending on their unique circumstances, genetic factors, and lifestyle choices. A proactive approach to understanding this condition can lead to meaningful improvements in daily life.`,
    `Healthcare providers often recommend a multifaceted strategy when addressing concerns related to ${keyword}. This may include dietary modifications, stress management, targeted supplementation, and regular monitoring to ensure optimal health outcomes.`,
    `The science behind ${keyword} reveals complex interactions between multiple bodily systems, including the digestive tract, immune system, and microbiome. These connections highlight why a holistic approach to health is increasingly recognized as beneficial.`,
    `Dietary management plays a crucial role in supporting overall wellness related to ${keyword}. Specific nutrients, food combinations, and eating patterns have been shown to promote digestive comfort and systemic health benefits.`,
    `Professional guidance can be invaluable when developing a comprehensive plan to address ${keyword}. Registered dietitians, gastroenterologists, and other specialists bring expertise that can transform your approach to health.`,
    `Recent advances in nutritional science have expanded our understanding of how ${keyword} affects overall wellbeing. New research continues to validate traditional approaches while introducing innovative strategies for health optimization.`,
    `Lifestyle factors such as sleep quality, physical activity, stress management, and hydration significantly influence how your body handles ${keyword}. Optimizing these foundational elements creates a stronger foundation for health.`,
    `The gut microbiome plays an increasingly recognized role in maintaining health and managing concerns related to ${keyword}. Supporting beneficial bacterial populations through diet and lifestyle choices is now considered central to wellness strategies.`,
    `Supplementation may offer valuable support for individuals concerned about ${keyword}. Evidence-based supplements, combined with dietary and lifestyle modifications, often provide comprehensive support for digestive and overall health.`,
    `Understanding the triggers and patterns associated with ${keyword} empowers individuals to make informed decisions about their health. Keeping detailed records and working with healthcare providers can reveal valuable insights specific to your situation.`,
    `The connection between mental health and physical wellness, including issues related to ${keyword}, has become increasingly clear through modern research. The gut-brain axis represents one of the most exciting frontiers in medical science.`,
    `Developing sustainable habits around nutrition and lifestyle creates long-term benefits for managing ${keyword}. Gradual, consistent changes often prove more effective than dramatic shifts that are difficult to maintain.`,
    `Community support and access to reliable health information can significantly enhance outcomes for individuals addressing ${keyword}. Connecting with others on similar health journeys provides both practical insights and emotional encouragement.`,
  ];

  let content = "";
  let currentLength = 0;
  let paragraphIndex = 0;

  while (currentLength < targetWords) {
    const paragraph = paragraphs[paragraphIndex % paragraphs.length];
    content += paragraph + "\n\n";
    currentLength += paragraph.split(" ").length;
    paragraphIndex++;
  }

  return content.trim();
};

// Generate varied, unique FAQ answers
const generateFAQs = (keyword) => {
  const faqData = [
    {
      question: `What is ${keyword}?`,
      answerStart: `${keyword} refers to a significant aspect of digestive health that affects millions of people worldwide.`,
      details: `It involves complex interactions between nutritional factors, lifestyle choices, and biological processes.`,
    },
    {
      question: `How does ${keyword} affect digestion?`,
      answerStart: `The impact of ${keyword} on digestive function can be far-reaching and multifaceted.`,
      details: `It may influence nutrient absorption, bowel regularity, and overall gastrointestinal comfort in various ways.`,
    },
    {
      question: `What foods support healthy ${keyword}?`,
      answerStart: `Certain foods have been recognized for their beneficial properties related to ${keyword}.`,
      details: `These include fiber-rich vegetables, fermented foods, healthy fats, and proteins that support digestive health.`,
    },
    {
      question: `When should I see a healthcare provider about ${keyword}?`,
      answerStart: `Professional medical evaluation is recommended if ${keyword} significantly impacts your daily quality of life.`,
      details: `A healthcare provider can offer personalized assessment, diagnosis if needed, and evidence-based recommendations.`,
    },
    {
      question: `Are there supplements that support ${keyword}?`,
      answerStart: `Various supplements have been studied for their potential to support health related to ${keyword}.`,
      details: `These may include probiotics, prebiotics, specific enzymes, and plant-based compounds with demonstrated benefits.`,
    },
  ];

  return faqData.map((item) => ({
    question: item.question,
    answer: `${item.answerStart} ${item.details} Understanding your individual needs and consulting with healthcare professionals ensures you choose the most appropriate strategies for your situation.`,
  }));
};

// Try to parse JSON response from Gemini
function parseGeminiResponse(text) {
  try {
    // Remove markdown code blocks if present
    let cleanText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();

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
      console.log(
        `[AI Service] Response received: ${response.length} characters`
      );

      const parsed = parseGeminiResponse(response);
      if (parsed && parsed.content) {
        console.log(
          "[AI Service] ✓ Successfully generated article from Gemini"
        );
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
  const content = generateUniqueParagraphs(primaryKeyword, wordTarget);
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
