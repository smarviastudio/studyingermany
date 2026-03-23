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
    currentCountry: z.string().optional(),
    plannedStart: z.string().optional(),
    englishCert: z.string().optional(),
    englishScore: z.string().optional(),
    germanCert: z.string().optional(),
    financialReady: z.string().optional(),
    additionalNotes: z.string().optional(),
  }).optional(),
});

const ChecklistUpdateSchema = z.object({
  stepId: z.string(),
  completed: z.boolean(),
});

export const maxDuration = 60;

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-4o-mini';

const SYSTEM_PROMPT = `You are an expert German university application advisor with deep knowledge of German higher education. Your role is to analyze program requirements comprehensively and create a detailed, personalized application roadmap.

CRITICAL PERSONALIZATION RULES:
- The user has answered a questionnaire. Use their answers to deeply personalize the plan.
- If they provided their NATIONALITY, tailor advice for that country (e.g. APS certificate for India/China/Vietnam, embassy locations, typical processing times for their country).
- If they provided their CURRENT COUNTRY, calculate realistic timelines for document legalization, embassy appointments, travel, etc.
- If they provided PLANNED START semester, reverse-engineer all deadlines from that date. Show exactly how many months/weeks they have left and what to do when.
- If they provided ENGLISH/GERMAN LEVEL and CERTIFICATES, compare with program requirements and give specific advice (e.g. "You have IELTS 6.5 but program needs 7.0 - here's how to improve in X months").
- If they said FINANCIAL READINESS is "Not started", emphasize blocked account steps urgently. If "Ready", mark financial steps as lower priority.
- Use their ADDITIONAL NOTES for any extra personalization.
- Make the timeline SPECIFIC to their situation: "As a Pakistani student applying from Pakistan for Winter 2026/27, you need to start APS process by March 2026..."

Generate a comprehensive AI-powered program analysis summary that covers:
1. Program Overview: What this program is about, its focus areas, and what makes it unique
2. Academic Requirements: Detailed analysis of admission criteria, prerequisites, and academic standards
3. Language Requirements: Exact language proficiency needed and how to meet it
4. Tuition & Costs: Complete breakdown of fees, living costs, and financial requirements
5. Career Prospects: Job market outlook for graduates in this field in Germany
6. Application Process: How applications are submitted, deadlines, and key dates
7. Your Match Analysis: How well the user's profile aligns with program requirements

Return JSON ONLY with this exact structure:
{
  "aiProgramSummary": {
    "overview": "2-3 paragraph comprehensive analysis of this program, covering what it teaches, its strengths, target students, and unique features",
    "academicRequirements": "Detailed explanation of academic prerequisites, GPA requirements, and prior education needed",
    "languageRequirements": "Complete breakdown of language proficiency requirements with specific test scores and levels",
    "costsAndFunding": "Full analysis of tuition fees, semester fees, living costs, and available funding options",
    "careerOutlook": "Job market analysis for this field in Germany, typical career paths, and salary expectations",
    "applicationProcess": "Step-by-step explanation of how to apply, including portals, deadlines, and submission methods",
    "keyHighlights": ["3-5 most important facts about this program that students should know"]
  },
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
  "requiredDocuments": [
    {
      "id": "unique-doc-id",
      "name": "Document name extracted from program requirements",
      "category": "admission|visa|financial",
      "required": true,
      "description": "Brief description of what this document is",
      "programSpecificNotes": "Any specific notes from the program requirements about this document"
    }
  ],
  "applicationSubmission": {
    "method": "uni-assist|direct|other",
    "portalUrl": "URL if available from program data",
    "deadline": "Deadline from program data",
    "instructions": "Step-by-step instructions extracted from program's application channel info"
  },
  "universityInfo": {
    "cityName": "City name from program data",
    "cityDescription": "Brief description of the city",
    "jobProspects": "Job market analysis for this field in this city/region",
    "accommodationInfo": "Housing situation and costs in this city",
    "livingCosts": "Estimated monthly living costs"
  },
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

2. DOCUMENT GATHERING & REQUIRED DOCUMENTS ARRAY:
   - CRITICAL: You MUST ALWAYS return a requiredDocuments array - this is MANDATORY
   - Parse the program's requirements, tab_requirements_registration, and documents_required_list fields
   - Extract SPECIFIC documents mentioned in the program data
   - MINIMUM documents to include (even if not explicitly mentioned):
     * CV/Resume (id: "cv-resume", category: "admission")
     * Motivation Letter (id: "motivation-letter", category: "admission")
     * Academic Transcripts (id: "transcripts", category: "admission")
     * Degree Certificate (id: "degree-certificate", category: "admission")
     * Passport Copy (id: "passport", category: "visa")
     * Language Certificate (id: "language-cert-english" or "language-cert-german", category: "admission")
   - Additional documents based on program requirements: recommendation letters, APS certificate (for China/India/Vietnam/Mongolia), portfolio, etc.
   - Each document MUST have: id, name, category (admission/visa/financial), required (true/false), description, programSpecificNotes
   - If program mentions "certified copies" or "apostille", include that in programSpecificNotes
   - Example document object:
     {
       "id": "cv-resume",
       "name": "Curriculum Vitae (CV)",
       "category": "admission",
       "required": true,
       "description": "A detailed CV following German academic standards, including education, work experience, skills, and achievements.",
       "programSpecificNotes": "Must be in English or German, maximum 2 pages"
     }

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
   - CRITICAL: Extract application submission info from application_channel and application_channel_notes fields
   - Parse registration_deadline_date and registration_deadline_text for deadline info
   - Determine if it's uni-assist, direct university portal, or other method
   - Include step-by-step instructions from the program data
   - Populate applicationSubmission object with method, portalUrl, deadline, and instructions

7. VISA APPLICATION:
   - German Embassy info: https://www.germany.info/
   - Make it in Germany: https://www.make-it-in-germany.com/en/visa-residence/types/studying

8. HEALTH INSURANCE:
   - TK: https://www.tk.de/en
   - AOK: https://en.zuwanderer.aok.de/

9. UNIVERSITY & CITY INFORMATION:
   - CRITICAL: Extract city name from program data
   - Provide brief description of the city (size, character, student-friendliness)
   - Analyze job prospects for this specific field in this city/region
   - Describe accommodation situation (availability, typical costs, student housing options)
   - Estimate monthly living costs for this specific city
   - Populate universityInfo object with all this information

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

CRITICAL JSON REQUIREMENTS:
- Return ONLY valid JSON - no extra text, no explanations, no markdown formatting
- Ensure all strings are properly quoted
- No trailing commas in arrays or objects
- All required fields must be present
- Double-check all brackets and braces are properly closed

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
Currently Located In: ${(userProfile as any).currentCountry || 'Not specified'}
Planned Start Semester: ${(userProfile as any).plannedStart || 'Not specified'}

English Language Level: ${userProfile.englishLevel || 'Not specified'}
English Certificate: ${(userProfile as any).englishCert || 'None'}
English Test Score: ${(userProfile as any).englishScore || userProfile.ieltsScore || userProfile.toeflScore || 'Not provided'}
German Language Level: ${userProfile.germanLevel || 'Not specified'}
German Certificate: ${(userProfile as any).germanCert || 'None'}

Financial Readiness: ${(userProfile as any).financialReady || 'Not specified'}
Academic Background: ${userProfile.academicBackground || 'Not specified'}
Background Summary: ${userProfile.backgroundSummary || 'Not provided'}
Target Degree: ${userProfile.targetDegreeLevel || 'Not specified'}
Has Scholarship: ${userProfile.hasScholarship ? 'Yes' : 'No'}
Max Tuition Budget: ${userProfile.maxTuitionEur ? '€' + userProfile.maxTuitionEur : 'Not specified'}

Additional Notes from User: ${(userProfile as any).additionalNotes || 'None'}
` : 'No user profile provided - assume international student needing all steps'}

