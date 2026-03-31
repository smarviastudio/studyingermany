import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { csvDataProvider } from '@/lib/data/CSVDataProvider';
import { SearchFiltersSchema } from '@/lib/types';

const CourseFinderRequestSchema = z.object({
  query: z.string().min(5, 'Please describe what you want to study'),
  limit: z.number().min(1).max(50).optional(),
  timestamp: z.number().optional()
});

const DEFAULT_RESULTS_LIMIT = 24;

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
    "intake_term": "winter|summer|any",
    "online_only": true,
    "scholarship_available": true,
    "requires_english_proof": true,
    "requires_german_proof": false,
    "max_ielts_score": 5.5,
    "max_toefl_score": 80,
    "max_minimum_gpa": 2.5,
    "requires_work_experience": false,
    "max_min_ects": 180,
    "deadline_after": "2026-07-01",
    "application_channel": "uni-assist|direct-university|centralized-portal",
    "max_semester_fee": 350,
    "max_living_expenses": 950
  },
  "excluded_subjects": ["agriculture", "medicine"],
  "reasoning": "short explanation"
}

IMPORTANT RULES:
1. Extract subjects broadly - include the main subject AND related terms. For "chemical engineering", include ["chemical engineering", "chemistry", "chemical"]. For "computer science", include ["computer science", "software", "informatics", "IT"].
2. If user says "no X" or "not X" or "exclude X", add X to excluded_subjects array.
3. Tuition is euros per year. If user says "free" or "no tuition", set max_tuition to 0.
4. LANGUAGE COURSES: If user searches for "language course", "German language course", "language program", etc., this IS a course query. Set degree_level to "language_course" and subjects to ["german", "language"].
5. NON-course queries are: general questions about "how to learn German" (without mentioning course/program), "visa process", "accommodation tips", "blocked account", "health insurance", "living costs", etc.
6. The search will match against program names, subject areas, AND subject tags (like "software engineering", "mechanical engineering", etc.), so include relevant keywords.
7. If the user mentions an IELTS or TOEFL score they have, convert it into a maximum acceptable requirement. Example: "IELTS 5.5" means set "max_ielts_score": 5.5.
8. If the user asks for online, scholarship-funded, no-work-experience, GPA, ECTS, deadline, direct application, uni-assist, living-cost, or semester-fee constraints, put them in filters.
9. For GPA and ECTS, treat the user's value as the maximum required by the program. Example: "I have 180 ECTS" => "max_min_ects": 180.
10. For "still open", "deadline after now", or "open now", set deadline_after to today's date or a concrete date inferred from the query.

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

function extractScoreFiltersFromQuery(query: string) {
  const queryLower = query.toLowerCase();
  const filters: Partial<z.infer<typeof SearchFiltersSchema>> = {};

  const ieltsMatch =
    queryLower.match(/ielts(?:\s+score)?(?:\s+of)?\s+(\d(?:\.\d)?)/) ||
    queryLower.match(/(\d(?:\.\d)?)\s+ielts/);
  if (ieltsMatch) {
    filters.max_ielts_score = parseFloat(ieltsMatch[1]);
  }

  const toeflMatch =
    queryLower.match(/toefl(?:\s+(?:ibt|score))?(?:\s+of)?\s+(\d{2,3})/) ||
    queryLower.match(/(\d{2,3})\s+toefl/);
  if (toeflMatch) {
    filters.max_toefl_score = parseInt(toeflMatch[1], 10);
  }

  return filters;
}

