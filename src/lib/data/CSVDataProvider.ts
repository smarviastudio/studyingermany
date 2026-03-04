import { DataProvider, SearchResult } from './DataProvider';
import { Program, ProgramSummary, SearchFilters } from '../types';
import { csvLoader } from '../csv/loadPrograms';
import { TfIdf } from 'natural';

export class CSVDataProvider implements DataProvider {
  private programs: Program[] = [];
  private tfidf: TfIdf;
  private initialized = false;

  constructor() {
    this.tfidf = new TfIdf();
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    this.programs = await csvLoader.loadPrograms();
    this.buildSearchIndex();
    this.initialized = true;
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
    const rankedPrograms = this.rankPrograms(filteredPrograms, filters, queryText);
    
    return rankedPrograms.slice(0, limit).map(program => this.toProgramSummary(program));
  }

  private applyFilters(programs: Program[], filters: SearchFilters): Program[] {
    return programs.filter(program => {
      // Degree level filter
      if (filters.degree_level && filters.degree_level !== 'any') {
        if (program.degree_level !== filters.degree_level) return false;
      }
      
      // Subject filter
      if (filters.subjects && filters.subjects.length > 0) {
        const normalizeSubject = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
        const hasSubjectMatch = filters.subjects.some(subject => {
          const normalizedFilter = normalizeSubject(subject);
          return (
            program.subject_tags.some(tag => normalizeSubject(tag).includes(normalizedFilter)) ||
            normalizeSubject(program.subject_area || '').includes(normalizedFilter) ||
            normalizeSubject(program.program_name).includes(normalizedFilter)
          );
        });
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
    
    programs.forEach((program, index) => {
      const score = this.tfidf.tfidf(queryDoc.split(' '), index);
      scoredPrograms.push({
        ...program,
        relevanceScore: score
      });
    });
    
    return scoredPrograms
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .map(({ relevanceScore, ...program }) => program);
  }

  private rankPrograms(programs: Program[], filters: SearchFilters, queryText?: string): Array<Program & { matchScore: number; matchReason: string }> {
    return programs.map(program => {
      let score = 0;
      const reasons: string[] = [];
      
      // Base confidence score
      score += (program.confidence_score || 0) * 0.2;
      
      // Subject match scoring
      if (filters.subjects && filters.subjects.length > 0) {
        const subjectMatches = filters.subjects.filter(subject => 
          program.subject_tags.some(tag => tag.toLowerCase().includes(subject.toLowerCase())) ||
          program.subject_area?.toLowerCase().includes(subject.toLowerCase())
        ).length;
        score += (subjectMatches / filters.subjects.length) * 0.3;
        if (subjectMatches > 0) reasons.push(`Matches ${subjectMatches} subject(s)`);
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
      detail_url: program.detail_url
    };
  }

  async getProgram(id: string): Promise<Program | null> {
    await this.initialize();
    return this.programs.find(p => p.id === id) || null;
  }

  async getAllPrograms(): Promise<Program[]> {
    await this.initialize();
    return this.programs;
  }

  async reloadData(): Promise<void> {
    this.programs = await csvLoader.reloadPrograms();
    this.buildSearchIndex();
  }
}

export const csvDataProvider = new CSVDataProvider();
