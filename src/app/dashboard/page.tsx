'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import {
  Sparkles, ArrowRight, Search, Loader2,
  GraduationCap, Bookmark, Send, ChevronRight,
  LogOut, CheckCircle, PlayCircle, X,
  Calendar, FileText, Clock, Target,
  PenTool, Mail, MessageSquare, ExternalLink, Calculator
} from 'lucide-react';
import { ProgramModal } from '@/components/ProgramModal';
import type { ProgramSummary } from '@/lib/types';

type ProfileForm = {
  targetDegreeLevel?: string;
  targetSubjects: string[];
  preferredLanguage?: string;
  germanLevel?: string;
  englishLevel?: string;
  ieltsScore?: string;
  toeflScore?: string;
  hasScholarship?: string;
  academicBackground?: string;
  backgroundSummary?: string;
  experienceHighlights?: string;
  skills?: string;
  careerGoals?: string;
  preferredCities: string[];
  maxTuitionEur?: string;
  desiredIntake?: string;
  desiredStartYear?: string;
  constraints?: string;
  budgetNotes?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
};

type ShortlistEntry = {
  id: string;
  programId: string;
  programName: string;
  university: string;
  addedAt: string;
  notes?: string;
};

type PlanProgress = {
  programId: string;
  programName: string;
  university: string;
  completed: number;
  total: number;
  updatedAt?: string;
  nextStepTitle?: string;
  nextDeadline?: string;
  status: 'not_started' | 'in_progress' | 'complete';
};

const SUGGESTIONS = [
  'Master in Data Science, English-taught',
  'Low-cost engineering bachelor',
  'MBA with summer intake in Berlin',
];