function extractAdditionalFiltersFromQuery(query: string) {
  const queryLower = query.toLowerCase();
  const filters: Partial<z.infer<typeof SearchFiltersSchema>> = {};

  if (/(online|remote|distance learning|distance-learning|e-learning|elearning)/.test(queryLower)) {
    filters.online_only = true;
  }

  if (/(scholarship|scholarships|funding|financial support)/.test(queryLower)) {
    filters.scholarship_available = true;
  }

  if (/(english proficiency|english certificate|english test|ielts|toefl|pte|cambridge)/.test(queryLower)) {
    filters.requires_english_proof = true;
  }

  if (/(german required|german proficiency|german certificate|testdaf|telc|goethe|dsh|german level)/.test(queryLower)) {
    filters.requires_german_proof = true;
  }

  if (/(no work experience|without work experience|freshers|fresher|no experience required)/.test(queryLower)) {
    filters.requires_work_experience = false;
  } else if (/(work experience|required experience|experience required|with experience|mba)/.test(queryLower)) {
    filters.requires_work_experience = true;
  }

  const gpaMatch =
    queryLower.match(/(?:gpa|cgpa)(?:\s*(?:of|under|below|upto|up to|maximum|max)?)\s*(\d(?:\.\d+)?)/) ||
    queryLower.match(/(\d(?:\.\d+)?)\s*(?:gpa|cgpa)/);
  if (gpaMatch) {
    filters.max_minimum_gpa = parseFloat(gpaMatch[1]);
  }

  const ectsMatch =
    queryLower.match(/(?:ects)(?:\s*(?:of|under|below|upto|up to|maximum|max)?)\s*(\d{2,3})/) ||
    queryLower.match(/(\d{2,3})\s*ects/);
  if (ectsMatch) {
    filters.max_min_ects = parseInt(ectsMatch[1], 10);
  }

  const semesterFeeMatch = queryLower.match(/semester fee(?:\s*(?:under|below|upto|up to|max|maximum|of))?\s*€?\s*(\d+(?:\.\d+)?)/);
  if (semesterFeeMatch) {
    filters.max_semester_fee = parseFloat(semesterFeeMatch[1]);
  }

  const livingCostMatch = queryLower.match(/(?:living expenses|living costs|monthly costs)(?:\s*(?:under|below|upto|up to|max|maximum|of))?\s*€?\s*(\d+(?:\.\d+)?)/);
  if (livingCostMatch) {
    filters.max_living_expenses = parseFloat(livingCostMatch[1]);
  }

  if (/(uni-assist|uni assist)/.test(queryLower)) {
    filters.application_channel = 'uni-assist';
  } else if (/(direct application|direct university|apply direct|directly to university)/.test(queryLower)) {
    filters.application_channel = 'direct-university';
  } else if (/(centralized portal|central portal)/.test(queryLower)) {
    filters.application_channel = 'centralized-portal';
  }

  if (/(still open|open now|deadline after now|applications still open)/.test(queryLower)) {
    filters.deadline_after = new Date().toISOString().slice(0, 10);
  } else {
    const deadlineAfterMatch = query.match(/deadline(?:s)?\s+(?:after|from)\s+([A-Za-z0-9,\-./ ]+)/i);
    if (deadlineAfterMatch) {
      const parsed = Date.parse(deadlineAfterMatch[1].trim());
      if (!Number.isNaN(parsed)) {
        filters.deadline_after = new Date(parsed).toISOString().slice(0, 10);
      }
    }
  }

  return filters;
}

function sanitizeLanguageScoreFilters(
  filters: Partial<z.infer<typeof SearchFiltersSchema>>,
  query: string
) {
  const queryLower = query.toLowerCase();
  const nextFilters = { ...filters };

  if (!/ielts/.test(queryLower)) {
    delete nextFilters.max_ielts_score;
  }

  if (!/toefl/.test(queryLower)) {
    delete nextFilters.max_toefl_score;
  }

  if (nextFilters.max_ielts_score !== undefined && nextFilters.max_ielts_score <= 0) {
    delete nextFilters.max_ielts_score;
  }

  if (nextFilters.max_toefl_score !== undefined && nextFilters.max_toefl_score <= 0) {
    delete nextFilters.max_toefl_score;
  }

  return nextFilters;
}

