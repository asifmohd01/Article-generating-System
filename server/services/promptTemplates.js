// Prompt templates for SEO article generation
const PILLAR_ARTICLE_PROMPT = (keyword, title) => `
You are an expert SEO content writer specializing in gut health and wellness. Generate a comprehensive SEO-optimized pillar article (2500-3000 words).

Article Title: ${title}
Primary Keyword: ${keyword}

CRITICAL REQUIREMENTS FOR CONTENT QUALITY:
- EVERY paragraph must be unique and different from all others
- NO repetitive sentences or phrases
- NO placeholder text or repeated templates
- Create genuine, human-like content with natural variation
- Each paragraph should have its own perspective or angle
- Use varied sentence structures and lengths
- Include specific details, examples, and actionable information

Requirements:
1. Keyword Placement: Use the keyword in H1, within first 100 words, and naturally throughout (0.8-1.2% density)
2. Structure:
   - H1 with keyword
   - Introduction (100-150 words) - Set context and value
   - Multiple H2 sections with H3 subsections - Each section explores different aspects
   - Scannable with bullet points and varied formatting
   - Conclusion with actionable CTA
3. SEO Elements:
   - Meta description (150-160 chars) - Compelling and unique
   - FAQ section (5-8 Q&A pairs) - Varied questions, detailed answers
   - JSON-LD schema markup
4. Medical Content:
   - Grade 7-9 readability level
   - Include credible sources (NIH, CDC, NHS) with specific references
   - Medical disclaimers where appropriate
5. Content Quality:
   - Comprehensive and well-researched
   - 2500-3000 words minimum
   - Clear, easy to understand language
   - NEVER repeat the same sentence or phrase
   - Real insights and genuine information

IMPORTANT: Return ONLY valid JSON without any markdown formatting or code blocks. Start with { and end with }

{
  "title": "${title}",
  "metaDescription": "Create a 150-160 character meta description about ${keyword} that includes the keyword",
  "content": "Write the complete 2500-3000 word article here with HTML tags (use <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em> tags). Ensure every paragraph is unique with no repetition.",
  "faqs": [
    {"question": "What is ${keyword}?", "answer": "Detailed answer about the keyword..."},
    {"question": "How does ${keyword} affect digestion?", "answer": "Detailed answer about specific effects..."},
    {"question": "What foods support ${keyword}?", "answer": "Detailed answer about specific foods and why..."},
    {"question": "When should I see a doctor about ${keyword}?", "answer": "Detailed answer about specific symptoms and circumstances..."},
    {"question": "Are there supplements for ${keyword}?", "answer": "Detailed answer about specific supplements and their benefits..."}
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

CRITICAL REQUIREMENTS FOR CONTENT QUALITY:
- EVERY paragraph must be unique and different from all others
- NO repetitive sentences or phrases
- NO placeholder text or repeated templates
- Create genuine, human-like content with natural variation
- Each section should provide different insights
- Vary your writing style throughout
- Include real information, not filler content

Requirements:
1. Include keyword naturally (0.8-1.2% density)
2. Structure: H1, 3-4 H2 sections with unique content in each, scannable format
3. Meta description (150-160 chars) - Compelling and different
4. FAQ section (3-5 Q&A) - Each with substantive, unique answers
5. Grade 7-9 readability level
6. 1000-1500 words
7. Medical disclaimers where appropriate
8. Every paragraph different - no repetition allowed
9. Real insights and practical information

IMPORTANT: Return ONLY valid JSON without any markdown formatting or code blocks. Start with { and end with }

{
  "title": "${title}",
  "metaDescription": "Create a 150-160 character meta description about ${keyword}",
  "content": "Write the complete 1000-1500 word article here with HTML tags (use <h2>, <h3>, <p>, <ul>, <li>, <strong> tags). Ensure every paragraph is completely unique.",
  "faqs": [
    {"question": "What is ${keyword}?", "answer": "Detailed, substantive answer about the keyword..."},
    {"question": "How does ${keyword} affect digestion?", "answer": "Detailed answer about specific effects and mechanisms..."},
    {"question": "What foods support ${keyword}?", "answer": "Detailed answer with specific food examples and reasons..."}
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
  if (type === "pillar") {
    return PILLAR_ARTICLE_PROMPT(keyword, title);
  }
  return SUPPORTING_ARTICLE_PROMPT(keyword, title);
}

module.exports = { getPromptForType };
