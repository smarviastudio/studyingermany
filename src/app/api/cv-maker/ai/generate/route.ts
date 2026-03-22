import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { checkUsageLimit, incrementUsage } from '@/lib/usage-tracker';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-4o-mini';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.id) {
      const { allowed, current, limit } = await checkUsageLimit(session.user.id, 'cv');
      if (!allowed) {
        return NextResponse.json({
          error: 'Usage limit reached',
          upgradeRequired: true,
          current,
          limit,
          message: `You've used ${current}/${limit} free CV AI generations this month.`,
        }, { status: 402 });
      }
    }

    const { name, jobTitle, years, skills, background, hobbies, programId } = await request.json();
    
    if (!name || !jobTitle) {
      return NextResponse.json({ message: 'Name and job title are required' }, { status: 400 });
    }

    // Fetch program details if programId is provided
    let programDetails = null;
    if (programId) {
      try {
        const programRes = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/programs/${programId}`);
        if (programRes.ok) {
          const data = await programRes.json();
          programDetails = data.program;
        }
      } catch (err) {
        console.error('Failed to fetch program details:', err);
      }
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY not configured');
      return NextResponse.json({ message: 'AI service not configured. Please set OPENROUTER_API_KEY in .env.local' }, { status: 500 });
    }
    
    let programContext = '';
    if (programDetails) {
      programContext = `

TARGET PROGRAM INFORMATION:
The applicant is applying to: ${programDetails.program_name}
University: ${programDetails.university}
Degree Level: ${programDetails.degree_level || 'Not specified'}
Field of Study: ${programDetails.subject_area || 'Not specified'}
Language Requirements: ${programDetails.language_proficiency_required || 'Not specified'}
Academic Requirements: ${programDetails.academic_background_requirements || 'Not specified'}

IMPORTANT: Tailor the CV content to align with this specific program. Highlight relevant skills, experiences, and achievements that match the program's requirements and field of study. Make the professional summary emphasize the applicant's fit for this program.`;
    }

    const prompt = `You are a professional CV writer specializing in German university applications. Generate comprehensive CV content based on the following information:

Name: ${name}
Job Title/Target Role: ${jobTitle}
Years of Experience: ${years || 'Not specified'}
Skills: ${skills || 'Not specified'}
Background: ${background || 'Not specified'}
Hobbies: ${hobbies || 'Not specified'}${programContext}

Generate a complete CV with the following sections in JSON format:
{
  "summary": "A compelling 2-3 sentence professional summary${programDetails ? ' that emphasizes fit for the target program' : ''}",
  "experience": [
    {
      "role": "Job title",
      "company": "Company name",
      "period": "YYYY — YYYY",
      "description": "Brief role description",
      "bullets": ["Achievement 1", "Achievement 2", "Achievement 3"]
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
  "education": [
    {
      "degree": "Degree and Field",
      "school": "University Name",
      "period": "YYYY — YYYY"
    }
  ]
}

Make the content professional, achievement-focused${programDetails ? ', and specifically tailored to demonstrate qualifications for the target program' : ', and tailored to the job title'}. ${programDetails ? 'Emphasize skills and experiences relevant to ' + programDetails.subject_area + ' and ' + programDetails.degree_level + ' studies.' : ''} Generate 2-3 experience entries and 1-2 education entries. Only return valid JSON, no additional text.`;

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    try {
      console.log('[CV AI] Calling OpenRouter with model:', MODEL);
      const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://daad-ai-consultant.local',
          'X-Title': 'DAAD AI Consultant - CV Maker'
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: 'You are a professional CV writer. Return only valid JSON, no markdown, no extra text.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000
        }),
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[CV AI] OpenRouter error:', response.status, errorText);
        return NextResponse.json({ 
          message: `AI service error (${response.status}). Please try again.` 
        }, { status: 500 });
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('[CV AI] Invalid response structure:', JSON.stringify(data).slice(0, 500));
        return NextResponse.json({ message: 'Invalid AI response structure' }, { status: 500 });
      }
      
      const content = data.choices[0].message.content;
      console.log('[CV AI] Got response, length:', content?.length);
      
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('[CV AI] No JSON found in response:', content?.slice(0, 300));
        return NextResponse.json({ message: 'Invalid AI response format' }, { status: 500 });
      }
      
      const cvData = JSON.parse(jsonMatch[0]);
      console.log('[CV AI] Successfully parsed CV data');
      const session2 = await auth();
      if (session2?.user?.id) {
        await incrementUsage(session2.user.id, 'cv');
      }
      return NextResponse.json(cvData);
    } finally {
      delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    }
  } catch (error) {
    console.error('[CV AI] Generation error:', error);
    return NextResponse.json({ 
      message: 'AI generation failed. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
