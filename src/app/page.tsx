'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import {
  Search, Loader2, Bookmark, ChevronRight,
  LogOut, X, ArrowRight, BookOpen, Newspaper, Calendar,
  MessageSquare
} from 'lucide-react';
import { ProgramModal } from '@/components/ProgramModal';
import type { ProgramSummary } from '@/lib/types';

const RED = '#dd0000';

const HERO_SUGGESTIONS = [
  'English-taught master in AI',
  'No-tuition engineering bachelor',
  'MBA in Berlin · summer intake',
];

const QUICK_TOPICS = [
  'student visa', 'blocked account', 'housing tips', 'health insurance', 'jobs in germany', 'scholarships',
];

const TOOLS = [
  { href: '/cv-maker',          label: 'AI CV Maker',       desc: 'German-format CV',          emoji: '📄' },
  { href: '/cover-letter',      label: 'Cover Letter',      desc: 'Draft & refine',             emoji: '✉️' },
  { href: '/motivation-letter', label: 'Motivation Letter', desc: 'Tailored to program',        emoji: '🎯' },
  { href: '/gpa-converter',     label: 'GPA Converter',     desc: 'Convert to German scale',    emoji: '🔢' },
  { href: '/dashboard',         label: 'My Dashboard',      desc: 'Shortlist & track apps',     emoji: '📊' },
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
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
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
    html
      .replace(/<[^>]*>/g, '')
      .replace(/\[\s*\]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim()
  );
}

