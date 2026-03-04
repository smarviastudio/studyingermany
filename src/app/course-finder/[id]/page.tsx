'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  ArrowLeft, Loader2, CheckCircle2, ExternalLink,
  FileText, Mail, GraduationCap, Clock, Euro,
  Calendar, AlertTriangle, Sparkles, RotateCcw, ChevronRight, MapPin,
  ChevronDown, X, Zap, MessageCircle, Trophy, Rocket, BookOpen, Globe
} from 'lucide-react';
import type { Program } from '@/lib/types';

interface ApplicationStep {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  completed: boolean;
  action?: {
    type: 'cv' | 'letter' | 'document' | 'external';
    label: string;
    url: string;
  };
}

interface ApplicationPlan {
  steps: ApplicationStep[];
  overview: string;
  blockers: string[];
  estimatedTimeline: string;
}

function formatDuration(months: number | undefined): string {
  if (!months) return '';
  if (months % 6 === 0) {
    const semesters = months / 6;
    return `${semesters} semester${semesters !== 1 ? 's' : ''}`;
  }
  const years = months / 12;
  if (Number.isInteger(years)) return `${years} year${years !== 1 ? 's' : ''}`;
  return `${years.toFixed(1)} years`;
}

export default function ProgramApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const programId = params.id as string;
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const source = searchParams?.get('source');

  const [program, setProgram] = useState<Program | null>(null);
  const [plan, setPlan] = useState<ApplicationPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(false);
  const [savedPlanLoading, setSavedPlanLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [dismissedBlockers, setDismissedBlockers] = useState<number[]>([]);

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
    if (programId) fetchProgram();
  }, [programId]);

  useEffect(() => {
    if (!programId || !isAuthenticated) {
      setSavedPlanLoading(false);
      return;
    }
    let cancelled = false;
    const loadSavedPlan = async () => {
      try {
        setSavedPlanLoading(true);
        const response = await fetch(`/api/programs/${programId}/application-plan`, { cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled && data?.plan) setPlan(data.plan);
      } catch { /* silent */ } finally {
        if (!cancelled) setSavedPlanLoading(false);
      }
    };
    loadSavedPlan();
    return () => { cancelled = true; };
  }, [programId, isAuthenticated]);

  const completedSteps = plan?.steps?.filter((s) => s.completed).length ?? 0;
  const totalSteps = plan?.steps?.length ?? 0;
  const pct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const generateApplicationPlan = async () => {
    if (!program) return;
    try {
      setPlanLoading(true);
      setError(null);
      const response = await fetch(`/api/programs/${programId}/application-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ program }),
      });
      if (!response.ok) throw new Error('Failed to generate application plan');
      const data = await response.json();
      setPlan(data.plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate plan');
    } finally {
      setPlanLoading(false);
    }
  };

  const toggleStepCompletion = (stepId: string) => {
    if (!plan) return;
    const updatedPlan: ApplicationPlan = {
      ...plan,
      steps: plan.steps.map((s) => s.id === stepId ? { ...s, completed: !s.completed } : s),
    };
    setPlan(updatedPlan);
    if (!isAuthenticated) return;
    const target = updatedPlan.steps.find((s) => s.id === stepId);
    if (!target) return;
    fetch(`/api/programs/${programId}/application-plan`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepId, completed: target.completed }),
    }).catch(() => {});
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a]">
        <nav className="border-b border-white/[0.06] bg-[#0a0a1a]/80 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto flex items-center px-6 h-14">
            <div className="w-32 h-4 rounded bg-white/[0.06] animate-pulse" />
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-4">
            <div className="h-8 w-2/3 rounded-lg bg-white/[0.04] animate-pulse" />
            <div className="h-5 w-1/3 rounded bg-white/[0.03] animate-pulse" />
            <div className="grid grid-cols-4 gap-3 mt-6">
              {[1,2,3,4].map(i => <div key={i} className="h-16 rounded-lg bg-white/[0.03] animate-pulse" />)}
            </div>
            <div className="h-40 rounded-xl bg-white/[0.03] animate-pulse mt-6" />
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error && !program) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-white font-semibold text-lg mb-1">Something went wrong</h2>
          <p className="text-white/40 text-sm mb-5">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-5 py-2.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white text-sm hover:bg-white/[0.1] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!program) return null;

  const quickStats = [
    program.degree_level && { icon: GraduationCap, label: 'Degree', value: program.degree_level, color: 'text-blue-400' },
    program.duration_months && { icon: Clock, label: 'Duration', value: formatDuration(program.duration_months), color: 'text-purple-400' },
    { icon: Euro, label: 'Tuition', value: program.tuition_exact_eur ? `\u20ac${program.tuition_exact_eur}/sem` : program.is_free ? 'Free' : 'N/A', color: 'text-emerald-400' },
    program.beginning_normalized && { icon: Calendar, label: 'Intake', value: program.beginning_normalized, color: 'text-amber-400' },
  ].filter(Boolean) as { icon: typeof Clock; label: string; value: string; color: string }[];

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0a1a]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6 h-14">
          <button
            onClick={() => source === 'shortlist' ? router.push('/my-shortlist') : router.push('/dashboard')}
            className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {source === 'shortlist' ? 'Shortlist' : 'Dashboard'}
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-semibold text-sm">StudyGermany</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* ── Program header ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1.5">{program.program_name}</h1>
          <p className="text-white/40 text-sm flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {program.university}{program.city ? ` \u00b7 ${program.city}` : ''}
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-2 mt-5">
            {quickStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
                  <span className="text-white/30 text-xs">{stat.label}</span>
                  <span className="text-white text-xs font-medium">{stat.value}</span>
                </div>
              );
            })}
            {program.detail_url && (
              <a
                href={program.detail_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/70 text-xs transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                DAAD Page
              </a>
            )}
          </div>
        </div>

        {/* ── Loading saved plan ── */}
        {savedPlanLoading && (
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-10 text-center">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin mx-auto mb-3" />
            <p className="text-white/40 text-sm">Loading your application plan...</p>
          </div>
        )}

        {/* ── Generate plan CTA ── */}
        {!plan && !savedPlanLoading && (
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-white font-semibold text-lg mb-1.5">Ready to apply?</h2>
            <p className="text-white/35 text-sm mb-6 max-w-sm mx-auto">
              AI will analyze the requirements and create a personalized step-by-step application plan for you.
            </p>
            <button
              onClick={generateApplicationPlan}
              disabled={planLoading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white text-sm font-medium transition-all shadow-lg shadow-purple-600/20"
            >
              {planLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating your plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Application Plan
                </>
              )}
            </button>

            {/* Generating animation */}
            {planLoading && (
              <div className="mt-8 max-w-sm mx-auto">
                <div className="space-y-3">
                  {['Analyzing program requirements...', 'Checking document needs...', 'Building your checklist...'].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        i === 0 ? 'border-blue-500 bg-blue-500/20' : i === 1 ? 'border-purple-500/40' : 'border-white/10'
                      }`}>
                        {i === 0 && <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />}
                      </div>
                      <span className={i === 0 ? 'text-white/60' : 'text-white/20'}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg text-sm max-w-sm mx-auto">
                {error}
              </div>
            )}
          </div>
        )}

        {/* ── Application Plan ── */}
        {plan && !savedPlanLoading && (() => {
          const nextStep = plan.steps.find((s) => !s.completed);
          const nextStepIdx = nextStep ? plan.steps.indexOf(nextStep) : -1;
          const visibleBlockers = plan.blockers.filter((_, i) => !dismissedBlockers.includes(i));

          const getStepIcon = (title: string) => {
            const t = title.toLowerCase();
            if (t.includes('language') || t.includes('test')) return { icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/15' };
            if (t.includes('document') || t.includes('transcript') || t.includes('gather')) return { icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/15' };
            if (t.includes('cv') || t.includes('resume')) return { icon: FileText, color: 'text-cyan-400', bg: 'bg-cyan-500/15' };
            if (t.includes('letter') || t.includes('motivation') || t.includes('statement')) return { icon: Mail, color: 'text-pink-400', bg: 'bg-pink-500/15' };
            if (t.includes('submit') || t.includes('apply') || t.includes('portal')) return { icon: Rocket, color: 'text-emerald-400', bg: 'bg-emerald-500/15' };
            if (t.includes('research') || t.includes('professor') || t.includes('contact')) return { icon: BookOpen, color: 'text-amber-400', bg: 'bg-amber-500/15' };
            return { icon: Zap, color: 'text-white/50', bg: 'bg-white/[0.06]' };
          };

          const motivationMsg = pct === 0
            ? "I've created your personalized plan. Let's tackle it step by step!"
            : pct < 50
              ? `Great start! You've completed ${completedSteps} step${completedSteps !== 1 ? 's' : ''}. Keep going!`
              : pct < 100
                ? `Almost there! Just ${totalSteps - completedSteps} more step${totalSteps - completedSteps !== 1 ? 's' : ''} to go.`
                : "Amazing! You've completed everything. Time to submit!";

          return (
            <div className="space-y-5">
              {/* ── AI Assistant message ── */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mt-0.5">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="rounded-2xl rounded-tl-md bg-white/[0.04] border border-white/[0.08] p-4">
                    <p className="text-white/70 text-sm leading-relaxed">{plan.overview}</p>
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/[0.06]">
                      <span className="text-white/25 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {plan.estimatedTimeline || 'Timeline varies'}
                      </span>
                      <span className="text-white/25 text-xs">{totalSteps} steps total</span>
                    </div>
                  </div>
                  <p className="text-white/20 text-[10px] mt-1.5 ml-1">AI Assistant</p>
                </div>
              </div>

              {/* ── Heads-up card (collapsible) ── */}
              {visibleBlockers.length > 0 && (() => {
                const getBlockerMeta = (text: string) => {
                  const t = text.toLowerCase();
                  if (t.includes('language') || t.includes('certificate'))
                    return { icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10', tip: 'Check the program page for accepted language tests (IELTS, TOEFL, TestDaF).' };
                  if (t.includes('academic') || t.includes('background') || t.includes('gpa'))
                    return { icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/10', tip: 'Review the admission requirements on the DAAD page for minimum GPA or prerequisite courses.' };
                  if (t.includes('deadline') || t.includes('approaching'))
                    return { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', tip: 'Set a calendar reminder and aim to submit at least 1 week before the deadline.' };
                  if (t.includes('document') || t.includes('missing'))
                    return { icon: FileText, color: 'text-pink-400', bg: 'bg-pink-500/10', tip: 'Start gathering documents early — some (e.g. apostilles) can take weeks to process.' };
                  return { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', tip: 'Address this early to avoid delays in your application.' };
                };

                return (
                  <div className="rounded-xl bg-amber-500/[0.03] border border-amber-500/10 overflow-hidden">
                    <button
                      onClick={() => setDismissedBlockers(prev => prev.length === plan.blockers.length ? [] : plan.blockers.map((_, i) => i))}
                      className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-amber-500/[0.03] transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-amber-300/80 text-xs font-semibold">Heads up — {visibleBlockers.length} thing{visibleBlockers.length !== 1 ? 's' : ''} to watch out for</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-amber-400/40 transition-transform ${dismissedBlockers.length === plan.blockers.length ? '' : 'rotate-180'}`} />
                    </button>
                    {dismissedBlockers.length < plan.blockers.length && (
                      <div className="px-5 pb-4 space-y-3">
                        {visibleBlockers.map((b, i) => {
                          const meta = getBlockerMeta(b);
                          const BIcon = meta.icon;
                          return (
                            <div key={i} className="flex items-start gap-3 pl-1">
                              <div className={`w-6 h-6 rounded-md ${meta.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                <BIcon className={`w-3 h-3 ${meta.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white/60 text-xs font-medium">{b}</p>
                                <p className="text-white/25 text-[11px] mt-0.5 leading-relaxed">{meta.tip}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ── Progress + motivation ── */}
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    pct === 100 ? 'bg-emerald-500/15' : pct > 0 ? 'bg-blue-500/15' : 'bg-white/[0.06]'
                  }`}>
                    {pct === 100 ? <Trophy className="w-4 h-4 text-emerald-400" /> : pct > 0 ? <Zap className="w-4 h-4 text-blue-400" /> : <Rocket className="w-4 h-4 text-white/30" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{motivationMsg}</p>
                  </div>
                  <p className={`text-lg font-bold ${pct === 100 ? 'text-emerald-400' : 'text-white'}`}>{pct}%</p>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${pct === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {/* Step dots */}
                <div className="flex items-center gap-1.5 mt-3">
                  {plan.steps.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => setExpandedStep(expandedStep === s.id ? null : s.id)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        s.completed
                          ? 'bg-emerald-500 w-2'
                          : i === nextStepIdx
                            ? 'bg-blue-500 w-4 animate-pulse'
                            : 'bg-white/10 w-2'
                      }`}
                      title={s.title}
                    />
                  ))}
                  <span className="ml-auto text-white/20 text-[10px]">{completedSteps}/{totalSteps}</span>
                </div>
              </div>

              {/* ── Focus: What's next ── */}
              {nextStep && pct < 100 && (() => {
                const si = getStepIcon(nextStep.title);
                const FocusIcon = si.icon;
                return (
                  <div className="rounded-xl border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/[0.06] to-purple-500/[0.03] p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Up Next</span>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl ${si.bg} flex items-center justify-center flex-shrink-0`}>
                        <FocusIcon className={`w-5 h-5 ${si.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-sm">{nextStep.title}</h4>
                        <p className="text-white/40 text-xs mt-1 leading-relaxed">{nextStep.description}</p>
                        <div className="flex items-center gap-3 mt-3">
                          {nextStep.deadline && (
                            <span className="flex items-center gap-1 text-[11px] text-amber-400/70 bg-amber-500/10 px-2 py-1 rounded-md">
                              <Calendar className="w-3 h-3" />
                              {nextStep.deadline}
                            </span>
                          )}
                          {nextStep.action && (
                            <a
                              href={nextStep.action.url}
                              className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              {nextStep.action.type === 'cv' && <FileText className="w-3 h-3" />}
                              {nextStep.action.type === 'letter' && <Mail className="w-3 h-3" />}
                              {nextStep.action.type === 'document' && <FileText className="w-3 h-3" />}
                              {nextStep.action.type === 'external' && <ExternalLink className="w-3 h-3" />}
                              {nextStep.action.label}
                              <ChevronRight className="w-3 h-3" />
                            </a>
                          )}
                          <button
                            onClick={() => toggleStepCompletion(nextStep.id)}
                            className="ml-auto flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Mark Done
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── All Steps ── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider">All Steps</h3>
                  <button
                    onClick={generateApplicationPlan}
                    disabled={planLoading}
                    className="flex items-center gap-1.5 text-[11px] text-white/25 hover:text-white/50 transition-colors disabled:opacity-50"
                  >
                    {planLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
                    Regenerate
                  </button>
                </div>

                <div className="space-y-1.5">
                  {plan.steps.map((step, idx) => {
                    const si = getStepIcon(step.title);
                    const StepIcon = si.icon;
                    const isExpanded = expandedStep === step.id;
                    const isCurrent = idx === nextStepIdx;

                    return (
                      <div
                        key={step.id}
                        className={`rounded-xl border transition-all ${
                          step.completed
                            ? 'bg-emerald-500/[0.03] border-emerald-500/10'
                            : isCurrent
                              ? 'bg-blue-500/[0.04] border-blue-500/15'
                              : 'bg-white/[0.015] border-white/[0.05]'
                        }`}
                      >
                        {/* Step header — always visible, clickable */}
                        <button
                          onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                          className="w-full flex items-center gap-3 p-3.5 text-left"
                        >
                          {/* Checkbox */}
                          <div
                            onClick={(e) => { e.stopPropagation(); toggleStepCompletion(step.id); }}
                            className="flex-shrink-0 transition-transform hover:scale-110"
                          >
                            {step.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <div className={`w-5 h-5 rounded-full border-2 ${
                                isCurrent ? 'border-blue-500/60' : 'border-white/10'
                              }`} />
                            )}
                          </div>

                          {/* Icon */}
                          <div className={`w-7 h-7 rounded-lg ${si.bg} flex items-center justify-center flex-shrink-0`}>
                            <StepIcon className={`w-3.5 h-3.5 ${step.completed ? 'text-emerald-400/50' : si.color}`} />
                          </div>

                          {/* Title + meta */}
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-medium truncate ${
                              step.completed ? 'text-emerald-400/60 line-through' : 'text-white'
                            }`}>
                              {step.title}
                            </h4>
                            {step.deadline && !isExpanded && (
                              <p className="text-[10px] text-amber-400/40 mt-0.5 flex items-center gap-1">
                                <Calendar className="w-2.5 h-2.5" /> {step.deadline}
                              </p>
                            )}
                          </div>

                          {/* Expand arrow */}
                          <ChevronDown className={`w-4 h-4 text-white/15 transition-transform flex-shrink-0 ${
                            isExpanded ? 'rotate-180' : ''
                          }`} />
                        </button>

                        {/* Expanded content */}
                        {isExpanded && (
                          <div className="px-3.5 pb-4 pt-0 ml-[4.25rem]">
                            <p className={`text-xs leading-relaxed mb-3 ${
                              step.completed ? 'text-white/20' : 'text-white/40'
                            }`}>
                              {step.description}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              {step.deadline && (
                                <span className="flex items-center gap-1 text-[11px] text-amber-400/60 bg-amber-500/[0.08] px-2 py-1 rounded-md">
                                  <Calendar className="w-3 h-3" />
                                  {step.deadline}
                                </span>
                              )}
                              {step.action && (
                                <a
                                  href={step.action.url}
                                  className="flex items-center gap-1.5 text-[11px] font-medium text-blue-400 hover:text-blue-300 bg-blue-500/[0.08] px-2.5 py-1 rounded-md transition-colors"
                                >
                                  {step.action.type === 'cv' && <FileText className="w-3 h-3" />}
                                  {step.action.type === 'letter' && <Mail className="w-3 h-3" />}
                                  {step.action.type === 'document' && <FileText className="w-3 h-3" />}
                                  {step.action.type === 'external' && <ExternalLink className="w-3 h-3" />}
                                  {step.action.label}
                                  <ChevronRight className="w-2.5 h-2.5" />
                                </a>
                              )}
                              {!step.completed && (
                                <button
                                  onClick={() => toggleStepCompletion(step.id)}
                                  className="flex items-center gap-1 text-[11px] font-medium text-emerald-400/70 hover:text-emerald-400 bg-emerald-500/[0.08] px-2.5 py-1 rounded-md transition-colors ml-auto"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  Done
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Completion celebration ── */}
              {pct === 100 && (
                <div className="rounded-xl bg-gradient-to-br from-emerald-500/[0.08] to-blue-500/[0.05] border border-emerald-500/20 p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-emerald-300 font-semibold text-lg mb-1">Application Ready!</h3>
                  <p className="text-white/35 text-sm max-w-xs mx-auto">You&apos;ve completed all steps. Time to submit your application and start your journey to Germany!</p>
                  {program.detail_url && (
                    <a
                      href={program.detail_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-medium hover:bg-emerald-500/30 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Go to Application Portal
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
