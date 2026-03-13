'use client';

import { useState, useEffect, useMemo, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { 
  Search, Loader2, Bookmark, X, ArrowRight, BookOpen, Newspaper, Calendar,
  GraduationCap, FileText, Languages, Home, Briefcase, CreditCard, Shield,
  Plane, Star, Zap, TrendingUp, Users, Globe, Clock, Calculator, LayoutDashboard
} from 'lucide-react';
import { ProgramModal } from '@/components/ProgramModal';
import type { ProgramSummary } from '@/lib/types';
import { SiteNav } from '@/components/SiteNav';

const RED = '#dd0000';

const HERO_SUGGESTIONS = [
  'English-taught master in AI',
  'No-tuition engineering bachelor',
  'MBA in Berlin · summer intake',
];

const TOOLS = [
  { href: '/cv-maker',                  label: 'AI CV Maker',            desc: 'Build a German-format CV in minutes with AI assistance',              icon: FileText,    gradient: 'from-red-500 to-rose-600' },
  { href: '/cover-letter',              label: 'Cover Letter',           desc: 'Draft professional cover letters tailored to German employers',        icon: Briefcase,   gradient: 'from-amber-500 to-orange-600' },
  { href: '/motivation-letter',         label: 'Motivation Letter',      desc: 'Create compelling motivation letters for university applications',     icon: Star,        gradient: 'from-violet-500 to-purple-600' },
  { href: '/gpa-converter',             label: 'GPA Converter',          desc: 'Convert your grades to the German grading scale instantly',           icon: TrendingUp,  gradient: 'from-emerald-500 to-green-600' },
  { href: '/netto-brutto-calculator',   label: 'Salary Calculator',      desc: 'Calculate your net salary after German taxes and deductions',         icon: Calculator,  gradient: 'from-teal-500 to-cyan-600' },
  { href: '/dashboard',                 label: 'My Dashboard',           desc: 'Track your applications, shortlists and study plans',                 icon: Zap,         gradient: 'from-blue-500 to-indigo-600' },
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
  const [shortlistedPrograms, setShortlistedPrograms] = useState<string[]>([]);
  const [shortlistingId, setShortlistingId] = useState<string | null>(null);
  const [signInToast, setSignInToast] = useState(false);
  const [wpPosts, setWpPosts] = useState<WpPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }),
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [wpPosts, postsLoading, activeCategory]);

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
        body: JSON.stringify({ query: query.trim(), limit: 9 }),
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
        await fetch(`/api/shortlist?programId=${program.id}`, { method: 'DELETE' });
        setShortlistedPrograms(p => p.filter(id => id !== program.id));
      } else {
        await fetch('/api/shortlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ programId: program.id, programName: program.program_name, university: program.university, notes: '' }) });
        setShortlistedPrograms(p => [...p, program.id]);
      }
    } catch { /* silent */ } finally { setShortlistingId(null); }
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
          onClose={() => setSelectedProgramId(null)}
          onToggleShortlist={() => {
            const prog = results.find(r => r.id === selectedProgramId);
            if (prog) handleShortlist(prog);
          }}
        />
      )}

      {showSearchResults && (
        <div className="search-modal-overlay" onClick={() => setShowSearchResults(false)}>
          <div className="search-modal-content" onClick={e => e.stopPropagation()}>
            <div className="search-modal-header">
              <div>
                <h1 className="search-modal-title">
                  {searching ? 'Searching programs...' : results.length > 0 ? `Found ${results.length} programs` : 'Search Results'}
                </h1>
                {reasoning && !searching && <p className="search-modal-subtitle">{reasoning}</p>}
              </div>
              <button onClick={() => setShowSearchResults(false)} className="search-modal-close">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="search-modal-body">
              {searching && (
                <div className="search-modal-loading">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" style={{ color: RED }} />
                  <p>Finding the best programs for you...</p>
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
                <div className="search-results-grid">
                  {results.map(program => (
                    <div key={program.id} onClick={() => { setSelectedProgramId(program.id); setShowSearchResults(false); }} className="program-card">
                      <div className="program-card-image">
                        {program.image_url && (
                          <Image src={program.image_url} alt={program.program_name} fill style={{ objectFit: 'cover' }} sizes="280px" unoptimized onError={e => { e.currentTarget.style.display = 'none'; }} />
                        )}
                        {program.is_free && <span className="program-badge-free">No Tuition</span>}
                        <button onClick={e => { e.stopPropagation(); handleShortlist(program); }} disabled={shortlistingId === program.id} className="program-bookmark-btn" style={{ color: shortlistedPrograms.includes(program.id) ? '#d97706' : '#525252' }}>
                          {shortlistingId === program.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bookmark className="w-4 h-4" style={{ fill: shortlistedPrograms.includes(program.id) ? 'currentColor' : 'none' }} />}
                        </button>
                      </div>
                      <div className="program-card-body">
                        <h4 className="program-card-title">{program.program_name}</h4>
                        <p className="program-card-uni">{program.university}{program.city ? ` · ${program.city}` : ''}</p>
                        {program.match_reason && <p className="program-card-match">{program.match_reason}</p>}
                        <div className="program-card-footer">
                          {program.tuition_fee_number != null ? <span>€{program.tuition_fee_number.toLocaleString()}</span> : program.is_free ? <span className="text-emerald-600 font-semibold">Free</span> : null}
                          {program.beginning_normalized && <span>{program.beginning_normalized}</span>}
                          <span className="program-card-view">View →</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!searching && !searchError && !nonCourseMessage && results.length === 0 && (
                <div className="search-modal-empty">
                  <Search className="w-12 h-12 mx-auto mb-4" style={{ color: '#d4d4d4' }} />
                  <p>No results yet. Try searching for a program above.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <SiteNav />

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
            Your journey to<br />
            <span className="hero-title-gradient">Germany starts here</span>
          </h1>
          <p className="hero-subtitle animate-fade-up-3">
            Search 20,000+ university programs, read step-by-step guides, and use free AI tools —
            everything international students need to study in Germany.
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
            <div className="hero-trust-item"><Shield className="w-4 h-4" /><span>Free forever</span></div>
            <div className="hero-trust-divider" />
            <div className="hero-trust-item"><Users className="w-4 h-4" /><span>15,000+ students helped</span></div>
            <div className="hero-trust-divider" />
            <div className="hero-trust-item"><Globe className="w-4 h-4" /><span>All German universities</span></div>
          </div>
        </div>
      </section>

      {/* ══ STUDENT JOURNEY ARTICLES ══ */}
      <section className="journey-section" id="guides">
        <div className="section-container">
          <div className="section-header scroll-reveal">
            <div className="section-label">Your Student Journey</div>
            <h2 className="section-title">Step-by-step guides for every stage</h2>
            <p className="section-desc">From your first visa application to landing a job — organized by the stages of your Germany experience.</p>
          </div>

          <div className="journey-pills scroll-reveal">
            <button className={`journey-pill ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>
              <BookOpen className="w-4 h-4" /> All Articles
            </button>
            {JOURNEY_CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const count = categorizedPosts[cat.key]?.length || 0;
              return (
                <button key={cat.key} className={`journey-pill ${activeCategory === cat.key ? 'active' : ''}`} onClick={() => setActiveCategory(cat.key)} style={{ '--pill-color': cat.color } as React.CSSProperties}>
                  <Icon className="w-4 h-4" />
                  {cat.label}
                  {count > 0 && <span className="journey-pill-count">{count}</span>}
                </button>
              );
            })}
          </div>

          {activeCategory === 'all' && featuredPost && !postsLoading && (
            <Link href={`/blog/${featuredPost.slug}`} className="featured-card scroll-reveal">
              <div className="featured-card-image">
                {featuredPost.featuredImage ? (
                  <Image src={featuredPost.featuredImage} alt={stripHtml(featuredPost.title)} className="featured-img" width={800} height={450} loading="lazy" />
                ) : (
                  <div className="featured-img-placeholder">
                    <BookOpen className="w-16 h-16" style={{ color: 'rgba(255,255,255,0.3)' }} />
                  </div>
                )}
                <div className="featured-card-overlay" />
                <div className="featured-card-content">
                  {featuredPost.categories[0] && <span className="featured-badge">{decodeHtmlEntities(featuredPost.categories[0].name)}</span>}
                  <h3 className="featured-title">{stripHtml(featuredPost.title)}</h3>
                  <p className="featured-excerpt">{stripHtml(featuredPost.excerpt)}</p>
                  <div className="featured-meta">
                    <Clock className="w-3.5 h-3.5" /><span>{timeAgo(featuredPost.date)}</span>
                    <span className="featured-read">Read article <ArrowRight className="w-3.5 h-3.5" /></span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {postsLoading && (
            <div className="articles-grid">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="article-skeleton">
                  <div className="skeleton-image" />
                  <div className="skeleton-body">
                    <div className="skeleton-line w80" />
                    <div className="skeleton-line w60" />
                    <div className="skeleton-line w40" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!postsLoading && filteredPosts.length === 0 && (
            <div className="empty-articles scroll-reveal">
              <Newspaper className="w-12 h-12 mb-4" style={{ color: '#d4d4d4' }} />
              <p className="empty-title">No articles in this category yet</p>
              <p className="empty-desc">{activeCategory === 'all' ? 'Articles will appear here once published on WordPress.' : 'Try selecting "All Articles" or check back soon.'}</p>
            </div>
          )}

          {!postsLoading && filteredPosts.length > 0 && (
            <div className="articles-grid">
              {(activeCategory === 'all' ? filteredPosts.filter(p => p.id !== featuredPost?.id) : filteredPosts).slice(0, 9).map((post, idx) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="article-card scroll-reveal" style={{ transitionDelay: `${idx * 0.06}s` }}>
                  <div className="article-card-image">
                    {post.featuredImage ? (
                      <Image src={post.featuredImage} alt={stripHtml(post.title)} loading="lazy" className="article-img" width={400} height={225} />
                    ) : (
                      <div className="article-img-placeholder"><BookOpen className="w-8 h-8" style={{ color: '#d4d4d4' }} /></div>
                    )}
                    {post.categories[0] && <span className="article-badge">{decodeHtmlEntities(post.categories[0].name)}</span>}
                  </div>
                  <div className="article-card-body">
                    <div className="article-meta"><Calendar className="w-3 h-3" /><span>{timeAgo(post.date)}</span></div>
                    <h3 className="article-title">{stripHtml(post.title)}</h3>
                    <p className="article-excerpt">{stripHtml(post.excerpt)}</p>
                    <span className="article-link">Read article <ArrowRight className="w-3.5 h-3.5" /></span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="stats-section">
        <div className="stats-bg-pattern" />
        <div className="section-container stats-grid">
          {[
            { num: '20,000+', label: 'Study programs indexed', icon: GraduationCap },
            { num: '15,000+', label: 'Students helped', icon: Users },
            { num: '5 AI tools', label: 'Completely free', icon: Zap },
            { num: '200+', label: 'Guides & articles', icon: BookOpen },
          ].map(({ num, label, icon: Icon }, idx) => (
            <div key={label} className="stat-card scroll-reveal" style={{ transitionDelay: `${idx * 0.1}s` }}>
              <div className="stat-icon-wrap"><Icon className="w-6 h-6" /></div>
              <p className="stat-number">{num}</p>
              <p className="stat-label">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TOOLS ══ */}
      <section className="tools-section" id="tools">
        <div className="section-container">
          <div className="section-header scroll-reveal">
            <div className="section-label">Free AI Tools</div>
            <h2 className="section-title">Everything you need to apply</h2>
            <p className="section-desc">AI-powered assistants for CVs, cover letters, GPA conversion — all aligned with German standards.</p>
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

      {/* ══ CTA ══ */}
      <section className="cta-section scroll-reveal">
        <div className="cta-bg" />
        <div className="section-container cta-content">
          <h2 className="cta-title">Ready to start your Germany journey?</h2>
          <p className="cta-desc">Search programs, build your CV, and get step-by-step guidance — all for free.</p>
          <div className="cta-buttons">
            <a href="#hero" className="cta-btn-primary"><Search className="w-5 h-5" />Search Programs</a>
            <Link href="/cv-maker" className="cta-btn-secondary">Build Your CV <ArrowRight className="w-4 h-4" /></Link>
          </div>
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
