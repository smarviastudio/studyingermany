import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import crypto from 'crypto';
import { Program, ProgramSchema, AICourseSummarySchema } from '../types';

const CURRENT_YEAR = new Date().getFullYear();

function normalizeIsoDeadline(year: number, month: number, day: number): string {
  let targetYear = year < CURRENT_YEAR ? CURRENT_YEAR : year;
  const today = new Date();
  let candidate = new Date(Date.UTC(targetYear, month - 1, day));
  if (candidate < today) {
    targetYear += 1;
    candidate = new Date(Date.UTC(targetYear, month - 1, day));
  }
  const mm = month.toString().padStart(2, '0');
  const dd = day.toString().padStart(2, '0');
  return `${targetYear}-${mm}-${dd}`;
}

function normalizeDeadline(value?: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  // Try ISO-style parsing first (e.g. 2025-07-15)
  const isoMatch = trimmed.match(/^\s*(\d{4})-(\d{2})-(\d{2})\s*$/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return normalizeIsoDeadline(parseInt(y, 10), parseInt(m, 10), parseInt(d, 10));
  }

  // Fallback: try to parse generic date strings
  const timestamp = Date.parse(trimmed);
  if (!Number.isNaN(timestamp)) {
    const parsed = new Date(timestamp);
    const normalized = normalizeIsoDeadline(parsed.getUTCFullYear(), parsed.getUTCMonth() + 1, parsed.getUTCDate());
    return normalized;
  }

  // If we only have text, replace the first outdated year token with the current cycle
  const matches = Array.from(trimmed.matchAll(/\b(19|20)\d{2}\b/g)).map((m) => parseInt(m[0], 10));
  if (matches.length > 0) {
    const outdated = matches.find((year) => year < CURRENT_YEAR);
    if (outdated) {
      const nextCycleYear = CURRENT_YEAR;
      return trimmed.replace(outdated.toString(), nextCycleYear.toString());
    }
  }
  return trimmed;
}

interface RawCSVRow {
  [key: string]: string;
}

export class CSVLoader {
  private static instance: CSVLoader;
  private programs: Program[] = [];
  private lastLoaded: Date | null = null;

  private constructor() {}

  static getInstance(): CSVLoader {
    if (!CSVLoader.instance) {
      CSVLoader.instance = new CSVLoader();
    }
    return CSVLoader.instance;
  }

