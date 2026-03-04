import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import https from 'https';
import { csvDataProvider } from '@/lib/data/CSVDataProvider';
import { SearchFiltersSchema } from '@/lib/types';

const CourseFinderRequestSchema = z.object({
  query: z.string().min(5, 'Please describe what you want to study'),
  limit: z.number().min(1).max(20).optional(),
  timestamp: z.number().optional()
});

type CourseFinderAIResponse = {
  query_text?: string;
  filters?: z.infer<typeof SearchFiltersSchema>;
  reasoning?: string;
  excluded_subjects?: string[];
  is_non_course_query?: boolean;
};

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-4o-mini';

const SYSTEM_PROMPT = `You help international students find German university programs.

FIRST: Determine if the user is searching for a university PROGRAM/COURSE, or asking about something else (e.g. learning German, visa, accommodation, scholarships, living costs, etc.).

If the query is NOT about finding a university program, return:
{
  "is_non_course_query": true,
  "reasoning": "A helpful 1-2 sentence answer or suggestion for the user's question. For example, if they ask about learning German, suggest resources like Goethe-Institut, DW Learn German, Duolingo, etc. Be specific and helpful."
}

If the query IS about finding a university program, return:
{
  "query_text": "concise search keywords",
  "filters": {
    "degree_level": "bachelor|master|phd|any",
    "subjects": ["data science", "business"],
    "language": "english|german|either",
    "cities": ["berlin", "munich"],
    "max_tuition": 0,
    "intake_term": "winter|summer|any"
  },
  "excluded_subjects": ["agriculture", "medicine"],
  "reasoning": "short explanation"
}

IMPORTANT RULES:
1. ONLY extract subjects that the user explicitly mentions. Do NOT add related subjects.
2. If user says "psychology", subjects should be ["psychology"] NOT ["psychology", "sociology"].
3. If user says "no X" or "not X" or "exclude X", add X to excluded_subjects array.
4. Be very specific with subject matching - only include what user actually requested.
5. Tuition is euros per year.
6. Queries about "learning German", "German language courses", "visa", "accommodation", "scholarships", "blocked account", "health insurance", "living in Germany" are NON-course queries.

Do not include any text outside of JSON.`;

function stripCodeFences(text: string) {
  if (!text) return text;
  const trimmed = text.trim();
  if (trimmed.startsWith('```')) {
    const lines = trimmed.split('\n');
    lines.shift();
    if (lines[lines.length - 1].trim() === '```') {
      lines.pop();
    }
    return lines.join('\n');
  }
  return trimmed;
}

