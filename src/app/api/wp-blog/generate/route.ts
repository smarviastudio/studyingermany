export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { topic, tone, length, keywords, category } = await request.json();

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const wordTarget =
      length === 'short' ? '400–600' : length === 'long' ? '1200–1800' : '700–1000';

    const prompt = `You are an expert content writer for "Students in Germany" — a website helping international students move to, study, and live in Germany.

Write a complete, engaging blog post about: "${topic}"

Requirements:
- Tone: ${tone || 'informative and friendly'}
- Length: ${wordTarget} words
- Category: ${category || 'Guides'}
- Keywords to include naturally: ${keywords || topic}
- Target audience: international students planning to study in Germany
- FAQ requirement: include 3-5 unique FAQs aligned with the topic. Each answer must be practical (2-3 sentences) and avoid repeating previous answers.

Format your response as valid JSON with this exact structure:
{
  "title": "SEO-optimized, compelling title (max 70 chars)",
  "excerpt": "A 1-2 sentence summary for SEO meta description (max 160 chars)",
  "content": "Full HTML blog post content using <h2>, <h3>, <p>, <ul>, <li>, <strong>, <blockquote> tags. No <html>, <body>, or <head> tags. Start directly with content.",
  "tags": ["tag1", "tag2", "tag3"],
  "seo_slug": "url-friendly-slug-with-hyphens",
  "faqs": [
    {"question":"Specific reader question #1 about the topic","answer":"Helpful answer in 2-3 sentences"},
    {"question":"Specific reader question #2 about the topic","answer":"Helpful answer in 2-3 sentences"},
    {"question":"Specific reader question #3 about the topic","answer":"Helpful answer in 2-3 sentences"}
  ]
}

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
        model: 'google/gemini-2.0-flash-001',
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

    return NextResponse.json({ post: parsed });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