  async loadPrograms(forceReload = false): Promise<Program[]> {
    if (this.programs.length > 0 && !forceReload) {
      return this.programs;
    }

    const csvPath = path.join(process.cwd(), 'data', 'programs.csv');
    
    console.log(`[CSVLoader] Attempting to load CSV from: ${csvPath}`);
    console.log(`[CSVLoader] Current working directory: ${process.cwd()}`);
    
    let finalPath = csvPath;
    
    if (!fs.existsSync(csvPath)) {
      console.error(`[CSVLoader] CSV file not found at ${csvPath}`);
      // Try alternative paths for Vercel serverless
      const altPaths = [
        path.join(__dirname, '../../../../data/programs.csv'),
        path.join(process.cwd(), '../data/programs.csv'),
        '/var/task/data/programs.csv',
      ];
      let found = false;
      for (const altPath of altPaths) {
        console.log(`[CSVLoader] Trying alternative path: ${altPath}`);
        if (fs.existsSync(altPath)) {
          console.log(`[CSVLoader] Found CSV at alternative path: ${altPath}`);
          finalPath = altPath;
          found = true;
          break;
        }
      }
      if (!found) {
        throw new Error(`CSV file not found at ${csvPath} or any alternative paths`);
      }
    }

    const rawRows: RawCSVRow[] = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(finalPath)
        .pipe(csv())
        .on('data', (row: RawCSVRow) => {
          rawRows.push(row);
        })
        .on('end', () => {
          try {
            this.programs = rawRows.map(row => this.normalizeRow(row));
            this.lastLoaded = new Date();
            console.log(`Loaded ${this.programs.length} programs from CSV`);
            resolve(this.programs);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
  }

  private normalizeRow(row: RawCSVRow): Program {
    // Generate stable ID
    const id = row.course_id || this.generateId(
      row.course_name || row.program_name || '',
      row.university_name || row.university || '',
      row.detail_url || row.source_url || ''
    );

    // Parse JSON arrays safely
    const parseJsonArray = (value: string): string[] => {
      if (!value || value.trim() === '' || value === '[]') return [];
      const sanitize = (entry: any) =>
        typeof entry === 'string'
          ? entry.replace(/['"\[\]]/g, '').trim()
          : String(entry).trim();
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed)
          ? parsed.map(sanitize).filter(Boolean)
          : [];
      } catch {
        // Fallback: split by common delimiters
        return value
          .split(/[,;|]/)
          .map(sanitize)
          .filter(Boolean);
      }
    };

    // Parse tuition
    const parseTuition = (value: string): number | null => {
      if (!value || value.toLowerCase().includes('free') || value.toLowerCase().includes('none')) {
        return 0;
      }
      const numMatch = value.match(/[\d,]+/);
      if (numMatch) {
        return parseInt(numMatch[0].replace(/,/g, ''));
      }
      return null;
    };

    // Parse intake months from beginning_normalized
    const parseIntakeMonths = (beginning: string): number[] => {
      const months: number[] = [];
      if (beginning?.toLowerCase().includes('winter')) months.push(10); // October
      if (beginning?.toLowerCase().includes('summer')) months.push(4); // April
      if (beginning?.toLowerCase().includes('spring')) months.push(3); // March
      if (beginning?.toLowerCase().includes('fall') || beginning?.toLowerCase().includes('autumn')) months.push(9); // September
      return months;
    };

    // Parse duration
    const parseDuration = (duration: string): number | null => {
      if (!duration) return null;
      const semesterMatch = duration.match(/(\d+)\s*semester/i);
      if (semesterMatch) {
        return parseInt(semesterMatch[1]) * 6; // Convert semesters to months
      }
      const monthMatch = duration.match(/(\d+)\s*month/i);
      if (monthMatch) {
        return parseInt(monthMatch[1]);
      }
      return null;
    };

    const sanitizeNumber = (value?: string | null) => {
      if (!value) return NaN;
      const cleaned = value.replace(/[^0-9.]/g, '');
      return cleaned ? parseFloat(cleaned) : NaN;
    };

    const parseBoolean = (value?: string | boolean | null) => {
      if (value === undefined || value === null) return undefined;
      if (typeof value === 'boolean') return value;
      const normalized = value.trim().toLowerCase();
      if (!normalized) return undefined;
      if (['true', 'yes', '1'].includes(normalized)) return true;
      if (['false', 'no', '0'].includes(normalized)) return false;
      return undefined;
    };

    const ensureJsonString = (value?: string | null) => {
      if (!value || value.trim() === '') return '[]';
      return value;
    };

    const parseAICourseSummary = (value?: string | null) => {
      if (!value || value.trim() === '') return undefined;
      try {
        const parsed = JSON.parse(value);
        return AICourseSummarySchema.parse(parsed);
      } catch (error) {
        console.warn('Skipping invalid ai_course_summary value', error);
        return undefined;
      }
    };

    const tuitionNumber = parseTuition(row.tuition_fee_number || row.cost_string_clean || '');
    const tuitionFeeValue = sanitizeNumber(row.tuition_fee_number) || tuitionNumber;
    const tuitionMinValue = sanitizeNumber(row.tuition_eur_min) || tuitionNumber;
    const tuitionMaxValue = sanitizeNumber(row.tuition_eur_max) || tuitionNumber;
    
    const program: Program = {
      id,
      course_id: row.id || row.course_id,
      source_url: row.detail_url || row.source_url,
      university: row.university || 'Unknown University',
      program_name: row.program_name || 'Unknown Program',
      degree_level: row.degree_level_normalized || row.degree_level,
      subject_tags: parseJsonArray(row.tags_array || ''),
      languages_array: parseJsonArray(row.languages_array || ''),
      language_level_german: parseJsonArray(row.language_level_german || ''),
      language_level_english: parseJsonArray(row.language_level_english || ''),
      intake_terms: parseJsonArray(row.intake_terms || ''),
      intake_months: parseJsonArray(row.intake_months || '').map(m => parseInt(m)).filter(n => !isNaN(n)),
      duration_months: parseInt(row.duration_months || '') || parseDuration(row.programme_duration || ''),
      tuition_fee_number: tuitionFeeValue || null,
      tuition_fee_currency: row.tuition_fee_currency || 'EUR',
      tuition_eur_min: tuitionMinValue || null,
      tuition_eur_max: tuitionMaxValue || null,
      city: row.city,
      state: row.state,
      country: 'Germany',
      application_deadline: normalizeDeadline(row.application_deadline) ?? null,
      requirements: row.requirements || row.requirements_text_clean || null,
      description: row.description || row.program_name || null,
      quality_warnings: parseJsonArray(row.quality_warnings || ''),
      confidence_score: parseFloat(row.completeness_score || row.confidence_score || '0'),
      beginning_normalized: row.beginning_normalized,
      programme_duration: row.programme_duration,
      intakes: row.intakes,
      subject_area: row.subject_area,
      tags_array: parseJsonArray(row.tags_array || ''),
      image_url: row.image_url,
      detail_url: row.detail_url,
      
      // Add tab content from enhanced dataset
      tab_overview: row.tab_overview || null,
      tab_course_details: row.tab_course_details || null,
      tab_costs_funding: row.tab_costs_funding || null,
      tab_requirements_registration: row.tab_requirements_registration || null,
      tab_services: row.tab_services || null,

      language_proficiency_required: parseBoolean(row.language_proficiency_required),
      ielts_min_score: row.ielts_min_score || undefined,
      toefl_min_score: row.toefl_min_score || undefined,
      other_language_tests: ensureJsonString(row.other_language_tests),
      german_min_level: row.german_min_level || undefined,
      english_min_level: row.english_min_level || undefined,
      language_notes: row.language_notes || undefined,
      academic_background_requirements: row.academic_background_requirements || undefined,
      support_services_summary: row.support_services_summary || undefined,
      support_services_list: ensureJsonString(row.support_services_list),
      tuition_exact_eur: row.tuition_exact_eur || undefined,
      tuition_min_eur: row.tuition_min_eur || undefined,
      tuition_max_eur: row.tuition_max_eur || undefined,
      tuition_notes: row.tuition_notes || undefined,
      semester_fee_eur: row.semester_fee_eur || undefined,
      semester_fee_notes: row.semester_fee_notes || undefined,
      living_expenses_month_eur: row.living_expenses_month_eur || undefined,
      living_expenses_notes: row.living_expenses_notes || undefined,
      min_ects_required: row.min_ects_required || undefined,
      academic_notes: row.academic_notes || undefined,
      registration_deadline_date: normalizeDeadline(row.registration_deadline_date) ?? undefined,
      registration_deadline_text: row.registration_deadline_text || undefined,
      application_channel: row.application_channel || undefined,
      application_channel_notes: row.application_channel_notes || undefined,
      scholarship_available: parseBoolean(row.scholarship_available),
      scholarship_notes: row.scholarship_notes || undefined,
      documents_required_list: ensureJsonString(row.documents_required_list),
      ai_course_summary: parseAICourseSummary(row.ai_course_summary),
    };

    // Validate with schema
    return ProgramSchema.parse(program);
  }

  private generateId(programName: string, university: string, url: string): string {
    const combined = `${programName}-${university}-${url}`;
    return crypto.createHash('md5').update(combined).digest('hex').substring(0, 12);
  }

  getPrograms(): Program[] {
    return this.programs;
  }

  getLastLoaded(): Date | null {
    return this.lastLoaded;
  }

  async reloadPrograms(): Promise<Program[]> {
    return this.loadPrograms(true);
  }
}

export const csvLoader = CSVLoader.getInstance();