async function callOpenRouter(query: string): Promise<CourseFinderAIResponse | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.warn('OPENROUTER_API_KEY missing. Falling back to basic search.');
    return null;
  }

  // Temporarily disable SSL verification for development
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://daad-ai-consultant.local',
        'X-Title': 'DAAD AI Course Finder'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: query }
        ],
        temperature: 0.4,
        max_tokens: 500
      }),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter error ${response.status}:`, errorText);
      console.error(`Failed model: ${MODEL}`);
      return null;
    }

    const data = await response.json();
    const text = stripCodeFences(data?.choices?.[0]?.message?.content || '');
    if (!text) return null;

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Failed to parse OpenRouter JSON', error, text);
      return null;
    }
  } finally {
    // Re-enable SSL verification
    delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  }
}

export async function POST(request: NextRequest) {
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  try {
    console.log(`[Course Finder ${requestId}] NEW REQUEST received`);
    const body = await request.json();
    console.log(`[Course Finder ${requestId}] Request body:`, JSON.stringify(body));
    
    const { query, limit = 8, timestamp } = CourseFinderRequestSchema.parse(body);
    console.log(`[Course Finder ${requestId}] Parsed query: "${query}", limit: ${limit}, timestamp: ${timestamp}`);

    console.log(`[Course Finder ${requestId}] Calling OpenRouter with fresh query...`);
    const aiResult = await callOpenRouter(query);
    console.log(`[Course Finder ${requestId}] AI result:`, JSON.stringify(aiResult));

    // Handle non-course queries (e.g. "german learning", "visa info")
    if (aiResult?.is_non_course_query) {
      console.log(`[Course Finder ${requestId}] Non-course query detected, returning helpful message`);
      return NextResponse.json({
        query,
        filters: {},
        reasoning: aiResult.reasoning || 'This doesn\'t seem to be a course search. Try describing the program you\'re looking for.',
        programs: [],
        is_non_course_query: true,
        request_id: requestId
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    // Fallback: If AI fails, extract basic filters from query text
    let filters = {};
    let queryText = query;
    let reasoning = null;
    let excludedSubjects: string[] = [];
    
    if (aiResult) {
      filters = aiResult.filters ? SearchFiltersSchema.parse(aiResult.filters) : {};
      queryText = aiResult.query_text?.trim() || query;
      reasoning = aiResult.reasoning || null;
      excludedSubjects = aiResult.excluded_subjects || [];
    } else {
      // Manual fallback extraction
      console.log(`[Course Finder ${requestId}] AI failed, using manual extraction`);
      const queryLower = query.toLowerCase();
      
      // Extract degree level
      if (queryLower.includes('bachelor')) filters = { ...filters, degree_level: 'bachelor' };
      else if (queryLower.includes('master')) filters = { ...filters, degree_level: 'master' };
      else if (queryLower.includes('phd') || queryLower.includes('doctorate')) filters = { ...filters, degree_level: 'phd' };
      
      // Extract cities
      const cities = [];
      if (queryLower.includes('munich') || queryLower.includes('münchen')) cities.push('Munich');
      if (queryLower.includes('berlin')) cities.push('Berlin');
      if (queryLower.includes('hamburg')) cities.push('Hamburg');
      if (cities.length > 0) filters = { ...filters, cities };
      
      // Extract language
      if (queryLower.includes('english')) filters = { ...filters, language: 'english' };
      else if (queryLower.includes('german')) filters = { ...filters, language: 'german' };
      
      // Extract intake
      if (queryLower.includes('winter')) filters = { ...filters, intake_term: 'winter' };
      else if (queryLower.includes('summer')) filters = { ...filters, intake_term: 'summer' };
      
      reasoning = 'Manual extraction (AI unavailable)';
    }
    
    console.log(`\n========== [Course Finder ${requestId}] ==========`);
    console.log(`Original Query: "${query}"`);
    console.log(`AI Extracted Filters:`, JSON.stringify(filters, null, 2));
    console.log(`AI Query Text: "${queryText}"`);
    console.log(`AI Reasoning: ${reasoning}`);
    console.log(`Excluded Subjects:`, JSON.stringify(excludedSubjects));
    console.log(`================================================\n`);

    console.log(`[Course Finder ${requestId}] Searching with filters...`);
    // Search for more initially to account for filtering
    const searchLimit = excludedSubjects.length > 0 ? limit * 3 : limit * 2;
    let programs = await csvDataProvider.searchPrograms(filters, queryText, searchLimit);
    console.log(`[Course Finder ${requestId}] Found ${programs.length} programs after CSV filtering`);
    if (programs.length > 0) {
      console.log(`[Course Finder ${requestId}] Sample cities:`, programs.slice(0, 5).map(p => p.city).join(', '));
      console.log(`[Course Finder ${requestId}] Sample degrees:`, programs.slice(0, 5).map(p => p.degree_level).join(', '));
    }

    // Filter out excluded subjects
    if (excludedSubjects.length > 0) {
      programs = programs.filter(program => {
        const programName = program.program_name.toLowerCase();
        const programSubject = program.subject_area?.toLowerCase() || '';
        
        return !excludedSubjects.some(excluded => {
          const excludedLower = excluded.toLowerCase();
          return programName.includes(excludedLower) || programSubject.includes(excludedLower);
        });
      });
      console.log(`[Course Finder ${requestId}] After exclusion: ${programs.length} programs`);
    }

    // Limit to requested number after filtering
    programs = programs.slice(0, limit);
    
    console.log(`[Course Finder ${requestId}] Returning ${programs.length} final programs`);
    console.log(`[Course Finder ${requestId}] Program IDs:`, programs.map(p => p.id).join(', '));

    return NextResponse.json({
      query: queryText,
      filters,
      reasoning,
      excluded_subjects: excludedSubjects,
      programs,
      request_id: requestId
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error(`[Course Finder ${requestId}] ERROR:`, error);
    console.error(`[Course Finder ${requestId}] Error stack:`, error instanceof Error ? error.stack : 'No stack');
    
    if (error instanceof z.ZodError) {
      console.error('[Course Finder] Validation error:', error.issues);
      return NextResponse.json({
        error: 'Invalid request format',
        details: error.issues,
        message: error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Unable to process course finder request',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : String(error)
    }, { status: 500 });
  }
}