export default function DashboardPage() {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const INITIAL_PROFILE: ProfileForm = {
    targetDegreeLevel: '',
    targetSubjects: [],
    preferredLanguage: 'either',
    germanLevel: '',
    englishLevel: '',
    ieltsScore: '',
    toeflScore: '',
    hasScholarship: '',
    academicBackground: '',
    backgroundSummary: '',
    experienceHighlights: '',
    skills: '',
    careerGoals: '',
    preferredCities: [],
    maxTuitionEur: '',
    desiredIntake: 'any',
    desiredStartYear: '',
    constraints: '',
    budgetNotes: '',
    linkedinUrl: '',
    portfolioUrl: '',
  };

  // AI search
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [results, setResults] = useState<ProgramSummary[]>([]);
  const [reasoning, setReasoning] = useState<string | null>(null);
  const [nonCourseMessage, setNonCourseMessage] = useState<string | null>(null);

  // Shortlist & progress
  const [shortlistEntries, setShortlistEntries] = useState<ShortlistEntry[]>([]);
  const [shortlistedPrograms, setShortlistedPrograms] = useState<string[]>([]);
  const [planProgress, setPlanProgress] = useState<PlanProgress[]>([]);
  const [profileForm, setProfileForm] = useState<ProfileForm>(INITIAL_PROFILE);
  const subjectsInputValue = profileForm.targetSubjects.join(', ');
  const citiesInputValue = profileForm.preferredCities.join(', ');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Program modal
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [shortlistingId, setShortlistingId] = useState<string | null>(null);
  const [signInToast, setSignInToast] = useState(false);
  const [journeyLoading, setJourneyLoading] = useState(false);

  // Fetch shortlist + application plans
  useEffect(() => {
    if (status !== 'authenticated') {
      setShortlistEntries([]);
      setShortlistedPrograms([]);
      setPlanProgress([]);
      return;
    }
    let cancelled = false;
    setJourneyLoading(true);

    (async () => {
      try {
        const [slRes, plansRes] = await Promise.all([
          fetch('/api/shortlist'),
          fetch('/api/application-plans', { cache: 'no-store' }),
        ]);

        if (!cancelled && slRes.ok) {
          const slData = await slRes.json();
          const entries: ShortlistEntry[] = slData.shortlists ?? [];
          setShortlistEntries(entries);
          setShortlistedPrograms(entries.map((e) => e.programId));
        }

        if (!cancelled && plansRes.ok) {
          const plansData = await plansRes.json();
          const progress: PlanProgress[] = [];
          for (const rec of plansData.plans ?? []) {
            if (!rec?.programId || !rec?.planData) continue;
            try {
              const parsed = JSON.parse(rec.planData);
              const steps = Array.isArray(parsed?.steps) ? parsed.steps : [];
              if (steps.length > 0) {
                const completedCount = steps.filter((s: { completed?: boolean }) => s.completed).length;
                const nextStep = steps.find((s: { completed?: boolean }) => !s.completed);
                progress.push({
                  programId: rec.programId,
                  programName: rec.programName || 'Unknown Program',
                  university: rec.university || '',
                  completed: completedCount,
                  total: steps.length,
                  updatedAt: rec.updatedAt,
                  nextStepTitle: nextStep?.title,
                  nextDeadline: nextStep?.deadline,
                  status: completedCount === 0 ? 'not_started' : completedCount === steps.length ? 'complete' : 'in_progress',
                });
              }
            } catch { /* skip bad data */ }
          }
          setPlanProgress(progress);
        }
      } catch { /* silent */ } finally {
        if (!cancelled) setJourneyLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [status]);

  const toggleShortlist = (programId: string) => {
    setShortlistedPrograms((prev) =>
      prev.includes(programId) ? prev.filter((id) => id !== programId) : [...prev, programId]
    );
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setProfileForm(INITIAL_PROFILE);
      return;
    }
    let cancelled = false;
    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        const res = await fetch('/api/profile', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        if (!cancelled && data.profile) {
          const p = data.profile;
          setProfileForm({
            targetDegreeLevel: p.targetDegreeLevel || '',
            targetSubjects: p.targetSubjects || [],
            preferredLanguage: p.preferredLanguage || 'either',
            germanLevel: p.germanLevel || '',
            englishLevel: p.englishLevel || '',
            ieltsScore: p.ieltsScore?.toString() || '',
            toeflScore: p.toeflScore?.toString() || '',
            hasScholarship: typeof p.hasScholarship === 'boolean' ? (p.hasScholarship ? 'yes' : 'no') : '',
            academicBackground: p.academicBackground || '',
            backgroundSummary: p.backgroundSummary || '',
            experienceHighlights: p.experienceHighlights || '',
            skills: p.skills || '',
            careerGoals: p.careerGoals || '',
            preferredCities: p.preferredCities || [],
            maxTuitionEur: p.maxTuitionEur?.toString() || '',
            desiredIntake: p.desiredIntake || 'any',
            desiredStartYear: p.desiredStartYear?.toString() || '',
            constraints: p.constraints || '',
            budgetNotes: p.budgetNotes || '',
            linkedinUrl: p.linkedinUrl || '',
            portfolioUrl: p.portfolioUrl || '',
          });
        }
      } catch (error) {
        console.warn(error);
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    };
    loadProfile();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  const updateProfileForm = (updates: Partial<ProfileForm>) => {
    setProfileForm((prev) => ({ ...prev, ...updates }));
  };

  const handleProfileSave = async () => {
    if (!isAuthenticated) return;
    try {
      setProfileSaving(true);
      setProfileMessage(null);
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetDegreeLevel: profileForm.targetDegreeLevel || undefined,
          targetSubjects: profileForm.targetSubjects,
          preferredLanguage: profileForm.preferredLanguage || undefined,
          germanLevel: profileForm.germanLevel || undefined,
          englishLevel: profileForm.englishLevel || undefined,
          ieltsScore: profileForm.ieltsScore ? Number(profileForm.ieltsScore) : null,
          toeflScore: profileForm.toeflScore ? Number(profileForm.toeflScore) : null,
          hasScholarship: profileForm.hasScholarship ? profileForm.hasScholarship === 'yes' : undefined,
          academicBackground: profileForm.academicBackground || undefined,
          backgroundSummary: profileForm.backgroundSummary || undefined,
          experienceHighlights: profileForm.experienceHighlights || undefined,
          skills: profileForm.skills || undefined,
          careerGoals: profileForm.careerGoals || undefined,
          preferredCities: profileForm.preferredCities,
          maxTuitionEur: profileForm.maxTuitionEur ? Number(profileForm.maxTuitionEur) : null,
          desiredIntake: profileForm.desiredIntake || undefined,
          desiredStartYear: profileForm.desiredStartYear ? Number(profileForm.desiredStartYear) : undefined,
          constraints: profileForm.constraints || undefined,
          budgetNotes: profileForm.budgetNotes || undefined,
          linkedinUrl: profileForm.linkedinUrl || undefined,
          portfolioUrl: profileForm.portfolioUrl || undefined,
        }),
      });
      if (!response.ok) throw new Error('Failed to save profile');
      setProfileMessage('Profile saved. The more you share, the smarter your AI plans become.');
    } catch (error) {
      setProfileMessage(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setProfileSaving(false);
      setTimeout(() => setProfileMessage(null), 4000);
    }
  };

  const handleShortlistFromCard = async (program: ProgramSummary) => {
    if (!isAuthenticated) {
      setSignInToast(true);
      setTimeout(() => setSignInToast(false), 4000);
      return;
    }
    const alreadyShortlisted = shortlistedPrograms.includes(program.id);
    setShortlistingId(program.id);
    try {
      if (alreadyShortlisted) {
        const res = await fetch(`/api/shortlist?programId=${program.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed');
        setShortlistedPrograms((prev) => prev.filter((id) => id !== program.id));
        setShortlistEntries((prev) => prev.filter((e) => e.programId !== program.id));
      } else {
        const res = await fetch('/api/shortlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            programId: program.id,
            programName: program.program_name,
            university: program.university,
            notes: '',
          }),
        });
        if (!res.ok) throw new Error('Failed');
        setShortlistedPrograms((prev) => [...prev, program.id]);
        setShortlistEntries((prev) => [
          ...prev,
          {
            id: program.id,
            programId: program.id,
            programName: program.program_name,
            university: program.university,
            addedAt: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      // silent fail
    } finally {
      setShortlistingId(null);
    }
  };

  // AI search handler
  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setSearchError(null);
    setResults([]);
    setReasoning(null);
    setNonCourseMessage(null);
    try {
      const res = await fetch('/api/course-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), limit: 12 }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || 'Something went wrong');
      }
      const data = await res.json();
      if (data.is_non_course_query) {
        setNonCourseMessage(data.reasoning || 'This doesn\'t seem to be a course search. Try describing the program you\'re looking for.');
        setResults([]);
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

  const hasShortlist = shortlistEntries.length > 0;
  const hasPlans = planProgress.length > 0;

  // Helper: get plan progress for a program
  const getPlanFor = (programId: string) => planProgress.find((p) => p.programId === programId);

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* ── Sign-in toast ── */}
      {signInToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60]">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#1a1a2e] border border-white/10 shadow-2xl shadow-black/40">
            <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center flex-shrink-0">
              <Bookmark className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Sign in to shortlist</p>
              <p className="text-white/40 text-xs">Create a free account to save programs</p>
            </div>
            <Link
              href="/auth/signin"
              className="ml-3 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors flex-shrink-0"
            >
              Sign in
            </Link>
            <button onClick={() => setSignInToast(false)} className="ml-1 text-white/30 hover:text-white/60 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0a1a]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 h-16">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">StudyGermany</span>
          </Link>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={() => setShowProfileModal(true)}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-white/30 text-sm transition-colors"
              >
                Complete Profile
              </button>
            )}

            {isAuthenticated && hasShortlist && (
              <Link
                href="/my-shortlist"
                className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
              >
                <Bookmark className="w-4 h-4" />
                <span>{shortlistEntries.length} saved</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => signOut()}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/signin"
                  className="text-sm text-white/70 hover:text-white transition-colors px-3 py-1.5"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm bg-white text-[#0a0a1a] font-medium px-4 py-1.5 rounded-lg hover:bg-white/90 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6">
        {/* ── Hero + Search ── */}
        <section className="pt-20 pb-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs text-white/50 font-medium tracking-wide uppercase">AI-Powered</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-3">
            Find your perfect program
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              in Germany
            </span>
          </h1>

          <p className="text-white/40 text-lg max-w-lg mx-auto mb-10">
            Describe what you&apos;re looking for and let AI match you with the right courses, instantly.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
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
                placeholder="e.g. English-taught master in AI with no tuition fees..."
                className="w-full pl-5 pr-14 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-white/25 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 resize-none text-[15px] leading-relaxed transition-all"
              />
              <button
                type="submit"
                disabled={searching || !query.trim()}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white disabled:opacity-30 hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                {searching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Suggestion chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-white/40 hover:text-white/70 hover:border-white/15 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </form>
        </section>

        {/* ── Search Results ── */}
        {(searching || searchError || results.length > 0 || nonCourseMessage) && (
          <section className="pb-12">
            {searching && (
              <div className="flex items-center justify-center gap-3 py-12 text-white/40">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Finding the best matches…</span>
              </div>
            )}

            {searchError && (
              <div className="text-center py-8">
                <p className="text-red-400/80 text-sm">{searchError}</p>
              </div>
            )}

            {/* Non-course query — AI helpful message */}
            {!searching && nonCourseMessage && (
              <div className="max-w-2xl mx-auto">
                <div className="flex gap-3 p-5 rounded-2xl bg-gradient-to-br from-purple-500/[0.06] to-blue-500/[0.04] border border-purple-500/15">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/70 text-sm leading-relaxed">{nonCourseMessage}</p>
                    <p className="text-white/25 text-xs mt-3">💡 This search is for finding university programs. Try something like &quot;Master in Data Science&quot; or &quot;English-taught engineering bachelor&quot;.</p>
                  </div>
                </div>
              </div>
            )}

            {!searching && results.length > 0 && (
              <div className="space-y-4">
                {reasoning && (
                  <p className="text-xs text-white/30 text-center mb-6">{reasoning}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((program) => (
                    <div
                      key={program.id}
                      className="rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/15 hover:bg-white/[0.05] transition-all group overflow-hidden"
                    >
                      <div
                        className="relative h-36 w-full bg-gradient-to-br from-blue-900/40 to-purple-900/40 overflow-hidden cursor-pointer"
                        onClick={() => setSelectedProgramId(program.id)}
                      >
                        {program.image_url ? (
                          <Image
                            src={program.image_url}
                            alt={program.program_name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            unoptimized
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <GraduationCap className="w-10 h-10 text-white/10" />
                          </div>
                        )}
                        {program.is_free && (
                          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-emerald-500/90 text-[10px] font-semibold text-white">No Tuition</span>
                        )}
                        {/* Shortlist button on image */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleShortlistFromCard(program); }}
                          disabled={shortlistingId === program.id}
                          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all disabled:opacity-50 ${
                            shortlistedPrograms.includes(program.id)
                              ? 'bg-amber-500/30 border border-amber-400/40 text-amber-300'
                              : 'bg-black/40 border border-white/20 text-white/60 hover:text-white hover:bg-black/60'
                          }`}
                        >
                          {shortlistingId === program.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Bookmark className={`w-4 h-4 ${shortlistedPrograms.includes(program.id) ? 'fill-current' : ''}`} />
                          )}
                        </button>
                      </div>
                      <div className="p-4 cursor-pointer" onClick={() => setSelectedProgramId(program.id)}>
                        <h3 className="text-white font-semibold text-sm group-hover:text-blue-300 transition-colors leading-snug line-clamp-2">
                          {program.program_name}
                        </h3>
                        <p className="text-white/40 text-xs mt-1.5 line-clamp-1">
                          {program.university}{program.city ? ` · ${program.city}` : ''}
                        </p>
                        {program.match_reason && (
                          <p className="text-emerald-400/50 text-[11px] mt-2 leading-relaxed line-clamp-2">{program.match_reason}</p>
                        )}
                        <div className="flex items-center gap-2 mt-3 text-[11px] text-white/25">
                          {program.tuition_fee_number != null ? (
                            <span>&euro;{program.tuition_fee_number.toLocaleString()}</span>
                          ) : program.is_free ? (
                            <span className="text-emerald-400/60">Free</span>
                          ) : null}
                          {program.beginning_normalized && (
                            <span>{program.beginning_normalized}</span>
                          )}
                          <span className="ml-auto text-white/15 group-hover:text-white/40 transition-colors flex items-center gap-0.5">
                            Details <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inline hint after results */}
                <div className="text-center pt-2">
                  <p className="text-white/25 text-xs">
                    <Bookmark className="w-3 h-3 inline mr-1 -mt-0.5" />
                    Tap the <strong className="text-white/40">bookmark icon</strong> to shortlist a program. Then go to your shortlist and click <strong className="text-white/40">Start Application</strong> — AI will create your personalized checklist.
                  </p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Quick Tools ── */}
        <section className="pb-10">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider">Application Tools</h2>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <Link
              href="/cv-maker"
              className="group flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:border-cyan-500/25 hover:bg-cyan-500/[0.04] transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/15 transition-colors">
                <PenTool className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium">CV Maker</p>
                <p className="text-white/25 text-[11px] truncate">Build your academic CV</p>
              </div>
            </Link>

            <Link
              href="/cover-letter"
              className="group flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:border-violet-500/25 hover:bg-violet-500/[0.04] transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-500/15 transition-colors">
                <FileText className="w-4 h-4 text-violet-300" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium">Cover Letter</p>
                <p className="text-white/25 text-[11px] truncate">Draft & improve letters</p>
              </div>
            </Link>

            <Link
              href="/motivation-letter"
              className="group flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:border-pink-500/25 hover:bg-pink-500/[0.04] transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-500/15 transition-colors">
                <Mail className="w-4 h-4 text-pink-400" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium">Motivation Letter</p>
                <p className="text-white/25 text-[11px] truncate">AI-written for your program</p>
              </div>
            </Link>

            <Link
              href="/gpa-converter"
              className="group flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:border-emerald-500/25 hover:bg-emerald-500/[0.04] transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/15 transition-colors">
                <Calculator className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium">GPA Converter</p>
                <p className="text-white/25 text-[11px] truncate">Convert to German scale</p>
              </div>
            </Link>
          </div>
        </section>

        {/* ── Journey loading skeleton ── */}
        {isAuthenticated && journeyLoading && (
          <section className="pb-14">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="h-5 w-48 rounded bg-white/[0.06] animate-pulse" />
                <div className="h-3 w-32 rounded bg-white/[0.04] animate-pulse mt-2" />
              </div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-white/[0.05] animate-pulse" />
                      <div className="h-3 w-1/2 rounded bg-white/[0.03] animate-pulse" />
                    </div>
                    <div className="h-8 w-28 rounded-lg bg-white/[0.05] animate-pulse flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Your Journey (contextual) ── */}
        {/* Show shortlist + progress if user has saved programs */}
        {isAuthenticated && !journeyLoading && hasShortlist && (
          <section className="pb-14">
            {/* Section header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-white font-semibold text-lg">Your Application Journey</h2>
                <p className="text-white/30 text-xs mt-0.5">{shortlistEntries.length} program{shortlistEntries.length !== 1 ? 's' : ''} saved{hasPlans ? ` · ${planProgress.filter(p => p.status === 'complete').length} complete` : ''}</p>
              </div>
              <Link
                href="/my-shortlist"
                className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1"
              >
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Quick stats row for users with plans */}
            {hasPlans && (
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="p-3.5 rounded-xl bg-blue-500/[0.06] border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-white/30 text-[10px] uppercase tracking-wider">In Progress</span>
                  </div>
                  <p className="text-white font-bold text-lg">{planProgress.filter(p => p.status === 'in_progress').length}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-white/30 text-[10px] uppercase tracking-wider">Not Started</span>
                  </div>
                  <p className="text-white font-bold text-lg">{shortlistEntries.length - planProgress.length + planProgress.filter(p => p.status === 'not_started').length}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-white/30 text-[10px] uppercase tracking-wider">Complete</span>
                  </div>
                  <p className="text-white font-bold text-lg">{planProgress.filter(p => p.status === 'complete').length}</p>
                </div>
              </div>
            )}

            {/* Program cards */}
            <div className="space-y-3">
              {shortlistEntries.map((entry) => {
                const plan = getPlanFor(entry.programId);
                const pct = plan ? Math.round((plan.completed / plan.total) * 100) : 0;

                return (
                  <div
                    key={entry.id}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12] transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* Info */}
                      <button
                        onClick={() => setSelectedProgramId(entry.programId)}
                        className="flex-1 text-left min-w-0"
                      >
                        <p className="text-white font-medium text-sm leading-snug truncate">{entry.programName}</p>
                        <p className="text-white/35 text-xs mt-0.5 truncate">{entry.university}</p>
                      </button>

                      {/* CTA */}
                      {plan ? (
                        <Link
                          href={`/course-finder/${entry.programId}?source=shortlist`}
                          className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-all flex-shrink-0 ${
                            pct === 100
                              ? 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-300'
                              : 'bg-blue-500/15 border border-blue-500/25 text-blue-300 hover:text-white hover:border-blue-400/40'
                          }`}
                        >
                          {pct === 100 ? (
                            <><CheckCircle className="w-3.5 h-3.5" /> Complete</>
                          ) : (
                            <>Continue <ChevronRight className="w-3 h-3" /></>
                          )}
                        </Link>
                      ) : (
                        <Link
                          href={`/course-finder/${entry.programId}?source=shortlist`}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/25 text-xs font-medium text-blue-300 hover:text-white hover:border-blue-400/40 transition-all flex-shrink-0"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          Start Application
                        </Link>
                      )}
                    </div>

                    {/* Progress bar + next step details */}
                    {plan && (
                      <div className="mt-3 pt-3 border-t border-white/[0.05]">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className={`text-[11px] font-medium ${pct === 100 ? 'text-emerald-400' : 'text-white/40'}`}>
                            {plan.completed}/{plan.total}
                          </span>
                        </div>
                        {plan.nextStepTitle && pct < 100 && (
                          <div className="flex items-center gap-2 text-xs">
                            <FileText className="w-3 h-3 text-white/20 flex-shrink-0" />
                            <span className="text-white/40">Next:</span>
                            <span className="text-white/60 truncate">{plan.nextStepTitle}</span>
                            {plan.nextDeadline && (
                              <span className="flex items-center gap-1 text-amber-400/60 ml-auto flex-shrink-0">
                                <Calendar className="w-3 h-3" />
                                {plan.nextDeadline}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Explainer for new / unauthenticated users (no shortlist yet) */}
        {!hasShortlist && (
          <section className="pb-16">
            {/* Divider */}
            {results.length > 0 && (
              <div className="border-t border-white/[0.06] mb-10 mt-2" />
            )}
            <div className="text-center mb-6">
              <h2 className="text-white font-semibold text-lg">How it works</h2>
              <p className="text-white/30 text-xs mt-1">From search to application — AI guides every step</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Card 1 */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/15">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Search className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-400/50 uppercase tracking-widest">Step 1</span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1.5">Search &amp; Explore</h3>
                <p className="text-white/30 text-xs leading-relaxed">
                  Describe what you want to study above. AI searches 2,500+ programs and shows you the best matches with fees, requirements, and details.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/15">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Bookmark className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-[10px] font-bold text-purple-400/50 uppercase tracking-widest">Step 2</span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1.5">Shortlist Favorites</h3>
                <p className="text-white/30 text-xs leading-relaxed">
                  Open any program, check the details, and tap <strong className="text-white/50">Shortlist</strong> to save it.
                  {!isAuthenticated && (
                    <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300 ml-1">Sign up free</Link>
                  )}
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/15">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400/50 uppercase tracking-widest">Step 3</span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1.5">Apply with AI</h3>
                <p className="text-white/30 text-xs leading-relaxed">
                  Click <strong className="text-white/50">Start Application</strong> on any saved program. AI creates your personalized checklist: CV, motivation letter, GPA, documents &amp; deadlines.
                </p>
              </div>
            </div>

            {/* CTA for unauthenticated */}
            {!isAuthenticated && (
              <div className="text-center mt-6">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/20"
                >
                  Get Started Free <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Profile Modal */}
      {isAuthenticated && showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10 bg-black/70 backdrop-blur-sm" role="dialog" aria-modal>
          <div className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0f0f23] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/35">Your AI profile</p>
                <h2 className="text-white text-xl font-semibold mt-1">Help us know you better</h2>
                <p className="text-white/50 text-sm mt-2 max-w-xl">
                  Every field is optional, but more context means smarter recommendations, letters, and plans.
                </p>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
                aria-label="Close profile editor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {profileLoading ? (
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading your profile…
                </div>
              ) : (
                <>
                  {profileMessage && (
                    <div className="text-xs px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-white/70">
                      {profileMessage}
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Target degree</label>
                        <select
                          value={profileForm.targetDegreeLevel}
                          onChange={(e) => updateProfileForm({ targetDegreeLevel: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/[0.02] text-white/80 text-sm px-3 py-2"
                        >
                          <option value="">Not sure yet</option>
                          <option value="bachelor">Bachelor</option>
                          <option value="master">Master</option>
                          <option value="phd">PhD</option>
                          <option value="non_degree">Certificate / Other</option>
                          <option value="any">Any</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Subject interests</label>
                        <input
                          value={subjectsInputValue}
                          onChange={(e) => updateProfileForm({ targetSubjects: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                          placeholder="e.g. AI, Robotics"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.02] text-white/80 text-sm px-3 py-2 placeholder:text-white/25"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Preferred language</label>
                        <select
                          value={profileForm.preferredLanguage}
                          onChange={(e) => updateProfileForm({ preferredLanguage: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/[0.02] text-white/80 text-sm px-3 py-2"
                        >
                          <option value="either">Either English or German</option>
                          <option value="english">English</option>
                          <option value="german">German</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-white/50 mb-1 block">German level</label>
                          <select
                            value={profileForm.germanLevel}
                            onChange={(e) => updateProfileForm({ germanLevel: e.target.value })}
                            className="w-full rounded-xl border border-white/10 bg-white/[0.02] text-white/80 text-sm px-3 py-2"
                          >
                            <option value="">Not specified</option>
                            {['none','a1','a2','b1','b2','c1','c2'].map((level) => (
                              <option key={level} value={level}>{level.toUpperCase()}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-white/50 mb-1 block">English level</label>
                          <select
                            value={profileForm.englishLevel}
                            onChange={(e) => updateProfileForm({ englishLevel: e.target.value })}
                            className="w-full rounded-xl border border-white/10 bg-white/[0.02] text-white/80 text-sm px-3 py-2"
                          >
                            <option value="">Not specified</option>
                            {['none','a1','a2','b1','b2','c1','c2'].map((level) => (
                              <option key={level} value={level}>{level.toUpperCase()}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-white/50 mb-1 block">IELTS</label>
                          <input
                            type="number"
                            min="0"
                            max="9"
                            step="0.1"
                            value={profileForm.ieltsScore}
                            onChange={(e) => updateProfileForm({ ieltsScore: e.target.value })}
                            placeholder="e.g. 7.5"
                            className="w-full rounded-xl border border-white/10 bg-white/[0.02] text-white/80 text-sm px-3 py-2 placeholder:text-white/25"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-white/50 mb-1 block">TOEFL</label>
                          <input
                            type="number"
                            min="0"
                            max="120"
                            value={profileForm.toeflScore}
                            onChange={(e) => updateProfileForm({ toeflScore: e.target.value })}
                            placeholder="e.g. 102"
                            className="w-full rounded-xl border border-white/10 bg-white/[0.02] text-white/80 text-sm px-3 py-2 placeholder:text-white/25"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Academic background</label>
                        <textarea
                          value={profileForm.academicBackground}
                          onChange={(e) => updateProfileForm({ academicBackground: e.target.value })}
                          placeholder="Current degree, GPA, notable coursework..."
                          rows={3}
                          className="w-full rounded-xl border border-white/10 bg-white/[0.02] text-white/80 text-sm px-3 py-2 placeholder:text-white/25"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Experience & skills</label>
                        <textarea
                          value={profileForm.experienceHighlights}
                          onChange={(e) => updateProfileForm({ experienceHighlights: e.target.value })}
                          placeholder="Internships, research, projects, leadership..."
                          rows={3}
                          className="w-full rounded-xl border border-white/10 bg-white/[0.02] text-white/80 text-sm px-3 py-2 placeholder:text-white/25"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Career goals</label>
                        <textarea
                          value={profileForm.careerGoals}
                          onChange={(e) => updateProfileForm({ careerGoals: e.target.value })}
                          rows={2}
                          placeholder="e.g. Build AI for healthcare"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.02] text-white/80 text-sm px-3 py-2 placeholder:text-white/25"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Preferred cities</label>
                        <input
                          value={citiesInputValue}
                          onChange={(e) => updateProfileForm({ preferredCities: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                          placeholder="e.g. Berlin, Munich"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.02] text-white/80 text-sm px-3 py-2 placeholder:text-white/25"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Max tuition (€ / year)</label>
                        <input
                          type="number"
                          min="0"
                          value={profileForm.maxTuitionEur}
                          onChange={(e) => updateProfileForm({ maxTuitionEur: e.target.value })}
                          placeholder="Optional"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.02] text-white/80 text-sm px-3 py-2 placeholder:text-white/25"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Preferred intake</label>
                        <select
                          value={profileForm.desiredIntake}
                          onChange={(e) => updateProfileForm({ desiredIntake: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/[0.02] text-white/80 text-sm px-3 py-2"
                        >
                          <option value="any">Any</option>
                          <option value="winter">Winter</option>
                          <option value="summer">Summer</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Start year</label>
                        <input
                          type="number"
                          min={new Date().getFullYear()}
                          max={2030}
                          value={profileForm.desiredStartYear}
                          onChange={(e) => updateProfileForm({ desiredStartYear: e.target.value })}
                          placeholder="e.g. 2025"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.02] text-white/80 text-sm px-3 py-2 placeholder:text-white/25"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Scholarship preference</label>
                        <select
                          value={profileForm.hasScholarship}
                          onChange={(e) => updateProfileForm({ hasScholarship: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/[0.02] text-white/80 text-sm px-3 py-2"
                        >
                          <option value="">No preference</option>
                          <option value="yes">I already have funding</option>
                          <option value="no">Need funding assistance</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">LinkedIn</label>
                        <input
                          value={profileForm.linkedinUrl}
                          onChange={(e) => updateProfileForm({ linkedinUrl: e.target.value })}
                          placeholder="https://"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.02] text-white/80 text-sm px-3 py-2 placeholder:text-white/25"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Portfolio / website</label>
                        <input
                          value={profileForm.portfolioUrl}
                          onChange={(e) => updateProfileForm({ portfolioUrl: e.target.value })}
                          placeholder="https://"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.02] text-white/80 text-sm px-3 py-2 placeholder:text-white/25"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-white/50 mb-1 block">Other notes or constraints</label>
                      <textarea
                        value={profileForm.constraints}
                        onChange={(e) => updateProfileForm({ constraints: e.target.value })}
                        rows={2}
                        placeholder="Visas, deadlines, budget notes..."
                        className="w-full rounded-xl border border-white/10 bg-white/[0.02] text-white/80 text-sm px-3 py-2 placeholder:text-white/25"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        disabled={profileSaving}
                        onClick={handleProfileSave}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Save profile
                      </button>
                      <p className="text-xs text-white/45">Optional—but sharing helps AI tailor everything to you.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Program Modal ── */}
      {selectedProgramId && (
        <ProgramModal
          programId={selectedProgramId}
          isShortlisted={shortlistedPrograms.includes(selectedProgramId)}
          onToggleShortlist={() => toggleShortlist(selectedProgramId)}
          onClose={() => setSelectedProgramId(null)}
        />
      )}
    </div>
  );
}
