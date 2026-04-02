'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { Program } from '@/lib/types';
import {
  X, MapPin, GraduationCap, Calendar, Globe, Clock,
  ExternalLink, FileText, Star, CheckCircle,
  Bookmark, ArrowRight, Loader2, ChevronDown, ChevronUp, Euro,
  BookOpen, ShieldCheck, Coins, Briefcase, Home,
  Users, Languages, TrendingUp, Sparkles, AlertCircle, LogIn, UserPlus,
  type LucideIcon
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { createPortal } from 'react-dom';

interface ProgramModalProps {
  programId: string;
  onClose: () => void;
  isShortlisted?: boolean;
  onToggleShortlist?: () => void;
}

type Tab = 'overview' | 'city' | 'requirements' | 'costs';

interface DetailSectionCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: ReactNode;
  containerClassName?: string;
  iconClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

function DetailSectionCard({
  icon: Icon,
  title,
  subtitle,
  children,
  containerClassName = 'border-gray-200 bg-white',
  iconClassName = 'from-slate-500 to-slate-600 shadow-slate-500/20',
  titleClassName = 'text-gray-900',
  subtitleClassName = 'text-gray-500',
}: DetailSectionCardProps) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${containerClassName}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconClassName} flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className={`font-bold ${titleClassName}`}>{title}</h3>
          <p className={`text-xs ${subtitleClassName}`}>{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export function ProgramModal({ programId, onClose, isShortlisted = false, onToggleShortlist }: ProgramModalProps) {
  const { status } = useSession();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shortlistLoading, setShortlistLoading] = useState(false);
  const [isShortlistedState, setIsShortlistedState] = useState(isShortlisted);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showAllModules, setShowAllModules] = useState(false);
  const [signInMessage, setSignInMessage] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/programs/${programId}`);
        if (!response.ok) throw new Error('Failed to fetch program details');
        const data = await response.json();
        setProgram(data.program);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [programId]);

  useEffect(() => {
    if (status !== 'authenticated') {
      setIsShortlistedState(isShortlisted);
      return;
    }

    const loadShortlist = async () => {
      try {
        const shortlistResponse = await fetch('/api/shortlist');
        if (!shortlistResponse.ok) return;

        const shortlistData = await shortlistResponse.json();
        const isInShortlist = shortlistData.shortlists?.some((item: { programId: string }) => item.programId === programId);
        setIsShortlistedState(!!isInShortlist);
      } catch (err) {
        console.error('Shortlist preload failed:', err);
      }
    };

    loadShortlist();
  }, [programId, isShortlisted, status]);

  const handleToggleShortlist = async () => {
    if (status !== 'authenticated') {
      setSignInMessage(true);
      return;
    }
    if (!program) return;
    setShortlistLoading(true);
    try {
      if (isShortlistedState) {
        const response = await fetch(`/api/shortlist?programId=${programId}`, { method: 'DELETE' });
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error?.error || 'Failed to remove from shortlist');
        }
        setIsShortlistedState(false);
      } else {
        const response = await fetch('/api/shortlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            programId: program.id,
            programName: program.program_name,
            university: program.university,
            notes: ''
          }),
        });
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          if (response.status === 409) {
            // Already in shortlist, just update the state
            setIsShortlistedState(true);
            return;
          }
          if (response.status === 400 && error?.error?.includes('User not found')) {
            // User session issue
            setSignInMessage(true);
            setTimeout(() => setSignInMessage(false), 5000);
            throw new Error('Please sign out and sign back in to update your shortlist');
          }
          throw new Error(error?.error || 'Failed to add to shortlist');
        }
        setIsShortlistedState(true);
      }
      onToggleShortlist?.();
    } catch (err) {
      console.error('Shortlist error:', err);
      // You could add a toast notification here
      alert(err instanceof Error ? err.message : 'Failed to update shortlist');
    } finally {
      setShortlistLoading(false);
    }
  };

  const capitalize = (value?: string | null) => value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
  const parseArrayField = (field?: string[] | null) => {
    if (!field) return [];
    return field.flatMap(item => item.split(',')).map(item => item.replace(/['\[\]]/g, '').trim()).filter(Boolean).map(item => item.charAt(0).toUpperCase() + item.slice(1));
  };
  const formatDuration = (months: number | null) => {
    if (!months) return null;
    const semesters = Math.round(months / 6);
    if (semesters > 0 && months % 6 <= 1) return `${semesters} semester${semesters !== 1 ? 's' : ''}`;
    const years = months / 12;
    if (Number.isInteger(years)) return `${years} year${years !== 1 ? 's' : ''}`;
    if (months % 6 === 0) return `${years} years`;
    return `${Math.round(years * 10) / 10} years`;
  };
  const formatEuroValue = (value: string | number | null | undefined) => {
    if (value === null || value === undefined || value === '') return null;
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return `€${value}`;
    return `€${numeric.toLocaleString('de-DE')}`;
  };
  const getTuitionDisplay = () => {
    if (program?.is_free || program?.tuition_fee_number === 0) return 'Free';
    const exactFee = formatEuroValue(program?.tuition_exact_eur ?? null);
    if (exactFee) return exactFee;
    if (program?.tuition_min_eur && program?.tuition_max_eur) {
      const rangeMin = formatEuroValue(program.tuition_min_eur);
      const rangeMax = formatEuroValue(program.tuition_max_eur);
      if (rangeMin && rangeMax) {
        // Shorten display if too long
        const display = `${rangeMin}–${rangeMax}`;
        if (display.length > 20) return `${rangeMin.substring(0, 7)}...–${rangeMax.substring(0, 7)}...`;
        return display;
      }
    }
    if (program?.tuition_fee_number) return `€${program.tuition_fee_number.toLocaleString('de-DE')}`;
    return null;
  };
  const parseJsonField = (field?: string) => {
    if (!field) return [];
    try { return JSON.parse(field); }
    catch { return field.split(';').map(s => s.trim()).filter(Boolean); }
  };

  const aiSummary = program?.ai_course_summary;
  const summaryModules = aiSummary?.modules?.filter(Boolean) ?? [];
  const summaryDocuments = aiSummary?.requirements?.documents?.filter(Boolean) ?? [];
  const summaryTakeaways = aiSummary?.takeaways?.filter(Boolean) ?? [];
  const documentsRequired = parseJsonField(program?.documents_required_list);
  const otherLanguageTests = parseJsonField(program?.other_language_tests);
  const supportServices = parseJsonField(program?.support_services_list);
  const tuitionDisplay = getTuitionDisplay();
  const durationDisplay = formatDuration(program?.duration_months ?? null);
  const languageDisplay = parseArrayField(program?.languages_array)[0] || 'English';
  
  // Check if city/life tab has content
  const hasCityContent = program?.city_expats_overview || program?.accommodation_outlook || 
    program?.job_market_demand || program?.city_living_costs || program?.german_daily_life_requirement;

  const quickStats = [
    durationDisplay && { icon: Clock, label: 'Duration', value: durationDisplay },
    { icon: Globe, label: 'Language', value: languageDisplay },
    tuitionDisplay && { icon: Euro, label: 'Tuition', value: tuitionDisplay },
    program?.beginning_normalized && { icon: Calendar, label: 'Intake', value: capitalize(program.beginning_normalized) },
  ].filter(Boolean) as { icon: LucideIcon; label: string; value: string }[];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
        <div className="bg-white rounded-2xl p-8 border border-[#e5e5e5] shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3 text-[#171717]">
            <Loader2 className="w-5 h-5 text-[#dd0000] animate-spin" />
            <span className="text-sm font-medium">Loading program details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4 border border-[#e5e5e5] shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="text-center text-[#171717]">
            <AlertCircle className="w-10 h-10 text-[#dd0000] mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Error Loading Program</h3>
            <p className="text-sm text-[#6b6b6b] mb-4">{error || 'Program not found'}</p>
            <button onClick={onClose} className="px-4 py-2 bg-[#dd0000] text-white text-sm rounded-lg hover:bg-[#c20000] transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-start justify-center overflow-y-auto py-8 px-4" onClick={onClose}>
      <style jsx global>{`
        .modal-scroll::-webkit-scrollbar { width: 6px; }
        .modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .modal-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
        .modal-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.3); }
      `}</style>

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl text-[#171717] overflow-hidden modal-scroll" onClick={(e) => e.stopPropagation()}>
        {signInMessage && typeof document !== 'undefined' && createPortal(
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
            onClick={() => setSignInMessage(false)}
          >
            <div
              className="max-h-[calc(100vh-32px)] w-full max-w-lg overflow-y-auto rounded-[28px] border border-white/70 bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[#fff4f4] via-white to-[#f6f0ff] px-6 pb-5 pt-6">
                <div className="mb-5 flex items-start gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#dd0000] to-[#7c3aed] shadow-lg shadow-[#dd0000]/15">
                    <Bookmark className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#dd0000]">Shortlist</p>
                    <p className="mt-1 text-[30px] font-semibold leading-none text-[#171717]">Save this program</p>
                    <p className="mt-3 text-base leading-7 text-[#6b6b6b]">
                      Sign in or create a free account to save programs, build your shortlist, and come back later.
                    </p>
                  </div>
                  <button onClick={() => setSignInMessage(false)} className="text-[#a3a3a3] transition-colors hover:text-[#171717]">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid gap-3 rounded-2xl border border-black/5 bg-white/80 p-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-[#fafafa] px-4 py-3 text-sm font-medium text-[#404040]">Save favorites</div>
                  <div className="rounded-2xl bg-[#fafafa] px-4 py-3 text-sm font-medium text-[#404040]">Track later</div>
                  <div className="rounded-2xl bg-[#fafafa] px-4 py-3 text-sm font-medium text-[#404040]">Free account</div>
                </div>
              </div>
              <div className="px-6 pb-6 pt-5">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/auth/signin"
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#dd0000] px-5 py-4 text-center text-base font-semibold text-white transition-colors hover:bg-[#c10000]"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#e5e5e5] bg-white px-5 py-4 text-center text-base font-semibold text-[#171717] transition-colors hover:bg-[#f8f8f8]"
                  >
                    <UserPlus className="h-4 w-4" />
                    Sign up
                  </Link>
                </div>
                <button
                  onClick={() => setSignInMessage(false)}
                  className="mt-3 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-[#7a7a7a] transition-colors hover:bg-[#f8f8f8] hover:text-[#171717]"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        <div className="relative">
          <div className="relative h-64 overflow-hidden">
            {/* Background - show image prominently or gradient fallback */}
            {program.image_url && program.image_url.trim() !== '' && !program.image_url.includes('placeholder') ? (
              <>
                <Image
                  src={program.image_url}
                  alt={program.program_name}
                  fill
                  className="object-cover"
                  sizes="800px"
                  unoptimized
                  priority
                  onError={(e) => { 
                    const target = e.currentTarget;
                    target.style.display = 'none';
                  }}
                />
                {/* Lighter gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#6B8DD6]" />
                <div className="absolute inset-0">
                  <div className="absolute -top-10 -left-6 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
                  <div className="absolute -bottom-12 right-0 w-72 h-72 rounded-full bg-[#fbbf24]/15 blur-3xl" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <GraduationCap className="w-24 h-24 text-white/15" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </>
            )}

            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              {program.detail_url && (
                <a
                  href={program.detail_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 text-[#222] text-xs font-semibold shadow-lg hover:bg-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  DAAD
                </a>
              )}
              <button onClick={onClose} className="p-2 rounded-lg bg-white/90 text-[#555] hover:bg-white shadow-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute inset-0 flex flex-col justify-end px-6 pb-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {program.degree_level && (
                  <span className="px-2.5 py-0.5 rounded-md bg-white text-[#8b5cf6] text-[11px] font-bold tracking-wide shadow-sm">
                    {capitalize(program.degree_level)}
                  </span>
                )}
                {program.subject_area && (
                  <span className="px-2.5 py-0.5 rounded-md bg-black/80 text-white text-[11px] font-semibold shadow-sm">
                    {program.subject_area}
                  </span>
                )}
              </div>
              <h1 className="text-2xl leading-tight font-bold text-white mb-1 drop-shadow-md">
                {program.program_name}
              </h1>
              <div className="flex flex-wrap items-center gap-1.5 text-sm text-white/90">
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="font-medium">{program.university}</span>
                {program.city && (
                  <>
                    <span className="text-white/60">·</span>
                    <MapPin className="w-3 h-3" />
                    <span>{program.city}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-5 bg-[#fafafa] border-b border-[#ececec]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {quickStats.map(({ icon: Icon, label, value }, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#ececec] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#999]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold tracking-[0.35em] text-[#8a8a8a] uppercase">{label}</p>
                    <p className="text-base font-semibold text-[#101010] truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-[11px] font-semibold tracking-[0.3em] text-[#b3b3b3] uppercase">
                {isShortlistedState ? 'Saved to your dashboard' : 'Save to shortlist to track this program'}
              </p>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  onClick={handleToggleShortlist}
                  disabled={shortlistLoading}
                  className={`flex-1 md:flex-none min-w-[140px] flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all disabled:opacity-50 ${
                    isShortlistedState ? 'border-[#f5c16c] bg-[#fff4e3] text-[#b35900]' : 'border-[#e3e3e3] bg-white text-[#171717] hover:border-[#cfcfcf] hover:bg-[#f9f9f9]'
                  }`}
                >
                  {shortlistLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bookmark className={`w-4 h-4 ${isShortlistedState ? 'fill-current' : ''}`} />}
                  {isShortlistedState ? 'Saved' : 'Save program'}
                </button>

                {isShortlistedState && (
                  <Link
                    href="/my-shortlist"
                    className={`flex-1 md:flex-none min-w-[160px] flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#dd0000] text-white text-sm font-bold shadow-lg shadow-[#dd0000]/25 hover:bg-[#c20000] transition-colors`}
                  >
                    Open Shortlist <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky top-0 z-20 bg-white/96 backdrop-blur-sm border-b border-[#e7e7e7] px-6 pt-3 pb-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex gap-1.5 rounded-[22px] border border-[#e5e7eb] bg-gradient-to-b from-[#f8fafc] to-[#eef2f7] p-1.5 shadow-inner">
            {[
              { key: 'overview' as Tab, label: 'Overview', icon: Sparkles, color: '#8b5cf6' },
              { key: 'requirements' as Tab, label: 'Requirements', icon: ShieldCheck, color: '#7c3aed' },
              ...(hasCityContent ? [{ key: 'city' as Tab, label: 'City & Life', icon: MapPin, color: '#3b82f6' }] : []),
              { key: 'costs' as Tab, label: 'Costs', icon: Coins, color: '#10b981' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-white shadow-[0_6px_18px_rgba(15,23,42,0.16)] ring-1 ring-black/5'
                      : 'text-[#4b5563] hover:text-[#111827] hover:bg-white/80'
                  }`}
                  style={isActive ? { backgroundColor: tab.color } : { backgroundColor: 'transparent' }}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6b7280]'}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-6 bg-white">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {aiSummary?.overview && (
                <DetailSectionCard
                  icon={Star}
                  title="Program Snapshot"
                  subtitle="AI summary of the course"
                  containerClassName="border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50"
                  iconClassName="from-violet-500 to-fuchsia-600 shadow-violet-500/25"
                  titleClassName="text-violet-950"
                  subtitleClassName="text-violet-600"
                >
                  <p className="text-[15px] leading-relaxed text-[#2d2d2d]">{aiSummary.overview}</p>
                </DetailSectionCard>
              )}

              {program?.university_profile && (
                <DetailSectionCard
                  icon={GraduationCap}
                  title="University Profile"
                  subtitle="What the institution feels like"
                  containerClassName="border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50"
                  iconClassName="from-emerald-500 to-green-600 shadow-emerald-500/25"
                  titleClassName="text-emerald-950"
                  subtitleClassName="text-emerald-600"
                >
                  <p className="text-[14px] leading-relaxed text-[#2d2d2d]">{program.university_profile}</p>
                </DetailSectionCard>
              )}

              {summaryModules.length > 0 && (
                <DetailSectionCard
                  icon={BookOpen}
                  title="Key Modules"
                  subtitle="Topics you are likely to study"
                  containerClassName="border-slate-200 bg-white"
                  iconClassName="from-slate-700 to-slate-900 shadow-slate-500/20"
                >
                  <div className="flex flex-wrap gap-2">
                    {(showAllModules ? summaryModules : summaryModules.slice(0, 6)).map((mod, idx) => (
                      <span key={`mod-${idx}`} className="px-3 py-1.5 rounded-lg bg-[#f4f4f0] text-[#2d2d2d] text-xs font-semibold border border-[#ececec]">
                        {mod}
                      </span>
                    ))}
                    {summaryModules.length > 6 && (
                      <button
                        onClick={() => setShowAllModules(!showAllModules)}
                        className="px-3 py-1.5 rounded-lg border border-[#dd0000] text-[#dd0000] text-xs font-bold bg-white hover:bg-[#fff5f5] transition-colors flex items-center gap-1"
                      >
                        {showAllModules ? (<>Less <ChevronUp className="w-3 h-3" /></>) : (<>+{summaryModules.length - 6} more <ChevronDown className="w-3 h-3" /></>)}
                      </button>
                    )}
                  </div>
                </DetailSectionCard>
              )}

              {summaryTakeaways.length > 0 && (
                <DetailSectionCard
                  icon={TrendingUp}
                  title="Why This Program"
                  subtitle="Highlights worth noticing"
                  containerClassName="border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50"
                  iconClassName="from-amber-500 to-orange-600 shadow-amber-500/25"
                  titleClassName="text-amber-950"
                  subtitleClassName="text-amber-600"
                >
                  <ul className="space-y-2.5">
                    {summaryTakeaways.map((tip, idx) => (
                      <li key={`tip-${idx}`} className="flex items-start gap-2.5 text-[#2d2d2d] text-sm leading-relaxed">
                        <CheckCircle className="w-4 h-4 text-[#22ad5c] mt-0.5 flex-shrink-0" />
                        <span className="font-medium">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </DetailSectionCard>
              )}

              {!aiSummary && (program.tab_course_details || program.tab_overview || program.description) && (
                <DetailSectionCard
                  icon={Sparkles}
                  title="Course Details"
                  subtitle="Overview of the curriculum"
                  containerClassName="border-slate-200 bg-white"
                  iconClassName="from-violet-500 to-indigo-600 shadow-violet-500/25"
                >
                  <p className="text-[#2d2d2d] text-sm leading-relaxed font-medium">
                    {program.tab_course_details || program.tab_overview || program.description}
                  </p>
                </DetailSectionCard>
              )}

              {supportServices.length > 0 && (
                <DetailSectionCard
                  icon={Users}
                  title="Student Support"
                  subtitle="Services available during your studies"
                  containerClassName="border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50"
                  iconClassName="from-blue-500 to-cyan-600 shadow-blue-500/25"
                  titleClassName="text-blue-950"
                  subtitleClassName="text-blue-600"
                >
                  <div className="flex flex-wrap gap-2">
                    {supportServices.map((service: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 rounded-lg bg-[#f9f9f7] border border-[#ececec] text-[#2d2d2d] text-xs font-semibold">
                        {service}
                      </span>
                    ))}
                  </div>
                </DetailSectionCard>
              )}
            </div>
          )}

          {/* CITY & LIFE TAB */}
          {activeTab === 'city' && hasCityContent && (
            <div className="space-y-5">
              {/* City Overview */}
              {program.city_expats_overview && (
                <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-900">Life in {program.city}</h3>
                      <p className="text-xs text-blue-600">Expat & student community</p>
                    </div>
                  </div>
                  <p className="text-[15px] leading-relaxed text-gray-700">{program.city_expats_overview}</p>
                </div>
              )}

              {/* Job Market */}
              {program.job_market_demand && (
                <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Job Market & Career</h3>
                      <p className="text-xs text-gray-500">Employment opportunities</p>
                    </div>
                  </div>
                  <p className="text-[15px] leading-relaxed text-gray-700">{program.job_market_demand}</p>
                </div>
              )}

              {/* Accommodation */}
              {program.accommodation_outlook && (
                <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                      <Home className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Accommodation</h3>
                      <p className="text-xs text-gray-500">Housing options</p>
                    </div>
                  </div>
                  <p className="text-[15px] leading-relaxed text-gray-700">{program.accommodation_outlook}</p>
                </div>
              )}

              {/* Living Costs */}
              {program.city_living_costs && (
                <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                      <Euro className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Cost of Living</h3>
                      <p className="text-xs text-gray-500">Monthly expenses</p>
                    </div>
                  </div>
                  <p className="text-[15px] leading-relaxed text-gray-700">{program.city_living_costs}</p>
                </div>
              )}

              {/* Language in Daily Life */}
              {(program.german_daily_life_requirement || program.english_livability) && (
                <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                      <Languages className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-violet-900">Language in Daily Life</h3>
                      <p className="text-xs text-violet-600">How much German/English you need</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {program.german_daily_life_requirement && (
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">German Requirement</p>
                        <p className="text-[14px] leading-relaxed text-gray-700">{program.german_daily_life_requirement}</p>
                      </div>
                    )}
                    {program.english_livability && (
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">English Livability</p>
                        <p className="text-[14px] leading-relaxed text-gray-700">{program.english_livability}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AI City Fit Score */}
              {program.ai_city_fit_score && (
                <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold">AI City Fit Analysis</h3>
                        <p className="text-xs text-gray-400">Suitability for international students</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{program.ai_city_fit_score}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-5">
              {(aiSummary?.requirements?.academic_background || program.academic_background_requirements) && (
                <DetailSectionCard
                  icon={ShieldCheck}
                  title="Academic Background"
                  subtitle="Eligibility and prior study expectations"
                  containerClassName="border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50"
                  iconClassName="from-blue-500 to-indigo-600 shadow-blue-500/25"
                  titleClassName="text-blue-950"
                  subtitleClassName="text-blue-600"
                >
                  <p className="text-[#2d2d2d] text-sm leading-relaxed font-medium">
                    {aiSummary?.requirements?.academic_background || program.academic_background_requirements}
                  </p>
                  {program.min_ects_required && (
                    <p className="text-[#6b6b6b] text-xs mt-3">Minimum ECTS: <strong className="text-[#171717]">{program.min_ects_required}</strong></p>
                  )}
                </DetailSectionCard>
              )}

              {(aiSummary?.requirements?.language || program.language_proficiency_required) && (
                <DetailSectionCard
                  icon={Languages}
                  title="Language Requirements"
                  subtitle="Tests and minimum proficiency"
                  containerClassName="border-violet-100 bg-gradient-to-br from-violet-50 to-purple-50"
                  iconClassName="from-violet-500 to-purple-600 shadow-violet-500/25"
                  titleClassName="text-violet-950"
                  subtitleClassName="text-violet-600"
                >
                  {aiSummary?.requirements?.language && (
                    <p className="text-[#2d2d2d] text-sm leading-relaxed font-medium mb-4">{aiSummary.requirements.language}</p>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {program.ielts_min_score && (
                      <div className="p-3 rounded-xl bg-[#f9f9f7] border border-[#e5e5e5] text-center">
                        <p className="text-[#0d0d0d] font-bold text-lg">{program.ielts_min_score}</p>
                        <p className="text-[#9b9b9b] text-[10px] uppercase tracking-wider font-bold">IELTS</p>
                      </div>
                    )}
                    {program.toefl_min_score && (
                      <div className="p-3 rounded-xl bg-[#f9f9f7] border border-[#e5e5e5] text-center">
                        <p className="text-[#0d0d0d] font-bold text-lg">{program.toefl_min_score}</p>
                        <p className="text-[#9b9b9b] text-[10px] uppercase tracking-wider font-bold">TOEFL</p>
                      </div>
                    )}
                    {program.german_min_level && (
                      <div className="p-3 rounded-xl bg-[#f9f9f7] border border-[#e5e5e5] text-center">
                        <p className="text-[#0d0d0d] font-bold text-lg uppercase">{program.german_min_level}</p>
                        <p className="text-[#9b9b9b] text-[10px] uppercase tracking-wider font-bold">German</p>
                      </div>
                    )}
                    {program.english_min_level && (
                      <div className="p-3 rounded-xl bg-[#f9f9f7] border border-[#e5e5e5] text-center">
                        <p className="text-[#0d0d0d] font-bold text-lg uppercase">{program.english_min_level}</p>
                        <p className="text-[#9b9b9b] text-[10px] uppercase tracking-wider font-bold">English</p>
                      </div>
                    )}
                  </div>
                  {otherLanguageTests.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {otherLanguageTests.map((test: string, idx: number) => (
                        <span key={idx} className="px-3 py-1.5 rounded-lg bg-[#f4f4f0] border border-[#ececec] text-[#2d2d2d] text-xs font-semibold">{test}</span>
                      ))}
                    </div>
                  )}
                  {program.language_notes && (
                    <p className="text-[#6b6b6b] text-xs mt-3 leading-relaxed">{program.language_notes}</p>
                  )}
                </DetailSectionCard>
              )}

              {(summaryDocuments.length > 0 || documentsRequired.length > 0) && (
                <DetailSectionCard
                  icon={FileText}
                  title="Required Documents"
                  subtitle="What you will likely need to submit"
                  containerClassName="border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50"
                  iconClassName="from-amber-500 to-orange-600 shadow-amber-500/25"
                  titleClassName="text-amber-950"
                  subtitleClassName="text-amber-600"
                >
                  <ul className="space-y-2">
                    {(summaryDocuments.length > 0 ? summaryDocuments : documentsRequired).map((doc: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[#2d2d2d] text-sm">
                        <FileText className="w-4 h-4 text-[#999] mt-0.5 flex-shrink-0" />
                        <span className="font-medium">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </DetailSectionCard>
              )}

              {(program.application_channel || program.registration_deadline_date) && (
                <DetailSectionCard
                  icon={Calendar}
                  title="Application Process"
                  subtitle="Portal and key timeline details"
                  containerClassName="border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50"
                  iconClassName="from-emerald-500 to-green-600 shadow-emerald-500/25"
                  titleClassName="text-emerald-950"
                  subtitleClassName="text-emerald-600"
                >
                  <div className="space-y-3">
                    {program.application_channel && program.application_channel !== 'unknown' && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#6b6b6b] text-sm font-medium">Portal</span>
                        <span className="text-[#0d0d0d] text-sm font-bold capitalize">{program.application_channel.replace('-', ' ')}</span>
                      </div>
                    )}
                    {program.registration_deadline_date && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#6b6b6b] text-sm font-medium">Deadline</span>
                        <span className="text-[#dd0000] font-bold text-sm">{program.registration_deadline_date}</span>
                      </div>
                    )}
                  </div>
                  {program.application_channel_notes && (
                    <p className="text-[#6b6b6b] text-xs mt-3 leading-relaxed">{program.application_channel_notes}</p>
                  )}
                </DetailSectionCard>
              )}

              {aiSummary?.requirements?.extra && (
                <DetailSectionCard
                  icon={AlertCircle}
                  title="Additional Notes"
                  subtitle="Extra requirement details"
                  containerClassName="border-slate-200 bg-[#fafafa]"
                  iconClassName="from-slate-500 to-slate-700 shadow-slate-500/20"
                >
                  <p className="text-[#5f5f5f] text-sm leading-relaxed">{aiSummary.requirements.extra}</p>
                </DetailSectionCard>
              )}
            </div>
          )}

          {activeTab === 'costs' && (
            <div className="space-y-5">
              <DetailSectionCard
                icon={Coins}
                title="Fee Breakdown"
                subtitle="Main costs to budget for"
                containerClassName="border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50"
                iconClassName="from-emerald-500 to-green-600 shadow-emerald-500/25"
                titleClassName="text-emerald-950"
                subtitleClassName="text-emerald-600"
              >
                <div className="space-y-3">
                  {(program.tuition_exact_eur || tuitionDisplay) && (
                    <div className="flex items-center justify-between py-2 border-b border-[#f1f1f1]">
                      <span className="text-[#6b6b6b] text-sm font-medium">Tuition</span>
                      <span className="text-[#0d0d0d] font-bold">{tuitionDisplay || 'Contact university'}</span>
                    </div>
                  )}
                  {program.semester_fee_eur && (
                    <div className="flex items-center justify-between py-2 border-b border-[#f1f1f1]">
                      <div>
                        <span className="text-[#6b6b6b] text-sm font-medium">Semester Fee</span>
                        {program.semester_fee_notes && <p className="text-[#9b9b9b] text-[11px]">{program.semester_fee_notes}</p>}
                      </div>
                      <span className="text-[#0d0d0d] font-bold">€{program.semester_fee_eur}</span>
                    </div>
                  )}
                  {program.living_expenses_month_eur && (
                    <div className="flex items-center justify-between py-2 border-b border-[#f1f1f1]">
                      <div>
                        <span className="text-[#6b6b6b] text-sm font-medium">Living Expenses</span>
                        {program.living_expenses_notes && <p className="text-[#9b9b9b] text-[11px]">{program.living_expenses_notes}</p>}
                      </div>
                      <span className="text-[#0d0d0d] font-bold">€{program.living_expenses_month_eur}/mo</span>
                    </div>
                  )}
                </div>
                {program.tuition_notes && (
                  <p className="text-[#8a8a8a] text-xs mt-3 leading-relaxed">{program.tuition_notes}</p>
                )}
              </DetailSectionCard>

              {aiSummary?.costs && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(['tuition', 'semester_fee', 'living_expenses', 'funding'] as const).map((key) => {
                    const value = (aiSummary.costs as Record<string, string | undefined>)?.[key];
                    if (!value) return null;
                    const labels: Record<string, string> = {
                      tuition: 'Tuition Info',
                      semester_fee: 'Semester Fee',
                      living_expenses: 'Living Costs',
                      funding: 'Funding & Scholarships',
                    };
                    return (
                      <DetailSectionCard
                        key={key}
                        icon={key === 'funding' ? CheckCircle : key === 'living_expenses' ? Home : Euro}
                        title={labels[key]}
                        subtitle={key === 'funding' ? 'Scholarship and funding context' : key === 'living_expenses' ? 'Monthly spending guidance' : 'AI-generated cost note'}
                        containerClassName="border-slate-200 bg-white"
                        iconClassName={key === 'funding' ? 'from-emerald-500 to-green-600 shadow-emerald-500/25' : key === 'living_expenses' ? 'from-amber-500 to-orange-600 shadow-amber-500/25' : 'from-slate-700 to-slate-900 shadow-slate-500/20'}
                      >
                        <p className="text-[#2d2d2d] text-sm leading-relaxed font-medium">{value}</p>
                      </DetailSectionCard>
                    );
                  })}
                </div>
              )}

              {program.scholarship_available && (
                <DetailSectionCard
                  icon={CheckCircle}
                  title="Scholarships Available"
                  subtitle="Funding support may be offered"
                  containerClassName="border-emerald-200 bg-emerald-50"
                  iconClassName="from-emerald-500 to-green-600 shadow-emerald-500/25"
                  titleClassName="text-emerald-950"
                  subtitleClassName="text-emerald-700"
                >
                  {program.scholarship_notes && (
                    <p className="text-emerald-900 text-sm leading-relaxed">{program.scholarship_notes}</p>
                  )}
                </DetailSectionCard>
              )}
            </div>
          )}
        </div>

        {!isShortlistedState && (
          <div className="sticky bottom-0 bg-white border-t border-[#ececec] px-8 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-[#171717] text-sm font-semibold">Interested in this program?</p>
                <p className="text-[#6b6b6b] text-xs">Save it to start your AI-guided application</p>
              </div>
              <button
                onClick={handleToggleShortlist}
                disabled={shortlistLoading}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#dd0000] text-white text-sm font-semibold hover:bg-[#c20000] transition-all disabled:opacity-50"
              >
                {shortlistLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bookmark className="w-4 h-4" />}
                Save to Shortlist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