function sanitizeExplicitConstraintFilters(
  filters: Partial<z.infer<typeof SearchFiltersSchema>>,
  query: string
) {
  const queryLower = query.toLowerCase();
  const nextFilters = { ...filters };

  const mentionsTuition = /(tuition|fee|fees|budget|free|scholarship|funding|cost)/.test(queryLower);
  const mentionsOnline = /(online|remote|distance learning|distance-learning|e-learning|elearning)/.test(queryLower);
  const mentionsScholarship = /(scholarship|scholarships|funding|financial support)/.test(queryLower);
  const mentionsEnglishProof = /(english proficiency|english certificate|english test|ielts|toefl|pte|cambridge)/.test(queryLower);
  const mentionsGermanProof = /(german required|german proficiency|german certificate|testdaf|telc|goethe|dsh|german level)/.test(queryLower);
  const mentionsGpa = /(?:gpa|cgpa)/.test(queryLower);
  const mentionsWorkExperience = /(work experience|experience required|no work experience|without work experience|freshers|fresher|mba)/.test(queryLower);
  const mentionsEcts = /\bects\b/.test(queryLower);
  const mentionsDeadline = /(deadline|deadlines|still open|open now|applications still open)/.test(queryLower);
  const mentionsChannel = /(uni-assist|uni assist|direct application|direct university|apply direct|centralized portal|central portal)/.test(queryLower);
  const mentionsSemesterFee = /semester fee/.test(queryLower);
  const mentionsLivingExpenses = /(living expenses|living costs|monthly costs)/.test(queryLower);

  if (!mentionsTuition) delete nextFilters.max_tuition;
  if (!mentionsOnline) delete nextFilters.online_only;
  if (!mentionsScholarship) delete nextFilters.scholarship_available;
  if (!mentionsEnglishProof) delete nextFilters.requires_english_proof;
  if (!mentionsGermanProof) delete nextFilters.requires_german_proof;
  if (!mentionsGpa) delete nextFilters.max_minimum_gpa;
  if (!mentionsWorkExperience) delete nextFilters.requires_work_experience;
  if (!mentionsEcts) delete nextFilters.max_min_ects;
  if (!mentionsDeadline) delete nextFilters.deadline_after;
  if (!mentionsChannel) delete nextFilters.application_channel;
  if (!mentionsSemesterFee) delete nextFilters.max_semester_fee;
  if (!mentionsLivingExpenses) delete nextFilters.max_living_expenses;

  if (nextFilters.max_minimum_gpa !== undefined && nextFilters.max_minimum_gpa <= 0) {
    delete nextFilters.max_minimum_gpa;
  }

  if (nextFilters.max_min_ects !== undefined && nextFilters.max_min_ects <= 0) {
    delete nextFilters.max_min_ects;
  }

  if (nextFilters.max_semester_fee !== undefined && nextFilters.max_semester_fee <= 0) {
    delete nextFilters.max_semester_fee;
  }

  if (nextFilters.max_living_expenses !== undefined && nextFilters.max_living_expenses <= 0) {
    delete nextFilters.max_living_expenses;
  }

  if (nextFilters.application_channel === 'any') {
    delete nextFilters.application_channel;
  }

  return nextFilters;
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
    
    const { query, limit = DEFAULT_RESULTS_LIMIT, timestamp } = CourseFinderRequestSchema.parse(body);
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

      filters = {
        ...filters,
        ...extractScoreFiltersFromQuery(query),
        ...extractAdditionalFiltersFromQuery(query),
      };
      
      reasoning = 'Manual extraction (AI unavailable)';
    }

    // Preserve AI understanding, but enforce explicit score constraints from the raw query.
    filters = {
      ...filters,
      ...extractScoreFiltersFromQuery(query),
      ...extractAdditionalFiltersFromQuery(query),
    };
    filters = sanitizeLanguageScoreFilters(filters, query);
    filters = sanitizeExplicitConstraintFilters(filters, query);
    
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
