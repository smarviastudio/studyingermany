'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Search, Loader2, LogOut, ArrowRight, Newspaper, Zap, Menu, X, GraduationCap, BookOpen, Wrench, Tag, LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContactModal } from './ContactModalProvider';

const RED = '#dd0000';

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

export type SiteNavPost = {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  link: string;
  featuredImage?: string | null;
  categories?: { id: number; name: string; slug: string }[];
};

export function SiteNav() {
  const { status } = useSession();
  const { openContactModal } = useContactModal();
  const isAuthenticated = status === 'authenticated';

  const [aiUsage, setAiUsage] = useState<{ used: number; limit: number } | null>(null);
  const [aiCredits, setAiCredits] = useState<number>(0);
  const [hasUnlimited, setHasUnlimited] = useState(false);

  const [wpPosts, setWpPosts] = useState<SiteNavPost[]>([]);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [tickerPaused, setTickerPaused] = useState(false);
  const [navQuery, setNavQuery] = useState('');
  const [navResults, setNavResults] = useState<SiteNavPost[]>([]);
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const [navLoading, setNavLoading] = useState(false);
  const [navAllOpen, setNavAllOpen] = useState(false);
  const [navAllLoading, setNavAllLoading] = useState(false);
  const [navAllResults, setNavAllResults] = useState<SiteNavPost[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navDropdownRef = useRef<HTMLDivElement>(null);
  const navInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/wp-posts?per_page=8&ticker_only=1');
        if (res.ok) {
          const data = await res.json();
          setWpPosts(data.posts || []);
        }
      } catch {
        // silent
      }
    })();
  }, []);

  useEffect(() => {
    if (!wpPosts.length) return;
    const interval = setInterval(() => {
      if (tickerPaused) return;
      setTickerIndex((prev) => (prev + 1) % wpPosts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [wpPosts, tickerPaused]);

  const goToSlide = (index: number) => {
    if (!wpPosts.length) return;
    const next = (index + wpPosts.length) % wpPosts.length;
    setTickerIndex(next);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const [usageRes, creditsRes] = await Promise.all([
          fetch('/api/ai-credits'),
          fetch('/api/credits/balance'),
        ]);
        if (usageRes.ok) {
          const data = await usageRes.json();
          setAiUsage(data);
        }
        if (creditsRes.ok) {
          const data = await creditsRes.json();
          setHasUnlimited(data.hasUnlimited);
          if (!data.hasUnlimited) {
            setAiCredits(data.credits);
          }
        }
      } catch {
        // silent
      }
    })();
  }, [isAuthenticated]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!navDropdownRef.current || !navInputRef.current) return;
      if (
        navDropdownOpen &&
        !navDropdownRef.current.contains(event.target as Node) &&
        !navInputRef.current.contains(event.target as Node)
      ) {
        setNavDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [navDropdownOpen]);

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

  return (
    <>
      {navAllOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 70, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '60px 20px', overflowY: 'auto' }}
          onClick={() => setNavAllOpen(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: 24, maxWidth: 600, width: '100%', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,0.35)', padding: '28px 32px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <p style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a1a1a1', margin: 0 }}>Articles</p>
                <h3 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0' }}>Results for “{navQuery.trim()}”</h3>
              </div>
              <button onClick={() => setNavAllOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#777' }}>
                ✕
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
                {navAllResults.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    style={{ textDecoration: 'none', border: '1px solid #f2f2f2', borderRadius: 18, padding: '18px 22px', display: 'flex', gap: 18, alignItems: 'stretch', transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = RED;
                      e.currentTarget.style.boxShadow = '0 18px 40px rgba(0,0,0,0.08)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#f2f2f2';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
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
                        <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: RED, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          Read article <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile drawer overlay */}
      <div className={`sitenav-drawer-overlay${drawerOpen ? ' open' : ''}`} onClick={() => setDrawerOpen(false)} />

      {/* Mobile slide-out drawer */}
      <div className={`sitenav-drawer${drawerOpen ? ' open' : ''}`}>
        <div className="sitenav-drawer-head">
          <Image src="/logo_wp.png" alt="Students in Germany" width={120} height={38} style={{ objectFit: 'contain' }} />
          <button className="sitenav-drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
        </div>
        <div className="sitenav-drawer-links">
          <a href="/#hero" className="sitenav-drawer-link" onClick={() => setDrawerOpen(false)}><GraduationCap size={20} />Course Finder</a>
          <a href="/#guides" className="sitenav-drawer-link" onClick={() => setDrawerOpen(false)}><BookOpen size={20} />Study Guides</a>
          <a href="/#tools" className="sitenav-drawer-link" onClick={() => setDrawerOpen(false)}><Wrench size={20} />Free AI Tools</a>
          <a href="/pricing" className="sitenav-drawer-link red" onClick={() => setDrawerOpen(false)}><Tag size={20} />Pricing</a>
          {isAuthenticated && <Link href="/dashboard" className="sitenav-drawer-link" onClick={() => setDrawerOpen(false)}><LayoutDashboard size={20} />Dashboard</Link>}
        </div>
        <div className="sitenav-drawer-auth">
          {isAuthenticated ? (
            <>
              {!hasUnlimited && aiCredits !== null && (
                <Link href="/credits" className="sitenav-drawer-credits" onClick={() => setDrawerOpen(false)} style={{ textDecoration: 'none', display: 'block' }}>
                  <span>AI Credits Available</span>
                  <strong style={{ color: aiCredits === 0 ? '#ef4444' : '#7c3aed' }}>{aiCredits} credits</strong>
                </Link>
              )}
              <button onClick={() => { signOut(); setDrawerOpen(false); }} className="sitenav-drawer-btn secondary" style={{ border: 'none', cursor: 'pointer' }}>
                <LogOut size={16} /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="sitenav-drawer-btn secondary" onClick={() => setDrawerOpen(false)}>Sign in</Link>
              <Link href="/cv-maker" className="sitenav-drawer-btn primary" onClick={() => setDrawerOpen(false)}>Free CV Maker</Link>
            </>
          )}
        </div>
      </div>

      <header style={{ background: '#fff', borderBottom: '1px solid #e5e5e5' }}>
        <div className="sitenav-header" style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Image src="/logo_wp.png" alt="Students in Germany" width={140} height={44} style={{ objectFit: 'contain' }} priority />
          </Link>

          <nav className="sitenav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {[
              { label: 'Guides', href: '/#guides' },
              { label: 'Tools', href: '/#tools' },
              { label: 'Course Finder', href: '/#hero' },
              { label: 'Pricing', href: '/pricing' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{ fontSize: 14, fontWeight: 600, color: label === 'Pricing' ? RED : '#404040', textDecoration: 'none', letterSpacing: '0.01em', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = RED)}
                onMouseLeave={(e) => (e.currentTarget.style.color = label === 'Pricing' ? RED : '#404040')}
              >
                {label}
              </a>
            ))}
            <button
              type="button"
              onClick={openContactModal}
              style={{ fontSize: 14, fontWeight: 600, color: '#404040', border: '1px solid #e5e5e5', borderRadius: 999, padding: '8px 16px', background: 'none', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = RED)}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#404040')}
            >
              Contact
            </button>
            <form onSubmit={handleNavSearchSubmit} style={{ position: 'relative', marginLeft: 8 }}>
              <Search className="w-4 h-4" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3', pointerEvents: 'none' }} />
              <input
                ref={navInputRef}
                type="text"
                placeholder="Search articles..."
                value={navQuery}
                onChange={(e) => {
                  setNavQuery(e.target.value);
                  if (!e.target.value) {
                    setNavResults([]);
                    setNavDropdownOpen(false);
                  }
                }}
                style={{ width: 220, padding: '8px 12px 8px 36px', fontSize: 13, border: '1px solid #e5e5e5', borderRadius: 8, outline: 'none', transition: 'all 0.2s' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = RED;
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(221,0,0,0.08)';
                  if (navResults.length) setNavDropdownOpen(true);
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e5e5';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button type="submit" style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: RED, fontSize: 12, fontWeight: 700 }}>
                Go
              </button>
              {navDropdownOpen && (
                <div
                  ref={navDropdownRef}
                  style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 320, background: '#fff', borderRadius: 16, boxShadow: '0 20px 45px rgba(0,0,0,0.12)', border: '1px solid #f2f2f2', padding: '14px 16px', zIndex: 40 }}
                >
                  {navLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#666' }}>
                      <Loader2 className="w-4 h-4 animate-spin" /> Searching articles...
                    </div>
                  ) : navResults.length === 0 ? (
                    <p style={{ fontSize: 13, color: '#777', margin: 0 }}>No matches yet. Try a different keyword.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {navResults.map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: '#111', paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>
                          <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>{stripHtml(post.title)}</p>
                          <span style={{ fontSize: 12, color: '#777' }}>{timeAgo(post.date)}</span>
                        </Link>
                      ))}
                      <button
                        type="button"
                        onClick={openNavAllResults}
                        style={{ fontSize: 12, fontWeight: 600, color: RED, textDecoration: 'none', alignSelf: 'flex-end', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        View all results →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </form>
          </nav>

          {/* Mobile hamburger */}
          <button className="sitenav-hamburger" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>

          <div className="sitenav-desktop-auth" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isAuthenticated ? (
              <>
                <Link
                  href="/credits"
                  title={hasUnlimited ? 'Unlimited AI generations included in your plan' : `${aiCredits} AI credits available. Click to buy more.`}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 20, background: hasUnlimited ? 'rgba(34,197,94,0.08)' : aiCredits === 0 ? 'rgba(239,68,68,0.08)' : 'rgba(124,58,237,0.07)', border: `1px solid ${hasUnlimited ? 'rgba(34,197,94,0.2)' : aiCredits === 0 ? 'rgba(239,68,68,0.2)' : 'rgba(124,58,237,0.15)'}`, textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = hasUnlimited
                      ? 'rgba(34,197,94,0.12)'
                      : aiCredits === 0
                        ? 'rgba(239,68,68,0.12)'
                        : 'rgba(124,58,237,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = hasUnlimited
                      ? 'rgba(34,197,94,0.08)'
                      : aiCredits === 0
                        ? 'rgba(239,68,68,0.08)'
                        : 'rgba(124,58,237,0.07)';
                  }}
                >
                  <Zap className="w-3 h-3" style={{ color: hasUnlimited ? '#22c55e' : aiCredits === 0 ? '#ef4444' : '#7c3aed' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: hasUnlimited ? '#15803d' : aiCredits === 0 ? '#ef4444' : '#7c3aed' }}>
                    {hasUnlimited ? 'Unlimited' : aiCredits}
                  </span>
                  <span style={{ fontSize: 11, color: '#737373' }}>credits</span>
                </Link>
                <Link href="/dashboard" style={{ fontSize: 14, fontWeight: 600, color: '#525252', textDecoration: 'none' }}>
                  Dashboard
                </Link>
                <button onClick={() => signOut()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
                  <LogOut className="w-4 h-4" style={{ color: '#a3a3a3' }} />
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" style={{ fontSize: 14, fontWeight: 600, color: '#525252', textDecoration: 'none' }}>
                  Sign in
                </Link>
                <Link
                  href="/cv-maker"
                  style={{ background: RED, color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px 20px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}
                >
                  Free CV Maker
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div style={{ height: 6, background: 'linear-gradient(90deg, #000 0%, #000 33.33%, #dd0000 33.33%, #dd0000 66.66%, #ffce00 66.66%, #ffce00 100%)' }} />

      <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5' }}>
        <div className="news-ticker-shell" onMouseEnter={() => setTickerPaused(true)} onMouseLeave={() => setTickerPaused(false)}>
          <div className="news-ticker-controls">
            <span className="news-ticker-label">News</span>
            <div className="news-ticker-nav-group">
              <button className="news-ticker-nav" aria-label="Previous" onClick={() => goToSlide(tickerIndex - 1)}>
                <ChevronLeft size={14} />
              </button>
              <button className="news-ticker-nav" aria-label="Next" onClick={() => goToSlide(tickerIndex + 1)}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <div className="news-ticker-track">
            {wpPosts.length > 0 ? (
              <div 
                className="news-ticker-slider" 
                style={{ transform: `translateX(-${tickerIndex * 100}%)` }}
              >
                {wpPosts.map((post) => (
                  <div key={post.id} className="news-ticker-item">
                    <span className="news-ticker-date">{timeAgo(post.date)}</span>
                    <Link href={`/blog/${post.slug}`} className="news-ticker-title">
                      {stripHtml(post.title)}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <span className="news-ticker-empty">Latest updates coming soon...</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
