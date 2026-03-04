'use client';

import { useState } from 'react';
import { Sparkles, Search, X, Loader2, Bookmark, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { ProgramSummary } from '@/lib/types';
import { ProgramModal } from '@/components/ProgramModal';

export default function CourseFinderPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    query: string;
    filters: any;
    reasoning: string | null;
    excluded_subjects?: string[];
    programs: ProgramSummary[];
  } | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);

  const exampleQueries = [
    'I want to study master in data science in Germany',
    'Find low-cost bachelor programs in engineering',
    'English taught MBA with summer intake',
    'Master in Psychology, Sociology from India, no agriculture please'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);
    setSelectedProgramId(null);

    try {
      const response = await fetch('/api/course-finder', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Request-ID': `${Date.now()}-${Math.random()}`
        },
        body: JSON.stringify({ 
          query: query.trim(), 
          limit: 8,
          timestamp: Date.now()
        }),
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to find courses');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-purple-200 hover:text-white mb-4 transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-green-400" />
            <h1 className="text-4xl font-bold text-white">AI Course Finder</h1>
          </div>
          <p className="text-purple-200 text-lg">
            Describe what you want to study, and we'll find matching courses from our database
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">
                What are you looking for?
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g., I want to study master in computer science in Berlin with low tuition, no agriculture programs"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-green-400 min-h-[100px]"
                disabled={loading}
              />
            </div>

            {/* Example Queries */}
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQuery(example)}
                  className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
                  disabled={loading}
                >
                  {example}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Finding Courses...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Find Courses
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* AI Reasoning */}
            {results.reasoning && (
              <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-200 mb-1">AI Analysis</p>
                <p className="text-white">{results.reasoning}</p>
              </div>
            )}

            {/* Applied Filters */}
            {results.filters && Object.keys(results.filters).length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
                <p className="text-sm font-semibold text-purple-200 mb-2">Applied Filters</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(results.filters).map(([key, value]) => {
                    if (!value || (Array.isArray(value) && value.length === 0)) return null;
                    return (
                      <span
                        key={key}
                        className="px-3 py-1 bg-purple-500/30 text-white text-sm rounded-full"
                      >
                        {key}: {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Excluded Subjects */}
            {results.excluded_subjects && results.excluded_subjects.length > 0 && (
              <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-200 mb-2">Excluded from Results</p>
                <div className="flex flex-wrap gap-2">
                  {results.excluded_subjects.map((subject, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-red-500/30 text-white text-sm rounded-full flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Program Results */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {results.programs.length > 0 ? `Found ${results.programs.length} matching programs` : 'No matches found'}
              </h2>
              
              {results.programs.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 text-center border border-white/20">
                  <p className="text-purple-200 text-lg">
                    No programs found matching your criteria. Try adjusting your search.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.programs.map((program) => (
                    <div
                      key={program.id}
                      className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:border-green-400/50 transition-all group overflow-hidden flex flex-col"
                    >
                      {/* Program Image */}
                      <div className="relative h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
                        {program.image_url && program.image_url.trim() !== '' && !program.image_url.includes('placeholder') ? (
                          <Image
                            src={program.image_url}
                            alt={program.program_name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            unoptimized
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-16 h-16 text-white/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        
                        {/* Tuition Badge */}
                        <div className="absolute top-3 right-3">
                          {program.is_free ? (
                            <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                              Free
                            </span>
                          ) : program.tuition_exact_eur ? (
                            <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                              €{program.tuition_exact_eur}/sem
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Program Info */}
                      <div className="p-4 flex-1 flex flex-col">
                        <button
                          type="button"
                          onClick={() => setSelectedProgramId(program.id)}
                          className="text-left flex-1"
                        >
                          <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors mb-2 line-clamp-2">
                            {program.program_name}
                          </h3>
                          
                          <p className="text-purple-200 text-sm mb-3">
                            {program.university}
                          </p>
                          <p className="text-purple-300 text-xs mb-3">
                            📍 {program.city}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {program.degree_level && (
                              <span className="px-2 py-1 bg-purple-500/30 text-purple-100 text-xs rounded">
                                {program.degree_level}
                              </span>
                            )}
                            {program.beginning_normalized && (
                              <span className="px-2 py-1 bg-green-500/30 text-green-100 text-xs rounded">
                                {program.beginning_normalized}
                              </span>
                            )}
                          </div>
                        </button>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-auto pt-3 border-t border-white/10">
                          <button
                            onClick={() => setSelectedProgramId(program.id)}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Shortlist functionality will be handled in modal
                              setSelectedProgramId(program.id);
                            }}
                            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                            title="Add to shortlist"
                          >
                            <Bookmark className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Favorite functionality
                            }}
                            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                            title="Add to favorites"
                          >
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {selectedProgramId && (
        <ProgramModal
          programId={selectedProgramId}
          onClose={() => setSelectedProgramId(null)}
        />
      )}
    </div>
  );
}
