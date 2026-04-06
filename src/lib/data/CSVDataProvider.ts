import { DataProvider } from './DataProvider';
import { Program, ProgramSummary, SearchFilters } from '../types';
import { csvLoader } from '../csv/loadPrograms';
import { TfIdf } from 'natural';

export class CSVDataProvider implements DataProvider {
  private programs: Program[] = [];
  private programIndex = new Map<string, Program>();
  private programSearchIndex = new Map<string, number>();
  private tfidf: TfIdf;
  private initialized = false;
  private initializePromise: Promise<void> | null = null;

  constructor() {
    this.tfidf = new TfIdf();
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    if (this.initializePromise) return this.initializePromise;

    this.initializePromise = (async () => {
      this.programs = await csvLoader.loadPrograms();
      this.programIndex = new Map(this.programs.map((program) => [program.id, program]));
      this.programSearchIndex = new Map(this.programs.map((program, index) => [program.id, index]));
      this.buildSearchIndex();
      this.initialized = true;
    })();

    try {
      await this.initializePromise;
    } finally {
      this.initializePromise = null;
    }
  }

  private buildSearchIndex(): void {
    this.tfidf = new TfIdf();
    
    this.programs.forEach((program) => {
      const searchText = [
        program.program_name,
        program.university,
        program.subject_area || '',
        program.description || '',
        ...program.subject_tags,
        ...program.tags_array,
      ].join(' ').toLowerCase();
      
      this.tfidf.addDocument(searchText);
    });
  }

  async searchPrograms(
    filters: SearchFilters, 
    queryText?: string, 
    limit = 12
  ): Promise<ProgramSummary[]> {
    await this.initialize();
    
    let filteredPrograms = this.applyFilters(this.programs, filters);
    
    // Apply semantic search if query provided
    if (queryText && queryText.trim()) {
      const scoredPrograms = this.scoreByRelevance(filteredPrograms, queryText);
      filteredPrograms = scoredPrograms.slice(0, limit * 2); // Get more for ranking
    }
    
    // Apply ranking
    const rankedPrograms = this.rankPrograms(filteredPrograms, filters);
    
    return rankedPrograms.slice(0, limit).map(program => this.toProgramSummary(program));
  }

