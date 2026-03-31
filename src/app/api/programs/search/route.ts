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
    
    if (searchParams.get('degree_level')) {
      filters.degree_level = searchParams.get('degree_level');
    }
    
    if (searchParams.get('subjects')) {
      filters.subjects = searchParams.get('subjects')?.split(',') || [];
    }
    
    if (searchParams.get('language')) {
      filters.language = searchParams.get('language');
    }
    
    if (searchParams.get('cities')) {
      filters.cities = searchParams.get('cities')?.split(',') || [];
    }
    
    if (searchParams.get('max_tuition')) {
      filters.max_tuition = parseInt(searchParams.get('max_tuition') || '0');
    }
    
    if (searchParams.get('intake_term')) {
      filters.intake_term = searchParams.get('intake_term');
    }

    if (searchParams.get('online_only')) {
      filters.online_only = searchParams.get('online_only') === 'true';
    }

    if (searchParams.get('scholarship_available')) {
      filters.scholarship_available = searchParams.get('scholarship_available') === 'true';
    }

    if (searchParams.get('requires_english_proof')) {
      filters.requires_english_proof = searchParams.get('requires_english_proof') === 'true';
    }

    if (searchParams.get('requires_german_proof')) {
      filters.requires_german_proof = searchParams.get('requires_german_proof') === 'true';
    }

    if (searchParams.get('max_ielts_score')) {
      filters.max_ielts_score = parseFloat(searchParams.get('max_ielts_score') || '0');
    }

    if (searchParams.get('max_toefl_score')) {
      filters.max_toefl_score = parseFloat(searchParams.get('max_toefl_score') || '0');
    }

    if (searchParams.get('max_minimum_gpa')) {
      filters.max_minimum_gpa = parseFloat(searchParams.get('max_minimum_gpa') || '0');
    }

    if (searchParams.get('requires_work_experience')) {
      filters.requires_work_experience = searchParams.get('requires_work_experience') === 'true';
    }

    if (searchParams.get('max_min_ects')) {
      filters.max_min_ects = parseFloat(searchParams.get('max_min_ects') || '0');
    }

    if (searchParams.get('deadline_after')) {
      filters.deadline_after = searchParams.get('deadline_after');
    }

    if (searchParams.get('application_channel')) {
      filters.application_channel = searchParams.get('application_channel');
    }

    if (searchParams.get('max_semester_fee')) {
      filters.max_semester_fee = parseFloat(searchParams.get('max_semester_fee') || '0');
    }

    if (searchParams.get('max_living_expenses')) {
      filters.max_living_expenses = parseFloat(searchParams.get('max_living_expenses') || '0');
    }
    
    if (searchParams.get('min_confidence')) {
      filters.min_confidence = parseFloat(searchParams.get('min_confidence') || '0');
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
