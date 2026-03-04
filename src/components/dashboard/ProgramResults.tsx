'use client';

import { useState, useEffect, useMemo } from 'react';
import { X, MapPin, Clock, Euro, Globe, ExternalLink, Bookmark, Filter, Search, Sparkles, Calendar, Map, List } from 'lucide-react';
import { Program } from '@/lib/types';

interface SearchCriteria {
  degree_level: string;
  subject_area: string;
  language: string;
  budget_max: number | null;
  city: string;
  intake: string;
}

interface ProgramResultsProps {
  criteria: SearchCriteria;
  onClose: () => void;
  onProgramSelect: (program: Program) => void;
  shortlistedIds: string[];
  onToggleShortlist: (programId: string) => void;
}

export function ProgramResults({ criteria, onClose, onProgramSelect, shortlistedIds, onToggleShortlist }: ProgramResultsProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const savedCount = shortlistedIds.length;

  useEffect(() => {
    fetchPrograms();
  }, [criteria]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      
      // Build query parameters from criteria
      const params = new URLSearchParams();
      if (criteria.degree_level && criteria.degree_level !== 'any') {
        params.append('degree_level', criteria.degree_level);
      }
      if (criteria.subject_area) {
        params.append('subjects', criteria.subject_area);
      }
      if (criteria.language && criteria.language !== 'either') {
        params.append('language', criteria.language);
      }
      if (criteria.budget_max !== null) {
        params.append('max_tuition', criteria.budget_max.toString());
      }
      if (criteria.city && criteria.city !== 'any') {
        params.append('cities', criteria.city);
      }
      if (criteria.intake && criteria.intake !== 'any') {
        params.append('intake_term', criteria.intake);
      }
      
      const response = await fetch(`/api/programs/search?${params.toString()}`);
      const data = await response.json();
      
      setPrograms(data.programs || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTuition = (amount: number | null) => {
    if (amount === null || amount === undefined || Number.isNaN(amount)) return 'Contact university';
    if (amount === 0) return 'Free';
    return `€${amount.toLocaleString()}/year`;
  };

  const parseCurrencyValue = (value?: string | number | null) => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }
    const cleaned = value.replace(/[^0-9.,]/g, '').replace(',', '');
    const parsed = parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const getTuitionDisplay = (program: Program) => {
    const exact = parseCurrencyValue(program.tuition_exact_eur ?? null);
    if (exact !== null) {
      return `€${exact.toLocaleString()}/year`;
    }

    const min = parseCurrencyValue(program.tuition_min_eur ?? null);
    const max = parseCurrencyValue(program.tuition_max_eur ?? null);
    if (min !== null && max !== null && min !== max) {
      return `€${min.toLocaleString()} - €${max.toLocaleString()}/year`;
    }
    if (min !== null) {
      return `€${min.toLocaleString()}/year`;
    }

    return formatTuition(program.tuition_fee_number ?? null);
  };

  const formatDuration = (months: number | null) => {
    if (!months) return 'Contact university';
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? 's' : ''}`;
  };

  const shortlistedPrograms = useMemo(
    () => programs.filter(program => shortlistedIds.includes(program.id)),
    [programs, shortlistedIds]
  );

  const languagesInShortlist = useMemo(() => {
    const langs = new Set<string>();
    shortlistedPrograms.forEach(program => {
      if (program.languages_array?.length) {
        langs.add(program.languages_array[0]);
      }
    });
    return Array.from(langs).slice(0, 3);
  }, [shortlistedPrograms]);

  const tuitionStats = useMemo(() => {
    if (shortlistedPrograms.length === 0) return null;
    const amounts = shortlistedPrograms
      .map(program => program.tuition_fee_number)
      .filter((value): value is number => value !== null && value !== undefined);
    if (amounts.length === 0) return null;
    return {
      min: Math.min(...amounts),
      max: Math.max(...amounts)
    };
  }, [shortlistedPrograms]);

  const earliestDeadline = useMemo(() => {
    const timestamps = shortlistedPrograms
      .map(program => (program.application_deadline ? Date.parse(program.application_deadline) : null))
      .filter((value): value is number => !!value && !Number.isNaN(value));
    if (timestamps.length === 0) return null;
    return new Date(Math.min(...timestamps)).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, [shortlistedPrograms]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50">
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div>
                  <p className="text-sm uppercase tracking-wide text-blue-300 mb-1">Program Matches</p>
                  <h1 className="text-3xl font-semibold text-white">
                    {loading ? 'Searching...' : `${programs.length} Programs Found`}
                  </h1>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[criteria.degree_level, criteria.subject_area, `${criteria.language} programs`]
                      .filter(Boolean)
                      .map((pill, index) => (
                        <span
                          key={`pill-${pill}-${index}`}
                          className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-white capitalize"
                        >
                          {pill}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-xs uppercase tracking-wide text-white/80">
                  Shortlisted: <span className="text-white font-semibold">{savedCount}</span>
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex items-center border border-white/20 rounded-lg overflow-hidden bg-white/5">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center space-x-2 px-4 py-2 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-blue-500 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    <span>List</span>
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`flex items-center space-x-2 px-4 py-2 transition-colors ${
                      viewMode === 'map'
                        ? 'bg-blue-500 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Map className="w-4 h-4" />
                    <span>Map</span>
                  </button>
                </div>
                
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-white/20 text-white bg-white/5 hover:bg-white/10 transition-colors">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-white/20 text-white bg-white/5 hover:bg-white/10 transition-colors">
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
            {shortlistedPrograms.length > 0 && (
              <div className="bg-white/5 border border-white/15 rounded-2xl p-6 backdrop-blur-lg">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-wide text-blue-200 mb-1">AI Guidance</p>
                      <h3 className="text-xl font-semibold text-white">{shortlistedPrograms.length} program{shortlistedPrograms.length > 1 ? 's' : ''} shortlisted</h3>
                      <p className="text-white/70 text-sm">We recommend comparing details side-by-side before moving into applications.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-white/80">
                    <div>
                      <p className="text-white/60 text-xs uppercase">Languages</p>
                      <p className="font-semibold">{languagesInShortlist.length ? languagesInShortlist.join(', ') : '—'}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs uppercase">Tuition Range</p>
                      <p className="font-semibold">{tuitionStats ? `€${tuitionStats.min.toLocaleString()} - €${tuitionStats.max.toLocaleString()}` : 'Varied'}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs uppercase">Earliest Deadline</p>
                      <p className="font-semibold flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{earliestDeadline || 'Not provided'}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs uppercase">Location Spread</p>
                      <p className="font-semibold">
                        {shortlistedPrograms.map(program => program.city || 'Germany').filter(Boolean).slice(0, 2).join(', ')}
                        {shortlistedPrograms.length > 2 ? ' +' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/80">
                  {["Review eligibility & language proofs", "Check uni portal / uni-assist", "Plan documents & schedule reminders"].map((task, index) => (
                    <div key={`next-${index}`} className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-2xl py-3 px-4">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-blue-200 font-semibold">
                        {index + 1}
                      </div>
                      <p>{task}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl border border-white/10 p-6 animate-pulse">
                    <div className="h-4 bg-white/10 rounded mb-3"></div>
                    <div className="h-3 bg-white/10 rounded mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : programs.length === 0 ? (
              <div className="text-center py-16 text-white">
                <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-white/60" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No programs found</h3>
                <p className="text-white/70 mb-6">Try adjusting your search criteria to see more results.</p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  Modify Search
                </button>
              </div>
            ) : viewMode === 'map' ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-white">
                <Map className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <h3 className="text-xl font-semibold mb-2">Map View</h3>
                <p className="text-white/70 mb-4">Interactive map showing {programs.length} program locations across Germany</p>
                <div className="bg-white/10 border border-white/20 rounded-xl p-6 text-left">
                  <p className="text-sm text-white/80 mb-2">📍 Programs by city:</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(programs.map(p => p.city).filter(Boolean))).slice(0, 10).map((city, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-sm text-blue-200">
                        {city} ({programs.filter(p => p.city === city).length})
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-white/60 mt-4">Full interactive map with Google Maps integration coming soon</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((program) => (
                  <div
                    key={program.id}
                    className="bg-white/5 rounded-2xl border border-white/10 hover:border-white/30 hover:shadow-2xl transition-all cursor-pointer group backdrop-blur-xl"
                    onClick={() => onProgramSelect(program)}
                  >
                    {/* Program Image */}
                    <div className="relative h-48 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl m-4 overflow-hidden">
                      {program.image_url && (
                        <img
                          src={program.image_url}
                          alt={program.program_name}
                          className="w-full h-full object-cover opacity-70"
                        />
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleShortlist(program.id);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-full border border-white/30 transition-colors ${
                          shortlistedIds.includes(program.id)
                            ? 'bg-pink-600 text-white'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                        aria-label={shortlistedIds.includes(program.id) ? 'Remove from shortlist' : 'Add to shortlist'}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                          {program.program_name}
                        </h3>
                        <p className="text-sm opacity-90">{program.university}</p>
                      </div>
                    </div>

                    {/* Program Details */}
                    <div className="px-6 pb-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-white/80">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(program.duration_months)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-white/80">
                          <Globe className="w-4 h-4" />
                          <span>{program.languages_array?.[0] || 'English'}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-white/80">
                          <MapPin className="w-4 h-4" />
                          <span>{program.city || 'Germany'}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-white/80">
                          <Euro className="w-4 h-4" />
                          <span>{getTuitionDisplay(program)}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {program.degree_level && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-100 text-xs rounded-full font-medium border border-blue-400/30">
                            {program.degree_level.toUpperCase()}
                          </span>
                        )}
                         
                        {program.subject_area && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-100 text-xs rounded-full font-medium border border-green-400/30">
                            {program.subject_area}
                          </span>
                        )}
                         
                        {program.tuition_fee_number === 0 && (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-100 text-xs rounded-full font-medium border border-yellow-400/30">
                            FREE
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleShortlist(program.id);
                          }}
                          className={`flex-1 border rounded-lg py-2 px-4 text-sm font-medium transition-colors ${
                            shortlistedIds.includes(program.id)
                              ? 'border-pink-400 text-pink-200 bg-pink-500/10'
                              : 'border-white/20 text-white/70 hover:border-white/40'
                          }`}
                        >
                          {shortlistedIds.includes(program.id) ? 'Shortlisted' : 'Add to shortlist'}
                        </button>

                        <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium">
                          View Details
                        </button>
                        
                        {program.detail_url && (
                          <a
                            href={program.detail_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-white/50 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