INSTRUCTIONS:
1. Compare the user profile against program requirements
2. Calculate a profile match score (0-100)
3. Identify what the user already has vs what they need
4. Create personalized steps - mark steps as autoCompleted if user already meets requirement
5. Use ONLY the verified URLs from your instructions
6. Replace {PROGRAM_ID} with: ${program.id}
7. IMPORTANT: Use the user's nationality, current country, planned start semester, and financial readiness to create SPECIFIC, TIME-BOUND steps. For example: "As a [nationality] student in [country], you should apply for APS by [date] to meet the [planned start] deadline."
8. If the user has a planned start semester, reverse-engineer ALL deadlines from that date.
9. Tailor visa advice, document legalization, and embassy information to the user's nationality and current country.

Generate a comprehensive, personalized application plan.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 50000);

    let response;
    try {
      response = await fetch(OPENROUTER_URL, {
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
          max_tokens: 4000
        }),
        signal: controller.signal,
        cache: 'no-store'
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter error ${response.status}:`, errorText);
      throw new Error('AI service unavailable');
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || '';
    
    console.log('[OpenRouter] Raw AI response:', text.substring(0, 200));
    
    // Extract and clean JSON from response
    let jsonText = text;
    
    // Try to find JSON object in the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
    
    // Clean common JSON formatting issues
    jsonText = jsonText
      .replace(/,\s*}/g, '}')  // Remove trailing commas before closing braces
      .replace(/,\s*]/g, ']')  // Remove trailing commas before closing brackets
      .replace(/:\s*,/g, ': null,')  // Fix empty values
      .replace(/:\s*}/g, ': null}')  // Fix missing values at end
      .replace(/:\s*]/g, ': null]');  // Fix missing values in arrays

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
      console.log('[OpenRouter] Successfully parsed JSON');
    } catch (parseError) {
      console.error('[OpenRouter] JSON parse error:', parseError);
      console.error('[OpenRouter] Attempted JSON text:', jsonText.substring(0, 500));
      
      // Try a more aggressive cleanup
      try {
        // Remove any non-JSON content that might be wrapped around
        const cleanJson = jsonText.replace(/^[^{]*({.*})[^}]*$/, '$1');
        parsed = JSON.parse(cleanJson);
        console.log('[OpenRouter] Successfully parsed JSON after aggressive cleanup');
      } catch (secondError) {
        console.error('[OpenRouter] Second JSON parse attempt failed:', secondError);
        console.error('[OpenRouter] Full AI response for debugging:', text);
        throw new Error('AI response contains invalid JSON format');
      }
    }
    
    // Validate required fields
    if (!parsed.steps || !Array.isArray(parsed.steps)) {
      console.error('[OpenRouter] Missing or invalid steps in response:', parsed);
      throw new Error('AI response missing required steps array');
    }
    
    if (!parsed.profileMatch) {
      console.error('[OpenRouter] Missing profileMatch in response:', parsed);
      throw new Error('AI response missing required profileMatch');
    }

    // Ensure requiredDocuments array exists with minimum documents
    if (!parsed.requiredDocuments || !Array.isArray(parsed.requiredDocuments) || parsed.requiredDocuments.length === 0) {
      console.warn('[OpenRouter] Missing or empty requiredDocuments, adding default documents');
      parsed.requiredDocuments = [
        {
          id: "cv-resume",
          name: "Curriculum Vitae (CV)",
          category: "admission",
          required: true,
          description: "A detailed CV following German academic standards, including education, work experience, skills, and achievements.",
          programSpecificNotes: "Must be in English or German, typically 1-2 pages"
        },
        {
          id: "motivation-letter",
          name: "Motivation Letter",
          category: "admission",
          required: true,
          description: "A letter explaining your motivation for this program, your academic background, career goals, and why you're a good fit.",
          programSpecificNotes: "Usually 1 page, addressed to the admissions committee"
        },
        {
          id: "transcripts",
          name: "Academic Transcripts",
          category: "admission",
          required: true,
          description: "Official transcripts from all universities/colleges attended, showing courses taken and grades received.",
          programSpecificNotes: "Must be certified copies or officially translated if not in English/German"
        },
        {
          id: "degree-certificate",
          name: "Degree Certificate",
          category: "admission",
          required: true,
          description: "Your bachelor's degree certificate (for master's programs) or high school diploma (for bachelor's programs).",
          programSpecificNotes: "Certified copy required, with official translation if necessary"
        },
        {
          id: "language-cert-english",
          name: "English Language Certificate",
          category: "admission",
          required: true,
          description: "Proof of English proficiency (IELTS, TOEFL, Cambridge, etc.) if the program is taught in English.",
          programSpecificNotes: "Check specific minimum score requirements for this program"
        },
        {
          id: "passport",
          name: "Passport Copy",
          category: "visa",
          required: true,
          description: "A clear copy of your valid passport, showing personal information and validity dates.",
          programSpecificNotes: "Passport must be valid for at least 6 months beyond your intended stay"
        },
        {
          id: "blocked-account",
          name: "Blocked Account Confirmation",
          category: "financial",
          required: true,
          description: "Proof of blocked account (Sperrkonto) with €11,904 for one year of living expenses in Germany.",
          programSpecificNotes: "Required for student visa application"
        }
      ];
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
    
    // Check subscription tier and plan limits
    const session = await auth();
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          subscription: {
            select: { planType: true }
          }
        }
      });

      const tier = user?.subscription?.planType || 'free';
      
      // Check plan count for free users - only count plans that still exist in shortlist
      if (tier === 'free') {
        // Get user's current shortlist
        const shortlistItems = await prisma.shortlist.findMany({
          where: { userId: session.user.id },
          select: { programId: true }
        });
        
        const shortlistedProgramIds = shortlistItems.map(item => item.programId);
        
        // Count only plans for programs that are still in shortlist
        const planCount = await prisma.applicationPlan.count({
          where: { 
            userId: session.user.id,
            programId: { in: shortlistedProgramIds }
          }
        });

        if (planCount >= 3) {
          return NextResponse.json({
            error: 'Free plan limit reached',
            message: 'You have reached the maximum of 3 application plans on the free tier. Please upgrade to generate more plans.',
            limit: 3,
            current: planCount,
            tier: 'free'
          }, { status: 403 });
        }
      }
    }
    
    // ALWAYS create a guaranteed fallback plan first
    const fallbackPlan = createGuaranteedPlan(program, userProfile);
    
    let plan = fallbackPlan;
    
    // Try AI enhancement, but don't fail if it doesn't work
    try {
      const aiPlan = await callOpenRouter(program, userProfile);
      if (aiPlan && aiPlan.steps && Array.isArray(aiPlan.steps) && aiPlan.steps.length > 0) {
        console.log(`[Application Plan ${requestId}] AI plan generated successfully, using AI plan`);
        plan = aiPlan;
      } else {
        console.log(`[Application Plan ${requestId}] AI plan invalid, using fallback plan`);
      }
    } catch (aiError) {
      console.error(`[Application Plan ${requestId}] AI generation failed, using fallback plan:`, aiError);
      // Continue with fallback plan - no error thrown
    }
    
    console.log(`[Application Plan ${requestId}] Plan ready with ${plan.steps?.length || 0} steps`);
    
    // Save to database if user is authenticated
    if (session?.user?.id) {
      try {
        // Ensure user exists first
        let user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.name || '',
              password: '',
            }
          });
        }
        
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

// GUARANTEED PLAN - This ALWAYS works, no AI needed
function createGuaranteedPlan(program: any, userProfile?: any) {
  const programName = program.program_name || 'This Program';
  const university = program.university || 'the University';
  const deadline = program.registration_deadline_date || program.registration_deadline_text || 'Check university website';
  
  // Determine language requirements
  const needsEnglish = program.language_proficiency_required !== false;
  const needsGerman = program.german_min_level && program.german_min_level !== 'Not required';
  
  // Check user's language status
  const hasEnglish = userProfile?.englishLevel || userProfile?.ieltsScore || userProfile?.toeflScore;
  const hasGerman = userProfile?.germanLevel;
  
  const steps = [
    {
      id: 'step-1-requirements',
      title: 'Review Program Requirements',
      description: `Check all admission requirements for ${programName} at ${university}. Make sure you understand what documents and qualifications are needed.`,
      completed: false,
      priority: 'high' as const,
      category: 'application' as const,
    },
    {
      id: 'step-2-language',
      title: 'Prepare Language Certificates',
      description: needsEnglish 
        ? 'Obtain English proficiency certificate (IELTS, TOEFL, or equivalent). Most German universities require IELTS 6.0-6.5 or TOEFL 80-90.'
        : 'Check if German language proficiency is required for this program.',
      completed: hasEnglish ? true : false,
      autoCompleted: hasEnglish ? true : false,
      autoCompletedReason: hasEnglish ? 'Language proficiency already provided in profile' : undefined,
      priority: 'high' as const,
      category: 'language' as const,
    },
    {
      id: 'step-3-documents',
      title: 'Gather Required Documents',
      description: 'Collect all required documents: academic transcripts, degree certificates, CV, motivation letter, and passport copy.',
      completed: false,
      priority: 'high' as const,
      category: 'documents' as const,
    },
    {
      id: 'step-4-cv',
      title: 'Create Your CV',
      description: 'Prepare a professional CV following German academic standards. Include education, work experience, skills, and achievements.',
      completed: false,
      priority: 'high' as const,
      category: 'documents' as const,
    },
    {
      id: 'step-5-motivation',
      title: 'Write Motivation Letter',
      description: `Write a compelling motivation letter explaining why you want to study ${programName} and how it fits your career goals.`,
      completed: false,
      priority: 'high' as const,
      category: 'documents' as const,
    },
    {
      id: 'step-6-submit',
      title: 'Submit Application',
      description: `Submit your complete application before the deadline: ${deadline}. Apply through the university portal or uni-assist.`,
      completed: false,
      priority: 'high' as const,
      category: 'application' as const,
    },
    {
      id: 'step-7-financial',
      title: 'Prepare Financial Documents',
      description: 'Open a blocked account (Sperrkonto) with €11,904 for living expenses. This is required for your student visa.',
      completed: false,
      priority: 'medium' as const,
      category: 'financial' as const,
    },
    {
      id: 'step-8-visa',
      title: 'Apply for Student Visa',
      description: 'After receiving your admission letter, apply for a German student visa at your local German embassy.',
      completed: false,
      priority: 'medium' as const,
      category: 'visa' as const,
    },
  ];

  const requiredDocuments = [
    {
      id: 'cv-resume',
      name: 'Curriculum Vitae (CV)',
      category: 'admission' as const,
      required: true,
      description: 'A detailed CV following German academic standards, including education, work experience, skills, and achievements.',
      programSpecificNotes: 'Must be in English or German, typically 1-2 pages'
    },
    {
      id: 'motivation-letter',
      name: 'Motivation Letter',
      category: 'admission' as const,
      required: true,
      description: 'A letter explaining your motivation for this program, your academic background, career goals, and why you are a good fit.',
      programSpecificNotes: 'Usually 1-2 pages, addressed to the admissions committee'
    },
    {
      id: 'transcripts',
      name: 'Academic Transcripts',
      category: 'admission' as const,
      required: true,
      description: 'Official transcripts from all universities/colleges attended, showing courses taken and grades received.',
      programSpecificNotes: 'Must be certified copies or officially translated if not in English/German'
    },
    {
      id: 'degree-certificate',
      name: 'Degree Certificate',
      category: 'admission' as const,
      required: true,
      description: 'Your degree certificate proving completion of your previous studies.',
      programSpecificNotes: 'Certified copy required, with official translation if necessary'
    },
    {
      id: 'language-certificate',
      name: 'Language Proficiency Certificate',
      category: 'admission' as const,
      required: needsEnglish,
      description: 'Official language proficiency certificate (IELTS, TOEFL, TestDaF, etc.).',
      programSpecificNotes: program.ielts_min_score ? `Minimum IELTS: ${program.ielts_min_score}` : 'Check specific requirements'
    },
    {
      id: 'passport-copy',
      name: 'Passport Copy',
      category: 'visa' as const,
      required: true,
      description: 'A clear copy of your valid passport showing personal information and validity dates.',
      programSpecificNotes: 'Passport must be valid for at least 6 months beyond your intended stay'
    },
    {
      id: 'blocked-account',
      name: 'Blocked Account (Sperrkonto)',
      category: 'financial' as const,
      required: true,
      description: 'Proof of blocked account with €11,904 for one year of living expenses in Germany.',
      programSpecificNotes: 'Required for student visa application. Open with Fintiba or Expatrio.'
    },
    {
      id: 'health-insurance',
      name: 'Health Insurance',
      category: 'visa' as const,
      required: true,
      description: 'Proof of health insurance coverage valid in Germany.',
      programSpecificNotes: 'Get statutory health insurance (TK, AOK) or private insurance'
    },
  ];

  // Calculate match score based on user profile
  let score = 50; // Base score
  if (userProfile) {
    if (hasEnglish) score += 20;
    if (hasGerman) score += 10;
    if (userProfile.academicBackground) score += 10;
    if (userProfile.nationality) score += 5;
    if (userProfile.fullName) score += 5;
  }
  score = Math.min(score, 100);

  return {
    overview: `Application plan for ${programName} at ${university}. Follow these steps to complete your application successfully. Deadline: ${deadline}`,
    estimatedTimeline: '2-4 months',
    blockers: [],
    steps,
    requiredDocuments,
    applicationSubmission: {
      method: program.application_channel || 'University Portal',
      portalUrl: program.detail_url || undefined,
      deadline: deadline,
      instructions: program.application_channel_notes || 'Submit your application through the university\'s online portal. Make sure all documents are uploaded before the deadline.'
    },
    profileMatch: {
      score,
      summary: userProfile 
        ? `Based on your profile, you have a ${score}% match with this program. ${score >= 70 ? 'You meet most requirements!' : 'Complete your profile and documents to improve your chances.'}`
        : 'Complete your profile to get a personalized compatibility analysis.',
      strengths: userProfile ? [
        hasEnglish ? 'Language proficiency verified' : null,
        userProfile.academicBackground ? 'Academic background provided' : null,
      ].filter(Boolean) : [],
      gaps: userProfile ? [
        !hasEnglish ? 'Language certificate needed' : null,
        !userProfile.academicBackground ? 'Academic background not specified' : null,
      ].filter(Boolean) : ['Profile information needed for detailed analysis'],
      recommendations: [
        'Prepare all required documents early',
        'Check application deadlines carefully',
        'Start your motivation letter with plenty of time'
      ]
    }
  };
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.applicationPlan.deleteMany({
      where: {
        userId: session.user.id,
        programId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete application plan error:', error);
    return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 });
  }
}
