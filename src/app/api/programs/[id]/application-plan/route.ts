import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

const ApplicationPlanRequestSchema = z.object({
  program: z.object({
    id: z.string(),
    program_name: z.string(),
    university: z.string(),
    degree_level: z.string().optional(),
    requirements: z.string().nullable(),
    tab_requirements_registration: z.string().nullable(),
    tab_costs_funding: z.string().nullable(),
    language_proficiency_required: z.boolean().optional(),
    ielts_min_score: z.string().optional(),
    toefl_min_score: z.string().optional(),
    german_min_level: z.string().optional(),
    english_min_level: z.string().optional(),
    academic_background_requirements: z.string().optional(),
    documents_required_list: z.string().optional(),
    registration_deadline_date: z.string().optional(),
    registration_deadline_text: z.string().optional(),
    application_channel: z.string().optional(),
    application_channel_notes: z.string().optional(),
  }),
  userProfile: z.object({
    german_level: z.string().optional(),
    english_level: z.string().optional(),
    ielts_score: z.number().nullable().optional(),
    toefl_score: z.number().nullable().optional(),
    academic_background: z.string().optional(),
  }).optional(),
});

const ChecklistUpdateSchema = z.object({
  stepId: z.string(),
  completed: z.boolean(),
});

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-4o-mini';

const SYSTEM_PROMPT = `You are an expert university application advisor. Analyze program requirements and create a detailed, actionable application plan.

Return JSON ONLY with this structure:
{
  "overview": "Brief summary of the application process",
  "estimatedTimeline": "e.g., 3-6 months",
  "blockers": ["List of potential issues or missing requirements"],
  "steps": [
    {
      "id": "unique-id",
      "title": "Step title",
      "description": "What to do",
      "deadline": "Optional deadline",
      "completed": false,
      "action": {
        "type": "cv|letter|document|external",
        "label": "Button text",
        "url": "Link to tool or resource"
      }
    }
  ]
}

Create steps for:
1. Language test preparation (if needed)
2. Document gathering (transcripts, certificates, etc.)
3. CV preparation
4. Motivation letter writing
5. Reference letters
6. Application submission
7. Financial proof preparation
8. Visa application (if international)

For each step that can use our tools, set action.url to:
- CV: "/cv-maker"
- Motivation letter: "/motivation-letter?programId={program.id}"
- External resources: actual URLs

Use the exact program ID from the context when creating URLs.

Identify blockers like:
- Missing language certificates
- Insufficient academic background
- Approaching deadlines
- Missing documents

Be specific and actionable. Return ONLY valid JSON.`;

function applyChecklistState(planData: any, checklistState: Record<string, boolean> | null) {
  if (!planData?.steps || !Array.isArray(planData.steps)) {
    return planData;
  }

  if (!checklistState) {
    return {
      ...planData,
      steps: planData.steps.map((step: any) => ({
        ...step,
        completed: step.completed ?? false,
      })),
    };
  }

  return {
    ...planData,
    steps: planData.steps.map((step: any) => ({
      ...step,
      completed: checklistState[step.id] ?? step.completed ?? false,
    })),
  };
}