  private normalizeSearchText(value?: string | null): string {
    return (value || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  private subjectMatchesText(subject: string, text?: string | null): boolean {
    const normalizedSubject = this.normalizeSearchText(subject);
    const normalizedText = this.normalizeSearchText(text);
    if (!normalizedSubject || !normalizedText) return false;

    const subjectWords = normalizedSubject.split(' ').filter(Boolean);
    const textWords = normalizedText.split(' ').filter(Boolean);
    const textWordSet = new Set(textWords);

    if (subjectWords.length === 1) {
      const [word] = subjectWords;
      if (word.length <= 2) {
        return textWordSet.has(word);
      }
      return normalizedText.includes(normalizedSubject) || textWordSet.has(word);
    }

    if (normalizedText.includes(normalizedSubject)) {
      return true;
    }

    const significantWords = subjectWords.filter(word => word.length > 2);
    if (significantWords.length === 0) {
      return subjectWords.every(word => textWordSet.has(word));
    }

    return significantWords.every(word => textWordSet.has(word));
  }

  private programMatchesSubject(program: Program, subject: string): boolean {
    return [
      program.program_name,
      program.subject_area || '',
      ...program.subject_tags,
      ...program.tags_array,
    ].some(value => this.subjectMatchesText(subject, value));
  }

  private applyFilters(programs: Program[], filters: SearchFilters): Program[] {
    const parseScore = (value?: string | null) => {
      if (!value) return null;
      const match = value.match(/[\d.]+/);
      if (!match) return null;
      const parsed = parseFloat(match[0]);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const parseNumber = (value?: string | null) => {
      if (!value) return null;
      const match = value.match(/[\d.]+/);
      if (!match) return null;
      const parsed = parseFloat(match[0]);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const hasEnglishProofRequirement = (program: Program) => {
      // Check if program has any English language requirement
      const hasIelts = !!program.ielts_min_score && program.ielts_min_score.trim() !== '';
      const hasToefl = !!program.toefl_min_score && program.toefl_min_score.trim() !== '';
      const hasEnglishLevel = !!program.english_min_level && program.english_min_level.trim() !== '';
      const hasEnglishNotes = (program.language_notes || '').toLowerCase().includes('english');
      
      return hasIelts || hasToefl || hasEnglishLevel || hasEnglishNotes;
    };

    const hasGermanProofRequirement = (program: Program) =>
      !!program.german_min_level ||
      ((program.language_notes || '').toLowerCase().includes('german'));

    const normalizeChannel = (value?: string | null) =>
      (value || '')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/_/g, '-')
        .trim();

    return programs.filter(program => {
      // Degree level filter
      if (filters.degree_level && filters.degree_level !== 'any') {
        if (program.degree_level !== filters.degree_level) return false;
      }
      
      // Subject filter - searches in program name, subject area, subject_tags, AND tags_array
      if (filters.subjects && filters.subjects.length > 0) {
        const hasSubjectMatch = filters.subjects.some(subject => this.programMatchesSubject(program, subject));
        if (!hasSubjectMatch) return false;
      }
      
      // Language filter
      if (filters.language && filters.language !== 'either') {
        const hasLanguage = program.languages_array.some(lang => 
          lang.toLowerCase().includes(filters.language!.toLowerCase())
        );
        if (!hasLanguage) return false;
      }
      
      // City filter
      if (filters.cities && filters.cities.length > 0) {
        const hasCity = filters.cities.some(city => 
          program.city?.toLowerCase().includes(city.toLowerCase())
        );
        if (!hasCity) return false;
      }
      
      // Tuition filter
      if (filters.max_tuition !== undefined && filters.max_tuition !== null) {
        if (program.tuition_fee_number && program.tuition_fee_number > filters.max_tuition) {
          return false;
        }
      }
      
      // Intake term filter
      if (filters.intake_term && filters.intake_term !== 'any') {
        const hasIntake = program.intake_terms.some(term => 
          term?.toLowerCase().includes(filters.intake_term!.toLowerCase())
        ) || program.beginning_normalized?.toLowerCase().includes(filters.intake_term!.toLowerCase());
        if (!hasIntake) return false;
      }

      // Online / e-learning filter
      if (filters.online_only) {
        if (!program.is_elearning && !program.is_complete_online_possible) {
          return false;
        }
      }

      // Scholarship / funding filter
      if (filters.scholarship_available) {
        if (!program.scholarship_available && !(program.financial_support || '').trim()) {
          return false;
        }
      }

      // English proof filter
      if (filters.requires_english_proof !== undefined) {
        const hasRequirement = hasEnglishProofRequirement(program);
        if (filters.requires_english_proof ? !hasRequirement : hasRequirement) {
          return false;
        }
      }

      // German proof filter
      if (filters.requires_german_proof !== undefined) {
        const hasRequirement = hasGermanProofRequirement(program);
        if (filters.requires_german_proof ? !hasRequirement : hasRequirement) {
          return false;
        }
      }

      // IELTS filter
      if (filters.max_ielts_score !== undefined) {
        const requiredIelts = parseScore(program.ielts_min_score);
        if (requiredIelts === null || requiredIelts > filters.max_ielts_score) {
          return false;
        }
      }

      // TOEFL filter
      if (filters.max_toefl_score !== undefined) {
        const requiredToefl = parseScore(program.toefl_min_score);
        if (requiredToefl === null || requiredToefl > filters.max_toefl_score) {
          return false;
        }
      }

      // GPA filter
      if (filters.max_minimum_gpa !== undefined) {
        const requiredGpa = parseNumber(program.minimum_gpa);
        if (requiredGpa === null || requiredGpa > filters.max_minimum_gpa) {
          return false;
        }
      }

      // Work experience filter
      if (filters.requires_work_experience !== undefined) {
        const requiresExperience = program.work_experience_required === true;
        if (filters.requires_work_experience ? !requiresExperience : requiresExperience) {
          return false;
        }
      }

      // ECTS filter
      if (filters.max_min_ects !== undefined) {
        const requiredEcts = parseNumber(program.min_ects_required || program.ects_credits);
        if (requiredEcts === null || requiredEcts > filters.max_min_ects) {
          return false;
        }
      }

      // Deadline filter
      if (filters.deadline_after) {
        const programDeadline = program.registration_deadline_date || program.application_deadline;
        const requiredDeadline = Date.parse(filters.deadline_after);
        const actualDeadline = programDeadline ? Date.parse(programDeadline) : NaN;
        if (Number.isNaN(requiredDeadline) || Number.isNaN(actualDeadline) || actualDeadline < requiredDeadline) {
          return false;
        }
      }

      // Application channel filter
      if (filters.application_channel) {
        const requestedChannel = normalizeChannel(filters.application_channel);
        const programChannel = normalizeChannel(program.application_channel);
        if (!programChannel || !programChannel.includes(requestedChannel)) {
          return false;
        }
      }

      // Semester fee filter
      if (filters.max_semester_fee !== undefined) {
        const semesterFee = parseNumber(program.semester_fee_eur);
        if (semesterFee === null || semesterFee > filters.max_semester_fee) {
          return false;
        }
      }

      // Living expenses filter
      if (filters.max_living_expenses !== undefined) {
        const livingCosts = parseNumber(program.living_expenses_month_eur);
        if (livingCosts === null || livingCosts > filters.max_living_expenses) {
          return false;
        }
      }
      
      // Confidence filter
      if (filters.min_confidence !== undefined) {
        if (!program.confidence_score || program.confidence_score < filters.min_confidence) {
          return false;
        }
      }
      
      return true;
    });
  }

  private scoreByRelevance(programs: Program[], queryText: string): Program[] {
    const queryDoc = queryText.toLowerCase();
    const scoredPrograms: Array<Program & { relevanceScore: number }> = [];
    
    programs.forEach((program) => {
      const documentIndex = this.programSearchIndex.get(program.id);
      const score = documentIndex !== undefined
        ? this.tfidf.tfidf(queryDoc.split(' '), documentIndex)
        : 0;
      scoredPrograms.push({
        ...program,
        relevanceScore: score
      });
    });
    
    return scoredPrograms
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .map((scoredProgram) => {
        const program = { ...scoredProgram };
        delete (program as Program & { relevanceScore?: number }).relevanceScore;
        return program;
      });
  }

  private rankPrograms(programs: Program[], filters: SearchFilters): Array<Program & { matchScore: number; matchReason: string }> {
    return programs.map(program => {
      let score = 0;
      const reasons: string[] = [];
      
      // Base confidence score
      score += (program.confidence_score || 0) * 0.2;
      
      // Subject match scoring
      if (filters.subjects && filters.subjects.length > 0) {
        const subjectMatches = filters.subjects.filter(subject =>
          this.programMatchesSubject(program, subject)
        ).length;
        score += (subjectMatches / filters.subjects.length) * 0.3;
        // Don't show "Matches X subject(s)" - it's not useful info for users
      }
      
      // Language fit
      if (filters.language && filters.language !== 'either') {
        const hasLanguage = program.languages_array.some(lang => 
          lang.toLowerCase().includes(filters.language!.toLowerCase())
        );
        if (hasLanguage) {
          score += 0.2;
          reasons.push(`Taught in ${filters.language}`);
        }
      }
      
      // Intake timing match
      if (filters.intake_term && filters.intake_term !== 'any') {
        const hasIntake = program.beginning_normalized?.toLowerCase().includes(filters.intake_term.toLowerCase());
        if (hasIntake) {
          score += 0.15;
          reasons.push(`${filters.intake_term} intake available`);
        }
      }
      
      // Tuition affordability
      if (filters.max_tuition && program.tuition_fee_number !== null) {
        if (program.tuition_fee_number === 0) {
          score += 0.1;
          reasons.push('No tuition fees');
        } else if (program.tuition_fee_number <= filters.max_tuition * 0.8) {
          score += 0.05;
          reasons.push('Within budget');
        }
      }
      
      // Quality penalties
      if (program.quality_warnings.length > 0) {
        score -= program.quality_warnings.length * 0.02;
      }
      
      // Missing data penalties
      if (!program.tuition_fee_number && program.tuition_fee_number !== 0) score -= 0.05;
      if (!program.application_deadline) score -= 0.03;
      if (program.intake_months.length === 0) score -= 0.03;
      
      const matchReason = reasons.length > 0 ? reasons.join(', ') : 'General match';
      
      return {
        ...program,
        matchScore: Math.max(0, Math.min(1, score)),
        matchReason
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }

  private toProgramSummary(program: Program & { matchScore?: number; matchReason?: string }): ProgramSummary {
    return {
      id: program.id,
      program_name: program.program_name,
      university: program.university,
      city: program.city,
      degree_level: program.degree_level,
      subject_area: program.subject_area,
      tuition_fee_number: program.tuition_fee_number,
      tuition_fee_currency: program.tuition_fee_currency,
      tuition_eur_min: program.tuition_eur_min,
      tuition_eur_max: program.tuition_eur_max,
      tuition_exact_eur: program.tuition_exact_eur,
      is_free: program.is_free,
      beginning_normalized: program.beginning_normalized,
      quality_warnings: program.quality_warnings,
      match_score: program.matchScore,
      match_reason: program.matchReason,
      image_url: program.image_url,
      detail_url: program.detail_url,
      // Additional fields for search results display
      languages_array: program.languages_array,
      duration_months: program.duration_months,
      tags_array: program.tags_array,
    };
  }

  async getProgram(id: string): Promise<Program | null> {
    await this.initialize();
    return this.programIndex.get(id) || null;
  }

  async getAllPrograms(): Promise<Program[]> {
    await this.initialize();
    return this.programs;
  }

  async reloadData(): Promise<void> {
    this.programs = await csvLoader.reloadPrograms();
    this.programIndex = new Map(this.programs.map((program) => [program.id, program]));
    this.programSearchIndex = new Map(this.programs.map((program, index) => [program.id, index]));
    this.buildSearchIndex();
  }
}

export const csvDataProvider = new CSVDataProvider();
