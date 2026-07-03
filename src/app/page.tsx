'use client';

import { useState, useEffect, useMemo, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import {
  Search, Loader2, Bookmark, X, ArrowRight, BookOpen,
  GraduationCap, FileText, Languages, Home, Briefcase, CreditCard, Shield,
  Plane, Star, Zap, TrendingUp, Users, Globe, Calculator, LayoutDashboard,
  Settings, Filter, Sparkles, School, FolderOpen, ChevronLeft, ChevronRight, ChevronDown
} from 'lucide-react';
import { ProgramModal } from '@/components/ProgramModal';
import { ProgramCard } from '@/components/ProgramCard';
import type { ProgramSummary } from '@/lib/types';
import { SiteNav } from '@/components/SiteNav';

const SEARCH_RESULTS_LIMIT = 120;
const RESULTS_PER_PAGE = 12;

const HERO_SUGGESTIONS = [
  'English-taught master in AI',
  'Tuition-free engineering bachelor',
  'MBA in Berlin',
  'Data science master, winter 2026',
];

const QUICK_LINKS = [
  { href: '/masters-in-germany', label: 'Masters in Germany' },
  { href: '/bachelor-in-germany', label: 'Bachelors in Germany' },
  { href: '/english-taught-programs', label: 'English-taught programs' },
  { href: '/study-in-germany', label: 'Study in Germany guide' },
];

const FREE_TOOLS = [
  { href: '/gpa-converter/landing',           label: 'GPA Converter',      desc: 'Convert your grades to the German scale instantly. Know where you stand before you apply.', icon: TrendingUp, gradient: 'from-blue-500 to-indigo-600' },
  { href: '/netto-brutto-calculator/landing', label: 'Salary Calculator',  desc: 'See your real net salary after German taxes — for student jobs and your first job after graduation.', icon: Calculator, gradient: 'from-amber-500 to-orange-600' },
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
    location: 'LAHORE, PAKISTAN',
    quote: 'From Lahore to Leipzig in 6 months. The AI tools helped me translate my Pakistani qualifications to German standards. Now pursuing my dream of studying Computer Science at a top university.',
    flag: 'PK'
  },
  {
    name: 'Zainab O.',
    location: 'NAIROBI, KENYA',
    quote: 'The AI CV Maker was a game changer. I got accepted into three TU9 universities for Data Science. German Path made the complex simple.',
    flag: 'KE'
  },
  {
    name: 'Arjun M.',
    location: 'MUMBAI, INDIA',
    quote: 'Navigating the visa process from India was stressful until I found their step-by-step guides. Currently studying in Munich thanks to them!',
    flag: 'IN'
  },
  {
    name: 'Linh T.',
    location: 'HANOI, VIETNAM',
    quote: 'The GPA converter showed me that my grades were actually eligible for top public universities. It changed my entire application strategy.',
    flag: 'VN'
  },
  {
    name: 'Ahmed K.',
    location: 'CAIRO, EGYPT',
    quote: 'The motivation letter tool helped me craft a compelling story. Got accepted to RWTH Aachen with a scholarship for my Master in Engineering.',
    flag: 'EG'
  },
  {
    name: 'Maria S.',
    location: 'MANILA, PHILIPPINES',
    quote: 'Finding English-taught programs was overwhelming until I used German Path. Now I am studying Business Analytics in Berlin!',
    flag: 'PH'
  },
  {
    name: 'David N.',
    location: 'LAGOS, NIGERIA',
    quote: 'The blocked account guide and visa checklist saved me months of confusion. Successfully got my student visa on the first try.',
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

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
    }
  ];

  return (
    <section className="faq-section-new" id="faq">
      <div className="section-container">
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 className="section-title" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, marginBottom: '16px' }}>
            Frequently Asked Questions
          </h2>
          <p className="section-desc" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '16px', color: '#737373' }}>
            The questions every future international student asks first.
          </p>
        </div>

        <div className="faq-accordion" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {faqs.map((faq, index) => (
            <div key={index} className="faq-accordion-item">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="faq-accordion-button"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className="w-5 h-5 transition-transform"
                  style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
              {openIndex === index && (
                <div className="faq-accordion-content">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section style={{ padding: '80px 24px', background: '#fafafa', borderTop: '1px solid #ebebeb' }}>
      <div className="section-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="cta-box-new">
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#fff', marginBottom: '16px', textAlign: 'center' }}>
            Ready to start your journey?
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', marginBottom: '32px', textAlign: 'center', maxWidth: '600px', margin: '0 auto 32px' }}>
            Search programs, convert your GPA and read the guides — all free, no account needed. Sign up when you want to save programs and build your application.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/signup" className="cta-btn-white">
              Create Free Account
            </Link>
            <Link href="#hero" className="cta-btn-outline">
              Search Programs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialSlider({ testimonials }: { testimonials: typeof TESTIMONIALS }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalSlides = testimonials.length - itemsPerPage + 1;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % totalSlides);
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(interval);
  }, [totalSlides]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % totalSlides);
  };

  // Duplicate testimonials for infinite scrolling
  const allTestimonials = [...testimonials, ...testimonials, ...testimonials];
  const displayIndex = currentIndex + testimonials.length; // Start from middle copy
  const displayTestimonials = allTestimonials.slice(displayIndex, displayIndex + itemsPerPage);

  return (
    <section className="testimonial-section-new" id="stories">
      <div className="section-container">
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 className="section-title" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, marginBottom: '16px' }}>
            Students who made it to Germany
          </h2>
          <p className="section-desc" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '16px', color: '#737373' }}>
            Join 2,500+ students who found their path with German Path.
          </p>
        </div>

        <div className="testimonial-slider-wrapper-new" style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="testimonial-grid-new">
            {displayTestimonials.map((person, idx) => (
              <article key={`${person.name}-${idx}-${currentIndex}`} className="testimonial-card-new">
                <div className="testimonial-quote-icon">&quot;</div>
                <p className="testimonial-quote-text">{person.quote}</p>
                <div className="testimonial-footer">
                  <div className="testimonial-avatar-new">
                    <Image
                      src={`https://flagcdn.com/w80/${person.flag.toLowerCase()}.png`}
                      alt={person.location}
                      width={32}
                      height={24}
                      style={{ borderRadius: '4px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="testimonial-info-new">
                    <p className="testimonial-name-new">{person.name}</p>
                    <p className="testimonial-location-new">{person.location}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="testimonial-nav-new">
            <button onClick={handlePrev} className="testimonial-nav-btn-new" aria-label="Previous">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleNext} className="testimonial-nav-btn-new" aria-label="Next">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
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
  const [wpPosts, setWpPosts] = useState<WpPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
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
  }, [wpPosts, postsLoading, activeCategory]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/wp-posts?per_page=100');
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
      // Exclude if it ONLY has News category (News but no other categories)
      return !(hasNews && !hasOtherCategories);
    });

    guidePosts.forEach(post => {
      const postSlugs = post.categories.map(c => c.slug.toLowerCase());
      const postNames = post.categories.map(c => c.name.toLowerCase());
      let placed = false;
      // Allow a post to appear in multiple matching categories (not just the first)
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
    // Filter out News-only posts
    const guidePosts = wpPosts.filter(post => {
      const hasNews = post.categories.some(c => c.slug.toLowerCase() === 'news');
      const hasOtherCategories = post.categories.some(c => c.slug.toLowerCase() !== 'news');
      return !(hasNews && !hasOtherCategories);
    });

    if (activeCategory === 'all') return guidePosts;
    return categorizedPosts[activeCategory] || [];
  }, [activeCategory, wpPosts, categorizedPosts]);

  // Reset visible count when category changes
  useEffect(() => {
    setVisibleCount(6);
  }, [activeCategory]);

  const runSearch = async (searchText: string) => {
    const trimmed = searchText.trim();
    if (!trimmed) return;
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
    <div className="homepage-root">

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
      <section className="hero-section" id="hero">
        <div className="hero-bg-orbs">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>
        <div className="hero-content">
          <div className="hero-badge animate-fade-up-1">
            <span className="hero-badge-dot" />
            <span>FREE AI SEARCH · 20,000+ PROGRAMS</span>
          </div>
          <h1 className="hero-title animate-fade-up-2">
            <span style={{ display: 'block' }}>
              Find your degree program<br />
              <span className="hero-title-gradient">in Germany — free</span>
            </span>
          </h1>
          <p className="hero-subtitle animate-fade-up-3">
            Describe what you want to study in plain English. Our AI searches every German university program — no consultant, no fees, no account needed.
          </p>
          <form onSubmit={handleSearch} className="hero-search-form animate-fade-up-4">
            <div className="hero-search-bar">
              <Search className="hero-search-icon" />
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); runSearch(query); } }}
                rows={1}
                placeholder="e.g. tuition-free data science master in English, winter 2026"
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
            <span style={{ fontSize: 13, color: '#8a8a94', alignSelf: 'center' }}>Try:</span>
            {HERO_SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => runSearch(s)} className="hero-chip">{s}</button>
            ))}
          </div>
          <div className="hero-trust animate-fade-up-4">
            <div className="hero-trust-item"><Shield className="w-4 h-4" /><span>Free to use</span></div>
            <div className="hero-trust-divider" />
            <div className="hero-trust-item"><Users className="w-4 h-4" /><span>2,500+ students helped</span></div>
            <div className="hero-trust-divider" />
            <div className="hero-trust-item"><Globe className="w-4 h-4" /><span>All German universities</span></div>
          </div>
          <div className="hero-quicklinks animate-fade-up-4" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 28 }}>
            {QUICK_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 999, background: '#fff', border: '1px solid #e8e6ea', fontSize: 13, fontWeight: 600, color: '#444', textDecoration: 'none' }}>
                {label} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TOOLS (one unified section — free tools first) ══ */}
      <section className="tools-section" id="tools" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <div className="section-container">
          <div className="section-header scroll-reveal">
            <div className="section-label">Free Tools</div>
            <h2 className="section-title">Start here — no account needed</h2>
            <p className="section-desc">Check your grades, plan your budget and organize your applications. Instant and free.</p>
          </div>
          <div className="tools-grid">
            {FREE_TOOLS.map(({ href, label, desc, icon: Icon, gradient }, idx) => (
              <Link
                key={href}
                href={href}
                className="tool-card scroll-reveal"
                style={{ transitionDelay: `${idx * 0.08}s` }}
              >
                <span style={{ position: 'absolute', top: 16, right: 16, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, background: '#ecfdf5', color: '#059669', fontSize: 11, fontWeight: 800, letterSpacing: '0.03em' }}>
                  FREE
                </span>
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

          <div className="section-header scroll-reveal" style={{ marginTop: 72 }}>
            <div className="section-label">AI Application Tools</div>
            <h2 className="section-title">Ready to apply? Let AI write your documents</h2>
            <p className="section-desc">German-format CV, motivation letter and cover letter — generated for your profile. One-time credit packs from €2.99, no subscription.</p>
          </div>
          <div className="tools-grid">
            {AI_TOOLS.map(({ href, label, desc, icon: Icon, gradient }, idx) => (
              <Link
                key={href}
                href={href}
                className="tool-card tool-card--premium scroll-reveal"
                style={{ transitionDelay: `${idx * 0.08}s` }}
              >
                <span className="tool-premium-badge" aria-label="AI tool">
                  <Sparkles className="w-3 h-3" />
                  AI
                </span>
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
          <div className="scroll-reveal" style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 14, background: '#111', color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
              See pricing — packs from €2.99 <ArrowRight className="w-4 h-4" />
            </Link>
            <p style={{ fontSize: 12.5, color: '#8a8a94', margin: '12px 0 0' }}>
              No consultant fees · Credits never expire
            </p>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="howto-section scroll-reveal" style={{ padding: '96px 24px', background: '#fafafa', borderTop: '1px solid #ebebeb' }}>
        <div className="section-container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className="section-title" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, marginBottom: '16px' }}>Your Path, Simplified</h2>
            <p className="section-desc" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '16px' }}>We&apos;ve broken down the complex process of moving to Germany into five clear, manageable milestones.</p>
          </div>
          <div className="howto-steps-container">
            <div className="howto-progress-line" style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: '#ebe7e7', transform: 'translateY(-50%)', zIndex: -1 }} />
            <div className="howto-step">
              <div className="howto-step-circle gradient">01</div>
              <h4>Find Programs</h4>
              <p>Search 20,000+ courses with AI.</p>
            </div>
            <div className="howto-step">
              <div className="howto-step-circle gray">02</div>
              <h4>Prepare Docs</h4>
              <p>Build your CV and motivation letter.</p>
            </div>
            <div className="howto-step">
              <div className="howto-step-circle gray">03</div>
              <h4>Apply</h4>
              <p>Submit through Uni-Assist or directly.</p>
            </div>
            <div className="howto-step">
              <div className="howto-step-circle gray">04</div>
              <h4>Get Visa</h4>
              <p>Navigate embassy requirements with ease.</p>
            </div>
            <div className="howto-step">
              <div className="howto-step-circle gray">05</div>
              <h4>Arrive</h4>
              <p>Land in Germany and start your life.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ GUIDES & RESOURCES ══ */}
      <section className="guides-section" id="guides">
        <div className="section-container">
          <div className="section-header scroll-reveal">
            <div className="section-label">Guides &amp; Resources</div>
            <h2 className="section-title">Everything you need to know</h2>
            <p className="section-desc">Visa, housing, finances, language — written for international students.</p>
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
          {!postsLoading && filteredPosts.length > 0 && (
            <div className="guides-articles scroll-reveal">
              <div className="guides-articles-row">
                {filteredPosts.slice(0, visibleCount).map((post) => (
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
            { num: '€0', label: 'To search & explore', icon: Shield },
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
      <TestimonialSlider testimonials={TESTIMONIALS} />

      {/* ══ FAQ ══ */}
      <FAQSection />

      {/* ══ CTA ══ */}
      <CTASection />

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