function truncateText(text: string, limit = 160) {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trim()}…`;
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
  const [navQuery, setNavQuery] = useState('');
  const [navResults, setNavResults] = useState<WpPost[]>([]);
  const [navLoading, setNavLoading] = useState(false);
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const [navAllOpen, setNavAllOpen] = useState(false);
  const [navAllResults, setNavAllResults] = useState<WpPost[]>([]);
  const [navAllLoading, setNavAllLoading] = useState(false);
  const toolsScrollRef = useRef<HTMLDivElement>(null);
  const navDropdownRef = useRef<HTMLDivElement>(null);
  const navInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [wpPosts, postsLoading]);

  const scrollTools = (direction: 'left' | 'right') => {
    const container = toolsScrollRef.current;
    if (!container) return;
    const offset = direction === 'left' ? -320 : 320;
    container.scrollBy({ left: offset, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!navDropdownRef.current || !navInputRef.current) return;
      if (!navDropdownRef.current.contains(event.target as Node) && !navInputRef.current.contains(event.target as Node)) {
        setNavDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/wp-posts?per_page=6');
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

  const performNavSearch = async (value: string) => {
    if (!value || value.trim().length < 3) {
      setNavResults([]);
      setNavDropdownOpen(false);
      return;
    }
    setNavLoading(true);
    try {
      const res = await fetch(`/api/wp-posts?per_page=5&search=${encodeURIComponent(value.trim())}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setNavResults(data.posts || []);
      setNavDropdownOpen(true);
    } catch {
      setNavResults([]);
      setNavDropdownOpen(true);
    } finally {
      setNavLoading(false);
    }
  };

  const handleNavSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performNavSearch(navQuery);
  };

  const openNavAllResults = async () => {
    if (!navQuery.trim()) return;
    setNavDropdownOpen(false);
    setNavAllOpen(true);
    setNavAllLoading(true);
    try {
      const res = await fetch(`/api/wp-posts?per_page=20&search=${encodeURIComponent(navQuery.trim())}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setNavAllResults(data.posts || []);
    } catch {
      setNavAllResults([]);
    } finally {
      setNavAllLoading(false);
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
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#fff', color: '#171717', minHeight: '100vh' }}>

      {/* ── Sign-in toast ── */}
      {signInToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[60]">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white border border-gray-200 shadow-lg">
            <Bookmark className="w-4 h-4 flex-shrink-0" style={{ color: RED }} />
            <p className="text-gray-800 text-sm font-medium">Sign in to save programs</p>
            <Link href="/auth/signin" className="ml-1 px-3 py-1 rounded-lg text-white text-xs font-semibold transition-colors" style={{ background: RED }}>Sign in</Link>
            <button onClick={() => setSignInToast(false)}><X className="w-3.5 h-3.5 text-gray-400" /></button>
          </div>
        </div>
      )}

      {/* ── Program modal ── */}
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

      {/* ── Nav search all results overlay ── */}
      {navAllOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 70, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '60px 20px', overflowY: 'auto' }}
          onClick={() => setNavAllOpen(false)}>
          <div style={{ background: '#fff', borderRadius: 24, maxWidth: 720, width: '100%', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,0.35)', padding: '28px 32px' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <p style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a1a1a1', margin: 0 }}>Articles</p>
                <h3 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0' }}>Results for “{navQuery.trim()}”</h3>
              </div>
              <button onClick={() => setNavAllOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#777' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            {navAllLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#666', padding: '40px 0' }}>
                <Loader2 className="w-5 h-5 animate-spin" /> Loading articles…
              </div>
            ) : navAllResults.length === 0 ? (
              <p style={{ fontSize: 15, color: '#555' }}>No articles found. Try another keyword.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {navAllResults.map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`}
                    style={{ textDecoration: 'none', border: '1px solid #f2f2f2', borderRadius: 18, padding: '18px 22px', display: 'flex', gap: 18, alignItems: 'stretch', transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.boxShadow = '0 18px 40px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#f2f2f2'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                    {post.featuredImage ? (
                      <div style={{ width: 88, height: 88, borderRadius: 14, overflow: 'hidden', flexShrink: 0, border: '1px solid #f0f0f0', background: '#fafafa' }}>
                        <img src={post.featuredImage} alt={stripHtml(post.title)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{ width: 88, height: 88, borderRadius: 14, background: 'linear-gradient(135deg,#fff2f2,#ffecec)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Newspaper className="w-6 h-6" style={{ color: RED }} />
                      </div>
                    )}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <p style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 8px', lineHeight: 1.35 }}>{stripHtml(post.title)}</p>
                      <p style={{ fontSize: 13, color: '#5a5a5a', margin: '0 0 12px', lineHeight: 1.6 }}>{truncateText(stripHtml(post.excerpt) || 'Read full article on WordPress.')}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto' }}>
                        {post.categories?.[0] && (
                          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 10px', borderRadius: 999, background: '#fff3f3', color: RED }}>
                            {decodeHtmlEntities(post.categories[0].name)}
                          </span>
                        )}
                        <span style={{ fontSize: 12, color: '#9a9a9a' }}>{timeAgo(post.date)}</span>
                        <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: RED, display: 'inline-flex', alignItems: 'center', gap: 4 }}>Read article <ArrowRight className="w-3 h-3" /></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Search Results Modal ── */}
      {showSearchResults && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '60px 20px', overflowY: 'auto' }}
          onClick={() => setShowSearchResults(false)}>
          <div style={{ background: '#fff', borderRadius: 20, maxWidth: 1000, width: '100%', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
            onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ position: 'sticky', top: 0, background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '20px 20px 0 0', zIndex: 10 }}>
              <div>
                <h1 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: 20, fontWeight: 700, color: '#171717', margin: 0 }}>
                  {searching ? 'Searching programs...' : results.length > 0 ? `Found ${results.length} programs` : 'Search Results'}
                </h1>
                {reasoning && !searching && <p style={{ fontSize: 13, color: '#737373', margin: '4px 0 0', maxWidth: 600 }}>{reasoning}</p>}
              </div>
              <button onClick={() => setShowSearchResults(false)}
                style={{ width: 36, height: 36, borderRadius: 999, border: '1px solid #e5e5e5', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.borderColor = '#d4d4d4'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e5e5e5'; }}>
                <X className="w-4 h-4" style={{ color: '#737373' }} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px 28px 32px' }}>
              {searching && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
                  <Loader2 className="w-8 h-8 animate-spin mb-4" style={{ color: RED }} />
                  <p style={{ fontSize: 15, color: '#737373', fontWeight: 500 }}>Finding the best programs for you...</p>
                </div>
              )}

              {searchError && (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <p style={{ fontSize: 15, color: RED, fontWeight: 600, marginBottom: 8 }}>Search Error</p>
                  <p style={{ fontSize: 14, color: '#737373' }}>{searchError}</p>
                </div>
              )}

              {!searching && nonCourseMessage && (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <p style={{ fontSize: 15, color: '#737373', lineHeight: 1.65, maxWidth: 500, margin: '0 auto' }}>{nonCourseMessage}</p>
                </div>
              )}

              {!searching && results.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {results.map(program => (
                    <div key={program.id}
                      onClick={() => { setSelectedProgramId(program.id); setShowSearchResults(false); }}
                      style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                      
                      <div style={{ position: 'relative', height: 140, background: '#f0f0f0' }}>
                        {program.image_url && (
                          <Image src={program.image_url} alt={program.program_name} fill style={{ objectFit: 'cover' }} sizes="280px" unoptimized onError={e => { e.currentTarget.style.display = 'none'; }} />
                        )}
                        {program.is_free && (
                          <span style={{ position: 'absolute', top: 10, left: 10, background: '#16a34a', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99 }}>No Tuition</span>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); handleShortlist(program); }}
                          disabled={shortlistingId === program.id}
                          style={{ position: 'absolute', top: 10, right: 10, padding: 7, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 999, cursor: 'pointer', color: shortlistedPrograms.includes(program.id) ? '#d97706' : '#525252', transition: 'all 0.2s' }}>
                          {shortlistingId === program.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bookmark className="w-4 h-4" style={{ fill: shortlistedPrograms.includes(program.id) ? 'currentColor' : 'none' }} />}
                        </button>
                      </div>

                      <div style={{ padding: '14px 16px' }}>
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#171717', lineHeight: 1.4, margin: '0 0 6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {program.program_name}
                        </h4>
                        <p style={{ fontSize: 12, color: '#737373', margin: '0 0 8px', lineHeight: 1.4 }}>
                          {program.university}{program.city ? ` · ${program.city}` : ''}
                        </p>
                        {program.match_reason && (
                          <p style={{ fontSize: 11, color: '#16a34a', lineHeight: 1.5, margin: '0 0 10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {program.match_reason}
                          </p>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#a3a3a3', paddingTop: 10, borderTop: '1px solid #ebebeb' }}>
                          {program.tuition_fee_number != null ? <span>€{program.tuition_fee_number.toLocaleString()}</span> : program.is_free ? <span style={{ color: '#16a34a', fontWeight: 600 }}>Free</span> : null}
                          {program.beginning_normalized && <span>{program.beginning_normalized}</span>}
                          <span style={{ marginLeft: 'auto', color: RED, fontWeight: 700, fontSize: 12 }}>View →</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!searching && !searchError && !nonCourseMessage && results.length === 0 && (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <Search className="w-12 h-12 mx-auto mb-4" style={{ color: '#d4d4d4' }} />
                  <p style={{ fontSize: 15, color: '#737373' }}>No results yet. Try searching for a program above.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══ HEADER ══ */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Image src="/logo_wp.png" alt="Students in Germany" width={140} height={44} style={{ objectFit: 'contain' }} priority />
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {[
              { label: 'Guides', href: '#guides' },
              { label: 'Universities', href: '#universities' },
              { label: 'Tools', href: '#tools' },
              { label: 'Course Finder', href: '#search' },
              { label: 'Contact', href: 'http://localhost:8000/#contact' },
            ].map(({ label, href }) => (
              <a key={label} href={href}
                style={{ fontSize: 14, fontWeight: 600, color: '#404040', textDecoration: 'none', letterSpacing: '0.01em' }}
                onMouseEnter={e => (e.currentTarget.style.color = RED)}
                onMouseLeave={e => (e.currentTarget.style.color = '#404040')}>
                {label}
              </a>
            ))}
            <form onSubmit={handleNavSearchSubmit} style={{ position: 'relative', marginLeft: 4 }}>
              <Search className="w-4 h-4" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3', pointerEvents: 'none' }} />
              <input
                ref={navInputRef}
                type="text"
                placeholder="Search articles..."
                value={navQuery}
                onChange={(e) => { setNavQuery(e.target.value); if (!e.target.value) { setNavResults([]); setNavDropdownOpen(false); } }}
                style={{ width: 220, padding: '8px 12px 8px 36px', fontSize: 13, border: '1px solid #e5e5e5', borderRadius: 8, outline: 'none', transition: 'all 0.2s' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(221,0,0,0.08)`; if (navResults.length) setNavDropdownOpen(true); }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <button type="submit" style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: RED, fontSize: 12, fontWeight: 700 }}>Go</button>
              {navDropdownOpen && (
                <div ref={navDropdownRef} style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 320, background: '#fff', borderRadius: 16, boxShadow: '0 20px 45px rgba(0,0,0,0.12)', border: '1px solid #f2f2f2', padding: '14px 16px', zIndex: 40 }}>
                  {navLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#666' }}>
                      <Loader2 className="w-4 h-4 animate-spin" /> Searching articles...
                    </div>
                  ) : navResults.length === 0 ? (
                    <p style={{ fontSize: 13, color: '#777', margin: 0 }}>No matches yet. Try a different keyword.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {navResults.map(post => (
                        <Link key={post.id} href={`/blog/${post.slug}`}
                          style={{ textDecoration: 'none', color: '#111', paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>
                          <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>{stripHtml(post.title)}</p>
                          <span style={{ fontSize: 12, color: '#777' }}>{timeAgo(post.date)}</span>
                        </Link>
                      ))}
                      <button type="button" onClick={openNavAllResults}
                        style={{ fontSize: 12, fontWeight: 600, color: RED, textDecoration: 'none', alignSelf: 'flex-end', background: 'none', border: 'none', cursor: 'pointer' }}>
                        View all results →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </form>
          </nav>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" style={{ fontSize: 14, fontWeight: 600, color: '#525252', textDecoration: 'none' }}>Dashboard</Link>
                <button onClick={() => signOut()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
                  <LogOut className="w-4 h-4" style={{ color: '#a3a3a3' }} />
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" style={{ fontSize: 14, fontWeight: 600, color: '#525252', textDecoration: 'none' }}>Sign in</Link>
                <Link href="/cv-maker"
                  style={{ background: RED, color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px 20px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  Free CV Maker
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* German flag bar */}
      <div style={{ height: 6, background: 'linear-gradient(90deg, #000 0%, #000 33.33%, #dd0000 33.33%, #dd0000 66.66%, #ffce00 66.66%, #ffce00 100%)' }} />

      {/* ══ NEWS TICKER ══ */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 44 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', background: RED, padding: '3px 10px', borderRadius: 4, flexShrink: 0, marginRight: 16 }}>Updates</span>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ display: 'flex', gap: 40, animation: 'ticker-scroll 30s linear infinite', whiteSpace: 'nowrap' }}>
              {wpPosts.slice(0, 4).map(p => (
                <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: RED }}>{timeAgo(p.date)}</span>
                  <span style={{ fontSize: 13, color: '#404040' }}>{stripHtml(p.title)}</span>
                </a>
              ))}
              {wpPosts.length === 0 && (
                <span style={{ fontSize: 13, color: '#737373' }}>Stay tuned for the latest German visa and study news.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══ SEARCH HERO ══ */}
      <section id="hero" style={{ position: 'relative', background: 'linear-gradient(135deg, #fdfcfb 0%, #fef9f5 50%, #fff5f0 100%)', padding: '96px 0 80px', overflow: 'hidden' }}>
        
        {/* Decorative gradient orbs */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(221,0,0,0.08) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-8%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,206,0,0.06) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          
          {/* Animated badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 999, background: 'linear-gradient(135deg, rgba(221,0,0,0.08) 0%, rgba(255,206,0,0.08) 100%)', border: '1px solid rgba(221,0,0,0.15)', marginBottom: 24, animation: 'fadeInUp 0.6s ease-out' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: RED, animation: 'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#171717', letterSpacing: '0.05em' }}>AI-POWERED · 20,000+ PROGRAMS</span>
          </div>

          <h1 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: 'clamp(38px,5vw,64px)', fontWeight: 700, background: 'linear-gradient(135deg, #000 0%, #171717 50%, #404040 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.08, letterSpacing: '-1.2px', marginBottom: 20, animation: 'fadeInUp 0.7s ease-out 0.1s both' }}>
            Find your perfect program<br />in Germany
          </h1>
          
          <p style={{ fontSize: 18, color: '#525252', lineHeight: 1.7, maxWidth: 680, margin: '0 auto 40px', fontWeight: 500, animation: 'fadeInUp 0.7s ease-out 0.2s both' }}>
            Describe what you want in plain English. Our AI instantly searches 20,000+ German university programs
            and shows you the <span style={{ color: RED, fontWeight: 700 }}>exact matches</span> — tuition, intake, language, everything.
          </p>

          <form onSubmit={handleSearch} style={{ maxWidth: 760, margin: '0 auto', animation: 'fadeInUp 0.7s ease-out 0.3s both' }}>
            <div className="search-bar-hero" style={{ position: 'relative', borderRadius: 20, background: '#fff', border: '2px solid #e8e8e8', padding: '8px 8px 8px 20px', display: 'flex', alignItems: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)', transition: 'all 0.3s ease' }}>
              <Search className="w-5 h-5" style={{ color: '#a3a3a3', marginRight: 14, flexShrink: 0 }} />
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSearch(e as unknown as FormEvent);
                  }
                }}
                rows={1}
                placeholder="e.g. tuition-free data science master in English, Berlin intake 2025"
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', color: '#111', resize: 'none', fontWeight: 500 }}
              />
              <button
                type="submit"
                disabled={searching || !query.trim()}
                style={{ border: 'none', borderRadius: 16, padding: '12px 28px', fontWeight: 700, fontSize: 15, background: `linear-gradient(135deg, ${RED} 0%, #bb0000 100%)`, color: '#fff', cursor: 'pointer', opacity: searching || !query.trim() ? 0.5 : 1, boxShadow: searching || !query.trim() ? 'none' : '0 4px 16px rgba(221,0,0,0.25)', transition: 'all 0.2s', flexShrink: 0 }}
                onMouseEnter={e => { if (!searching && query.trim()) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
              >
                {searching ? 'Searching…' : 'Search'}
              </button>
            </div>
          </form>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 20, animation: 'fadeInUp 0.7s ease-out 0.4s both' }}>
            {HERO_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuery(suggestion)}
                className="suggestion-chip"
                style={{ border: '1px solid #e0e0e0', borderRadius: 999, padding: '8px 16px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', fontSize: 13, fontWeight: 600, color: '#525252', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.color = RED; e.currentTarget.style.background = 'rgba(221,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.color = '#525252'; e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
              >
                {suggestion}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ══ FREE TOOLS ══ */}
      <section id="tools" style={{ background: '#fff', padding: '80px 0', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: RED, margin: '0 0 10px' }}>Free AI Tools</p>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: 'clamp(24px,2.7vw,36px)', fontWeight: 800, color: '#0f0f0f', margin: 0 }}>
              Everything you need to apply
            </h2>
            <p style={{ fontSize: 15, color: '#666', margin: '12px auto 0', maxWidth: 560 }}>Spark-grade assistants for your CV, letters, GPA conversion and dashboard — all aligned with German formats.</p>
          </div>

          <div style={{ position: 'relative', padding: '0 32px' }}>
            <button
              type="button"
              aria-label="Scroll tools left"
              onClick={() => scrollTools('left')}
              style={{ position: 'absolute', left: -26, top: '50%', transform: 'translateY(-50%)', zIndex: 3, background: '#fff', border: '1px solid #e5e5e5', borderRadius: '999px', width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.12)', cursor: 'pointer' }}
            >
              <ChevronRight style={{ transform: 'rotate(180deg)', color: '#555' }} className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Scroll tools right"
              onClick={() => scrollTools('right')}
              style={{ position: 'absolute', right: -26, top: '50%', transform: 'translateY(-50%)', zIndex: 3, background: '#fff', border: '1px solid #e5e5e5', borderRadius: '999px', width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.12)', cursor: 'pointer' }}
            >
              <ChevronRight style={{ color: '#555' }} className="w-4 h-4" />
            </button>

            <div style={{ position: 'absolute', left: 24, top: 0, bottom: 0, width: 70, pointerEvents: 'none', background: 'linear-gradient(90deg,#fff 0%,rgba(255,255,255,0) 100%)' }} />
            <div style={{ position: 'absolute', right: 24, top: 0, bottom: 0, width: 70, pointerEvents: 'none', background: 'linear-gradient(270deg,#fff 0%,rgba(255,255,255,0) 100%)' }} />

            <div ref={toolsScrollRef} style={{ display: 'flex', gap: 18, overflowX: 'auto', padding: '16px 80px 28px', scrollSnapType: 'x mandatory', scrollBehavior: 'smooth', justifyContent: 'center' }}>
              {TOOLS.map(({ href, label, desc, emoji }) => (
                <Link key={href} href={href}
                  style={{ flex: '0 0 260px', minHeight: 240, scrollSnapAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, padding: '28px 24px', border: '1px solid #ececec', borderRadius: 24, textDecoration: 'none', background: '#fff', transition: 'all 0.28s cubic-bezier(0.22,1,0.36,1)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 24px 48px rgba(221,0,0,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#ececec'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.04)'; }}>
                  <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #fff 0%, #fafafa 100%)', border: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: '0 4px 12px rgba(0,0,0,0.06)', transition: 'transform 0.3s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
                    <span>{emoji}</span>
                  </div>
                  <div>
                    <strong style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 17, fontWeight: 700, color: '#0f0f0f', display: 'block', marginBottom: 6, letterSpacing: '-0.2px' }}>{label}</strong>
                    <span style={{ fontSize: 13, color: '#5f5f5f', lineHeight: 1.6, display: 'block' }}>{desc}</span>
                  </div>
                  <div style={{ marginTop: 'auto', paddingTop: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: RED, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      Try it free <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ LATEST ARTICLES ══ */}
      <section id="guides" style={{ background: '#fff', padding: '72px 0' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 36 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: RED, margin: '0 0 8px' }}>Knowledge Base</p>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: 'clamp(22px,2.5vw,32px)', fontWeight: 800, color: '#111', margin: 0, letterSpacing: '-0.3px' }}>
                Latest Guides &amp; Articles
              </h2>
            </div>
            <a href="http://localhost:8000" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 14, fontWeight: 700, color: RED, textDecoration: 'none' }}>
              View all →
            </a>
          </div>

          {postsLoading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ borderRadius: 16, background: '#f5f5f5', overflow: 'hidden' }}>
                  <div style={{ height: 190, background: '#ebebeb' }} />
                  <div style={{ padding: 20 }}>
                    <div style={{ height: 16, background: '#e5e5e5', borderRadius: 4, marginBottom: 8, width: '80%' }} />
                    <div style={{ height: 12, background: '#e5e5e5', borderRadius: 4, width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!postsLoading && wpPosts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', border: '2px dashed #e5e5e5', borderRadius: 16 }}>
              <Newspaper className="w-10 h-10 mx-auto mb-3" style={{ color: '#d4d4d4' }} />
              <p style={{ fontSize: 15, color: '#737373', fontWeight: 600, marginBottom: 6 }}>No articles loaded yet</p>
              <p style={{ fontSize: 13, color: '#a3a3a3', marginBottom: 16 }}>Start the WordPress server at localhost:8000 to see articles here.</p>
              <a href="http://localhost:8000" target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 14, fontWeight: 700, color: RED, textDecoration: 'none' }}>
                Open WordPress →
              </a>
            </div>
          )}

          {!postsLoading && wpPosts.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }}>
              {wpPosts.map((post, idx) => (
                <Link key={post.id} href={`/blog/${post.slug}`}
                  className={`scroll-reveal card-hover`}
                  style={{ textDecoration: 'none', background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', animationDelay: `${idx * 0.1}s`, transitionDelay: `${idx * 0.08}s` }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.boxShadow = `0 12px 40px rgba(221,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#ebebeb'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}>

                  <div style={{ height: 200, background: 'linear-gradient(135deg, #f5f5f0 0%, #eeeeea 100%)', overflow: 'hidden', position: 'relative' }}>
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={stripHtml(post.title)}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                        onError={e => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen className="w-10 h-10" style={{ color: '#d4d4d4' }} />
                      </div>
                    )}
                    {post.categories[0] && (
                      <span style={{ position: 'absolute', top: 12, left: 12, background: RED, color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.06em', boxShadow: '0 2px 8px rgba(221,0,0,0.3)' }}>
                        {decodeHtmlEntities(post.categories[0].name)}
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <Calendar className="w-3 h-3" style={{ color: '#c4c4c4' }} />
                      <span style={{ fontSize: 11, color: '#b0b0b0', fontWeight: 600, letterSpacing: '0.03em' }}>{timeAgo(post.date)}</span>
                    </div>
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: 15, fontWeight: 700, color: '#111', lineHeight: 1.4, margin: '0 0 8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {stripHtml(post.title)}
                    </h3>
                    <p style={{ fontSize: 13, color: '#6b6b6b', lineHeight: 1.6, margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {stripHtml(post.excerpt)}
                    </p>
                    <span style={{ marginTop: 'auto', fontSize: 13, fontWeight: 700, color: RED, display: 'inline-flex', alignItems: 'center', gap: 4 }}>Read article →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ STATS STRIP ══ */}
      <section style={{ background: '#f8f8f5', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5', padding: '48px 0' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, textAlign: 'center' }}>
          {[
            { num: '20,000+', label: 'Study programs' },
            { num: '15,000+', label: 'Students helped' },
            { num: '5 AI tools', label: 'Completely free' },
            { num: '200+', label: 'Guides & articles' },
          ].map(({ num, label }, idx) => (
            <div key={label} className="scroll-reveal" style={{ transitionDelay: `${idx * 0.1}s` }}>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 34, fontWeight: 800, color: RED, margin: '0 0 4px', letterSpacing: '-0.5px' }}>{num}</p>
              <p style={{ fontSize: 14, color: '#6b6b6b', margin: 0, fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: '#1a1a1a', position: 'relative' }}>
        {/* German flag bar on top */}
        <div style={{ height: 6, background: 'linear-gradient(90deg, #000 0%, #000 33.33%, #dd0000 33.33%, #dd0000 66.66%, #ffce00 66.66%, #ffce00 100%)' }} />
        
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '64px 24px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 48 }}>
            
            {/* Logo & Description */}
            <div>
              <Image src="/logo_wp.png" alt="Students in Germany" width={140} height={44} style={{ objectFit: 'contain', marginBottom: 16 }} priority />
              <p style={{ fontSize: 14, color: '#a3a3a3', lineHeight: 1.6, margin: 0 }}>
                Your guide to studying and living in Germany
              </p>
            </div>

            {/* Resources */}
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', marginBottom: 20 }}>Resources</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Study Guides', href: '#guides' },
                  { label: 'Universities', href: '#universities' },
                  { label: 'Scholarships', href: 'http://localhost:8000/?cat=scholarships' },
                  { label: 'Student Visa', href: 'http://localhost:8000/?cat=visa' },
                ].map(({ label, href }) => (
                  <a key={label} href={href} style={{ fontSize: 14, color: '#a3a3a3', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#a3a3a3')}>
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', marginBottom: 20 }}>Tools</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'CV Maker', href: '/cv-maker' },
                  { label: 'Cover Letter', href: '/cover-letter' },
                  { label: 'Motivation Letter', href: '/motivation-letter' },
                  { label: 'GPA Converter', href: '/gpa-converter' },
                ].map(({ label, href }) => (
                  <a key={label} href={href} style={{ fontSize: 14, color: '#a3a3a3', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#a3a3a3')}>
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Support */}
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', marginBottom: 20 }}>Support</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Contact', href: 'http://localhost:8000/#contact' },
                  { label: 'FAQ', href: 'http://localhost:8000/?cat=faq' },
                  { label: 'Privacy', href: '/privacy' },
                  { label: 'Dashboard', href: '/dashboard' },
                ].map(({ label, href }) => (
                  <a key={label} href={href} style={{ fontSize: 14, color: '#a3a3a3', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#a3a3a3')}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: 24, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <p style={{ fontSize: 13, color: '#666', margin: 0 }}>© 2026 Students in Germany. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 20 }}>
              <a href="/auth/signin" style={{ fontSize: 13, color: '#a3a3a3', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#a3a3a3')}>
                Sign in
              </a>
              <a href="http://localhost:8000" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#a3a3a3', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#a3a3a3')}>
                Blog
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
        
        .search-bar-hero:focus-within {
          border-color: ${RED} !important;
          box-shadow: 0 16px 48px rgba(221,0,0,0.12), 0 0 0 4px rgba(221,0,0,0.08) !important;
          transform: translateY(-2px);
        }
        
        .suggestion-chip:active {
          transform: translateY(0px) !important;
        }
      `}</style>

    </div>
  );
}

