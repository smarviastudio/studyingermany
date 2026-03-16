import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-4o-mini';

const SYSTEM_PROMPT = `You are a concise German university application assistant. Rigorously follow these rules:

1. Keep every reply UNDER 120 words (ideally 3-5 bullet points or a short numbered list).
2. Use very tight formatting:
   - Begin with a one-line answer.
   - Follow with max 4 bullets ("•" or "-"), each under 20 words.
3. Never repeat the program name unless necessary; skip fluff and greetings.
4. Only mention resources that are directly relevant; provide URLs only when essential.
5. If unsure, say so briefly and recommend the best next step.

Topics you can cover:
- Required documents, timeline, portals
- Language/financial/visa requirements
- Health insurance & accommodation basics
- Scholarships and preparation tips

Tone: precise, supportive, zero marketing language.`;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: programId } = await params;
    const body = await request.json();
    const { message, programContext, userProfile, conversationHistory = [] } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
    }

    // Build context message
    const contextMessage = `
PROGRAM CONTEXT:
${programContext ? `
Program: ${programContext.program_name} at ${programContext.university}
Degree: ${programContext.degree_level || 'Not specified'}
Location: ${programContext.city || 'Germany'}
Language: ${programContext.languages_array?.join(', ') || 'Not specified'}
Duration: ${programContext.programme_duration || 'Not specified'}
Tuition: ${programContext.is_free ? 'Free (only semester fees)' : programContext.tuition_fee_number ? `€${programContext.tuition_fee_number}` : 'Check university website'}

Requirements:
${programContext.tab_requirements_registration || programContext.requirements || 'Standard requirements apply'}

Language Requirements:
- IELTS: ${programContext.ielts_min_score || 'Not specified'}
- TOEFL: ${programContext.toefl_min_score || 'Not specified'}
- German: ${programContext.german_min_level || 'Not specified'}
- English: ${programContext.english_min_level || 'Not specified'}

Application Deadline: ${programContext.registration_deadline_date || programContext.registration_deadline_text || 'Check university website'}
Application Channel: ${programContext.application_channel || 'Check university website'}
` : 'No program context available'}

USER PROFILE:
${userProfile ? `
Name: ${userProfile.fullName || 'Not provided'}
Nationality: ${userProfile.nationality || 'Not specified'}
German Level: ${userProfile.germanLevel || 'Not specified'}
English Level: ${userProfile.englishLevel || 'Not specified'}
IELTS Score: ${userProfile.ieltsScore || 'Not taken'}
TOEFL Score: ${userProfile.toeflScore || 'Not taken'}
Academic Background: ${userProfile.academicBackground || 'Not specified'}
` : 'No user profile available'}
`;

    // Build messages array
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'system', content: contextMessage },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    try {
      const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://germanpath.com',
          'X-Title': 'GermanPath Course Assistant'
        },
        body: JSON.stringify({
          model: MODEL,
          messages,
          temperature: 0.4,
          max_tokens: 400
        }),
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenRouter error ${response.status}:`, errorText);
        return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 });
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

      return NextResponse.json({
        reply,
        programId
      });
    } finally {
      delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    }
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
