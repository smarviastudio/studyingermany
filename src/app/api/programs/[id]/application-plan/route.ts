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
    fullName: z.string().optional(),
    nationality: z.string().optional(),
    germanLevel: z.string().optional(),
    englishLevel: z.string().optional(),
    ieltsScore: z.number().nullable().optional(),
    ieltsListening: z.number().nullable().optional(),
    ieltsReading: z.number().nullable().optional(),
    ieltsWriting: z.number().nullable().optional(),
    ieltsSpeaking: z.number().nullable().optional(),
    toeflScore: z.number().nullable().optional(),
    toeflReading: z.number().nullable().optional(),
    toeflListening: z.number().nullable().optional(),
    toeflSpeaking: z.number().nullable().optional(),
    toeflWriting: z.number().nullable().optional(),
    testDafScore: z.string().optional(),
    goetheLevel: z.string().optional(),
    currentGPA: z.number().nullable().optional(),
    gradingScale: z.string().optional(),
    academicBackground: z.string().optional(),
    backgroundSummary: z.string().optional(),
    targetDegreeLevel: z.string().optional(),
    hasScholarship: z.boolean().optional(),
    maxTuitionEur: z.number().nullable().optional(),
  }).optional(),
});

const ChecklistUpdateSchema = z.object({
  stepId: z.string(),
  completed: z.boolean(),
});

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-4o-mini';