async function callOpenRouter(program: any, userProfile?: any): Promise<any> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  try {
    const userPrompt = `Program: ${program.program_name} at ${program.university}
Degree: ${program.degree_level || 'Not specified'}

Requirements:
${program.tab_requirements_registration || program.requirements || 'No specific requirements listed'}

Language Requirements:
- Required: ${program.language_proficiency_required ? 'Yes' : 'No'}
- IELTS: ${program.ielts_min_score || 'Not specified'}
- TOEFL: ${program.toefl_min_score || 'Not specified'}
- German: ${program.german_min_level || 'Not specified'}
- English: ${program.english_min_level || 'Not specified'}

Academic Background:
${program.academic_background_requirements || 'Not specified'}

Documents Required:
${program.documents_required_list || 'Not specified'}

Application Deadline:
${program.registration_deadline_text || program.registration_deadline_date || 'Not specified'}

Application Channel:
${program.application_channel || 'Not specified'}
${program.application_channel_notes || ''}

User Profile:
${userProfile ? `
- German Level: ${userProfile.german_level || 'Not specified'}
- English Level: ${userProfile.english_level || 'Not specified'}
- IELTS Score: ${userProfile.ielts_score || 'Not taken'}
- TOEFL Score: ${userProfile.toefl_score || 'Not taken'}
- Academic Background: ${userProfile.academic_background || 'Not specified'}
` : 'No user profile provided'}

Create a comprehensive application plan.`;

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://daad-ai-consultant.local',
        'X-Title': 'DAAD Application Plan Generator'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 2000
      }),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter error ${response.status}:`, errorText);
      throw new Error('AI service unavailable');
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || '';
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }

    return JSON.parse(jsonMatch[0]);
  } finally {
    delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const record = await prisma.applicationPlan.findUnique({
      where: {
        userId_programId: {
          userId: session.user.id,
          programId: id,
        },
      },
    });

    if (!record) {
      return NextResponse.json({ plan: null });
    }

    let parsedPlan: any = null;
    let checklistState: Record<string, boolean> | null = null;

    try {
      parsedPlan = JSON.parse(record.planData);
      checklistState = record.checklistState ? JSON.parse(record.checklistState) : null;
    } catch (parseError) {
      console.error('Failed to parse stored plan data', parseError);
      return NextResponse.json({ error: 'Corrupted plan data' }, { status: 500 });
    }

    return NextResponse.json({
      plan: applyChecklistState(parsedPlan, checklistState),
      updatedAt: record.updatedAt,
    });
  } catch (error) {
    console.error('Fetch application plan error:', error);
    return NextResponse.json({ error: 'Failed to fetch application plan' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log(`[Application Plan ${requestId}] Received request`);
    const { id } = await params;
    const body = await request.json();
    
    const { program, userProfile } = ApplicationPlanRequestSchema.parse(body);
    
    console.log(`[Application Plan ${requestId}] Generating plan for program: ${program.program_name}`);
    
    const plan = await callOpenRouter(program, userProfile);
    
    console.log(`[Application Plan ${requestId}] Plan generated successfully`);
    
    // Save to database if user is authenticated
    const session = await auth();
    if (session?.user?.id) {
      try {
        await prisma.applicationPlan.upsert({
          where: {
            userId_programId: {
              userId: session.user.id,
              programId: id,
            },
          },
          update: {
            planData: JSON.stringify(plan),
            updatedAt: new Date(),
            checklistState: JSON.stringify({}),
          },
          create: {
            userId: session.user.id,
            programId: id,
            programName: program.program_name,
            university: program.university,
            planData: JSON.stringify(plan),
            checklistState: JSON.stringify({}),
          },
        });
        console.log(`[Application Plan ${requestId}] Saved to database for user ${session.user.id}`);
      } catch (dbError) {
        console.error(`[Application Plan ${requestId}] Database save error:`, dbError);
        // Continue even if DB save fails
      }
    }
    
    return NextResponse.json({
      plan,
      programId: id,
      generatedAt: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    console.error(`[Application Plan ${requestId}] Error:`, error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Invalid request format',
        details: error.issues
      }, { status: 400 });
    }
    
    return NextResponse.json({
      error: 'Failed to generate application plan',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { stepId, completed } = ChecklistUpdateSchema.parse(body);

    const planRecord = await prisma.applicationPlan.findUnique({
      where: {
        userId_programId: {
          userId: session.user.id,
          programId: id,
        },
      },
    });

    if (!planRecord) {
      return NextResponse.json({ error: 'Application plan not found' }, { status: 404 });
    }

    let checklistState: Record<string, boolean> = {};
    if (planRecord.checklistState) {
      try {
        checklistState = JSON.parse(planRecord.checklistState);
      } catch (parseError) {
        console.error('Failed to parse checklist state', parseError);
      }
    }

    checklistState[stepId] = completed;

    await prisma.applicationPlan.update({
      where: {
        userId_programId: {
          userId: session.user.id,
          programId: id,
        },
      },
      data: {
        checklistState: JSON.stringify(checklistState),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request format', details: error.issues }, { status: 400 });
    }
    console.error('Update checklist error:', error);
    return NextResponse.json({ error: 'Failed to update checklist' }, { status: 500 });
  }
}
