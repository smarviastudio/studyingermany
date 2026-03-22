import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-4o-mini';

const SYSTEM_PROMPT = `You are an expert German university application advisor. You will receive a list of shortlisted programs and a user profile. Generate a comprehensive, personalized application roadmap covering all programs.

Return ONLY valid JSON with this exact structure:

{
  "timeline": [
    {
      "id": "tl-1",
      "programId": "program-id",
      "programName": "Program Name",
      "university": "University Name",
      "event": "Application deadline / Document submission / APS booking / Visa appointment",
      "date": "YYYY-MM-DD or estimated month like 2025-07",
      "description": "What needs to happen by this date",
      "category": "application|documents|aps|visa|financial|language",
      "urgent": false
    }
  ],
  "documents": {
    "shared": [
      {
        "id": "doc-1",
        "name": "Document name",
        "description": "What this document is and how to get it",
        "category": "academic|language|financial|identity|visa",
        "required": true,
        "nationalitySpecific": false,
        "tips": "Specific advice for obtaining this document"
      }
    ],
    "perProgram": [
      {
        "programId": "program-id",
        "programName": "Program Name",
        "university": "University Name",
        "documents": [
          {
            "id": "pdoc-1",
            "name": "Program-specific document",
            "description": "Why this program needs this",
            "required": true,
            "tips": "How to prepare this"
          }
        ]
      }
    ]
  },
  "financial": {
    "blockedAccount": {
      "amount": 11904,
      "monthlyAllowance": 992,
      "deadline": "Open at least 6-8 weeks before visa appointment",
      "providers": [
        { "name": "Fintiba", "url": "https://www.fintiba.com/", "notes": "Most popular, fast processing" },
        { "name": "Expatrio", "url": "https://www.expatrio.com/", "notes": "Alternative option" }
      ]
    },
    "healthInsurance": {
      "monthlyCost": "110-120",
      "providers": [
        { "name": "TK", "url": "https://www.tk.de/en", "notes": "Recommended for students" },
        { "name": "AOK", "url": "https://en.zuwanderer.aok.de/", "notes": "Good coverage" }
      ],
      "startDate": "Must be active from your arrival date in Germany"
    },
    "livingCosts": [
      {
        "city": "City name",
        "monthlyEstimate": "850-1200",
        "breakdown": {
          "rent": "400-700",
          "food": "200-250",
          "transport": "30-70",
          "misc": "100-150"
        }
      }
    ],
    "scholarships": [
      {
        "name": "Scholarship name",
        "deadline": "YYYY-MM or descriptive",
        "amount": "Amount per month or total",
        "url": "URL",
        "eligibility": "Brief eligibility criteria",
        "applicablePrograms": ["program-id-1"]
      }
    ]
  },
  "language": [
    {
      "programId": "program-id",
      "programName": "Program Name",
      "university": "University Name",
      "languageRequired": "English|German|Both",
      "tests": [
        {
          "language": "English",
          "testName": "IELTS",
          "minimumScore": "6.5",
          "userCurrentLevel": "Description of user's current level",
          "status": "met|partial|not_met|unknown",
          "prepMonthsNeeded": 3,
          "bookByDate": "YYYY-MM",
          "milestones": [
            { "month": 1, "task": "Description of what to do" },
            { "month": 2, "task": "Description of what to do" },
            { "month": 3, "task": "Take the test" }
          ],
          "resources": [
            { "name": "Resource name", "url": "URL" }
          ]
        }
      ]
    }
  ],
  "weeklyTasks": [
    {
      "id": "week-1",
      "weekNumber": 1,
      "monthLabel": "Month 1",
      "weekLabel": "Week 1",
      "tasks": [
        {
          "id": "task-1-1",
          "task": "Description of what to do",
          "category": "documents|application|financial|language|visa",
          "programId": "all or specific program-id",
          "completed": false
        }
      ]
    }
  ]
}

CRITICAL RULES:
1. Timeline: Generate reverse-engineered deadlines for EACH shortlisted program. Include application deadline, document submission cutoff, APS certificate booking (for Indian/Pakistani/Chinese students), and visa appointment window. Sort chronologically.

2. Documents: Split into "shared" (needed for all programs like passport, CV, blocked account proof) and "perProgram" (program-specific requirements like portfolio, specific transcripts format). For users from India/Pakistan/China/Vietnam, ALWAYS include APS certificate.

3. Financial: Use ONLY verified URLs. Blocked account is €11,904/year (€992/month) as of 2024. Include city-specific living costs for cities where shortlisted programs are located. List relevant scholarships (DAAD, Deutschlandstipendium, etc.) with real deadlines.

4. Language: For each program, identify the language requirements. Compare with user's current level. Suggest which test to take, preparation timeline, booking deadlines, and monthly milestones. Use ONLY verified URLs:
   - IELTS: https://www.ielts.org/
   - TOEFL: https://www.ets.org/toefl
   - TestDaF: https://www.testdaf.de/en/
   - Goethe Institut: https://www.goethe.de/en/spr/kup.html
   - DW Learn German: https://learngerman.dw.com/en/overview

5. Weekly Tasks: Create a realistic 6-18 month task board. Break the entire process into weekly tasks. Each task should be specific and actionable. Group by month. Cover ALL aspects: documents, applications, finances, language, visa.

6. Nationality-specific advice: If user is from India/Pakistan/China/Vietnam/Mongolia, include APS certificate requirements. For non-EU students, always include visa steps.

7. Return ONLY valid JSON - no extra text, no markdown, no code blocks.

CRITICAL JSON RULES:
- All string values must be properly escaped
- No trailing commas in arrays or objects
- All quotes must be properly closed
- Arrays must not have syntax errors
- Return ONLY the JSON object, nothing else`;

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's shortlisted programs
    const shortlistItems = await prisma.shortlist.findMany({
      where: { userId: session.user.id },
    });

    if (shortlistItems.length === 0) {
      return NextResponse.json({ 
        error: 'No programs shortlisted', 
        message: 'Please shortlist at least one program before generating a plan.' 
      }, { status: 400 });
    }

    // Fetch user profile
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    });

    // Fetch program details for each shortlisted program
    const programDetails = await Promise.all(
      shortlistItems.map(async (item) => {
        try {
          const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
          const res = await fetch(`${baseUrl}/api/programs/${item.programId}`);
          if (res.ok) {
            const data = await res.json();
            return data.program;
          }
        } catch (err) {
          console.error(`Failed to fetch program ${item.programId}:`, err);
        }
        // Return basic info from shortlist if API fails
        return {
          id: item.programId,
          program_name: item.programName,
          university: item.university,
        };
      })
    );

    // Build the AI prompt
    const programsText = programDetails.map((p, i) => `
PROGRAM ${i + 1}:
- ID: ${p.id}
- Name: ${p.program_name}
- University: ${p.university}
- Degree Level: ${p.degree_level || 'Not specified'}
- City: ${p.city || 'Not specified'}
- Language of Instruction: ${p.languages_array?.join(', ') || p.language_of_instruction || 'Not specified'}
- Intake: ${p.beginning_normalized || 'Not specified'}
- Duration: ${p.programme_duration || (p.duration_months ? `${p.duration_months} months` : 'Not specified')}
- Tuition: ${p.is_free ? 'No tuition' : (p.tuition_fee_number ? `€${p.tuition_fee_number}` : 'Not specified')}
- Application Deadline: ${p.registration_deadline_text || p.registration_deadline_date || 'Check university website'}
- Application Channel: ${p.application_channel || 'Not specified'} ${p.application_channel_notes || ''}
- Requirements: ${p.tab_requirements_registration || p.requirements || 'Standard requirements'}
- Language Requirements: IELTS min ${p.ielts_min_score || 'N/A'}, TOEFL min ${p.toefl_min_score || 'N/A'}, German min ${p.german_min_level || 'N/A'}
- Academic Background: ${p.academic_background_requirements || 'Not specified'}
- Documents: ${p.documents_required_list || 'Standard documents'}
`).join('\n');

    const userProfileText = userProfile ? `
USER PROFILE:
- Name: ${userProfile.fullName || 'Not provided'}
- Nationality: ${userProfile.nationality || 'Not specified'}
- German Level: ${userProfile.germanLevel || 'Not specified'}
- English Level: ${userProfile.englishLevel || 'Not specified'}
- IELTS Score: ${userProfile.ieltsScore || 'Not taken'}
- TOEFL Score: ${userProfile.toeflScore || 'Not taken'}
- Academic Background: ${userProfile.academicBackground || 'Not specified'}
- Background Summary: ${userProfile.backgroundSummary || 'Not provided'}
- Target Degree: ${userProfile.targetDegreeLevel || 'Not specified'}
- Has Scholarship: ${userProfile.hasScholarship ? 'Yes' : 'No'}
- Budget: ${userProfile.maxTuitionEur ? `€${userProfile.maxTuitionEur}` : 'Not specified'}
- Desired Intake: ${userProfile.desiredIntake || 'Not specified'}
- Career Goals: ${userProfile.careerGoals || 'Not specified'}
` : 'No user profile available - assume international non-EU student needing all steps.';

    const userPrompt = `Generate a comprehensive application roadmap for this student.

${userProfileText}

SHORTLISTED PROGRAMS (${programDetails.length}):
${programsText}

Today's date: ${new Date().toISOString().split('T')[0]}

Generate the full plan with all 5 sections: timeline, documents, financial, language, weeklyTasks.
For the weekly task board, create tasks for the next 6 months (24 weeks), with 2-4 tasks per week.
Sort timeline events chronologically.
Be specific and actionable.`;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
    }

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    try {
      console.log('[Plan AI] Generating comprehensive plan for', programDetails.length, 'programs');
      
      const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
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
          max_tokens: 8000
        }),
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Plan AI] OpenRouter error:', response.status, errorText);
        return NextResponse.json({ error: 'AI service error' }, { status: 500 });
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content || '';
      
      console.log('[Plan AI] Response length:', content.length);

      // Extract JSON - try to find the outermost JSON object
      let jsonText = content.trim();
      
      // Remove markdown code blocks if present
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }
      
      // Find JSON object boundaries
      const firstBrace = jsonText.indexOf('{');
      const lastBrace = jsonText.lastIndexOf('}');
      
      if (firstBrace === -1 || lastBrace === -1) {
        console.error('[Plan AI] No JSON found in response');
        console.error('[Plan AI] Content preview:', content.substring(0, 500));
        return NextResponse.json({ error: 'Invalid AI response - no JSON found' }, { status: 500 });
      }
      
      jsonText = jsonText.substring(firstBrace, lastBrace + 1);
      
      // Clean common JSON issues
      jsonText = jsonText
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']')
        .replace(/\n/g, ' ')
        .replace(/\r/g, '')
        .replace(/\t/g, ' ');
      
      let plan;
      try {
        plan = JSON.parse(jsonText);
      } catch (parseError: any) {
        console.error('[Plan AI] JSON parse error:', parseError.message);
        console.error('[Plan AI] Failed JSON preview:', jsonText.substring(0, 1000));
        return NextResponse.json({ 
          error: 'Failed to parse AI response', 
          details: parseError.message 
        }, { status: 500 });
      }
      
      console.log('[Plan AI] Parsed plan successfully');

      // Validate structure
      if (!plan.timeline || !plan.documents || !plan.financial || !plan.language || !plan.weeklyTasks) {
        console.error('[Plan AI] Missing required sections');
        return NextResponse.json({ error: 'Incomplete plan generated' }, { status: 500 });
      }

      // Save to database using ApplicationPlan model with special "master-plan" programId
      await prisma.applicationPlan.upsert({
        where: {
          userId_programId: {
            userId: session.user.id,
            programId: 'master-plan',
          },
        },
        update: {
          planData: JSON.stringify(plan),
          checklistState: JSON.stringify({}),
          updatedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          programId: 'master-plan',
          programName: 'Comprehensive Application Plan',
          university: `${programDetails.length} programs`,
          planData: JSON.stringify(plan),
          checklistState: JSON.stringify({}),
        },
      });

      console.log('[Plan AI] Saved master plan to database');

      return NextResponse.json({
        plan,
        programCount: programDetails.length,
        generatedAt: new Date().toISOString(),
      });

    } finally {
      delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    }

  } catch (error) {
    console.error('[Plan AI] Error:', error);
    return NextResponse.json({
      error: 'Failed to generate plan',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
