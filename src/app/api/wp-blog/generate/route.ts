export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';

type FAQItem = {
  question: string;
  answer: string;
};

function normalizeFaqs(input: unknown, topic: string, category: string): FAQItem[] {
  const fallbackFaqs: FAQItem[] = [
    {
      question: `What should international students know about ${topic}?`,
      answer: `International students should check official university and government requirements early, compare deadlines carefully, and prepare documents in advance for ${topic}.`,
    },
    {
      question: `How can students get started with ${topic}?`,
      answer: `Start with official sources, make a step-by-step checklist, and focus first on the most important requirements related to ${topic}.`,
    },
    {
      question: `Are there common mistakes to avoid with ${topic}?`,
      answer: `Yes. Many students rely on outdated information, miss deadlines, or ignore program-specific rules, so always verify details through official channels.`,
    },
  ];

  const cleaned = Array.isArray(input)
    ? input
        .map((faq) => ({
          question: typeof faq?.question === 'string' ? faq.question.trim() : '',
          answer: typeof faq?.answer === 'string' ? faq.answer.trim() : '',
        }))
        .filter((faq) => faq.question && faq.answer)
    : [];

  const merged = [...cleaned];

  if (merged.length < 3) {
    for (const faq of fallbackFaqs) {
      if (merged.length >= 3) break;
      if (!merged.some((item) => item.question.toLowerCase() === faq.question.toLowerCase())) {
        merged.push(faq);
      }
    }
  }

  if (merged.length < 3) {
    merged.push(
      {
        question: `How does ${topic} relate to studying in Germany?`,
        answer: `${topic} can affect admission planning, budgeting, relocation, or student life, so it is worth understanding the details before making decisions.`,
      },
      {
        question: `Where can students find reliable information about ${category}?`,
        answer: `Use official university pages, DAAD resources, and government websites first, then compare that information with trusted student guides and communities.`,
      }
    );
  }

  return merged.slice(0, 5);
}

export async function POST(request: NextRequest) {
  try {
    const unauthorizedResponse = await requireAdminApi();
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const {
      topic,
      tone,
      length,
      focusKeyword,
      semanticKeywords,
      category,
      model,
    } = await request.json();

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const selectedModel = model || 'google/gemini-2.0-flash-001';
    const normalizedTopic = topic.trim();
    const normalizedFocusKeyword =
      typeof focusKeyword === 'string' && focusKeyword.trim()
        ? focusKeyword.trim()
        : normalizedTopic;
    const semanticKeywordList = Array.isArray(semanticKeywords)
      ? semanticKeywords
          .map((keyword) => (typeof keyword === 'string' ? keyword.trim() : ''))
          .filter(Boolean)
      : typeof semanticKeywords === 'string'
        ? semanticKeywords
            .split(',')
            .map((keyword) => keyword.trim())
            .filter(Boolean)
        : [];

    const wordTarget =
      length === 'short' ? '400–600' : length === 'long' ? '1200–1800' : '700–1000';

    const prompt = `You are an expert content writer for "Students in Germany" — a website helping international students move to, study, and live in Germany.

Write a complete, engaging, SEO-focused blog post about: "${normalizedTopic}"

Requirements:
- Tone: ${tone || 'informative and friendly'}
- Length: ${wordTarget} words
- Category: ${category || 'Guides'}
- Focus keyword: ${normalizedFocusKeyword}
- Semantic keywords to include naturally: ${semanticKeywordList.length ? semanticKeywordList.join(', ') : 'None provided. Infer the best semantically related terms from the topic and audience.'}
- Target audience: international students planning to study in Germany
- FAQ requirement: include 3-5 unique FAQs aligned with the topic. Each answer must be practical (2-3 sentences) and avoid repeating previous answers.
- Search intent: informational, practical, and action-oriented

SEO instructions:
- Make the article genuinely useful first, not keyword-stuffed.
- Use the focus keyword naturally in the title, SEO title, meta description, slug, opening paragraph, and at least one subheading.
- Use semantic keywords naturally across subheadings and body copy without forcing exact repetition.
- Start with a concise introduction that answers the core query quickly.
- Structure the article with clear <h2> and <h3> sections that match real search intent.
- Use short paragraphs, scannable formatting, and practical steps where relevant.
- Add 1-2 short bullet lists only where they improve clarity.
- Do not repeat the exact same phrase unnaturally.
- Do not invent statistics, legal rules, deadlines, or policy updates unless the topic explicitly provides them.
- If mentioning time-sensitive requirements, keep wording careful and evergreen.
- Do not include an <h1> inside the content because the page title will already serve as the H1.
- Where relevant, include 1-2 natural internal links using relative URLs such as /course-finder, /motivation-letter, /cv-maker, /gpa-converter, or /blog.

Format your response as valid JSON with this exact structure:
	{
	  "title": "SEO-optimized, compelling title (max 70 chars)",
	  "excerpt": "A 1-2 sentence summary for SEO meta description (max 160 chars)",
	  "seo_title": "Search title optimized for Google (max 60 chars)",
	  "meta_description": "Search meta description optimized for Google (max 155 chars)",
	  "content": "Full HTML blog post content using <h2>, <h3>, <p>, <ul>, <li>, <strong>, <blockquote>, <a> tags. No <html>, <body>, or <head> tags. Start directly with content.",
	  "tags": ["tag1", "tag2", "tag3"],
	  "seo_slug": "url-friendly-slug-with-hyphens",
	  "faqs": [
    {"question":"Specific reader question #1 about the topic","answer":"Helpful answer in 2-3 sentences"},
    {"question":"Specific reader question #2 about the topic","answer":"Helpful answer in 2-3 sentences"},
    {"question":"Specific reader question #3 about the topic","answer":"Helpful answer in 2-3 sentences"}
  ]
}

Output quality rules:
- Ensure the title and SEO title are distinct if that improves CTR, but both must stay aligned with the focus keyword.
- Make the meta description compelling, human-readable, and action-oriented.
- Build the slug around the focus keyword when natural.
- Choose tags from the focus keyword, semantic keywords, and the main subtopics covered.

Return ONLY the JSON, no markdown code blocks, no extra text.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://students-in-germany.com',
        'X-Title': 'Students in Germany Blog Generator',
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenRouter error:', err);
      return NextResponse.json({ error: 'AI generation failed' }, { status: 502 });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || '';

    // Strip markdown code fences if present
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

	    let parsed;
	    try {
	      parsed = JSON.parse(cleaned);
	    } catch {
	      return NextResponse.json({ error: 'Failed to parse AI response', raw }, { status: 500 });
	    }

	    parsed.seo_title =
	      typeof parsed?.seo_title === 'string' && parsed.seo_title.trim()
	        ? parsed.seo_title.trim()
	        : typeof parsed?.title === 'string'
	          ? parsed.title.trim()
	          : '';
	    parsed.meta_description =
	      typeof parsed?.meta_description === 'string' && parsed.meta_description.trim()
	        ? parsed.meta_description.trim()
	        : typeof parsed?.excerpt === 'string'
	          ? parsed.excerpt.trim()
	          : '';
    parsed.faqs = normalizeFaqs(parsed?.faqs, normalizedTopic, category || 'Guides');

	    return NextResponse.json({ post: parsed });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
