import { Program, ProgramSummary, SearchFilters } from '../types';

export interface DataProvider {
  initialize(): Promise<void>;
  searchPrograms(filters: SearchFilters, queryText?: string, limit?: number): Promise<ProgramSummary[]>;
  getProgram(id: string): Promise<Program | null>;
  getAllPrograms(): Promise<Program[]>;
  reloadData(): Promise<void>;
}

export interface SearchResult {
  programs: ProgramSummary[];
  total: number;
  filters_applied: SearchFilters;
  query_text?: string;
}
