'use client';

import { useState, useEffect, useMemo, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { 
  Search, Loader2, Bookmark, X, ArrowRight, BookOpen, Newspaper, Calendar,
  GraduationCap, FileText, Languages, Home, Briefcase, CreditCard, Shield,
  Plane, Star, Zap, TrendingUp, Users, Globe, Clock, Calculator, LayoutDashboard, MapPin,
  Settings, Filter, Sparkles
} from 'lucide-react';
import { ProgramModal } from '@/components/ProgramModal';
import { ProgramCard } from '@/components/ProgramCard';
import type { ProgramSummary } from '@/lib/types';
import { SiteNav } from '@/components/SiteNav';

const RED = '#dd0000';
const SEARCH_RESULTS_LIMIT = 24;

const HERO_SUGGESTIONS = [
  'English-taught master in AI',
  'No-tuition engineering bachelor',
  'MBA in Berlin · summer intake',
];

const TOOLS = [
  { href: '/cv-maker/landing',                  label: 'AI CV Maker',            desc: 'Build a German-format CV in minutes with AI assistance',              icon: FileText,    gradient: 'from-red-500 to-rose-600' },
  { href: '/cover-letter/landing',              label: 'Cover Letter',           desc: 'Draft professional cover letters tailored to German employers',        icon: Briefcase,   gradient: 'from-amber-500 to-orange-600' },
  { href: '/motivation-letter/landing',         label: 'Motivation Letter',      desc: 'Create compelling motivation letters for university applications',     icon: Star,        gradient: 'from-violet-500 to-purple-600' },
  { href: '/gpa-converter/landing',             label: 'GPA Converter',          desc: 'Convert your grades to the German grading scale instantly',           icon: TrendingUp,  gradient: 'from-emerald-500 to-green-600' },
  { href: '/netto-brutto-calculator/landing',   label: 'Salary Calculator',      desc: 'Calculate your net salary after German taxes and deductions',         icon: Calculator,  gradient: 'from-teal-500 to-cyan-600' },
  { href: '/dashboard/landing',                 label: 'My Dashboard',           desc: 'Track your applications, shortlists and study plans',                 icon: Zap,         gradient: 'from-blue-500 to-indigo-600' },
];

const TESTIMONIALS = [
  {
    name: 'Ayesha Khan',
    country: 'Karachi, Pakistan',
    track: 'Bachelor in Data Science (TU Munich)',
    quote: 'The AI document checklist told me exactly which certificates Munich required, and the CV builder gave me a German-style resume in 10 minutes.',
    highlight: 'Got admission with full semester waiver',
    avatar: '🇵🇰'
  },
  {
    name: 'Chinedu Adewale',
    country: 'Lagos, Nigeria',
    track: 'Master in Renewable Energy (FH Aachen)',
    quote: 'German Path showed me the blocked account options and helped me time every admin step. Their AI roadmap kept my tasks organized while I handled embassy requirements myself.',
    highlight: 'Planned finances + deadlines with AI',
    avatar: '🇳🇬'
  },
  {
    name: 'Meera Iyer',
    country: 'Bangalore, India',
    track: 'MBA in Berlin (SRH University)',
    quote: 'The motivation letter tool used my profile and program info to craft a personalized story that admissions loved.',
    highlight: 'Scholarship + internship offer',
    avatar: '🇮🇳'
  },
  {
    name: 'Kevin Otieno',
    country: 'Nairobi, Kenya',
    track: 'Master in Automotive Software (RWTH Aachen)',
    quote: 'I used the shortlist + AI plan to track every deadline. The guidance explained finances and insurance so I could prepare documents with confidence.',
    highlight: 'Working student job in 2 months',
    avatar: '🇰🇪'
  }
];

const JOURNEY_CATEGORIES = [
  { key: 'getting-started', label: 'Getting Started', icon: Plane, color: '#dd0000', desc: 'First steps to study in Germany', slugs: ['guides', 'getting-started', 'visa-immigration', 'visa'] },
  { key: 'university-life', label: 'University Life', icon: GraduationCap, color: '#7c3aed', desc: 'Admissions, programs & campus', slugs: ['university-life', 'admissions', 'programs'] },
  { key: 'housing',         label: 'Housing & Living', icon: Home, color: '#059669', desc: 'Find accommodation & settle in', slugs: ['housing', 'living', 'accommodation'] },
  { key: 'finance',         label: 'Finance & Insurance', icon: CreditCard, color: '#d97706', desc: 'Blocked accounts, insurance & more', slugs: ['finance', 'insurance', 'blocked-account'] },
  { key: 'jobs-career',     label: 'Jobs & Career', icon: Briefcase, color: '#0284c7', desc: 'Working while studying & after', slugs: ['jobs-career', 'jobs', 'career'] },
  { key: 'language',        label: 'Language & Culture', icon: Languages, color: '#be185d', desc: 'German language & integration', slugs: ['language', 'culture', 'integration'] },
];

type WpPost = {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  link: string;
  featuredImage: string | null;
  categories: { id: number; name: string; slug: string }[];
};

const HTML_ENTITY_MAP: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
};

