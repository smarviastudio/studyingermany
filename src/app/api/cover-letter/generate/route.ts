import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { checkUsageLimit, incrementUsage } from '@/lib/usage-tracker';

const CoverLetterRequestSchema = z.object({
  mode: z.enum(['generate', 'improve']),
  job: z.object({
    role: z.string().min(1),
    company: z.string().min(1),
    jobDescription: z.string().optional(),
    tone: z.string().optional(),
  }),
  applicant: z.object({
    fullName: z.string().min(1),
    summary: z.string().min(1),
    strengths: z.string().optional(),
    achievements: z.string().optional(),
    closing: z.string().optional(),
  }),
  draftText: z.string().optional(),
  cvText: z.string().optional(),
});

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-4o-mini';

const SYSTEM_PROMPT = `You are an experienced career coach who writes concise, persuasive cover letters for international students applying to jobs and internships in Germany.

Guidelines:
1. Keep tone professional yet warm.
2. Highlight value the candidate brings in the first two paragraphs.
3. Use clear paragraphing: intro, value proposition, experience proof, closing.
4. Reference company values or role expectations when provided.
5. Keep it between 320-420 words.
6. Include an actionable closing sentence with gratitude.
7. If an existing draft is supplied, improve wording, structure, and clarity without inventing false information.
8. If resume/CV snippets are provided, weave concrete accomplishments into the letter.`;

async function callOpenRouter({
  mode,
  job,
  applicant,
  draftText,
  cvText,
}: z.infer<typeof CoverLetterRequestSchema>): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  try {
    const baseDetails = `Role: ${job.role}\nCompany: ${job.company}\nTone: ${job.tone || 'Professional'}\nJob Description: ${job.jobDescription || 'Not provided'}`;
    const applicantDetails = `Applicant: ${applicant.fullName}\nSummary: ${applicant.summary}\nStrengths: ${applicant.strengths || 'Not provided'}\nAchievements: ${applicant.achievements || 'Not provided'}\nClosing Preferences: ${applicant.closing || 'Standard professional closing'}`;

    const userPrompt = mode === 'improve'
      ? `You are improving the following cover letter draft. Keep the structure tight, remove fluff, and ensure it speaks directly to the role.

${baseDetails}

${applicantDetails}

Existing Draft:
${draftText}
${cvText ? `\nResume Highlights:\n${cvText}` : ''}

Return the improved cover letter only.`
      : `Write a fresh cover letter for the following opportunity and candidate. Make it concise, persuasive, and tailored.

${baseDetails}

${applicantDetails}
${cvText ? `\nResume Highlights:\n${cvText}` : ''}

Return only the final letter text.`;

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://daad-ai-consultant.local',
        'X-Title': 'Cover Letter Studio',
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: mode === 'improve' ? 0.4 : 0.65,
        max_tokens: 1100,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cover letter AI error', response.status, errorText);
      throw new Error('AI service unavailable');
    }

    const data = await response.json();
    const letter = data?.choices?.[0]?.message?.content?.trim();
    if (!letter) throw new Error('Empty response from AI');
    return letter;
  } finally {
    delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  }
}

export async function POST(request: NextRequest) {
  const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  try {
    console.log(`[Cover Letter ${requestId}] Incoming request`);

    const session = await auth();
    if (session?.user?.id) {
      const { allowed, current, limit } = await checkUsageLimit(session.user.id, 'cover');
      if (!allowed) {
        return NextResponse.json({
          error: 'Usage limit reached',
          upgradeRequired: true,
          current,
          limit,
          message: `You've used ${current}/${limit} free cover letter generations this month.`,
        }, { status: 402 });
      }
    }

    const body = await request.json();
    const payload = CoverLetterRequestSchema.parse(body);

    const letter = await callOpenRouter(payload);
    console.log(`[Cover Letter ${requestId}] Success`);

    if (session?.user?.id) {
      await incrementUsage(session.user.id, 'cover');
    }

    return NextResponse.json({
      letter,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`[Cover Letter ${requestId}] Error`, error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({
      error: 'Failed to generate cover letter',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
