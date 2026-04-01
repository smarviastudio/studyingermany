import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getAiChatDailyLimit, getPlanDisplayName, normalizePlanType } from '@/lib/plans';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-4o-mini';

const SYSTEM_PROMPT = `You are a helpful German university application assistant. Format your responses with proper markdown:

**FORMATTING RULES:**
1. Use **bold** for important terms and headings
2. Use bullet points (- or •) for lists
3. Use numbered lists (1., 2., 3.) for sequential steps
4. Add blank lines between sections for readability
5. Keep paragraphs short (2-3 sentences max)

**CONTENT RULES:**
1. Start with a brief direct answer
2. Organize information in clear sections
3. Use bullet points for requirements, documents, or options
4. Use numbered lists for step-by-step processes
5. Keep responses concise but well-structured

**EXAMPLE FORMAT:**
Here's what you need:

**Required Documents:**
- Document 1
- Document 2
- Document 3

**Next Steps:**
1. First step
2. Second step
3. Third step

Topics: documents, requirements, visa, language tests, deadlines, scholarships, living in Germany.
Tone: helpful, clear, organized.`;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check message limits based on subscription tier
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        subscription: {
          select: { planType: true }
        }
      }
    });

    const rawPlanType = user?.subscription?.planType || 'free';
    const tier = user?.subscription ? normalizePlanType(rawPlanType) : 'free';
    const dailyLimit = getAiChatDailyLimit(rawPlanType);

    if (dailyLimit === 0) {
      return NextResponse.json({
        error: 'Upgrade required',
        message: 'AI Chat Consultant is available on Essential and Pro plans.',
        tier,
        planName: getPlanDisplayName(rawPlanType),
      }, { status: 403 });
    }

    let messageCount = 0;

    if (dailyLimit !== null) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      messageCount = await prisma.chatMessage.count({
        where: {
          userId: session.user.id,
          createdAt: { gte: today }
        }
      });

      if (messageCount >= dailyLimit) {
        return NextResponse.json({ 
          error: 'Daily message limit reached',
          message: `Your ${getPlanDisplayName(rawPlanType)} plan includes ${dailyLimit} AI Chat messages per day.`,
          limit: dailyLimit,
          tier,
          planName: getPlanDisplayName(rawPlanType),
          remainingMessages: 0
        }, { status: 429 });
      }
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

      // Save message to database for tracking
      await prisma.chatMessage.create({
        data: {
          userId: session.user.id,
          programId,
          message,
          reply
        }
      });

      const remaining = dailyLimit === null ? null : dailyLimit - messageCount - 1;

      return NextResponse.json({
        reply,
        programId,
        remainingMessages: remaining,
        dailyLimit,
        tier
      });
    } finally {
      delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    }
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