function decodeHtmlEntities(text: string) {
  if (!text) return '';
  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (_match, entity) => {
    const lower = entity.toLowerCase();
    if (lower[0] === '#') {
      const isHex = lower[1] === 'x';
      const codePoint = parseInt(isHex ? lower.slice(2) : lower.slice(1), isHex ? 16 : 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : '';
    }
    return HTML_ENTITY_MAP[lower] ?? '';
  });
}

function stripHtml(html: string) {
  return decodeHtmlEntities(
    html.replace(/<[^>]*>/g, '').replace(/\[\s*\]/g, '').replace(/\s{2,}/g, ' ').trim()
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function HomePage() {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [results, setResults] = useState<ProgramSummary[]>([]);
  const [reasoning, setReasoning] = useState<string | null>(null);
  const [nonCourseMessage, setNonCourseMessage] = useState<string | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [restoreSearchAfterModal, setRestoreSearchAfterModal] = useState(false);
  const [shortlistedPrograms, setShortlistedPrograms] = useState<string[]>([]);
  const [shortlistingId, setShortlistingId] = useState<string | null>(null);
  const [signInToast, setSignInToast] = useState(false);
  const [wpPosts, setWpPosts] = useState<WpPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [filters, setFilters] = useState({ language: 'all', city: 'all', degreeLevel: 'all', tuition: 'all' });
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    degreeLevel: '',
    city: '',
    language: '',
    tuitionMin: '',
    tuitionMax: '',
    isFree: false,
    intake: '',
    ieltsRequired: false,
    toeflRequired: false,
    germanRequired: false,
    englishRequired: false,
    onlineAvailable: false,
    scholarshipAvailable: false,
    subjectArea: '',
  });

  const heroSlides = [
    { main: 'Your journey to', highlight: 'Germany starts here' },
    { main: 'Say goodbye to', highlight: 'expensive consultants' },
    { main: 'Find your program', highlight: 'in minutes, not months' },
    { main: 'Save thousands on', highlight: 'consultant fees' },
    { main: 'AI-powered guidance', highlight: 'completely free' },
  ];

  const filteredResults = useMemo(() => {
    return results.filter(program => {
      const degreeLevel = program.degree_level?.toLowerCase() || '';
      const languages = program.languages_array?.map(l => l.toLowerCase()) || [];
      
      if (filters.language !== 'all' && !languages.some(l => l.includes(filters.language))) return false;
      if (filters.degreeLevel !== 'all' && !degreeLevel.includes(filters.degreeLevel)) return false;
      if (filters.tuition === 'free' && !program.is_free) return false;
      if (filters.tuition === 'paid' && program.is_free) return false;
      
      return true;
    });
  }, [results, filters]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }),
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [wpPosts, postsLoading, activeCategory]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/wp-posts?per_page=30');
        if (res.ok) {
          const data = await res.json();
          setWpPosts(data.posts || []);
        }
      } catch { /* silent */ } finally {
        setPostsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (showSearchResults) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSearchResults]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    (async () => {
      try {
        const res = await fetch('/api/shortlist');
        if (res.ok) {
          const data = await res.json();
          setShortlistedPrograms((data.shortlists ?? []).map((e: { programId: string }) => e.programId));
        }
      } catch { /* silent */ }
    })();
  }, [status]);

  const categorizedPosts = useMemo(() => {
    const groups: Record<string, WpPost[]> = {};
    JOURNEY_CATEGORIES.forEach(cat => { groups[cat.key] = []; });
    groups['other'] = [];
    wpPosts.forEach(post => {
      const postSlugs = post.categories.map(c => c.slug.toLowerCase());
      const postNames = post.categories.map(c => c.name.toLowerCase());
      let placed = false;
      for (const journeyCat of JOURNEY_CATEGORIES) {
        if (journeyCat.slugs.some(s => postSlugs.some(ps => ps.includes(s)) || postNames.some(pn => pn.includes(s)))) {
          groups[journeyCat.key].push(post);
          placed = true;
          break;
        }
      }
      if (!placed) groups['other'].push(post);
    });
    return groups;
  }, [wpPosts]);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') return wpPosts;
    return categorizedPosts[activeCategory] || [];
  }, [activeCategory, wpPosts, categorizedPosts]);

  const featuredPost = useMemo(() => {
    return wpPosts.find(p => p.featuredImage) || wpPosts[0] || null;
  }, [wpPosts]);

  const handleAdvancedSearch = async () => {
    setShowAdvancedSearch(false);
    setSearching(true);
    setSearchError(null);
    setResults([]);
    setReasoning(null);
    setNonCourseMessage(null);
    setShowSearchResults(true);

    try {
      // Construct natural language query from filters
      const queryParts: string[] = [];
      
      if (advancedFilters.isFree) queryParts.push('tuition-free');
      else if (advancedFilters.tuitionMin || advancedFilters.tuitionMax) {
        if (advancedFilters.tuitionMin && advancedFilters.tuitionMax) {
          queryParts.push(`tuition between €${advancedFilters.tuitionMin} and €${advancedFilters.tuitionMax}`);
        } else if (advancedFilters.tuitionMin) {
          queryParts.push(`tuition minimum €${advancedFilters.tuitionMin}`);
        } else if (advancedFilters.tuitionMax) {
          queryParts.push(`tuition maximum €${advancedFilters.tuitionMax}`);
        }
      }
      
      if (advancedFilters.subjectArea) queryParts.push(advancedFilters.subjectArea);
      if (advancedFilters.degreeLevel) queryParts.push(advancedFilters.degreeLevel);
      if (advancedFilters.language) queryParts.push(`in ${advancedFilters.language}`);
      if (advancedFilters.city) queryParts.push(`in ${advancedFilters.city}`);
      if (advancedFilters.intake) queryParts.push(`${advancedFilters.intake} intake`);
      if (advancedFilters.onlineAvailable) queryParts.push('online');
      if (advancedFilters.scholarshipAvailable) queryParts.push('with scholarships');
      if (advancedFilters.englishRequired) queryParts.push('english proficiency required');
      if (advancedFilters.germanRequired) queryParts.push('german proficiency required');
      if (advancedFilters.ieltsRequired) queryParts.push('ielts required');
      if (advancedFilters.toeflRequired) queryParts.push('toefl required');
      
      const constructedQuery = queryParts.length > 0 ? queryParts.join(' ') : 'programs in Germany';
      
      const res = await fetch('/api/course-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: constructedQuery, limit: SEARCH_RESULTS_LIMIT }),
      });
      
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      
      if (data.is_course_related === false) {
        setNonCourseMessage(data.message || 'Please search for academic programs.');
      } else {
        setResults(data.programs || []);
        setReasoning(data.reasoning || 'Advanced filter search');
      }
    } catch (err) {
      setSearchError('Failed to search programs. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setSearchError(null);
    setResults([]);
    setReasoning(null);
    setNonCourseMessage(null);
    setShowSearchResults(true);
    try {
      const res = await fetch('/api/course-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), limit: SEARCH_RESULTS_LIMIT }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || 'Something went wrong');
      const data = await res.json();
      if (data.is_non_course_query) {
        setNonCourseMessage(data.reasoning || 'Try describing a university program.');
      } else {
        setResults(data.programs || []);
        setReasoning(data.reasoning || null);
      }
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleShortlist = async (program: ProgramSummary) => {
    if (!isAuthenticated) { setSignInToast(true); setTimeout(() => setSignInToast(false), 4000); return; }
    const already = shortlistedPrograms.includes(program.id);
    setShortlistingId(program.id);
    try {
      if (already) {
        const response = await fetch(`/api/shortlist?programId=${program.id}`, { method: 'DELETE' });
        if (!response.ok) {
          const error = await response.json().catch(() => null);
          throw new Error(error?.message || error?.error || 'Failed to remove from shortlist');
        }
        setShortlistedPrograms(p => p.filter(id => id !== program.id));
      } else {
        const response = await fetch('/api/shortlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ programId: program.id, programName: program.program_name, university: program.university, notes: '' }),
        });
        if (!response.ok) {
          const error = await response.json().catch(() => null);
          throw new Error(error?.message || error?.error || 'Failed to save program');
        }
        setShortlistedPrograms(p => [...p, program.id]);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update shortlist');
    } finally { setShortlistingId(null); }
  };

  const closeSearchModal = () => {
    setShowSearchResults(false);
    setRestoreSearchAfterModal(false);
  };

  const handleProgramCardClick = (programId: string) => {
    setSelectedProgramId(programId);
    setRestoreSearchAfterModal(true);
    setShowSearchResults(false);
  };

  const handleProgramModalClose = () => {
    setSelectedProgramId(null);
    if (restoreSearchAfterModal) {
      setShowSearchResults(true);
      setRestoreSearchAfterModal(false);
    }
  };

  return (
    <div className="homepage-root">

      {signInToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[60]">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white border border-gray-200 shadow-lg">
            <Bookmark className="w-4 h-4 flex-shrink-0" style={{ color: RED }} />
            <p className="text-gray-800 text-sm font-medium">Sign in to save programs</p>
            <Link href="/auth/signin" className="ml-1 px-3 py-1 rounded-lg text-white text-xs font-semibold" style={{ background: RED }}>Sign in</Link>
            <button onClick={() => setSignInToast(false)}><X className="w-3.5 h-3.5 text-gray-400" /></button>
          </div>
        </div>
      )}

      {selectedProgramId && (
        <ProgramModal
          programId={selectedProgramId}
          isShortlisted={shortlistedPrograms.includes(selectedProgramId)}
          onClose={handleProgramModalClose}
          onToggleShortlist={() => {
            const prog = results.find(r => r.id === selectedProgramId);
            if (prog) handleShortlist(prog);
          }}
        />
      )}

      {showSearchResults && (
        <div className="search-modal-overlay" onClick={closeSearchModal}>
          <div className="search-modal-content" onClick={e => e.stopPropagation()}>
            <div className="search-modal-header">
              <div className="flex-1">
                {!searching && results.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-white" />
                      </div>
                      <h1 className="text-2xl font-bold text-slate-900">{filteredResults.length} Programs</h1>
                    </div>
                  </div>
                )}
                {!searching && results.length === 0 && (
                  <h1 className="text-2xl font-bold text-slate-900">Search Results</h1>
                )}
                {reasoning && !searching && (
                  <p className="text-sm text-slate-600 mt-1">Search: {reasoning}</p>
                )}
              </div>
              <button onClick={closeSearchModal} className="search-modal-close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="search-modal-body">
              {!searching && results.length > 0 && (
                <div className="flex gap-3 mb-6 pb-4 border-b border-slate-200 flex-wrap">
                  <select 
                    value={filters.language} 
                    onChange={(e) => setFilters({...filters, language: e.target.value})}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">All Languages</option>
                    <option value="english">English</option>
                    <option value="german">German</option>
                  </select>
                  <select 
                    value={filters.degreeLevel} 
                    onChange={(e) => setFilters({...filters, degreeLevel: e.target.value})}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">All Degrees</option>
                    <option value="bachelor">Bachelor</option>
                    <option value="master">Master</option>
                    <option value="phd">PhD</option>
                    <option value="language_course">Language Course</option>
                  </select>
                  <select 
                    value={filters.tuition} 
                    onChange={(e) => setFilters({...filters, tuition: e.target.value})}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">All Tuition</option>
                    <option value="free">Free / No Tuition</option>
                    <option value="paid">With Tuition Fee</option>
                  </select>
                </div>
              )}
              {searching && (
                <div className="search-modal-loading">
                  <div className="modern-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                  </div>
                  <p className="loading-text">Finding the best programs for you...</p>
                </div>
              )}
              {searchError && (
                <div className="search-modal-error">
                  <p className="error-title">Search Error</p>
                  <p>{searchError}</p>
                </div>
              )}
              {!searching && nonCourseMessage && (
                <div className="search-modal-message"><p>{nonCourseMessage}</p></div>
              )}
              {!searching && results.length > 0 && (
                <>
                  {filteredResults.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <p className="text-slate-600">No programs match your filters. Try adjusting your selection.</p>
                    </div>
                  )}
                  <div className="program-list">
                      {filteredResults.map(program => (
                        <ProgramCard 
                          key={program.id}
                          program={program}
                          onClick={() => handleProgramCardClick(program.id)}
                        />
                      ))}
                </div>
                </>
              )}
              {!searching && !searchError && !nonCourseMessage && results.length === 0 && (
                <div className="search-modal-empty">
                  <Search className="w-12 h-12 mx-auto mb-4" style={{ color: '#cbd5e1' }} />
                  <p>No results yet. Try searching for a program above.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <SiteNav />

      {/* Advanced Search Modal */}
      {showAdvancedSearch && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, overflowY: 'auto' }} onClick={() => setShowAdvancedSearch(false)}>
          <div style={{ background: '#fff', borderRadius: 24, maxWidth: 800, width: '100%', padding: 32, boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', maxHeight: 'calc(100vh - 40px)', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #dd0000, #b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Filter className="w-6 h-6" style={{ color: '#fff' }} />
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 800, color: '#111', margin: 0, lineHeight: 1.2 }}>Advanced Search</h2>
                  <p style={{ fontSize: 14, color: '#666', margin: 0 }}>Find programs with precise filters</p>
                </div>
              </div>
              <button onClick={() => setShowAdvancedSearch(false)} style={{ width: 40, height: 40, borderRadius: 12, background: '#f5f5f5', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f5f5f5'; }}>
                <X className="w-5 h-5" style={{ color: '#666' }} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>Degree Level</label>
                <select value={advancedFilters.degreeLevel} onChange={(e) => setAdvancedFilters({...advancedFilters, degreeLevel: e.target.value})} style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e5e5', borderRadius: 12, fontSize: 15, fontWeight: 500, outline: 'none', transition: 'all 0.2s' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#dd0000'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e5e5e5'; }}>
                  <option value="">All Levels</option>
                  <option value="bachelor">Bachelor</option>
                  <option value="master">Master</option>
                  <option value="phd">PhD / Doctorate</option>
                  <option value="language_course">Language Course</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>Language of Study</label>
                <select value={advancedFilters.language} onChange={(e) => setAdvancedFilters({...advancedFilters, language: e.target.value})} style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e5e5', borderRadius: 12, fontSize: 15, fontWeight: 500, outline: 'none', transition: 'all 0.2s' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#dd0000'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e5e5e5'; }}>
                  <option value="">Any Language</option>
                  <option value="english">English</option>
                  <option value="german">German</option>
                  <option value="bilingual">Bilingual (English & German)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>City</label>
                <input type="text" value={advancedFilters.city} onChange={(e) => setAdvancedFilters({...advancedFilters, city: e.target.value})} placeholder="e.g. Berlin, Munich" style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e5e5', borderRadius: 12, fontSize: 15, fontWeight: 500, outline: 'none', transition: 'all 0.2s' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#dd0000'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e5e5e5'; }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>Subject Area</label>
                <select value={advancedFilters.subjectArea} onChange={(e) => setAdvancedFilters({...advancedFilters, subjectArea: e.target.value})} style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e5e5', borderRadius: 12, fontSize: 15, fontWeight: 500, outline: 'none', transition: 'all 0.2s' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#dd0000'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e5e5e5'; }}>
                  <option value="">All Subjects</option>
                  <option value="engineering">Engineering</option>
                  <option value="computer science">Computer Science & IT</option>
                  <option value="business">Business & Management</option>
                  <option value="economics">Economics</option>
                  <option value="natural sciences">Natural Sciences</option>
                  <option value="medicine">Medicine & Health</option>
                  <option value="social sciences">Social Sciences</option>
                  <option value="arts">Arts & Humanities</option>
                  <option value="law">Law</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="architecture">Architecture</option>
                  <option value="design">Design</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>Intake Season</label>
                <select value={advancedFilters.intake} onChange={(e) => setAdvancedFilters({...advancedFilters, intake: e.target.value})} style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e5e5', borderRadius: 12, fontSize: 15, fontWeight: 500, outline: 'none', transition: 'all 0.2s' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#dd0000'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e5e5e5'; }}>
                  <option value="">Any Intake</option>
                  <option value="winter">Winter Semester</option>
                  <option value="summer">Summer Semester</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 12 }}>Tuition Fee Range (EUR/year)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input type="number" value={advancedFilters.tuitionMin} onChange={(e) => setAdvancedFilters({...advancedFilters, tuitionMin: e.target.value})} placeholder="Min (e.g. 0)" style={{ padding: '12px 14px', border: '2px solid #e5e5e5', borderRadius: 12, fontSize: 15, fontWeight: 500, outline: 'none', transition: 'all 0.2s' }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#dd0000'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#e5e5e5'; }} />
                  <input type="number" value={advancedFilters.tuitionMax} onChange={(e) => setAdvancedFilters({...advancedFilters, tuitionMax: e.target.value})} placeholder="Max (e.g. 5000)" style={{ padding: '12px 14px', border: '2px solid #e5e5e5', borderRadius: 12, fontSize: 15, fontWeight: 500, outline: 'none', transition: 'all 0.2s' }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#dd0000'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#e5e5e5'; }} />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 12 }}>Additional Filters</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: advancedFilters.isFree ? '#f0fdf4' : '#f9fafb', border: `2px solid ${advancedFilters.isFree ? '#16a34a' : '#e5e7eb'}`, borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
                  <input type="checkbox" checked={advancedFilters.isFree} onChange={(e) => setAdvancedFilters({...advancedFilters, isFree: e.target.checked})} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: advancedFilters.isFree ? '#16a34a' : '#374151' }}>Tuition-Free Only</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: advancedFilters.onlineAvailable ? '#eff6ff' : '#f9fafb', border: `2px solid ${advancedFilters.onlineAvailable ? '#3b82f6' : '#e5e7eb'}`, borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
                  <input type="checkbox" checked={advancedFilters.onlineAvailable} onChange={(e) => setAdvancedFilters({...advancedFilters, onlineAvailable: e.target.checked})} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: advancedFilters.onlineAvailable ? '#3b82f6' : '#374151' }}>Online/E-Learning</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: advancedFilters.scholarshipAvailable ? '#fef3c7' : '#f9fafb', border: `2px solid ${advancedFilters.scholarshipAvailable ? '#f59e0b' : '#e5e7eb'}`, borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
                  <input type="checkbox" checked={advancedFilters.scholarshipAvailable} onChange={(e) => setAdvancedFilters({...advancedFilters, scholarshipAvailable: e.target.checked})} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: advancedFilters.scholarshipAvailable ? '#f59e0b' : '#374151' }}>Scholarships Available</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: advancedFilters.englishRequired ? '#fce7f3' : '#f9fafb', border: `2px solid ${advancedFilters.englishRequired ? '#ec4899' : '#e5e7eb'}`, borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
                  <input type="checkbox" checked={advancedFilters.englishRequired} onChange={(e) => setAdvancedFilters({...advancedFilters, englishRequired: e.target.checked})} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: advancedFilters.englishRequired ? '#ec4899' : '#374151' }}>English Proficiency Required</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setAdvancedFilters({ degreeLevel: '', city: '', language: '', tuitionMin: '', tuitionMax: '', isFree: false, intake: '', ieltsRequired: false, toeflRequired: false, germanRequired: false, englishRequired: false, onlineAvailable: false, scholarshipAvailable: false, subjectArea: '' })} style={{ flex: 1, padding: '14px 24px', background: '#f5f5f5', border: '1px solid #e5e5e5', borderRadius: 14, fontSize: 15, fontWeight: 700, color: '#555', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e5e5e5'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f5f5f5'; }}>
                Clear All
              </button>
              <button onClick={handleAdvancedSearch} style={{ flex: 2, padding: '14px 24px', background: 'linear-gradient(135deg, #dd0000, #b91c1c)', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(221, 0, 0, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(221, 0, 0, 0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(221, 0, 0, 0.3)'; }}>
                <Sparkles className="w-5 h-5" /> Search Programs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ HERO ══ */}
      <section className="hero-section" id="hero">
        <div className="hero-bg-orbs">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>
        <div className="hero-content">
          <div className="hero-badge animate-fade-up-1">
            <span className="hero-badge-dot" />
            <span>AI-POWERED · 20,000+ PROGRAMS</span>
          </div>
          <h1 className="hero-title animate-fade-up-2">
            <span className="hero-slide-text" key={heroSlideIndex}>
              {heroSlides[heroSlideIndex].main}<br />
              <span className="hero-title-gradient">{heroSlides[heroSlideIndex].highlight}</span>
            </span>
          </h1>
          <p className="hero-subtitle animate-fade-up-3">
            Find your perfect German university program with AI-powered search. Get personalized guidance, build your application, and track your progress — all without paying expensive consultant fees. Join 2,500+ students who found their path to Germany.
          </p>
          <form onSubmit={handleSearch} className="hero-search-form animate-fade-up-4">
            <div className="hero-search-bar">
              <Search className="hero-search-icon" />
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch(e as unknown as FormEvent); } }}
                rows={1}
                placeholder="e.g. tuition-free data science master in English, Berlin intake 2025"
                className="hero-search-input"
              />
              <button type="button" onClick={() => setShowAdvancedSearch(true)} className="hero-advanced-btn" title="Advanced Search">
                <Settings className="w-5 h-5" />
              </button>
              <button type="submit" disabled={searching || !query.trim()} className="hero-search-btn">
                {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
              </button>
            </div>
          </form>
          <div className="hero-suggestions animate-fade-up-4">
            {HERO_SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => setQuery(s)} className="hero-chip">{s}</button>
            ))}
          </div>
          <div className="hero-trust animate-fade-up-4">
            <div className="hero-trust-item"><Shield className="w-4 h-4" /><span>Free to use</span></div>
            <div className="hero-trust-divider" />
            <div className="hero-trust-item"><Users className="w-4 h-4" /><span>2,500+ students helped</span></div>
            <div className="hero-trust-divider" />
            <div className="hero-trust-item"><Globe className="w-4 h-4" /><span>All German universities</span></div>
          </div>
        </div>
      </section>

      {/* ══ GUIDES & RESOURCES ══ */}
      <section className="guides-section" id="guides">
        <div className="section-container">
          <div className="section-header scroll-reveal">
            <div className="section-label">Guides & Resources</div>
            <h2 className="section-title">Everything you need to know</h2>
            <p className="section-desc">Browse guides by topic or search for specific information</p>
          </div>

          <div className="guides-search-wrapper scroll-reveal">
            <div className="guides-search-bar">
              <Search className="w-5 h-5" style={{ color: '#737373' }} />
              <input
                type="text"
                placeholder="Search guides: visa, housing, jobs..."
                className="guides-search-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const searchQuery = (e.target as HTMLInputElement).value;
                    if (searchQuery.trim()) {
                      window.location.href = `/blog?search=${encodeURIComponent(searchQuery.trim())}`;
                    }
                  }
                }}
              />
              <Link href="/blog" className="guides-browse-btn">
                Browse All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Featured Articles */}
          {!postsLoading && filteredPosts.length > 0 && (
            <div className="guides-articles scroll-reveal">
              <h3 className="guides-section-title">Featured Guides</h3>
              <div className="guides-articles-row">
                {filteredPosts.slice(0, 3).map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="guides-article-card">
                    <div className="guides-article-image">
                      {post.featuredImage ? (
                        <Image src={post.featuredImage} alt={stripHtml(post.title)} loading="lazy" className="guides-article-img" width={300} height={160} />
                      ) : (
                        <div className="guides-article-img-placeholder"><BookOpen className="w-6 h-6" style={{ color: '#d4d4d4' }} /></div>
                      )}
                      {post.categories[0] && <span className="guides-article-badge">{decodeHtmlEntities(post.categories[0].name)}</span>}
                    </div>
                    <div className="guides-article-body">
                      <h4 className="guides-article-title">{stripHtml(post.title)}</h4>
                      <p className="guides-article-excerpt">{stripHtml(post.excerpt)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Latest Articles */}
          {!postsLoading && filteredPosts.length > 3 && (
            <div className="guides-articles scroll-reveal">
              <h3 className="guides-section-title">Latest Guides</h3>
              <div className="guides-articles-row">
                {filteredPosts.slice(3, 6).map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="guides-article-card">
                    <div className="guides-article-image">
                      {post.featuredImage ? (
                        <Image src={post.featuredImage} alt={stripHtml(post.title)} loading="lazy" className="guides-article-img" width={300} height={160} />
                      ) : (
                        <div className="guides-article-img-placeholder"><BookOpen className="w-6 h-6" style={{ color: '#d4d4d4' }} /></div>
                      )}
                      {post.categories[0] && <span className="guides-article-badge">{decodeHtmlEntities(post.categories[0].name)}</span>}
                    </div>
                    <div className="guides-article-body">
                      <h4 className="guides-article-title">{stripHtml(post.title)}</h4>
                      <p className="guides-article-excerpt">{stripHtml(post.excerpt)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {postsLoading && (
            <div className="guides-articles scroll-reveal">
              <div className="guides-articles-row">
                {[1,2,3].map(i => (
                  <div key={i} className="guides-article-skeleton">
                    <div className="guides-skeleton-image" />
                    <div className="guides-skeleton-body">
                      <div className="guides-skeleton-line w80" />
                      <div className="guides-skeleton-line w60" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="stats-section">
        <div className="stats-bg-pattern" />
        <div className="section-container stats-grid">
          {[
            { num: '20,000+', label: 'Programs indexed', icon: GraduationCap },
            { num: '2,500+', label: 'Students helped', icon: Users },
            { num: 'AI-Powered', label: 'Smart tools', icon: Zap },
            { num: '100+', label: 'Expert guides', icon: BookOpen },
          ].map(({ num, label, icon: Icon }, idx) => (
            <div key={label} className="stat-card scroll-reveal" style={{ transitionDelay: `${idx * 0.1}s` }}>
              <div className="stat-icon-wrap"><Icon className="w-6 h-6" /></div>
              <p className="stat-number">{num}</p>
              <p className="stat-label">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="testimonial-section" id="stories">
        <div className="section-container">
          <div className="section-header scroll-reveal">
            <div className="section-label">Student Voices</div>
            <h2 className="section-title">Loved by applicants across Asia & Africa</h2>
            <p className="section-desc">Real students using German Path to unlock admissions, scholarships, and visas — Pakistani, Indian, Nigerian, Kenyan and more.</p>
          </div>

          <div className="testimonial-grid">
            {TESTIMONIALS.map((person, idx) => (
              <article key={person.name} className="testimonial-card scroll-reveal" style={{ transitionDelay: `${idx * 0.08}s` }}>
                <div className="testimonial-card-header">
                  <div className="testimonial-avatar">{person.avatar}</div>
                  <div className="testimonial-info">
                    <p className="testimonial-name">{person.name}</p>
                    <p className="testimonial-country">{person.country}</p>
                  </div>
                  <span className="testimonial-highlight">{person.highlight}</span>
                </div>
                <p className="testimonial-quote">{person.quote}</p>
                <p className="testimonial-track">{person.track}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TOOLS ══ */}
      <section className="tools-section" id="tools">
        <div className="section-container">
          <div className="section-header scroll-reveal">
            <div className="section-label">AI Tools</div>
            <h2 className="section-title">Everything you need to apply</h2>
            <p className="section-desc">AI-powered assistants for CVs, cover letters, GPA conversion — free to try, with credits for extended AI use.</p>
          </div>
          <div className="tools-grid">
            {TOOLS.map(({ href, label, desc, icon: Icon, gradient }, idx) => (
              <Link key={href} href={href} className="tool-card scroll-reveal" style={{ transitionDelay: `${idx * 0.08}s` }}>
                <div className={`tool-icon bg-gradient-to-br ${gradient}`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="tool-info">
                  <h3 className="tool-label">{label}</h3>
                  <p className="tool-desc">{desc}</p>
                </div>
                <div className="tool-arrow"><ArrowRight className="w-5 h-5" /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHO IS GERMAN PATH FOR ══ */}
      <section className="about-section scroll-reveal" id="about">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">About German Path</div>
            <h2 className="section-title">Who is German Path for?</h2>
            <p className="section-desc">
              German Path (GermanPath UG) is an AI-powered platform helping international students study in Germany. 
              Whether you&apos;re from Pakistan, India, Bangladesh, Nigeria, or anywhere else in the world — we&apos;re here to guide you.
            </p>
          </div>
          <div className="about-grid">
            <div className="about-card">
              <div className="about-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3>Bachelor & Master Students</h3>
              <p>Search 20,000+ English-taught degree programs at German universities, from tuition-free public universities to top private institutions.</p>
            </div>
            <div className="about-card">
              <div className="about-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3>Non-EU International Students</h3>
              <p>Get guidance on student visas, blocked accounts, health insurance, and everything non-EU students need to study in Germany legally.</p>
            </div>
            <div className="about-card">
              <div className="about-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3>Career-Focused Applicants</h3>
              <p>Build German-style CVs, write motivation letters, and prepare applications that meet German university standards — all with AI assistance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="howto-section scroll-reveal">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Your Journey</div>
            <h2 className="section-title">5 steps to study in Germany</h2>
          </div>
          <div className="howto-grid">
            <div className="howto-card">
              <div className="howto-number">1</div>
              <h3>Find Programs</h3>
              <p>Search 20,000+ English-taught degrees</p>
            </div>
            <div className="howto-card">
              <div className="howto-number">2</div>
              <h3>Prepare Docs</h3>
              <p>CV, motivation letter & transcripts</p>
            </div>
            <div className="howto-card">
              <div className="howto-number">3</div>
              <h3>Apply</h3>
              <p>Submit via uni-assist or directly</p>
            </div>
            <div className="howto-card">
              <div className="howto-number">4</div>
              <h3>Get Visa</h3>
              <p>Blocked account + health insurance</p>
            </div>
            <div className="howto-card">
              <div className="howto-number">5</div>
              <h3>Arrive</h3>
              <p>Register & start your studies</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="faq-section scroll-reveal" id="faq">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Common Questions</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-desc">Quick answers to the most common questions about studying in Germany.</p>
          </div>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Is studying in Germany really free?</h3>
              <p>Yes! Most public universities in Germany charge no tuition fees for bachelor and master programs — even for international students. You only pay a semester fee of €150-350 which includes public transport.</p>
            </div>
            <div className="faq-item">
              <h3>Do I need to speak German?</h3>
              <p>Not necessarily. There are 2,000+ English-taught programs in Germany. However, learning basic German helps with daily life and job opportunities after graduation.</p>
            </div>
            <div className="faq-item">
              <h3>How much money do I need for a student visa?</h3>
              <p>You need to prove €11,904 per year (€992/month) in a blocked account. This is the minimum required for a German student visa as of 2024.</p>
            </div>
            <div className="faq-item">
              <h3>Can I work while studying?</h3>
              <p>Yes! International students can work 140 full days or 280 half days per year. Many students work part-time jobs to cover living expenses.</p>
            </div>
            <div className="faq-item">
              <h3>What are the requirements for admission?</h3>
              <p>Requirements vary by program, but typically include: recognized school-leaving certificate, language proficiency (English/German), and sometimes entrance exams or portfolios.</p>
            </div>
            <div className="faq-item">
              <h3>Can I stay in Germany after graduation?</h3>
              <p>Yes! Graduates get an 18-month job-seeker visa to find employment in Germany. With a job, you can transition to a work permit and eventually permanent residency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="cta-section scroll-reveal">
        <div className="cta-bg" />
        <div className="section-container cta-content">
          <h2 className="cta-title">Ready to start your Germany journey?</h2>
          <p className="cta-desc">Search 20,000+ programs and use our AI tools to prepare your application. Start free, upgrade anytime.</p>
          <a href="#hero" className="cta-btn-primary"><Search className="w-5 h-5" />Search Programs Now</a>
        </div>
      </section>

      {/* ══ MOBILE BOTTOM TAB BAR ══ */}
      <nav className="mobile-tab-bar">
        <a href="#hero"><Search className="w-5 h-5" /><span>Search</span></a>
        <a href="#guides"><BookOpen className="w-5 h-5" /><span>Guides</span></a>
        <a href="#tools"><Zap className="w-5 h-5" /><span>Tools</span></a>
        <Link href={isAuthenticated ? '/dashboard' : '/auth/signin'}>
          <LayoutDashboard className="w-5 h-5" /><span>{isAuthenticated ? 'Dashboard' : 'Sign in'}</span>
        </Link>
      </nav>

    </div>
  );
}
