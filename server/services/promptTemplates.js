// Prompt templates for SEO article generation
const PILLAR_ARTICLE_PROMPT = (keyword, title) => `
You are an expert SEO content writer specializing in gut health and wellness. Generate a comprehensive SEO-optimized pillar article (2500-3000 words).

Article Title: ${title}
Primary Keyword: ${keyword}

Requirements:
1. Keyword Placement: Use the keyword in H1, within first 100 words, and naturally throughout (0.8-1.2% density)
2. Structure:
   - H1 with keyword
   - Introduction (100-150 words)
   - H2 sections with H3 subsections
   - Scannable with bullet points
   - Conclusion with CTA
3. SEO Elements:
   - Meta description (150-160 chars)
   - FAQ section (5-8 Q&A pairs)
   - JSON-LD schema markup
4. Medical Content:
   - Grade 7-9 readability level
   - Include credible sources (NIH, CDC, NHS)
   - Medical disclaimers where appropriate
5. Content Quality:
   - Comprehensive and well-researched
   - 2500-3000 words minimum
   - Clear, easy to understand language

IMPORTANT: Return ONLY valid JSON without any markdown formatting or code blocks. Start with { and end with }

{
  "title": "${title}",
  "metaDescription": "Create a 150-160 character meta description about ${keyword} that includes the keyword",
  "content": "Write the complete 2500-3000 word article here with HTML tags (use <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em> tags)",
  "faqs": [
    {"question": "What is ${keyword}?", "answer": "Answer about the keyword..."},
    {"question": "How does ${keyword} affect digestion?", "answer": "Answer about effects..."},
    {"question": "What foods support ${keyword}?", "answer": "Answer about foods..."},
    {"question": "When should I see a doctor about ${keyword}?", "answer": "Answer about doctor visit..."},
    {"question": "Are there supplements for ${keyword}?", "answer": "Answer about supplements..."}
  ],
  "jsonLd": {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${title}",
    "keywords": "${keyword}",
    "author": {"@type": "Person", "name": "Healthy Gut AI"}
  }
}
`;

const SUPPORTING_ARTICLE_PROMPT = (keyword, title) => `
You are an expert SEO content writer specializing in gut health. Generate a supporting article (1000-1500 words).

Article Title: ${title}
Primary Keyword: ${keyword}

Requirements:
1. Include keyword naturally (0.8-1.2% density)
2. Structure: H1, 3-4 H2 sections, scannable format
3. Meta description (150-160 chars)
4. FAQ section (3-5 Q&A)
5. Grade 7-9 readability level
6. 1000-1500 words
7. Medical disclaimers where appropriate

IMPORTANT: Return ONLY valid JSON without any markdown formatting or code blocks. Start with { and end with }

{
  "title": "${title}",
  "metaDescription": "Create a 150-160 character meta description about ${keyword}",
  "content": "Write the complete 1000-1500 word article here with HTML tags (use <h2>, <h3>, <p>, <ul>, <li>, <strong> tags)",
  "faqs": [
    {"question": "What is ${keyword}?", "answer": "Answer about the keyword..."},
    {"question": "How does ${keyword} affect digestion?", "answer": "Answer about effects..."},
    {"question": "What foods support ${keyword}?", "answer": "Answer about foods..."}
  ],
  "jsonLd": {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${title}",
    "keywords": "${keyword}",
    "author": {"@type": "Person", "name": "Healthy Gut AI"}
  }
}
`;

function getPromptForType(keyword, title, type) {
  if (type === 'pillar') {
    return PILLAR_ARTICLE_PROMPT(keyword, title);
  }
  return SUPPORTING_ARTICLE_PROMPT(keyword, title);
}

module.exports = { getPromptForType };
