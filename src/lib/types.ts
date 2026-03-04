import { z } from 'zod';

const SummaryRequirementsSchema = z.object({
  academic_background: z.string().optional().default(''),
  language: z.string().optional().default(''),
  documents: z.array(z.string()).optional().default([]),
  extra: z.string().optional().default(''),
}).default({
  academic_background: '',
  language: '',
  documents: [],
  extra: '',
});

const SummaryCostsSchema = z.object({
  tuition: z.string().optional().default(''),
  semester_fee: z.string().optional().default(''),
  living_expenses: z.string().optional().default(''),
  funding: z.string().optional().default(''),
}).default({
  tuition: '',
  semester_fee: '',
  living_expenses: '',
  funding: '',
});

export const AICourseSummarySchema = z.object({
  overview: z.string().optional().default(''),
  modules: z.array(z.string()).optional().default([]),
  requirements: SummaryRequirementsSchema.optional().default({
    academic_background: '',
    language: '',
    documents: [],
    extra: '',
  }),
  costs: SummaryCostsSchema.optional().default({
    tuition: '',
    semester_fee: '',
    living_expenses: '',
    funding: '',
  }),
  takeaways: z.array(z.string()).optional().default([]),
});

export type AICourseSummary = z.infer<typeof AICourseSummarySchema>;

// Program schema matching the CSV structure
export const ProgramSchema = z.object({
  id: z.string(),
  course_id: z.string().optional(),
  source_url: z.string().optional(),
  university: z.string(),
  program_name: z.string(),
  degree_level: z.string().optional(),
  subject_tags: z.array(z.string()),
  languages_array: z.array(z.string()),
  language_level_german: z.array(z.string()),
  language_level_english: z.array(z.string()),
  intake_terms: z.array(z.string()),
  intake_months: z.array(z.number()),
  duration_months: z.number().nullable(),
  tuition_fee_number: z.number().nullable(),
  tuition_fee_currency: z.string().optional(),
  tuition_eur_min: z.number().nullable(),
  tuition_eur_max: z.number().nullable(),
  is_free: z.boolean().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default('Germany'),
  application_deadline: z.string().nullable(),
  requirements: z.string().nullable(),
  description: z.string().nullable(),
  quality_warnings: z.array(z.string()),
  confidence_score: z.number().optional(),
  beginning_normalized: z.string().optional(),
  programme_duration: z.string().optional(),
  intakes: z.string().optional(), // JSON string
  subject_area: z.string().optional(),
  tags_array: z.array(z.string()),
  image_url: z.string().optional(),
  detail_url: z.string().optional(),
  
  // Tab content from enhanced DAAD dataset
  tab_overview: z.string().nullable(),
  tab_course_details: z.string().nullable(),
  tab_costs_funding: z.string().nullable(),
  tab_requirements_registration: z.string().nullable(),
  tab_services: z.string().nullable(),
  
  // AI-extracted structured fields
  language_proficiency_required: z.boolean().optional(),
  ielts_min_score: z.string().optional(),
  toefl_min_score: z.string().optional(),
  other_language_tests: z.string().optional(), // JSON array
  german_min_level: z.string().optional(),
  english_min_level: z.string().optional(),
  language_notes: z.string().optional(),
  academic_background_requirements: z.string().optional(),
  support_services_summary: z.string().optional(),
  support_services_list: z.string().optional(), // JSON array
  tuition_exact_eur: z.string().optional(),
  tuition_min_eur: z.string().optional(),
  tuition_max_eur: z.string().optional(),
  tuition_notes: z.string().optional(),
  semester_fee_eur: z.string().optional(),
  semester_fee_notes: z.string().optional(),
  living_expenses_month_eur: z.string().optional(),
  living_expenses_notes: z.string().optional(),
  min_ects_required: z.string().optional(),
  academic_notes: z.string().optional(),
  registration_deadline_date: z.string().optional(),
  registration_deadline_text: z.string().optional(),
  application_channel: z.string().optional(),
  application_channel_notes: z.string().optional(),
  scholarship_available: z.boolean().optional(),
  scholarship_notes: z.string().optional(),
  documents_required_list: z.string().optional(), // JSON array
  ai_course_summary: AICourseSummarySchema.optional(),
});

export type Program = z.infer<typeof ProgramSchema>;

// User profile schema
export const UserProfileSchema = z.object({
  target_degree_level: z.enum(['bachelor', 'master', 'phd', 'non_degree', 'any']).optional(),
  target_subjects: z.array(z.string()).optional().default([]),
  preferred_language: z.enum(['english', 'german', 'either']).optional().default('either'),
  german_level: z.enum(['none', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2']).optional(),
  english_level: z.enum(['none', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2']).optional(),
  ielts_score: z.number().nullable().optional(),
  toefl_score: z.number().nullable().optional(),
  has_scholarship: z.boolean().optional(),
  academic_background: z.string().optional(),
  background_summary: z.string().optional(),
  experience_highlights: z.string().optional(),
  skills: z.string().optional(),
  career_goals: z.string().optional(),
  preferred_cities: z.array(z.string()).optional().default([]),
  max_tuition_eur: z.number().nullable().optional(),
  desired_intake: z.enum(['winter', 'summer', 'any']).optional().default('any'),
  desired_start_year: z.number().optional(),
  constraints: z.string().optional(),
  budget_notes: z.string().optional(),
  linkedin_url: z.string().optional(),
  portfolio_url: z.string().optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// API schemas
export const SearchFiltersSchema = z.object({
  degree_level: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  language: z.string().optional(),
  cities: z.array(z.string()).optional(),
  max_tuition: z.number().optional(),
  intake_term: z.string().optional(),
  min_confidence: z.number().optional(),
});

export type SearchFilters = z.infer<typeof SearchFiltersSchema>;

export const ProgramSummarySchema = z.object({
  id: z.string(),
  program_name: z.string(),
  university: z.string(),
  city: z.string().optional(),
  degree_level: z.string().optional(),
  subject_area: z.string().optional(),
  tuition_fee_number: z.number().nullable(),
  tuition_fee_currency: z.string().optional(),
  tuition_eur_min: z.number().nullable(),
  tuition_eur_max: z.number().nullable(),
  tuition_exact_eur: z.string().optional(),
  is_free: z.boolean().optional(),
  beginning_normalized: z.string().optional(),
  quality_warnings: z.array(z.string()),
  match_score: z.number().optional(),
  match_reason: z.string().optional(),
  image_url: z.string().optional(),
  detail_url: z.string().optional(),
});

export type ProgramSummary = z.infer<typeof ProgramSummarySchema>;

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.date().default(() => new Date()),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatSessionSchema = z.object({
  session_id: z.string(),
  messages: z.array(ChatMessageSchema),
  user_profile: UserProfileSchema,
  referenced_program_ids: z.array(z.string()).default([]),
});

export type ChatSession = z.infer<typeof ChatSessionSchema>;
