'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, Loader2, CheckCircle2, ExternalLink,
  FileText, Mail, GraduationCap, Clock, Euro,
  Calendar, AlertTriangle, Sparkles, RotateCcw, ChevronRight, MapPin,
  ChevronDown, X, Zap, MessageCircle, Trophy, Rocket, BookOpen, Globe, Award, Info
} from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';
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
  const [expandedBlockers, setExpandedBlockers] = useState(true);

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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        <SiteNav />
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#dd0000' }} />
            <p style={{ fontSize: 15, color: '#737373', fontWeight: 500 }}>Loading program details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !program) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <SiteNav />
        <div style={{ maxWidth: 400, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <AlertTriangle className="w-8 h-8" style={{ color: '#dc2626' }} />
          </div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 8px' }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: 14, color: '#737373', margin: '0 0 24px' }}>{error}</p>
          <button onClick={() => router.push('/dashboard')} style={{ padding: '12px 24px', borderRadius: 10, background: '#dd0000', color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!program) return null;

  const getStepIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('language') || t.includes('test')) return { icon: Globe, color: '#3b82f6' };
    if (t.includes('document') || t.includes('transcript') || t.includes('gather')) return { icon: FileText, color: '#8b5cf6' };
    if (t.includes('cv') || t.includes('resume')) return { icon: FileText, color: '#06b6d4' };
    if (t.includes('letter') || t.includes('motivation') || t.includes('statement')) return { icon: Mail, color: '#ec4899' };
    if (t.includes('submit') || t.includes('apply') || t.includes('portal')) return { icon: Rocket, color: '#10b981' };
    if (t.includes('research') || t.includes('professor') || t.includes('contact')) return { icon: BookOpen, color: '#f59e0b' };
    return { icon: Zap, color: '#6b7280' };
  };

  const nextStep = plan?.steps.find((s) => !s.completed);
  const nextStepIdx = nextStep && plan ? plan.steps.indexOf(nextStep) : -1;

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <SiteNav />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px 80px' }}>
        {/* Back button */}
        <button onClick={() => source === 'shortlist' ? router.push('/my-shortlist') : router.push('/dashboard')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#555', cursor: 'pointer', marginBottom: 24, transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#dd0000'; e.currentTarget.style.color = '#dd0000'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.color = '#555'; }}>
          <ArrowLeft className="w-4 h-4" />
          {source === 'shortlist' ? 'Back to Shortlist' : 'Back to Dashboard'}
        </button>

        {/* Program Header Card */}
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, overflow: 'hidden', marginBottom: 24 }}>
          {program.image_url && (
            <div style={{ height: 200, position: 'relative', background: 'linear-gradient(135deg, #f5f5f0, #eee)' }}>
              <Image src={program.image_url} alt={program.program_name} fill style={{ objectFit: 'cover' }} sizes="1000px" unoptimized />
            </div>
          )}
          <div style={{ padding: 28 }}>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: '#0a0a0a', margin: '0 0 8px', lineHeight: 1.2 }}>
              {program.program_name}
            </h1>
            <p style={{ fontSize: 16, color: '#666', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin className="w-4 h-4" />
              {program.university}{program.city ? ` · ${program.city}` : ''}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
              {program.degree_level && (
                <div style={{ padding: '12px 16px', background: '#f5f5f5', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Award className="w-4 h-4" style={{ color: '#dd0000' }} />
                  <div>
                    <div style={{ fontSize: 11, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Degree</div>
                    <div style={{ fontSize: 14, color: '#111', fontWeight: 700 }}>{program.degree_level}</div>
                  </div>
                </div>
              )}
              {program.duration_months && (
                <div style={{ padding: '12px 16px', background: '#f5f5f5', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Clock className="w-4 h-4" style={{ color: '#dd0000' }} />
                  <div>
                    <div style={{ fontSize: 11, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</div>
                    <div style={{ fontSize: 14, color: '#111', fontWeight: 700 }}>{formatDuration(program.duration_months)}</div>
                  </div>
                </div>
              )}
              <div style={{ padding: '12px 16px', background: '#f5f5f5', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Euro className="w-4 h-4" style={{ color: '#dd0000' }} />
                <div>
                  <div style={{ fontSize: 11, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tuition</div>
                  <div style={{ fontSize: 14, color: '#111', fontWeight: 700 }}>
                    {program.is_free ? 'Free' : program.tuition_exact_eur ? `€${program.tuition_exact_eur}/sem` : 'N/A'}
                  </div>
                </div>
              </div>
              {program.beginning_normalized && (
                <div style={{ padding: '12px 16px', background: '#f5f5f5', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Calendar className="w-4 h-4" style={{ color: '#dd0000' }} />
                  <div>
                    <div style={{ fontSize: 11, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Intake</div>
                    <div style={{ fontSize: 14, color: '#111', fontWeight: 700 }}>{program.beginning_normalized}</div>
                  </div>
                </div>
              )}
            </div>

            {program.detail_url && (
              <a href={program.detail_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#555', textDecoration: 'none', marginTop: 16, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#dd0000'; e.currentTarget.style.color = '#dd0000'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.color = '#555'; }}>
                <ExternalLink className="w-4 h-4" />
                View on DAAD
              </a>
            )}
          </div>
        </div>

        {/* Loading saved plan */}
        {savedPlanLoading && (
          <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 60, textAlign: 'center' }}>
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#dd0000', margin: '0 auto 16px' }} />
            <p style={{ fontSize: 15, color: '#737373', fontWeight: 500 }}>Loading your application plan...</p>
          </div>
        )}

        {/* Generate plan CTA */}
        {!plan && !savedPlanLoading && (
          <div style={{ background: '#fff', border: '2px dashed #e5e5e5', borderRadius: 20, padding: 60, textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, rgba(221,0,0,0.08), rgba(124,58,237,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Sparkles className="w-8 h-8" style={{ color: '#dd0000' }} />
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 700, color: '#111', margin: '0 0 10px' }}>
              Ready to apply?
            </h2>
            <p style={{ fontSize: 15, color: '#737373', margin: '0 auto 28px', maxWidth: 480, lineHeight: 1.6 }}>
              AI will analyze the requirements and create a personalized step-by-step application plan for you.
            </p>
            <button onClick={generateApplicationPlan} disabled={planLoading} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px', background: '#dd0000', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(221,0,0,0.2)', opacity: planLoading ? 0.6 : 1 }}
              onMouseEnter={e => !planLoading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
              {planLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating your plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Application Plan
                </>
              )}
            </button>

            {planLoading && (
              <div style={{ marginTop: 40, maxWidth: 400, margin: '40px auto 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {['Analyzing program requirements...', 'Checking document needs...', 'Building your checklist...'].map((text, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 999, border: `2px solid ${i === 0 ? '#dd0000' : '#e5e5e5'}`, background: i === 0 ? 'rgba(221,0,0,0.1)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {i === 0 && <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: '#dd0000' }} />}
                      </div>
                      <span style={{ color: i === 0 ? '#555' : '#d4d4d4' }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div style={{ marginTop: 24, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626', padding: '14px 18px', borderRadius: 12, fontSize: 14, maxWidth: 400, margin: '24px auto 0' }}>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Application Plan */}
        {plan && !savedPlanLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* AI Overview */}
            <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 999, background: 'linear-gradient(135deg, #dd0000, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles className="w-5 h-5" style={{ color: '#fff' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 8px' }}>Your Application Plan</h3>
                  <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, margin: 0 }}>{plan.overview}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, paddingTop: 12, borderTop: '1px solid #f5f5f5' }}>
                    <span style={{ fontSize: 12, color: '#999', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock className="w-3.5 h-3.5" /> {plan.estimatedTimeline || 'Timeline varies'}
                    </span>
                    <span style={{ fontSize: 12, color: '#999' }}>{totalSteps} steps total</span>
                    <button onClick={generateApplicationPlan} disabled={planLoading} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'transparent', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#777', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#dd0000'; e.currentTarget.style.color = '#dd0000'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.color = '#777'; }}>
                      {planLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                      Regenerate
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Heads up / Blockers */}
            {plan.blockers.length > 0 && (
              <div style={{ background: '#fff', border: '1px solid #fbbf24', borderRadius: 20, overflow: 'hidden' }}>
                <button onClick={() => setExpandedBlockers(!expandedBlockers)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 20, background: 'rgba(251,191,36,0.05)', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(251,191,36,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <AlertTriangle className="w-5 h-5" style={{ color: '#f59e0b' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#d97706' }}>
                      Heads up — {plan.blockers.length} thing{plan.blockers.length !== 1 ? 's' : ''} to watch out for
                    </span>
                  </div>
                  <ChevronDown className="w-5 h-5" style={{ color: '#f59e0b', transform: expandedBlockers ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {expandedBlockers && (
                  <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {plan.blockers.map((blocker, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, padding: 14, background: '#fef3c7', borderRadius: 12 }}>
                        <Info className="w-4 h-4" style={{ color: '#d97706', flexShrink: 0, marginTop: 2 }} />
                        <p style={{ fontSize: 13, color: '#92400e', lineHeight: 1.5, margin: 0 }}>{blocker}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Progress Card */}
            <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: pct === 100 ? 'rgba(16,185,129,0.15)' : 'rgba(221,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {pct === 100 ? <Trophy className="w-6 h-6" style={{ color: '#10b981' }} /> : <Rocket className="w-6 h-6" style={{ color: '#dd0000' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#111', margin: 0 }}>
                    {pct === 0 ? "Let's get started!" : pct < 50 ? `Great start! ${completedSteps} step${completedSteps !== 1 ? 's' : ''} done.` : pct < 100 ? `Almost there! ${totalSteps - completedSteps} more to go.` : "All done! Ready to submit."}
                  </p>
                </div>
                <p style={{ fontSize: 24, fontWeight: 800, color: pct === 100 ? '#10b981' : '#dd0000', margin: 0 }}>{pct}%</p>
              </div>
              <div style={{ height: 8, background: '#f5f5f5', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: pct === 100 ? '#10b981' : 'linear-gradient(90deg, #dd0000, #7c3aed)', borderRadius: 999, transition: 'width 0.5s ease', width: `${pct}%` }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12 }}>
                {plan.steps.map((s, i) => (
                  <div key={s.id} style={{ height: 6, flex: 1, borderRadius: 999, background: s.completed ? '#10b981' : i === nextStepIdx ? '#dd0000' : '#e5e5e5', transition: 'all 0.3s' }} />
                ))}
              </div>
            </div>

            {/* Next Step Focus */}
            {nextStep && pct < 100 && (() => {
              const si = getStepIcon(nextStep.title);
              const NextIcon = si.icon;
              return (
                <div style={{ background: 'linear-gradient(135deg, rgba(221,0,0,0.05), rgba(124,58,237,0.05))', border: '2px solid rgba(221,0,0,0.2)', borderRadius: 20, padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <MessageCircle className="w-4 h-4" style={{ color: '#dd0000' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#dd0000', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Up Next</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <NextIcon className="w-6 h-6" style={{ color: si.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 17, fontWeight: 700, color: '#111', margin: '0 0 6px' }}>{nextStep.title}</h4>
                      <p style={{ fontSize: 14, color: '#666', lineHeight: 1.5, margin: '0 0 14px' }}>{nextStep.description}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {nextStep.deadline && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(251,191,36,0.15)', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#d97706' }}>
                            <Calendar className="w-3.5 h-3.5" />
                            {nextStep.deadline}
                          </span>
                        )}
                        {nextStep.action && (
                          <a href={nextStep.action.url} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#555', textDecoration: 'none', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#dd0000'; e.currentTarget.style.color = '#dd0000'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.color = '#555'; }}>
                            {nextStep.action.type === 'cv' && <FileText className="w-3.5 h-3.5" />}
                            {nextStep.action.type === 'letter' && <Mail className="w-3.5 h-3.5" />}
                            {nextStep.action.type === 'document' && <FileText className="w-3.5 h-3.5" />}
                            {nextStep.action.type === 'external' && <ExternalLink className="w-3.5 h-3.5" />}
                            {nextStep.action.label}
                          </a>
                        )}
                        <button onClick={() => toggleStepCompletion(nextStep.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#059669', cursor: 'pointer', transition: 'all 0.2s', marginLeft: 'auto' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.25)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.15)'; }}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mark Done
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* All Steps */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px' }}>
                All Steps ({completedSteps}/{totalSteps})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {plan.steps.map((step, idx) => {
                  const si = getStepIcon(step.title);
                  const StepIcon = si.icon;
                  const isExpanded = expandedStep === step.id;
                  const isCurrent = idx === nextStepIdx;

                  return (
                    <div key={step.id} className="application-step-card" style={{ background: '#fff', border: `1px solid ${step.completed ? '#bbf7d0' : isCurrent ? 'rgba(221,0,0,0.3)' : '#ebebeb'}`, borderRadius: 16, overflow: 'hidden', transition: 'all 0.2s' }}>
                      <button onClick={() => setExpandedStep(isExpanded ? null : step.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: 16, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                        <div onClick={(e) => { e.stopPropagation(); toggleStepCompletion(step.id); }} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                          onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
                          {step.completed ? (
                            <CheckCircle2 className="w-5 h-5" style={{ color: '#10b981' }} />
                          ) : (
                            <div style={{ width: 20, height: 20, borderRadius: 999, border: `2px solid ${isCurrent ? '#dd0000' : '#d4d4d4'}` }} />
                          )}
                        </div>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: step.completed ? '#f0fdf4' : '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <StepIcon className="w-4 h-4" style={{ color: step.completed ? '#10b981' : si.color }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontSize: 15, fontWeight: 600, color: step.completed ? '#10b981' : '#111', margin: 0, textDecoration: step.completed ? 'line-through' : 'none' }}>
                            {step.title}
                          </h4>
                          {step.deadline && !isExpanded && (
                            <p style={{ fontSize: 11, color: '#f59e0b', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Calendar className="w-3 h-3" /> {step.deadline}
                            </p>
                          )}
                        </div>
                        <ChevronDown className="w-5 h-5" style={{ color: '#d4d4d4', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                      </button>

                      {isExpanded && (
                        <div style={{ padding: '0 16px 16px 66px' }}>
                          <p style={{ fontSize: 14, color: step.completed ? '#999' : '#666', lineHeight: 1.6, margin: '0 0 14px' }}>
                            {step.description}
                          </p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {step.deadline && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(251,191,36,0.1)', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#d97706' }}>
                                <Calendar className="w-3.5 h-3.5" />
                                {step.deadline}
                              </span>
                            )}
                            {step.action && (
                              <a href={step.action.url} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#f5f5f5', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#555', textDecoration: 'none', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#ebebeb'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#f5f5f5'; }}>
                                {step.action.type === 'cv' && <FileText className="w-3.5 h-3.5" />}
                                {step.action.type === 'letter' && <Mail className="w-3.5 h-3.5" />}
                                {step.action.type === 'document' && <FileText className="w-3.5 h-3.5" />}
                                {step.action.type === 'external' && <ExternalLink className="w-3.5 h-3.5" />}
                                {step.action.label}
                              </a>
                            )}
                            {!step.completed && (
                              <button onClick={() => toggleStepCompletion(step.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(16,185,129,0.1)', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#059669', border: 'none', cursor: 'pointer', marginLeft: 'auto', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.2)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.1)'; }}>
                                <CheckCircle2 className="w-3.5 h-3.5" />
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

            {/* Completion Celebration */}
            {pct === 100 && (
              <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(59,130,246,0.05))', border: '2px solid rgba(16,185,129,0.3)', borderRadius: 20, padding: 40, textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Trophy className="w-10 h-10" style={{ color: '#10b981' }} />
                </div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 700, color: '#059669', margin: '0 0 10px' }}>
                  Application Ready!
                </h3>
                <p style={{ fontSize: 15, color: '#666', margin: '0 auto 24px', maxWidth: 400, lineHeight: 1.6 }}>
                  You've completed all steps. Time to submit your application and start your journey to Germany!
                </p>
                {program.detail_url && (
                  <a href={program.detail_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 28px', background: '#10b981', color: '#fff', borderRadius: 12, textDecoration: 'none', fontSize: 15, fontWeight: 700, transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(16,185,129,0.3)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.transform = 'none'; }}>
                    <ExternalLink className="w-5 h-5" />
                    Go to Application Portal
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
