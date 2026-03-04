'use client';

import { useState, useEffect } from 'react';
import { Program } from '@/lib/types';
import {
  X, MapPin, GraduationCap, Calendar, Globe, Clock,
  ExternalLink, FileText, AlertTriangle, Star, CheckCircle,
  Bookmark, ArrowRight, Loader2, ChevronDown, ChevronUp, Euro,
  BookOpen, ShieldCheck, Coins
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProgramModalProps {
  programId: string;
  onClose: () => void;
  isShortlisted?: boolean;
  onToggleShortlist?: () => void;
}

type Tab = 'overview' | 'requirements' | 'costs';

export function ProgramModal({ programId, onClose, isShortlisted = false, onToggleShortlist }: ProgramModalProps) {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shortlistLoading, setShortlistLoading] = useState(false);
  const [isShortlistedState, setIsShortlistedState] = useState(isShortlisted);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        setIsAuthenticated(!!session?.user);
        if (session?.user) {
          const shortlistResponse = await fetch('/api/shortlist');
          if (shortlistResponse.ok) {
            const shortlistData = await shortlistResponse.json();
            const isInShortlist = shortlistData.shortlists?.some((item: any) => item.programId === programId);
            setIsShortlistedState(isInShortlist);
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      }
    };
    checkAuth();
  }, [programId]);

  const handleToggleShortlist = async () => {
    if (!isAuthenticated) {
      setSignInMessage(true);
      setTimeout(() => setSignInMessage(false), 4000);
      return;
    }
    if (!program) return;
    setShortlistLoading(true);
    try {
      if (isShortlistedState) {
        const response = await fetch(`/api/shortlist?programId=${programId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to remove from shortlist');
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
        if (!response.ok) throw new Error('Failed to add to shortlist');
        setIsShortlistedState(true);
      }
      onToggleShortlist?.();
    } catch (err) {
      console.error('Shortlist error:', err);
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
    const exactFee = formatEuroValue(program?.tuition_exact_eur ?? null);
    if (exactFee) return exactFee;
    if (program?.tuition_min_eur && program?.tuition_max_eur) {
      const rangeMin = formatEuroValue(program.tuition_min_eur);
      const rangeMax = formatEuroValue(program.tuition_max_eur);
      if (rangeMin && rangeMax) return `${rangeMin}–${rangeMax}`;
    }
    if (program?.is_free || program?.tuition_fee_number === 0) return 'Free';
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

  const quickStats = [
    durationDisplay && { icon: Clock, label: 'Duration', value: durationDisplay },
    { icon: Globe, label: 'Language', value: languageDisplay },
    tuitionDisplay && { icon: Euro, label: 'Tuition', value: tuitionDisplay },
    program?.beginning_normalized && { icon: Calendar, label: 'Intake', value: capitalize(program.beginning_normalized) },
  ].filter(Boolean) as { icon: any; label: string; value: string }[];

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
            <AlertTriangle className="w-10 h-10 text-[#dd0000] mx-auto mb-3" />
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

  const cardClass = 'rounded-2xl border border-[#ececec] bg-white shadow-sm';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-start justify-center overflow-y-auto py-8 px-4" onClick={onClose}>
      <style jsx global>{`
        .modal-scroll::-webkit-scrollbar { width: 6px; }
        .modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .modal-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
        .modal-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.3); }
      `}</style>

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl text-[#171717] overflow-hidden modal-scroll" onClick={(e) => e.stopPropagation()}>
        {signInMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white border border-[#f0f0f0] shadow-2xl shadow-black/15">
              <div className="w-8 h-8 rounded-full bg-[#fff0f0] flex items-center justify-center flex-shrink-0">
                <Bookmark className="w-4 h-4 text-[#dd0000]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Sign in to shortlist</p>
                <p className="text-xs text-[#6b6b6b]">Create a free account to save programs</p>
              </div>
              <Link href="/auth/signin" className="ml-3 px-3 py-1.5 rounded-lg bg-[#dd0000] text-white text-xs font-semibold hover:bg-[#c10000] transition-colors flex-shrink-0">
                Sign in
              </Link>
              <button onClick={() => setSignInMessage(false)} className="ml-1 text-[#a3a3a3] hover:text-[#171717] transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <div className="relative">
          <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#fee4d4] via-[#fff5ee] to-[#fefce8]">
            <div className="absolute inset-0">
              <div className="absolute -top-10 -left-6 w-64 h-64 rounded-full bg-[#dd0000]/15 blur-3xl" />
              <div className="absolute -bottom-12 right-0 w-72 h-72 rounded-full bg-[#ffce00]/20 blur-3xl" />
            </div>
            {program.image_url && program.image_url.trim() !== '' && !program.image_url.includes('placeholder') && (
              <Image
                src={program.image_url}
                alt={program.program_name}
                fill
                className="object-cover opacity-25 mix-blend-multiply"
                sizes="800px"
                unoptimized
                priority
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />

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
                  <span className="px-2.5 py-0.5 rounded-md bg-white/90 text-[#b30000] text-[11px] font-bold tracking-wide">
                    {capitalize(program.degree_level)}
                  </span>
                )}
                {program.subject_area && (
                  <span className="px-2.5 py-0.5 rounded-md bg-[#111]/70 text-white text-[11px] font-semibold">
                    {program.subject_area}
                  </span>
                )}
              </div>
              <h1 className="text-2xl leading-tight font-bold text-[#0d0d0d] mb-1">
                {program.program_name}
              </h1>
              <div className="flex flex-wrap items-center gap-1.5 text-sm text-[#494949]">
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="font-medium">{program.university}</span>
                {program.city && (
                  <>
                    <span className="text-[#d4d4d4]">·</span>
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
                    href={`/course-finder/${programId}`}
                    className={`flex-1 md:flex-none min-w-[160px] flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#dd0000] text-white text-sm font-bold shadow-lg shadow-[#dd0000]/25 hover:bg-[#c20000] transition-colors`}
                  >
                    Start Application <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky top-0 z-20 bg-white border-b border-[#ececec] px-6 pt-3 pb-2">
          <div className="flex gap-2 bg-[#f5f5f5] rounded-full p-1">
            {([
              { key: 'overview' as Tab, label: 'Overview', icon: BookOpen, color: '#dd0000' },
              { key: 'requirements' as Tab, label: 'Requirements', icon: ShieldCheck, color: '#5b4ad1' },
              { key: 'costs' as Tab, label: 'Costs', icon: Coins, color: '#0f9b57' },
            ] as const).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive ? 'text-white shadow-sm' : 'text-[#7c7c7c]'
                  }`}
                  style={isActive ? { backgroundColor: tab.color } : { backgroundColor: 'transparent' }}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#b5b5b5]'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-6 bg-white">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {aiSummary?.overview && (
                <div className="rounded-2xl border border-[#ffe1da] bg-[#fff8f7] p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-[#dd0000]/10 flex items-center justify-center">
                      <Star className="w-4 h-4 text-[#dd0000]" />
                    </div>
                    <span className="text-xs font-bold tracking-wider text-[#b30000] uppercase">AI Summary</span>
                  </div>
                  <p className="text-[15px] leading-relaxed text-[#2d2d2d]">{aiSummary.overview}</p>
                </div>
              )}

              {summaryModules.length > 0 && (
                <div>
                  <p className="text-xs font-bold tracking-wider text-[#a3a3a3] uppercase mb-3">Key Modules</p>
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
                </div>
              )}

              {summaryTakeaways.length > 0 && (
                <div className="rounded-2xl border border-[#ececec] bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold tracking-wider text-[#a3a3a3] uppercase mb-3">Why this program</p>
                  <ul className="space-y-2.5">
                    {summaryTakeaways.map((tip, idx) => (
                      <li key={`tip-${idx}`} className="flex items-start gap-2.5 text-[#2d2d2d] text-sm leading-relaxed">
                        <CheckCircle className="w-4 h-4 text-[#22ad5c] mt-0.5 flex-shrink-0" />
                        <span className="font-medium">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!aiSummary && (program.tab_course_details || program.tab_overview || program.description) && (
                <div className="rounded-2xl border border-[#ececec] bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold tracking-wider text-[#a3a3a3] uppercase mb-3">Course details</p>
                  <p className="text-[#2d2d2d] text-sm leading-relaxed font-medium">
                    {program.tab_course_details || program.tab_overview || program.description}
                  </p>
                </div>
              )}

              {supportServices.length > 0 && (
                <div>
                  <p className="text-xs font-bold tracking-wider text-[#a3a3a3] uppercase mb-3">Student support</p>
                  <div className="flex flex-wrap gap-2">
                    {supportServices.map((service: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 rounded-lg bg-[#f9f9f7] border border-[#ececec] text-[#2d2d2d] text-xs font-semibold">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-5">
              {(aiSummary?.requirements?.academic_background || program.academic_background_requirements) && (
                <div className="rounded-2xl border border-[#ececec] bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold tracking-wider text-[#a3a3a3] uppercase mb-3">Academic Background</p>
                  <p className="text-[#2d2d2d] text-sm leading-relaxed font-medium">
                    {aiSummary?.requirements?.academic_background || program.academic_background_requirements}
                  </p>
                  {program.min_ects_required && (
                    <p className="text-[#6b6b6b] text-xs mt-3">Minimum ECTS: <strong className="text-[#171717]">{program.min_ects_required}</strong></p>
                  )}
                </div>
              )}

              {(aiSummary?.requirements?.language || program.language_proficiency_required) && (
                <div className="rounded-2xl border border-[#ececec] bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold tracking-wider text-[#a3a3a3] uppercase mb-3">Language Requirements</p>
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
                </div>
              )}

              {(summaryDocuments.length > 0 || documentsRequired.length > 0) && (
                <div className="rounded-2xl border border-[#ececec] bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold tracking-wider text-[#a3a3a3] uppercase mb-3">Required Documents</p>
                  <ul className="space-y-2">
                    {(summaryDocuments.length > 0 ? summaryDocuments : documentsRequired).map((doc: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[#2d2d2d] text-sm">
                        <FileText className="w-4 h-4 text-[#999] mt-0.5 flex-shrink-0" />
                        <span className="font-medium">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(program.application_channel || program.registration_deadline_date) && (
                <div className="rounded-2xl border border-[#ececec] bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold tracking-wider text-[#a3a3a3] uppercase mb-3">Application Process</p>
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
                </div>
              )}

              {aiSummary?.requirements?.extra && (
                <p className="text-[#8a8a8a] text-xs leading-relaxed px-1">{aiSummary.requirements.extra}</p>
              )}
            </div>
          )}

          {activeTab === 'costs' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#ececec] bg-white p-5 shadow-sm">
                <p className="text-xs font-bold tracking-wider text-[#a3a3a3] uppercase mb-4">Fee Breakdown</p>
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
              </div>

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
                      <div key={key} className="rounded-2xl border border-[#ececec] bg-white p-4 shadow-sm">
                        <p className="text-[11px] font-bold tracking-wider text-[#a3a3a3] uppercase mb-2">{labels[key]}</p>
                        <p className="text-[#2d2d2d] text-sm leading-relaxed font-medium">{value}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {program.scholarship_available && (
                <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 text-sm font-semibold">Scholarships Available</span>
                  </div>
                  {program.scholarship_notes && (
                    <p className="text-emerald-900 text-sm leading-relaxed ml-6">{program.scholarship_notes}</p>
                  )}
                </div>
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