const SYSTEM_PROMPT = `You are an expert German university application advisor. Analyze program requirements against the user's profile and create a detailed, personalized application plan.

Return JSON ONLY with this exact structure:
{
  "criticalRequirements": [
    {
      "type": "language_english|language_german|gpa|financial|documents",
      "label": "English Proficiency",
      "programRequirement": "IELTS 6.5 overall, min 6.0 per band",
      "userProvided": "IELTS 7.0 overall",
      "status": "met|partial|missing|unknown",
      "statusScore": 100,
      "notes": "Your IELTS score exceeds the requirement",
      "askUserQuestions": ["What is your IELTS overall score?", "What are your individual band scores?"]
    }
  ],
  "profileMatch": {
    "score": 85,
    "summary": "Brief 2-3 sentence analysis comparing user profile to program requirements",
    "strengths": ["What the user already has that matches requirements"],
    "gaps": ["What the user is missing or needs to improve"],
    "recommendations": ["Specific actionable recommendations"]
  },
  "overview": "Brief summary of the application process for this specific program",
  "estimatedTimeline": "e.g., 3-6 months",
  "blockers": ["List of potential issues or missing requirements based on user profile"],
  "steps": [
    {
      "id": "unique-id",
      "title": "Step title",
      "description": "Detailed description of what to do",
      "detailedInfo": "Extended explanation: why this step matters, what exactly is required for THIS program, tips for success",
      "deadline": "Specific deadline or relative timing like '3 months before application deadline'",
      "completed": false,
      "autoCompleted": false,
      "autoCompletedReason": "If user profile already satisfies this requirement, explain why",
      "priority": "high|medium|low",
      "category": "language|documents|application|financial|visa",
      "resources": [
        {
          "name": "Resource name",
          "url": "Verified URL",
          "description": "What this resource helps with"
        }
      ],
      "action": {
        "type": "cv|letter|document|external|info",
        "label": "Button text",
        "url": "Link to tool or resource"
      }
    }
  ]
}

CRITICAL RULES FOR STEPS:

1. LANGUAGE PREPARATION:
   - If user already has required language certificate (IELTS/TOEFL score meets minimum), set autoCompleted=true
   - For German courses, use these VERIFIED URLs only:
     * Goethe Institut: https://www.goethe.de/en/spr/kup.html
     * DW Learn German: https://learngerman.dw.com/en/overview
     * TestDaF: https://www.testdaf.de/en/
   - For English tests:
     * IELTS: https://www.ielts.org/for-test-takers/how-to-prepare
     * TOEFL: https://www.ets.org/toefl/test-takers/ibt/prepare.html

2. DOCUMENT GATHERING:
   - List specific documents required for THIS program
   - Include APS certificate info if user is from China, India, Vietnam, or Mongolia

3. CV PREPARATION:
   - action.url = "/cv-maker"
   - action.type = "cv"

4. MOTIVATION LETTER:
   - action.url = "/motivation-letter?programId={PROGRAM_ID}"
   - action.type = "letter"
   - Replace {PROGRAM_ID} with the actual program ID provided

5. FINANCIAL PROOF:
   - Explain blocked account requirement (€11,904/year = €992/month as of 2024)
   - Use these VERIFIED URLs only:
     * Fintiba: https://www.fintiba.com/
     * Expatrio: https://www.expatrio.com/
   - Include specific amount needed based on program duration

6. APPLICATION SUBMISSION:
   - Use uni-assist URL if applicable: https://www.uni-assist.de/en/
   - Or direct university portal if specified

7. VISA APPLICATION:
   - German Embassy info: https://www.germany.info/
   - Make it in Germany: https://www.make-it-in-germany.com/en/visa-residence/types/studying

8. HEALTH INSURANCE:
   - TK: https://www.tk.de/en
   - AOK: https://en.zuwanderer.aok.de/

CRITICAL REQUIREMENTS ANALYSIS:
You MUST analyze these critical requirements and output them in criticalRequirements array:

1. LANGUAGE REQUIREMENTS:
   - Extract exact IELTS/TOEFL/German level requirements from program data
   - Compare with user's provided scores
   - If user data missing, ask STRUCTURED CONDITIONAL questions in this order:
     * First: "Do you have an English language certificate (IELTS, TOEFL, etc.)?"
     * If yes, then: "Which English test did you take? (IELTS, TOEFL, Cambridge, etc.)"
     * Then: "What is your overall score/band?" and "What are your individual section scores?"
   - For German requirements, follow same pattern:
     * First: "Do you have a German language certificate?"
     * If yes: "Which test? (TestDaF, Goethe-Zertifikat, DSH, etc.)"
     * Then: "What is your level/score?"
   - Calculate statusScore: 100 if met, 50-99 if partial, 0 if missing
   - Example: "IELTS 6.5 overall, min 6.0 per band" vs "User has IELTS 7.0"

2. GPA/ACADEMIC REQUIREMENTS:
   - Extract minimum GPA or grade requirements
   - Compare with user's academic background
   - If missing, ask "What is your current GPA?" and "What grading scale (4.0, 10.0, percentage)?"
   - statusScore: 100 if exceeds, 75 if meets, 50 if close, 0 if unknown

3. FINANCIAL REQUIREMENTS:
   - Always include blocked account requirement (€11,904/year)
   - Compare with user's maxTuitionEur and hasScholarship
   - If missing, ask "Do you have funding arranged?" and "What is your budget?"

4. DOCUMENT REQUIREMENTS:
   - List critical documents (transcripts, certificates, passport)
   - Mark as "unknown" if user hasn't confirmed

IMPORTANT:
- Set autoCompleted=true for steps where user profile already meets requirements
- Be specific about deadlines relative to application deadline
- Include detailedInfo for EVERY step explaining what's needed for THIS specific program
- Never invent URLs - only use the verified URLs listed above or internal tool URLs
- If no verified URL exists, set action to null
- ALWAYS populate criticalRequirements array with at least language and financial requirements

Return ONLY valid JSON.`;

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
    const userPrompt = `PROGRAM DETAILS:
Program ID: ${program.id}
Program: ${program.program_name} at ${program.university}
Degree Level: ${program.degree_level || 'Not specified'}

PROGRAM REQUIREMENTS:
${program.tab_requirements_registration || program.requirements || 'No specific requirements listed'}

LANGUAGE REQUIREMENTS:
- Language Proficiency Required: ${program.language_proficiency_required ? 'Yes' : 'No'}
- Minimum IELTS Score: ${program.ielts_min_score || 'Not specified'}
- Minimum TOEFL Score: ${program.toefl_min_score || 'Not specified'}
- German Level Required: ${program.german_min_level || 'Not specified'}
- English Level Required: ${program.english_min_level || 'Not specified'}

ACADEMIC REQUIREMENTS:
${program.academic_background_requirements || 'Not specified'}

DOCUMENTS REQUIRED:
${program.documents_required_list || 'Standard documents: transcripts, certificates, CV, motivation letter'}

APPLICATION DEADLINE:
${program.registration_deadline_text || program.registration_deadline_date || 'Check university website'}

APPLICATION CHANNEL:
${program.application_channel || 'Not specified'}
${program.application_channel_notes || ''}

===== USER PROFILE =====
${userProfile ? `
Name: ${userProfile.fullName || 'Not provided'}
Nationality: ${userProfile.nationality || 'Not specified'}
German Language Level: ${userProfile.germanLevel || 'Not specified'}
English Language Level: ${userProfile.englishLevel || 'Not specified'}
IELTS Score: ${userProfile.ieltsScore || 'Not taken'}
TOEFL Score: ${userProfile.toeflScore || 'Not taken'}
Academic Background: ${userProfile.academicBackground || 'Not specified'}
Background Summary: ${userProfile.backgroundSummary || 'Not provided'}
Target Degree: ${userProfile.targetDegreeLevel || 'Not specified'}
Has Scholarship: ${userProfile.hasScholarship ? 'Yes' : 'No'}
Max Tuition Budget: ${userProfile.maxTuitionEur ? `€${userProfile.maxTuitionEur}` : 'Not specified'}
` : 'No user profile provided - assume international student needing all steps'}

INSTRUCTIONS:
1. Compare the user profile against program requirements
2. Calculate a profile match score (0-100)
3. Identify what the user already has vs what they need
4. Create personalized steps - mark steps as autoCompleted if user already meets requirement
5. Use ONLY the verified URLs from your instructions
6. Replace {PROGRAM_ID} with: ${program.id}

Generate a comprehensive, personalized application plan.`;

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
    
    console.log('[OpenRouter] Raw AI response:', text.substring(0, 200));
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[OpenRouter] No JSON found in response:', text);
      throw new Error('Invalid AI response format');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate required fields
    if (!parsed.steps || !Array.isArray(parsed.steps)) {
      console.error('[OpenRouter] Missing or invalid steps in response:', parsed);
      throw new Error('AI response missing required steps array');
    }
    
    if (!parsed.profileMatch) {
      console.error('[OpenRouter] Missing profileMatch in response:', parsed);
      throw new Error('AI response missing required profileMatch');
    }

    return parsed;
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
    
    console.log(`[Application Plan ${requestId}] Request body keys:`, Object.keys(body));
    console.log(`[Application Plan ${requestId}] Program data:`, body.program ? Object.keys(body.program) : 'missing');
    console.log(`[Application Plan ${requestId}] Full program object:`, JSON.stringify(body.program, null, 2));
    console.log(`[Application Plan ${requestId}] UserProfile data:`, body.userProfile ? Object.keys(body.userProfile) : 'missing');
    
    const parseResult = ApplicationPlanRequestSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(`[Application Plan ${requestId}] Validation failed:`, JSON.stringify(parseResult.error.issues, null, 2));
      return NextResponse.json({
        error: 'Invalid request format',
        details: parseResult.error.issues
      }, { status: 400 });
    }
    
    const { program, userProfile } = parseResult.data;
    
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
