import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { csvDataProvider } from '@/lib/data/CSVDataProvider';
import { SearchFiltersSchema, type SearchFilters } from '@/lib/types';

const SearchRequestSchema = z.object({
  filters: SearchFiltersSchema,
  query_text: z.string().optional(),
  limit: z.number().min(1).max(50).default(12),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters, query_text, limit } = SearchRequestSchema.parse(body);
    
    const results = await csvDataProvider.searchPrograms(filters, query_text, limit);
    
    return NextResponse.json({
      programs: results,
      total: results.length,
      filters_applied: filters,
      query_text,
    });
    
  } catch (error) {
    console.error('Search API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters into filters
    const filters: Partial<SearchFilters> = {};
    const degreeLevel = searchParams.get('degree_level') ?? undefined;
    const subjects = searchParams.get('subjects') ?? undefined;
    const language = searchParams.get('language') ?? undefined;
    const cities = searchParams.get('cities') ?? undefined;
    const maxTuition = searchParams.get('max_tuition') ?? undefined;
    const intakeTerm = searchParams.get('intake_term') ?? undefined;
    const onlineOnly = searchParams.get('online_only') ?? undefined;
    const scholarshipAvailable = searchParams.get('scholarship_available') ?? undefined;
    const requiresEnglishProof = searchParams.get('requires_english_proof') ?? undefined;
    const requiresGermanProof = searchParams.get('requires_german_proof') ?? undefined;
    const maxIeltsScore = searchParams.get('max_ielts_score') ?? undefined;
    const maxToeflScore = searchParams.get('max_toefl_score') ?? undefined;
    const maxMinimumGpa = searchParams.get('max_minimum_gpa') ?? undefined;
    const requiresWorkExperience = searchParams.get('requires_work_experience') ?? undefined;
    const maxMinEcts = searchParams.get('max_min_ects') ?? undefined;
    const deadlineAfter = searchParams.get('deadline_after') ?? undefined;
    const applicationChannel = searchParams.get('application_channel') ?? undefined;
    const maxSemesterFee = searchParams.get('max_semester_fee') ?? undefined;
    const maxLivingExpenses = searchParams.get('max_living_expenses') ?? undefined;
    const minConfidence = searchParams.get('min_confidence') ?? undefined;
    
    if (degreeLevel) {
      filters.degree_level = degreeLevel;
    }
    
    if (subjects) {
      filters.subjects = subjects.split(',');
    }
    
    if (language) {
      filters.language = language;
    }
    
    if (cities) {
      filters.cities = cities.split(',');
    }
    
    if (maxTuition) {
      filters.max_tuition = parseInt(maxTuition || '0');
    }
    
    if (intakeTerm) {
      filters.intake_term = intakeTerm;
    }

    if (onlineOnly) {
      filters.online_only = onlineOnly === 'true';
    }

    if (scholarshipAvailable) {
      filters.scholarship_available = scholarshipAvailable === 'true';
    }

    if (requiresEnglishProof) {
      filters.requires_english_proof = requiresEnglishProof === 'true';
    }

    if (requiresGermanProof) {
      filters.requires_german_proof = requiresGermanProof === 'true';
    }

    if (maxIeltsScore) {
      filters.max_ielts_score = parseFloat(maxIeltsScore || '0');
    }

    if (maxToeflScore) {
      filters.max_toefl_score = parseFloat(maxToeflScore || '0');
    }

    if (maxMinimumGpa) {
      filters.max_minimum_gpa = parseFloat(maxMinimumGpa || '0');
    }

    if (requiresWorkExperience) {
      filters.requires_work_experience = requiresWorkExperience === 'true';
    }

    if (maxMinEcts) {
      filters.max_min_ects = parseFloat(maxMinEcts || '0');
    }

    if (deadlineAfter) {
      filters.deadline_after = deadlineAfter;
    }

    if (applicationChannel) {
      filters.application_channel = applicationChannel;
    }

    if (maxSemesterFee) {
      filters.max_semester_fee = parseFloat(maxSemesterFee || '0');
    }

    if (maxLivingExpenses) {
      filters.max_living_expenses = parseFloat(maxLivingExpenses || '0');
    }
    
    if (minConfidence) {
      filters.min_confidence = parseFloat(minConfidence || '0');
    }
    
    const query_text = searchParams.get('query') || undefined;
    const limit = parseInt(searchParams.get('limit') || '12');
    
    const validatedFilters = SearchFiltersSchema.parse(filters);
    const results = await csvDataProvider.searchPrograms(validatedFilters, query_text, limit);
    
    return NextResponse.json({
      programs: results,
      total: results.length,
      filters_applied: validatedFilters,
      query_text,
    });
    
  } catch (error) {
    console.error('Search GET API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
