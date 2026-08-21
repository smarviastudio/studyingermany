'use client';

import { useState, useEffect, useMemo, useRef, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import {
  Search, Loader2, Bookmark, X, ArrowRight, BookOpen,
  GraduationCap, FileText, Languages, Home, Briefcase, CreditCard, Shield,
  Plane, Star, Zap, TrendingUp, Users, Globe, Calculator, LayoutDashboard,
  Settings, Filter, Sparkles, School, FolderOpen, ChevronDown, Check,
  FileCheck, Send, BadgeCheck, Clock, Euro
} from 'lucide-react';
import { track } from '@/lib/track';
import { ProgramModal } from '@/components/ProgramModal';
import { ProgramCard } from '@/components/ProgramCard';
import type { ProgramSummary } from '@/lib/types';
import { SiteNav } from '@/components/SiteNav';
import { BLOG_POSTS, CATEGORIES } from '@/content/blog';

const SEARCH_RESULTS_LIMIT = 120;
const RESULTS_PER_PAGE = 12;

const HERO_SUGGESTIONS = [
  'English-taught master in AI',
  'Tuition-free engineering bachelor',
  'MBA in Berlin',
  'Data science master, winter 2026',
];

const QUICK_LINKS = [
  { href: '/netto-brutto-calculator', label: 'German Tax Calculator' },
  { href: '/gpa-converter', label: 'GPA Converter' },
  { href: '/masters-in-germany', label: 'Masters in Germany' },
  { href: '/english-taught-programs', label: 'English-taught programs' },
  { href: '/study-in-germany', label: 'Study in Germany guide' },
];

const FREE_TOOLS = [
  { href: '/gpa-converter',           label: 'GPA Converter',      desc: 'Convert your grades to the German scale instantly. Know where you stand before you apply.', icon: TrendingUp, gradient: 'from-blue-500 to-indigo-600' },
  { href: '/netto-brutto-calculator', label: 'German Tax Calculator',  desc: 'See your real net salary after German taxes — for student jobs and your first job after graduation.', icon: Calculator, gradient: 'from-amber-500 to-orange-600' },
  { href: '/dashboard/landing',               label: 'Application Tracker', desc: 'Track your applications, deadlines and shortlisted programs in one place.', icon: LayoutDashboard, gradient: 'from-slate-700 to-slate-900' },
];

const AI_TOOLS = [
  { href: '/cv-maker/landing',          label: 'AI CV Maker',       desc: 'A recruiter-ready German-format CV (Lebenslauf), written for you in minutes.', icon: FileText,  gradient: 'from-red-500 to-rose-600' },
  { href: '/motivation-letter/landing', label: 'Motivation Letter', desc: 'A compelling, university-specific motivation letter that gets you noticed.',   icon: Star,      gradient: 'from-violet-500 to-purple-600' },
  { href: '/cover-letter/landing',      label: 'Cover Letter',      desc: 'Professional cover letters tailored to German employers and internships.',     icon: Briefcase, gradient: 'from-emerald-500 to-green-600' },
];

const TESTIMONIALS = [
  {
    name: 'Fatima Z.',
    location: 'Lahore, Pakistan',
    quote: 'From Lahore to Leipzig in 6 months. The AI tools helped me translate my Pakistani qualifications to German standards.',
    flag: 'PK'
  },
  {
    name: 'Zainab O.',
    location: 'Nairobi, Kenya',
    quote: 'The AI CV Maker was a game changer. I got accepted into three TU9 universities for Data Science.',
    flag: 'KE'
  },
  {
    name: 'Arjun M.',
    location: 'Mumbai, India',
    quote: 'Navigating the visa process from India was stressful until I found their step-by-step guides. Currently studying in Munich!',
    flag: 'IN'
  },
  {
    name: 'Linh T.',
    location: 'Hanoi, Vietnam',
    quote: 'The GPA converter showed me that my grades were actually eligible for top public universities. It changed my entire strategy.',
    flag: 'VN'
  },
  {
    name: 'Ahmed K.',
    location: 'Cairo, Egypt',
    quote: 'The motivation letter tool helped me craft a compelling story. Accepted to RWTH Aachen with a scholarship.',
    flag: 'EG'
  },
  {
    name: 'Maria S.',
    location: 'Manila, Philippines',
    quote: 'Finding English-taught programs was overwhelming until I used German Path. Now studying Business Analytics in Berlin!',
    flag: 'PH'
  },
  {
    name: 'David N.',
    location: 'Lagos, Nigeria',
    quote: 'The blocked account guide and visa checklist saved me months of confusion. Got my student visa on the first try.',
    flag: 'NG'
  }
];

const JOURNEY_CATEGORIES = [
  { key: 'phd',        label: 'PhD',        icon: GraduationCap, color: '#7c3aed', desc: 'Doctoral programs & research', slugs: ['phd', 'doctorate', 'doctoral'] },
  { key: 'master',     label: 'Master',     icon: BookOpen,       color: '#dd0000', desc: 'Master programs',              slugs: ['master', 'masters', 'postgraduate'] },
  { key: 'bachelor',   label: 'Bachelor',   icon: School,        color: '#059669', desc: 'Bachelor programs',          slugs: ['bachelor', 'bachelors', 'undergraduate', 'studienkolleg'] },
  { key: 'visa',       label: 'Visa',       icon: Plane,         color: '#d97706', desc: 'Visa & immigration',         slugs: ['visa', 'immigration', 'residence-permit', 'aufenthaltstitel'] },
  { key: 'housing',    label: 'Housing',    icon: Home,          color: '#0284c7', desc: 'Accommodation',              slugs: ['housing', 'accommodation', 'apartment', 'wg', 'dormitory', 'wohnheim'] },
  { key: 'finance',    label: 'Finance',    icon: CreditCard,    color: '#be185d', desc: 'Money matters',            slugs: ['finance', 'financial', 'money', 'cost', 'expenses', 'budget', 'blocked-account', 'sperrkonto', 'insurance', 'scholarship', 'funding', 'tuition', 'fees', 'living-costs'] },
  { key: 'jobs',       label: 'Jobs',       icon: Briefcase,     color: '#0891b2', desc: 'Working in Germany',       slugs: ['jobs', 'job', 'career', 'work', 'employment', 'working', 'internship', 'part-time', 'student-jobs', 'werkstudent', 'minijob'] },
  { key: 'language',   label: 'Language',   icon: Languages,     color: '#ea580c', desc: 'German language',          slugs: ['language', 'german', 'deutsch', 'learning', 'course'] },
  { key: 'others',     label: 'Others',     icon: FolderOpen,    color: '#64748b', desc: 'Other topics',             slugs: ['guides', 'tips', 'life', 'culture', 'lifestyle'] },
];

type WpPost = {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  link: string;
  featuredImage: string | null;
  coverEmoji?: string;
  categories: { id: number; name: string; slug: string }[];
};

// Native articles from src/content/blog.ts, mapped to the same shape as WordPress
// posts so they render in the guides section server-side (real crawlable links).
const STATIC_GUIDE_POSTS: WpPost[] = [...BLOG_POSTS]
  .sort((a, b) => (b.updatedAt || b.publishedAt).localeCompare(a.updatedAt || a.publishedAt))
  .map((post, idx) => ({
    id: -(idx + 1),
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    date: post.publishedAt,
    link: `/blog/${post.slug}`,
    featuredImage: null,
    coverEmoji: post.coverEmoji,
    categories: (post.tags && post.tags.length > 0 ? post.tags : [post.category]).map((tag, tagIdx) => ({
      id: -(idx * 10 + tagIdx + 1),
      name: tag === post.category ? CATEGORIES[post.category].label : tag.charAt(0).toUpperCase() + tag.slice(1),
      slug: tag,
    })),
  }));

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

/* ────────────────────────────────────────────────
   Animated hero demo: search → results → AI letter
   ──────────────────────────────────────────────── */
const DEMO_QUERY = 'Tuition-free Master in Data Science, taught in English';
const DEMO_RESULTS = [
  { name: 'M.Sc. Data Science',        uni: 'TU Berlin',   tag: '€0 tuition' },
  { name: 'M.Sc. Data Engineering',    uni: 'RWTH Aachen', tag: 'English' },
  { name: 'M.Sc. AI & Data Analytics', uni: 'TU München',  tag: 'Winter intake' },
];
const DEMO_LETTER_LINES = [88, 100, 94, 72, 97, 60];

function HeroDemo() {
  const [typed, setTyped] = useState('');
  const [phase, setPhase] = useState<'typing' | 'results' | 'letter' | 'done'>('typing');
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(DEMO_QUERY);
      setPhase('done');
      setShown(DEMO_LETTER_LINES.length);
      return;
    }
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) => new Promise<void>(res => { timers.push(setTimeout(res, ms)); });

    (async () => {
      while (alive) {
        setPhase('typing'); setTyped(''); setShown(0);
        await wait(700);
        for (let i = 1; i <= DEMO_QUERY.length && alive; i++) {
          setTyped(DEMO_QUERY.slice(0, i));
          await wait(34);
        }
        await wait(500);
        if (!alive) break;
        setPhase('results');
        for (let i = 1; i <= DEMO_RESULTS.length && alive; i++) {
          setShown(i);
          await wait(380);
        }
        await wait(1500);
        if (!alive) break;
        setPhase('letter'); setShown(0);
        await wait(400);
        for (let i = 1; i <= DEMO_LETTER_LINES.length && alive; i++) {
          setShown(i);
          await wait(300);
        }
        await wait(500);
        if (!alive) break;
        setPhase('done');
        await wait(2600);
      }
    })();

    return () => { alive = false; timers.forEach(clearTimeout); };
  }, []);

  return (
    <div className="gp-demo" aria-hidden="true">
      <div className="gp-demo-window">
        <div className="gp-demo-titlebar">
          <span className="gp-demo-dot" /><span className="gp-demo-dot" /><span className="gp-demo-dot" />
          <span className="gp-demo-title">German Path AI</span>
        </div>

        <div className="gp-demo-searchbar">
          <Search className="w-3.5 h-3.5" style={{ color: '#a1a1aa', flexShrink: 0 }} />
          <span className="gp-demo-query">
            {typed}
            {phase === 'typing' && <span className="gp-demo-caret" />}
          </span>
        </div>

        <div className="gp-demo-stage">
          {(phase === 'results') && (
            <div className="gp-demo-results">
              {DEMO_RESULTS.slice(0, shown).map((r) => (
                <div key={r.name} className="gp-demo-card">
                  <div className="gp-demo-card-icon"><GraduationCap className="w-3.5 h-3.5" /></div>
                  <div className="gp-demo-card-body">
                    <p className="gp-demo-card-name">{r.name}</p>
                    <p className="gp-demo-card-uni">{r.uni}</p>
                  </div>
                  <span className="gp-demo-card-tag">{r.tag}</span>
                </div>
              ))}
            </div>
          )}

          {(phase === 'letter' || phase === 'done') && (
            <div className="gp-demo-letter">
              <div className="gp-demo-letter-head">
                <FileText className="w-3.5 h-3.5" style={{ color: '#dd0000' }} />
                <span>Motivation Letter — TU Berlin</span>
                {phase === 'letter' && <span className="gp-demo-writing"><Sparkles className="w-3 h-3" /> AI writing…</span>}
                {phase === 'done' && <span className="gp-demo-ready"><Check className="w-3 h-3" /> Ready</span>}
              </div>
              <div className="gp-demo-letter-lines">
                {DEMO_LETTER_LINES.map((w, i) => (
                  <span
                    key={i}
                    className={`gp-demo-line ${i < shown || phase === 'done' ? 'on' : ''}`}
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
              {phase === 'done' && (
                <div className="gp-demo-stamp">
                  <BadgeCheck className="w-4 h-4" /> German format · draft in 60 seconds
                </div>
              )}
            </div>
          )}

          {phase === 'typing' && (
            <div className="gp-demo-placeholder">
              <Sparkles className="w-4 h-4" />
              <span>Searching 20,000+ programs…</span>
            </div>
          )}
        </div>
      </div>
      <div className="gp-demo-glow" />
    </div>
  );
}

/* ────────────────────────────────────────────────
   Count-up number that animates when scrolled into view
   ──────────────────────────────────────────────── */
function CountUp({ end, prefix = '', suffix = '', duration = 1500 }: { end: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVal(end); return; }
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        setVal(Math.round(end * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [end, duration]);

  return <span ref={ref}>{prefix}{val.toLocaleString('en-US')}{suffix}</span>;
}

/* ────────────────────────────────────────────────
   FAQ with FAQPage JSON-LD
   ──────────────────────────────────────────────── */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Are public universities in Germany really tuition-free?',
      answer: 'Yes! Most public universities in Germany charge no tuition fees for bachelor and master programs — even for international students. You only pay a semester contribution of €150-350 which often includes public transport.'
    },
    {
      question: 'Do I need to speak German to study in Germany?',
      answer: 'Not necessarily. There are over 2,000 English-taught programs, especially at master level. For German-taught programs you typically need B2/C1 (TestDaF or DSH). Basic German still helps enormously with daily life and part-time jobs.'
    },
    {
      question: 'What is the "Blocked Account" and do I need one?',
      answer: 'A blocked account (Sperrkonto) is required for your student visa. You need to prove €11,904 per year (€992/month) in a blocked account. This ensures you can support yourself financially during your studies.'
    },
    {
      question: 'How much money do I need to live in Germany monthly?',
      answer: 'On average, students need €850-1,200 per month depending on the city. This includes rent (€300-500), food (€200-250), health insurance (€110), transport (€50-80), and other expenses.'
    },
    {
      question: 'Is German Path free to use?',
      answer: 'Yes. Searching 20,000+ programs, the GPA converter, the salary calculator and all guides are completely free — no account needed. Only the AI document tools (CV, motivation letter, cover letter) use one-time credit packs starting at €2.99. No subscription, credits never expire.'
    },
    {
      question: 'When are the application deadlines for German universities?',
      answer: 'For the winter semester (October start) most programs close on July 15; for the summer semester (April start) on January 15. Many programs — and uni-assist processing — need documents weeks earlier, so start your application 3-4 months before the deadline.'
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <section className="gp-section" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="gp-container" style={{ maxWidth: 860 }}>
        <div className="gp-head scroll-reveal">
          <span className="gp-eyebrow">FAQ</span>
          <h2 className="gp-h2">Questions every future student asks</h2>
        </div>
        <div className="gp-faq scroll-reveal">
          {faqs.map((faq, index) => (
            <div key={index} className={`gp-faq-item ${openIndex === index ? 'open' : ''}`}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="gp-faq-q"
                aria-expanded={openIndex === index}
              >
                <span>{faq.question}</span>
                <span className="gp-faq-icon"><ChevronDown className="w-5 h-5" /></span>
              </button>
              <div className="gp-faq-a" style={{ maxHeight: openIndex === index ? 220 : 0 }}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [results, setResults] = useState<ProgramSummary[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [resultsPage, setResultsPage] = useState(1);
  const [reasoning, setReasoning] = useState<string | null>(null);
  const [nonCourseMessage, setNonCourseMessage] = useState<string | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [restoreSearchAfterModal, setRestoreSearchAfterModal] = useState(false);
  const [shortlistedPrograms, setShortlistedPrograms] = useState<string[]>([]);
  const [shortlistingId, setShortlistingId] = useState<string | null>(null);
  const [signInToast, setSignInToast] = useState(false);
  const [wpPosts, setWpPosts] = useState<WpPost[]>(STATIC_GUIDE_POSTS);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(6);
  const [filters, setFilters] = useState({ language: 'all', city: 'all', degreeLevel: 'all', tuition: 'all' });
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

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / RESULTS_PER_PAGE));

  const paginatedResults = useMemo(() => {
    const startIndex = (resultsPage - 1) * RESULTS_PER_PAGE;
    return filteredResults.slice(startIndex, startIndex + RESULTS_PER_PAGE);
  }, [filteredResults, resultsPage]);

  const pageStart = filteredResults.length === 0 ? 0 : (resultsPage - 1) * RESULTS_PER_PAGE + 1;
  const pageEnd = Math.min(resultsPage * RESULTS_PER_PAGE, filteredResults.length);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }),
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [wpPosts, activeCategory]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/wp-posts?per_page=100');
        if (res.ok) {
          const data = await res.json();
          const staticSlugs = new Set(STATIC_GUIDE_POSTS.map(p => p.slug));
          const fetched: WpPost[] = (data.posts || []).filter((p: WpPost) => !staticSlugs.has(p.slug));
          setWpPosts([...fetched, ...STATIC_GUIDE_POSTS]);
        }
      } catch { /* silent */ }
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
    setResultsPage(1);
  }, [filters, results]);

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

    // Filter out posts that ONLY have "News" category
    const guidePosts = wpPosts.filter(post => {
      const hasNews = post.categories.some(c => c.slug.toLowerCase() === 'news');
      const hasOtherCategories = post.categories.some(c => c.slug.toLowerCase() !== 'news');
      return !(hasNews && !hasOtherCategories);
    });

    guidePosts.forEach(post => {
      const postSlugs = post.categories.map(c => c.slug.toLowerCase());
      const postNames = post.categories.map(c => c.name.toLowerCase());
      let placed = false;
      for (const journeyCat of JOURNEY_CATEGORIES) {
        const matchesSlug = postSlugs.some(ps => journeyCat.slugs.some(s => ps === s || ps.includes(s) || s.includes(ps)));
        const matchesName = postNames.some(pn => journeyCat.slugs.some(s => pn === s || pn.includes(s) || s.includes(pn)));
        if (matchesSlug || matchesName) {
          groups[journeyCat.key].push(post);
          placed = true;
        }
      }
      if (!placed) groups['other'].push(post);
    });
    return groups;
  }, [wpPosts]);

  const filteredPosts = useMemo(() => {
    const guidePosts = wpPosts.filter(post => {
      const hasNews = post.categories.some(c => c.slug.toLowerCase() === 'news');
      const hasOtherCategories = post.categories.some(c => c.slug.toLowerCase() !== 'news');
      return !(hasNews && !hasOtherCategories);
    });

    if (activeCategory === 'all') return guidePosts;
    return categorizedPosts[activeCategory] || [];
  }, [activeCategory, wpPosts, categorizedPosts]);

  useEffect(() => {
    setVisibleCount(6);
  }, [activeCategory]);

  const runSearch = async (searchText: string) => {
    const trimmed = searchText.trim();
    if (!trimmed) return;
    track('program_search', { authed: isAuthenticated });
    setQuery(trimmed);
    setSearching(true);
    setSearchError(null);
    setResults([]);
    setTotalMatches(0);
    setResultsPage(1);
    setReasoning(null);
    setNonCourseMessage(null);
    setShowSearchResults(true);
    try {
      const res = await fetch('/api/course-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed, limit: SEARCH_RESULTS_LIMIT }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || 'Something went wrong');
      const data = await res.json();
      if (data.is_non_course_query) {
        setNonCourseMessage(data.reasoning || 'Try describing a university program.');
      } else {
        setResults(data.programs || []);
        setTotalMatches(data.total_matches || data.programs?.length || 0);
        setReasoning(data.reasoning || null);
      }
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  const handleAdvancedSearch = async () => {
    setShowAdvancedSearch(false);

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

    await runSearch(queryParts.length > 0 ? queryParts.join(' ') : 'programs in Germany');
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
    <div className="homepage-root gp-root">

      {signInToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[60]">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white border border-gray-200 shadow-lg">
            <Bookmark className="w-4 h-4 flex-shrink-0 text-red-600" />
            <p className="text-gray-800 text-sm font-medium">Sign in to save programs</p>
            <Link href="/auth/signin" className="ml-1 px-3 py-1 rounded-lg text-white text-xs font-semibold bg-gradient-to-r from-red-600 to-purple-600">Sign in</Link>
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
                      <h1 className="text-2xl font-bold text-slate-900">{totalMatches || filteredResults.length} Programs</h1>
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
                  {filteredResults.length > 0 && (
                    <>
                  <div className="program-list">
                      {paginatedResults.map(program => (
                        <ProgramCard
                          key={program.id}
                          program={program}
                          onClick={() => handleProgramCardClick(program.id)}
                        />
                      ))}
                </div>
                      <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
                        <p>
                          Showing <span className="font-semibold text-slate-900">{pageStart}</span> to{' '}
                          <span className="font-semibold text-slate-900">{pageEnd}</span> of{' '}
                          <span className="font-semibold text-slate-900">{filteredResults.length}</span> filtered programs
                          {totalMatches > results.length ? ` from ${totalMatches} total matches` : ''}
                        </p>
                        {totalPages > 1 && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setResultsPage((page) => Math.max(1, page - 1))}
                              disabled={resultsPage === 1}
                              className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Previous
                            </button>
                            <span className="px-2 font-medium text-slate-800">
                              Page {resultsPage} of {totalPages}
                            </span>
                            <button
                              type="button"
                              onClick={() => setResultsPage((page) => Math.min(totalPages, page + 1))}
                              disabled={resultsPage === totalPages}
                              className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
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
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #dd0000, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  onFocus={e => { e.currentTarget.style.borderColor = '#8b5cf6'; }}
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
                  onFocus={e => { e.currentTarget.style.borderColor = '#8b5cf6'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e5e5e5'; }}>
                  <option value="">Any Language</option>
                  <option value="english">English</option>
                  <option value="german">German</option>
                  <option value="bilingual">Bilingual (English &amp; German)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>City</label>
                <input type="text" value={advancedFilters.city} onChange={(e) => setAdvancedFilters({...advancedFilters, city: e.target.value})} placeholder="e.g. Berlin, Munich" style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e5e5', borderRadius: 12, fontSize: 15, fontWeight: 500, outline: 'none', transition: 'all 0.2s' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#8b5cf6'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e5e5e5'; }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>Subject Area</label>
                <select value={advancedFilters.subjectArea} onChange={(e) => setAdvancedFilters({...advancedFilters, subjectArea: e.target.value})} style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e5e5', borderRadius: 12, fontSize: 15, fontWeight: 500, outline: 'none', transition: 'all 0.2s' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#8b5cf6'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e5e5e5'; }}>
                  <option value="">All Subjects</option>
                  <option value="engineering">Engineering</option>
                  <option value="computer science">Computer Science &amp; IT</option>
                  <option value="business">Business &amp; Management</option>
                  <option value="economics">Economics</option>
                  <option value="natural sciences">Natural Sciences</option>
                  <option value="medicine">Medicine &amp; Health</option>
                  <option value="social sciences">Social Sciences</option>
                  <option value="arts">Arts &amp; Humanities</option>
                  <option value="law">Law</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="architecture">Architecture</option>
                  <option value="design">Design</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>Intake Season</label>
                <select value={advancedFilters.intake} onChange={(e) => setAdvancedFilters({...advancedFilters, intake: e.target.value})} style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e5e5', borderRadius: 12, fontSize: 15, fontWeight: 500, outline: 'none', transition: 'all 0.2s' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#8b5cf6'; }}
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
                    onFocus={e => { e.currentTarget.style.borderColor = '#8b5cf6'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#e5e5e5'; }} />
                  <input type="number" value={advancedFilters.tuitionMax} onChange={(e) => setAdvancedFilters({...advancedFilters, tuitionMax: e.target.value})} placeholder="Max (e.g. 5000)" style={{ padding: '12px 14px', border: '2px solid #e5e5e5', borderRadius: 12, fontSize: 15, fontWeight: 500, outline: 'none', transition: 'all 0.2s' }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#8b5cf6'; }}
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
              <button onClick={handleAdvancedSearch} style={{ flex: 2, padding: '14px 24px', background: 'linear-gradient(135deg, #dd0000, #8b5cf6)', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(139, 92, 246, 0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.3)'; }}>
                <Sparkles className="w-5 h-5" /> Search Programs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ HERO ══ */}
      <section className="gp-hero" id="hero">
        <div className="gp-hero-bg">
          <div className="gp-hero-grid" />
          <div className="gp-orb gp-orb-1" />
          <div className="gp-orb gp-orb-2" />
        </div>
        <div className="gp-hero-inner">
          <div className="gp-hero-copy">
            <div className="gp-badge animate-fade-up-1">
              <span className="gp-badge-flag"><i /><i /><i /></span>
              <span>Your Germany application workspace</span>
            </div>
            <h1 className="gp-h1 animate-fade-up-2">
              Find the right German university —{' '}
              <span className="gp-h1-accent">then build an application that stands out.</span>
            </h1>
            <p className="gp-sub animate-fade-up-3">
              Search <strong>20,000+ real programs</strong>, compare tuition, language and deadlines, then create your German CV
              and motivation letter when you are ready. Start free — no account needed.
            </p>

            <form onSubmit={handleSearch} className="gp-search animate-fade-up-4">
              <div className="gp-search-bar">
                <Search className="gp-search-icon" />
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); runSearch(query); } }}
                  rows={1}
                  placeholder="Try: tuition-free data science master in English"
                  className="gp-search-input"
                />
                <button type="button" onClick={() => setShowAdvancedSearch(true)} className="gp-search-adv" title="Advanced Search">
                  <Settings className="w-5 h-5" />
                </button>
                <button type="submit" disabled={searching || !query.trim()} className="gp-search-btn">
                  {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Search <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </form>

            <div className="gp-hero-offer animate-fade-up-4">
              <span><Check className="w-3.5 h-3.5" /> Search free</span>
              <span><Check className="w-3.5 h-3.5" /> 2 free AI previews</span>
              <span><Check className="w-3.5 h-3.5" /> Documents from €2.99</span>
            </div>

            <div className="gp-chips animate-fade-up-4">
              {HERO_SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => runSearch(s)} className="gp-chip">{s}</button>
              ))}
            </div>

            <div className="gp-trust animate-fade-up-4">
              <span><Shield className="w-4 h-4" /> No consultant required</span>
              <i />
              <span><Users className="w-4 h-4" /> Built for international students</span>
              <i />
              <span><Globe className="w-4 h-4" /> Updated program data</span>
            </div>
          </div>

          <div className="gp-hero-visual animate-fade-up-3">
            <HeroDemo />
          </div>
        </div>

        <div className="gp-quicklinks">
          {QUICK_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="gp-quicklink">
              {label} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ))}
        </div>
      </section>

      {/* ══ TOOLS ══ */}
      <section className="gp-section gp-tools-section" id="tools">
        <div className="gp-container">
          <div className="gp-head scroll-reveal">
            <span className="gp-eyebrow">Free tools</span>
            <h2 className="gp-h2">Start here — no account needed</h2>
            <p className="gp-lead">Check your grades, plan your budget and organize your applications. Instant and free.</p>
          </div>
          <div className="gp-tools-grid">
            {FREE_TOOLS.map(({ href, label, desc, icon: Icon, gradient }, idx) => (
              <Link key={href} href={href} className="gp-tool scroll-reveal" style={{ transitionDelay: `${idx * 0.08}s` }}>
                <span className="gp-tool-badge gp-tool-badge-free">FREE</span>
                <div className={`gp-tool-icon bg-gradient-to-br ${gradient}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3>{label}</h3>
                <p>{desc}</p>
                <span className="gp-tool-arrow"><ArrowRight className="w-4 h-4" /></span>
              </Link>
            ))}
          </div>

          <div className="gp-head scroll-reveal" style={{ marginTop: 80 }}>
            <span className="gp-eyebrow">AI document tools</span>
            <h2 className="gp-h2">Ready to apply? Let AI write your documents</h2>
            <p className="gp-lead">Preview free — 2 generations, no account. Then one-time credit packs from €2.99. No subscription.</p>
          </div>
          <div className="gp-tools-grid">
            {AI_TOOLS.map(({ href, label, desc, icon: Icon, gradient }, idx) => (
              <Link key={href} href={href} className="gp-tool gp-tool-ai scroll-reveal" style={{ transitionDelay: `${idx * 0.08}s` }}>
                <span className="gp-tool-badge gp-tool-badge-ai"><Sparkles className="w-3 h-3" /> AI</span>
                <div className={`gp-tool-icon bg-gradient-to-br ${gradient}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3>{label}</h3>
                <p>{desc}</p>
                <span className="gp-tool-arrow"><ArrowRight className="w-4 h-4" /></span>
              </Link>
            ))}
          </div>
          <div className="scroll-reveal" style={{ textAlign: 'center', marginTop: 36 }}>
            <Link href="/pricing" className="gp-btn-dark">
              See pricing — packs from €2.99 <ArrowRight className="w-4 h-4" />
            </Link>
            <p style={{ fontSize: 12.5, color: '#8a8a94', margin: '12px 0 0' }}>
              No consultant fees · Credits never expire
            </p>
          </div>
        </div>
      </section>

      {/* ══ CONSULTANT VS GERMAN PATH ══ */}
      <section className="gp-section gp-compare-section">
        <div className="gp-container">
          <div className="gp-head scroll-reveal">
            <span className="gp-eyebrow">Why students switch</span>
            <h2 className="gp-h2">Education agents charge a fortune.<br />The work is now automated.</h2>
            <p className="gp-lead">Same program search. Same application documents. A very different bill.</p>
          </div>

          <div className="gp-compare scroll-reveal">
            <div className="gp-compare-card gp-compare-old">
              <p className="gp-compare-label"><Briefcase className="w-4 h-4" /> Education consultant</p>
              <p className="gp-compare-price gp-strike">€500 – €3,000</p>
              <ul>
                <li><X className="w-4 h-4" /> Weeks of waiting for drafts</li>
                <li><X className="w-4 h-4" /> Generic template letters</li>
                <li><X className="w-4 h-4" /> Pushes partner universities, not your best fit</li>
                <li><X className="w-4 h-4" /> Hidden fees after you commit</li>
              </ul>
            </div>

            <div className="gp-compare-vs"><span>VS</span></div>

            <div className="gp-compare-card gp-compare-new">
              <p className="gp-compare-label"><Sparkles className="w-4 h-4" /> German Path</p>
              <p className="gp-compare-price">
                €0 <span className="gp-compare-price-sub">to search · docs from €2.99</span>
              </p>
              <ul>
                <li><Check className="w-4 h-4" /> AI search across all 20,000+ programs — no bias</li>
                <li><Check className="w-4 h-4" /> CV &amp; motivation letter drafts in 60 seconds, German format</li>
                <li><Check className="w-4 h-4" /> Try before you sign up — 2 free previews</li>
                <li><Check className="w-4 h-4" /> One-time credits, no subscription, never expire</li>
              </ul>
              <Link href="/pricing" className="gp-btn-primary" style={{ marginTop: 18 }}>
                See pricing <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="gp-section gp-steps-section">
        <div className="gp-container">
          <div className="gp-head scroll-reveal">
            <span className="gp-eyebrow">How it works</span>
            <h2 className="gp-h2">From “where do I start?” to enrolled — in 3 steps</h2>
          </div>
          <div className="gp-steps">
            {[
              { n: '01', icon: Search,    title: 'Find your program',    text: 'Describe what you want to study in plain English. AI matches you with real programs — tuition, language, deadlines included.', cta: { label: 'Try the search', href: '#hero' } },
              { n: '02', icon: FileCheck, title: 'Generate your documents', text: 'CV, motivation letter and cover letter — written by AI in the German format admissions offices expect. Preview free.', cta: { label: 'See the tools', href: '#tools' } },
              { n: '03', icon: Send,      title: 'Apply & get your visa', text: 'Follow our step-by-step guides for uni-assist, blocked account and the embassy — written for your country.', cta: { label: 'Read the guides', href: '#guides' } },
            ].map(({ n, icon: Icon, title, text, cta }, idx) => (
              <div key={n} className="gp-step scroll-reveal" style={{ transitionDelay: `${idx * 0.12}s` }}>
                <div className="gp-step-num">{n}</div>
                <div className="gp-step-icon"><Icon className="w-5 h-5" /></div>
                <h3>{title}</h3>
                <p>{text}</p>
                <a href={cta.href} className="gp-step-link">{cta.label} <ArrowRight className="w-3.5 h-3.5" /></a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="gp-stats">
        <div className="gp-container gp-stats-grid">
          {[
            { end: 20000, suffix: '+', label: 'Programs indexed', icon: GraduationCap },
            { end: 2500,  suffix: '+', label: 'Students helped',  icon: Users },
            { end: 0,     prefix: '€', label: 'To search & explore', icon: Shield },
            { end: 60,    suffix: 's', label: 'To a finished document', icon: Clock },
          ].map(({ end, prefix, suffix, label, icon: Icon }, idx) => (
            <div key={label} className="gp-stat scroll-reveal" style={{ transitionDelay: `${idx * 0.1}s` }}>
              <div className="gp-stat-icon"><Icon className="w-5 h-5" /></div>
              <p className="gp-stat-num"><CountUp end={end} prefix={prefix} suffix={suffix} /></p>
              <p className="gp-stat-label">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TESTIMONIALS (marquee) ══ */}
      <section className="gp-section" id="stories">
        <div className="gp-head scroll-reveal">
          <span className="gp-eyebrow">Success stories</span>
          <h2 className="gp-h2">Students who made it to Germany</h2>
        </div>
        <div className="gp-marquee scroll-reveal" aria-label="Student testimonials">
          <div className="gp-marquee-track">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((person, idx) => (
              <figure key={`${person.name}-${idx}`} className="gp-quote-card">
                <blockquote>“{person.quote}”</blockquote>
                <figcaption>
                  <Image
                    src={`https://flagcdn.com/w80/${person.flag.toLowerCase()}.png`}
                    alt={person.location}
                    width={28}
                    height={21}
                    style={{ borderRadius: 4, objectFit: 'cover' }}
                  />
                  <div>
                    <p className="gp-quote-name">{person.name}</p>
                    <p className="gp-quote-loc">{person.location}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GUIDES & RESOURCES ══ */}
      <section className="guides-section gp-guides" id="guides">
        <div className="section-container">
          <div className="gp-head scroll-reveal">
            <span className="gp-eyebrow">Guides &amp; resources</span>
            <h2 className="gp-h2">Everything you need to know</h2>
            <p className="gp-lead">Visa, housing, finances, language — written for international students.</p>
          </div>

          {/* Category Filter Pills */}
          <div className="guides-category-pills scroll-reveal">
            <button
              onClick={() => setActiveCategory('all')}
              className={`guides-category-pill ${activeCategory === 'all' ? 'active' : ''}`}
            >
              All Guides
            </button>
            {JOURNEY_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const count = categorizedPosts[cat.key]?.length || 0;
              if (count === 0) return null;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`guides-category-pill ${activeCategory === cat.key ? 'active' : ''}`}
                  style={{ '--pill-color': cat.color } as React.CSSProperties}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                  <span className="guides-category-count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Articles Grid */}
          {filteredPosts.length > 0 && (
            <div className="guides-articles scroll-reveal">
              <div className="guides-articles-row">
                {filteredPosts.slice(0, visibleCount).map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="guides-article-card">
                    <div className="guides-article-image">
                      {post.featuredImage ? (
                        <Image src={post.featuredImage} alt={stripHtml(post.title)} loading="lazy" className="guides-article-img" width={300} height={160} />
                      ) : post.coverEmoji ? (
                        <div className="guides-article-img-placeholder" style={{ fontSize: 44, background: 'linear-gradient(135deg, #fef2f2, #f5f3ff)' }} aria-hidden>
                          {post.coverEmoji}
                        </div>
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

              <div className="guides-load-more">
                {filteredPosts.length > visibleCount && (
                  <button
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="guides-load-more-btn"
                  >
                    See more articles
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <Link href="/blog" className="guides-load-more-count" style={{ textDecoration: 'underline' }}>
                  Browse all guides →
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <FAQSection />

      {/* ══ FINAL CTA ══ */}
      <section className="gp-cta-section">
        <div className="gp-container">
          <div className="gp-cta scroll-reveal">
            <div className="gp-cta-flag"><i /><i /><i /></div>
            <div className="gp-cta-orb gp-cta-orb-1" />
            <div className="gp-cta-orb gp-cta-orb-2" />
            <h2>Start free. Pay only when you need documents.</h2>
            <p>Search programs, convert your GPA and read every guide — no account, no fees. Your first two AI documents are free to preview.</p>
            <div className="gp-cta-actions">
              <a href="#hero" className="gp-btn-white">Search programs — free</a>
              <Link href="/pricing" className="gp-btn-ghost">See pricing <Euro className="w-4 h-4" /></Link>
            </div>
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
