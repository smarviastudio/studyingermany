import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { checkUsageLimit, incrementUsage } from '@/lib/usage-tracker';

const MotivationLetterRequestSchema = z.object({
  program: z.object({
    program_name: z.string(),
    university: z.string(),
    degree_level: z.string().optional(),
    subject_area: z.string().optional(),
    description: z.string().nullable(),
    tab_overview: z.string().nullable(),
  }),
  userInput: z.object({
    fullName: z.string(),
    background: z.string(),
    motivation: z.string(),
    careerGoals: z.string(),
    whyThisProgram: z.string(),
    relevantExperience: z.string(),
  }),
  cvText: z.string().optional(),
});

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-4o-mini';

const SYSTEM_PROMPT = `You are an expert academic writing advisor specializing in motivation letters for German university applications.

Write a professional, compelling motivation letter that:
1. Follows standard German academic letter format
2. Is approximately 500-700 words
3. Has clear paragraphs with logical flow
4. Demonstrates genuine interest and fit
5. Highlights relevant qualifications
6. Shows understanding of the program
7. Connects past experience to future goals
8. Uses formal but engaging language
9. If a CV/resume is provided, use specific details from it (skills, projects, work experience, education) to make the letter concrete and personal
10. Include the applicant's contact details (name, email, phone) at the top of the letter if available from the CV

Structure:
- Opening: Introduction and purpose
- Body 1: Academic background and relevant experience
- Body 2: Why this specific program and university
- Body 3: Career goals and how the program helps achieve them
- Closing: Summary and call to action

Return ONLY the letter text, properly formatted with line breaks between paragraphs.`;

async function callOpenRouter(program: any, userInput: any, cvText?: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  try {
    const userPrompt = `Write a motivation letter for:

Applicant: ${userInput.fullName}

Program Details:
- Program: ${program.program_name}
- University: ${program.university}
- Degree Level: ${program.degree_level || 'Not specified'}
- Subject Area: ${program.subject_area || 'Not specified'}

Program Description:
${program.tab_overview || program.description || 'No description available'}

Applicant Information:

Academic Background:
${userInput.background}

Why This Program:
${userInput.whyThisProgram}

Motivation:
${userInput.motivation}

Career Goals:
${userInput.careerGoals}

Relevant Experience:
${userInput.relevantExperience}
${cvText ? `
--- APPLICANT'S CV/RESUME ---
${cvText}
--- END CV ---

Use the CV above to extract specific details like education history, skills, projects, work experience, publications, and contact information. Weave these concrete details into the letter to make it highly personalized and credible.` : ''}

Write a compelling motivation letter that incorporates all this information naturally.`;

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://daad-ai-consultant.local',
        'X-Title': 'DAAD Motivation Letter Generator'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      }),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter error ${response.status}:`, errorText);
      throw new Error('AI service unavailable');
    }

    const data = await response.json();
    const letter = data?.choices?.[0]?.message?.content || '';
    
    if (!letter) {
      throw new Error('Empty response from AI');
    }

    return letter.trim();
  } finally {
    delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  }
}

export async function POST(request: NextRequest) {
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log(`[Motivation Letter ${requestId}] Received request`);

    const session = await auth();
    if (session?.user?.id) {
      const { allowed, current, limit } = await checkUsageLimit(session.user.id, 'motivation');
      if (!allowed) {
        return NextResponse.json({
          error: 'Usage limit reached',
          upgradeRequired: true,
          current,
          limit,
          message: `You've used ${current}/${limit} free motivation letter generations this month.`,
        }, { status: 402 });
      }
    }

    const body = await request.json();
    
    const { program, userInput, cvText } = MotivationLetterRequestSchema.parse(body);
    
    console.log(`[Motivation Letter ${requestId}] Generating for: ${program.program_name}${cvText ? ' (with CV)' : ''}`);
    
    const letter = await callOpenRouter(program, userInput, cvText);
    
    console.log(`[Motivation Letter ${requestId}] Letter generated successfully`);

    const session2 = await auth();
    if (session2?.user?.id) {
      await incrementUsage(session2.user.id, 'motivation');
    }
    
    return NextResponse.json({
      letter,
      generatedAt: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    console.error(`[Motivation Letter ${requestId}] Error:`, error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Invalid request format',
        details: error.issues
      }, { status: 400 });
    }
    
    return NextResponse.json({
      error: 'Failed to generate motivation letter',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
