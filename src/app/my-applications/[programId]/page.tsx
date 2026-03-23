'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Loader2, ArrowLeft, CheckCircle2, Circle, AlertCircle,
  FileText, Calendar, ExternalLink, Sparkles,
  Globe, Clock, ChevronDown, ChevronUp,
  Wallet, Plane, Target, Building2, MapPin,
  AlertTriangle, PenTool
} from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';
import { GermanPulseLoader } from '@/components/GermanPulseLoader';
import { CourseAssistantChat } from '@/components/CourseAssistantChat';

// ─── Types ────────────────────────────────────────────────────
interface ApplicationStep {
  id: string;
  title: string;
  description: string;
  detailedInfo?: string;
  deadline?: string;
  completed: boolean;
  autoCompleted?: boolean;
  autoCompletedReason?: string;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
  resources?: { name: string; url: string; description: string }[];
  action?: { type: string; label: string; url: string };
}

interface RequiredDocument {
  id: string;
  name: string;
  category: string;
  required: boolean;
  description: string;
  programSpecificNotes?: string;
}

interface ApplicationPlan {
  profileMatch?: { score: number; summary: string; strengths: string[]; gaps: string[]; recommendations: string[] };
  requiredDocuments?: RequiredDocument[];
  applicationSubmission?: { method: string; portalUrl?: string; deadline?: string; instructions: string };
  overview: string;
  estimatedTimeline: string;
  blockers: string[];
  steps: ApplicationStep[];
}

interface QuestionnaireData {
  nationality: string;
  currentCountry: string;
  plannedStart: string;
  germanLevel: string;
  financialReady: string;
  additionalNotes: string;
}

// ─── Helpers ──────────────────────────────────────────────────
/* eslint-disable @typescript-eslint/no-explicit-any */
const sanitize = (profile: any) => {
  if (!profile) return null;
  const s: Record<string, unknown> = {};
  Object.entries(profile).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== '') s[k] = v; });
  return Object.keys(s).length > 0 ? s : null;
};

const buildProgramPayload = (p: any) => ({
  id: String(p.id),
  program_name: p.program_name || 'Unknown Program',
  university: p.university || 'Unknown University',
  degree_level: p.degree_level || undefined,
  requirements: p.requirements ?? null,
  tab_requirements_registration: p.tab_requirements_registration ?? null,
  tab_costs_funding: p.tab_costs_funding ?? null,
  language_proficiency_required: typeof p.language_proficiency_required === 'boolean' ? p.language_proficiency_required : undefined,
  ielts_min_score: p.ielts_min_score || undefined,
  toefl_min_score: p.toefl_min_score || undefined,
  german_min_level: p.german_min_level || undefined,
  english_min_level: p.english_min_level || undefined,
  academic_background_requirements: p.academic_background_requirements || undefined,
  documents_required_list: typeof p.documents_required_list === 'string' ? p.documents_required_list : Array.isArray(p.documents_required_list) ? JSON.stringify(p.documents_required_list) : undefined,
  registration_deadline_date: p.registration_deadline_date || undefined,
  registration_deadline_text: p.registration_deadline_text || undefined,
  application_channel: p.application_channel || undefined,
  application_channel_notes: p.application_channel_notes || undefined,
});
/* eslint-enable @typescript-eslint/no-explicit-any */

const categoryIcon = (cat?: string) => {
  switch (cat) {
    case 'language': return <Globe className="w-4 h-4" />;
    case 'documents': return <FileText className="w-4 h-4" />;
    case 'application': return <Target className="w-4 h-4" />;
    case 'financial': return <Wallet className="w-4 h-4" />;
    case 'visa': return <Plane className="w-4 h-4" />;
    default: return <CheckCircle2 className="w-4 h-4" />;
  }
};

const priorityColor = (p?: string) => {
  switch (p) {
    case 'high': return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' };
    case 'medium': return { bg: '#fffbeb', text: '#d97706', border: '#fef3c7' };
    default: return { bg: '#f0fdf4', text: '#16a34a', border: '#dcfce7' };
  }
};

const getDocToolLink = (docId: string, programId: string): { label: string; url: string; icon: 'cv' | 'letter' } | null => {
  if (docId === 'cv-resume' || docId.includes('cv')) return { label: 'Create with CV Maker', url: '/cv-maker', icon: 'cv' };
  if (docId === 'motivation-letter' || docId.includes('motivation')) return { label: 'Write with AI', url: `/motivation-letter?programId=${programId}`, icon: 'letter' };
  return null;
};

// ─── Inner Component ─────────────────────────────────────────
function PlanPageInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const programId = params.programId as string;
  const forceNew = searchParams.get('new') === '1';

  type PageState = 'loading' | 'questionnaire' | 'generating' | 'plan' | 'error';
  const [pageState, setPageState] = useState<PageState>('loading');
  const [plan, setPlan] = useState<ApplicationPlan | null>(null);
  const [programName, setProgramName] = useState('');
  const [university, setUniversity] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [programDetails, setProgramDetails] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userProfile, setUserProfile] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  const [qData, setQData] = useState<QuestionnaireData>({
    nationality: '', currentCountry: '', plannedStart: '',
    germanLevel: '', financialReady: '', additionalNotes: '',
  });

  // ─── Load data ─────────────────────────────────────────
  const loadData = async () => {
    try {
      setPageState('loading');
      const profileRes = await fetch('/api/profile');
      if (profileRes.ok) { const pd = await profileRes.json(); if (pd.profile) setUserProfile(pd.profile); }

      const shortlistRes = await fetch('/api/shortlist');
      if (shortlistRes.ok) {
        const sd = await shortlistRes.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const item = sd.shortlists?.find((i: any) => i.programId === programId);
        if (item) { setProgramName(item.programName); setUniversity(item.university); }
      }

      const progRes = await fetch(`/api/programs/${programId}`);
      if (progRes.ok) {
        const pd = await progRes.json();
        setProgramDetails(pd.program);
        if (pd.program?.program_name) setProgramName(pd.program.program_name);
        if (pd.program?.university) setUniversity(pd.program.university);
      }

      if (forceNew) {
        await fetch(`/api/programs/${programId}/application-plan`, { method: 'DELETE' });
        window.history.replaceState({}, '', `/my-applications/${programId}`);
        setPageState('questionnaire');
        return;
      }

      const planRes = await fetch(`/api/programs/${programId}/application-plan`);
      if (planRes.ok) {
        const data = await planRes.json();
        if (data.plan?.steps?.length) {
          setPlan(data.plan);
          if (data.checklistState) { try { setChecklist(JSON.parse(data.checklistState)); } catch { /* ignore */ } }
          setPageState('plan');
          return;
        }
      }
      setPageState('questionnaire');
    } catch (err) {
      console.error('Load error:', err);
      setPageState('questionnaire');
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/auth/signin?callbackUrl=/my-applications'); return; }
    if (status === 'authenticated' && programId) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, programId]);

  // ─── Generate ──────────────────────────────────────────
  const generatePlan = async () => {
    try {
      setPageState('generating');
      setErrorMsg('');
      let prog = programDetails;
      if (!prog) {
        const r = await fetch(`/api/programs/${programId}`);
        if (r.ok) { const d = await r.json(); prog = d.program; setProgramDetails(d.program); }
      }
      if (!prog) { setErrorMsg('Could not load program details'); setPageState('questionnaire'); return; }

      const enrichedProfile = {
        ...(sanitize(userProfile) || {}),
        nationality: qData.nationality,
        currentCountry: qData.currentCountry,
        plannedStart: qData.plannedStart,
        germanLevel: qData.germanLevel,
        financialReady: qData.financialReady,
        additionalNotes: qData.additionalNotes,
      };

      const res = await fetch(`/api/programs/${programId}/application-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ program: buildProgramPayload(prog), userProfile: enrichedProfile }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.plan?.steps?.length) { setPlan(data.plan); setPageState('plan'); return; }
      }
      const err = await res.json().catch(() => ({}));
      setErrorMsg(err?.error || err?.message || 'Failed to generate plan. Try again.');
      setPageState('questionnaire');
    } catch (err) {
      console.error('Generate error:', err);
      setErrorMsg('Something went wrong. Please try again.');
      setPageState('questionnaire');
    }
  };

  const toggleStep = async (stepId: string) => {
    const newVal = !checklist[stepId];
    setChecklist(prev => ({ ...prev, [stepId]: newVal }));
    try {
      await fetch(`/api/programs/${programId}/application-plan`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, completed: newVal }),
      });
    } catch { /* ignore */ }
  };

  const toggleExpand = (id: string) => {
    setExpandedSteps(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const regenerate = async () => {
    await fetch(`/api/programs/${programId}/application-plan`, { method: 'DELETE' });
    setPlan(null);
    setPageState('questionnaire');
  };

  // ─── Styles ────────────────────────────────────────────
  const card: React.CSSProperties = { background: '#fff', borderRadius: 16, border: '1px solid #e5e5e5', overflow: 'hidden' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '11px 14px', border: '1px solid #d4d4d4', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' };
  const selectStyle: React.CSSProperties = { ...inputStyle, background: '#fff' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 };

  // ─── RENDER: Loading ───────────────────────────────────
  if (pageState === 'loading') {
    return (<><SiteNav /><div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#dd0000' }} /></div></>);
  }

  // ─── RENDER: Questionnaire (single page, clean) ────────
  if (pageState === 'questionnaire') {
    const canGenerate = qData.nationality.trim().length > 0 && qData.currentCountry.trim().length > 0;
    return (
      <>
        <SiteNav />
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fafafa 0%, #fff 100%)' }}>
          <div style={{ maxWidth: 580, margin: '0 auto', padding: '32px 20px 80px' }}>
            <Link href="/my-applications" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#737373', textDecoration: 'none', marginBottom: 20 }}>
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>

            {programName && (
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0a0a0a', margin: '0 0 4px' }}>{programName}</h1>
                <p style={{ fontSize: 14, color: '#737373', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}><Building2 className="w-4 h-4" /> {university}</p>
              </div>
            )}

            {errorMsg && (
              <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle className="w-4 h-4" style={{ color: '#dc2626' }} /><span style={{ fontSize: 13, color: '#dc2626' }}>{errorMsg}</span>
              </div>
            )}

            {/* Intro */}
            <div style={{ ...card, marginBottom: 20, background: 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)' }}>
              <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #dd0000, #b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles className="w-5 h-5" style={{ color: '#fff' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0a0a0a', margin: '0 0 2px' }}>Personalize Your Plan</h2>
                  <p style={{ fontSize: 13, color: '#737373', margin: 0 }}>Quick questions to tailor visa, APS, timeline & financial advice</p>
                </div>
              </div>
            </div>

            {/* Questions — all on one page */}
            <div style={{ ...card, padding: 0 }}>
              {/* Section 1: Location */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <MapPin className="w-4 h-4" style={{ color: '#dd0000' }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0a0a0a' }}>Where are you from?</span>
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={labelStyle}>Nationality *</label>
                    <input type="text" placeholder="e.g. Indian" value={qData.nationality}
                      onChange={e => setQData(p => ({ ...p, nationality: e.target.value }))} style={inputStyle} />
                    <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>For visa & APS info</p>
                  </div>
                  <div>
                    <label style={labelStyle}>Current country *</label>
                    <input type="text" placeholder="e.g. India" value={qData.currentCountry}
                      onChange={e => setQData(p => ({ ...p, currentCountry: e.target.value }))} style={inputStyle} />
                    <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>For timeline planning</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Timeline & Language */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Calendar className="w-4 h-4" style={{ color: '#dd0000' }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0a0a0a' }}>Timeline & Language</span>
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={labelStyle}>Planned start</label>
                    <select value={qData.plannedStart} onChange={e => setQData(p => ({ ...p, plannedStart: e.target.value }))} style={selectStyle}>
                      <option value="">Select semester...</option>
                      <option value="Winter 2025/26">Winter 2025/26 (Oct)</option>
                      <option value="Summer 2026">Summer 2026 (Apr)</option>
                      <option value="Winter 2026/27">Winter 2026/27 (Oct)</option>
                      <option value="Summer 2027">Summer 2027 (Apr)</option>
                      <option value="Winter 2027/28">Winter 2027/28 (Oct)</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>German level</label>
                    <select value={qData.germanLevel} onChange={e => setQData(p => ({ ...p, germanLevel: e.target.value }))} style={selectStyle}>
                      <option value="">Select...</option>
                      <option value="None">No German</option>
                      <option value="A1-A2">Beginner (A1-A2)</option>
                      <option value="B1-B2">Intermediate (B1-B2)</option>
                      <option value="C1-C2">Advanced (C1-C2)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Financial & Notes */}
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Wallet className="w-4 h-4" style={{ color: '#dd0000' }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0a0a0a' }}>Financial & Additional</span>
                </div>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Financial readiness</label>
                    <select value={qData.financialReady} onChange={e => setQData(p => ({ ...p, financialReady: e.target.value }))} style={selectStyle}>
                      <option value="">Select...</option>
                      <option value="Ready - have blocked account or proof">Ready - blocked account / proof of funds</option>
                      <option value="In progress - saving up">In progress - saving up</option>
                      <option value="Need scholarship">Need scholarship or financial aid</option>
                      <option value="Not started">Not started yet</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Anything else? (optional)</label>
                    <textarea placeholder="e.g. I have IELTS 7.0, 2 years work experience, need APS info..."
                      value={qData.additionalNotes} onChange={e => setQData(p => ({ ...p, additionalNotes: e.target.value }))}
                      rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => router.push('/my-applications')}
                style={{ padding: '10px 20px', background: '#fff', border: '1px solid #d4d4d4', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#525252', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={generatePlan} disabled={!canGenerate}
                style={{
                  padding: '12px 28px', background: canGenerate ? '#dd0000' : '#e5e5e5', color: '#fff', border: 'none', borderRadius: 12,
                  fontSize: 15, fontWeight: 700, cursor: canGenerate ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', gap: 8, boxShadow: canGenerate ? '0 4px 14px rgba(221,0,0,0.25)' : 'none',
                }}>
                <Sparkles className="w-4 h-4" /> Generate My Plan
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─── RENDER: Generating ────────────────────────────────
  if (pageState === 'generating') {
    return (<><SiteNav /><div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><GermanPulseLoader headline="Creating your personalized roadmap..." progressLabel="Analyzing requirements, visa & APS needs" subline="This takes about 15-30 seconds" /></div></>);
  }

  // ─── RENDER: Plan ──────────────────────────────────────
  if (pageState === 'plan' && plan) {
    const completedCount = plan.steps.filter(s => checklist[s.id] || s.autoCompleted).length;
    const totalSteps = plan.steps.length;
    const progress = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
    const highPri = plan.steps.filter(s => s.priority === 'high' && !checklist[s.id] && !s.autoCompleted);
    const withDeadlines = plan.steps.filter(s => s.deadline && !checklist[s.id] && !s.autoCompleted);

    return (
      <>
        <SiteNav />
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px 100px' }}>
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <Link href="/my-applications" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#737373', textDecoration: 'none' }}>
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <button onClick={regenerate} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#525252', cursor: 'pointer' }}>
              <Sparkles className="w-3.5 h-3.5" /> Regenerate
            </button>
          </div>

          {/* Header + progress */}
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0a0a0a', margin: '0 0 4px' }}>{programName}</h1>
            <p style={{ fontSize: 14, color: '#737373', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}><Building2 className="w-4 h-4" /> {university}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: progress === 100 ? '#22c55e' : '#dd0000', borderRadius: 4, transition: 'width 0.3s' }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: progress === 100 ? '#22c55e' : '#dd0000' }}>{progress}%</span>
            </div>
            <p style={{ fontSize: 12, color: '#a3a3a3', margin: '4px 0 0' }}>{completedCount} of {totalSteps} steps completed</p>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
            <div style={{ ...card, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#dc2626' }}>{highPri.length}</div>
              <div style={{ fontSize: 11, color: '#737373', fontWeight: 600 }}>Critical Left</div>
            </div>
            <div style={{ ...card, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#d97706' }}>{withDeadlines.length}</div>
              <div style={{ fontSize: 11, color: '#737373', fontWeight: 600 }}>With Deadlines</div>
            </div>
            <div style={{ ...card, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: (plan.profileMatch?.score ?? 0) >= 70 ? '#22c55e' : '#f59e0b' }}>
                {plan.profileMatch?.score ?? '—'}%
              </div>
              <div style={{ fontSize: 11, color: '#737373', fontWeight: 600 }}>Profile Match</div>
            </div>
          </div>

          {/* Blockers / Barriers */}
          {plan.blockers && plan.blockers.length > 0 && (
            <div style={{ ...card, marginBottom: 16, padding: 16, background: '#fffbeb', borderColor: '#fef3c7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <AlertTriangle className="w-5 h-5" style={{ color: '#d97706' }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#92400e', margin: 0 }}>Potential Barriers</h3>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {plan.blockers.map((b, i) => (
                  <li key={i} style={{ fontSize: 13, color: '#78350f', lineHeight: 1.6, marginBottom: 3 }}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Profile Match */}
          {plan.profileMatch && (
            <div style={{ ...card, marginBottom: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles className="w-5 h-5" style={{ color: '#dd0000' }} /> Profile Match
                </h2>
                <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700, color: '#fff', background: plan.profileMatch.score >= 80 ? '#22c55e' : plan.profileMatch.score >= 60 ? '#f59e0b' : '#ef4444' }}>
                  {plan.profileMatch.score}%
                </span>
              </div>
              <p style={{ fontSize: 14, color: '#525252', margin: '0 0 12px', lineHeight: 1.6 }}>{plan.profileMatch.summary}</p>
              {plan.profileMatch.strengths?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {plan.profileMatch.strengths.map((s, i) => (
                    <span key={i} style={{ padding: '4px 10px', background: '#f0fdf4', color: '#16a34a', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>✓ {s}</span>
                  ))}
                </div>
              )}
              {plan.profileMatch.gaps?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {plan.profileMatch.gaps.map((g, i) => (
                    <span key={i} style={{ padding: '4px 10px', background: '#fef2f2', color: '#dc2626', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>✗ {g}</span>
                  ))}
                </div>
              )}
              {plan.profileMatch.recommendations?.length > 0 && (
                <div style={{ marginTop: 12, padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#334155', margin: '0 0 6px' }}>Recommendations</p>
                  {plan.profileMatch.recommendations.map((r, i) => (
                    <p key={i} style={{ fontSize: 13, color: '#475569', margin: '0 0 3px', lineHeight: 1.5 }}>• {r}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* How to Apply */}
          {plan.applicationSubmission && (
            <div style={{ ...card, marginBottom: 16, padding: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar className="w-5 h-5" style={{ color: '#dd0000' }} /> How to Apply
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                <span style={{ padding: '4px 10px', background: '#eff6ff', color: '#2563eb', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Method: {plan.applicationSubmission.method}</span>
                {plan.applicationSubmission.deadline && (
                  <span style={{ padding: '4px 10px', background: '#fef2f2', color: '#dc2626', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Deadline: {plan.applicationSubmission.deadline}</span>
                )}
              </div>
              <p style={{ fontSize: 13, color: '#525252', margin: '0 0 12px', lineHeight: 1.6 }}>{plan.applicationSubmission.instructions}</p>
              {plan.applicationSubmission.portalUrl && (
                <a href={plan.applicationSubmission.portalUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: '#dd0000', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  Open Application Portal <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Required Documents with tool links */}
          {plan.requiredDocuments && plan.requiredDocuments.length > 0 && (
            <div style={{ ...card, marginBottom: 16, padding: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText className="w-5 h-5" style={{ color: '#dd0000' }} /> Required Documents
              </h2>
              <div style={{ display: 'grid', gap: 8 }}>
                {plan.requiredDocuments.map((doc, i) => {
                  const tool = getDocToolLink(doc.id, programId);
                  return (
                    <div key={doc.id || i} style={{ padding: '12px 14px', background: '#fafafa', borderRadius: 10, border: '1px solid #f0f0f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a' }}>{doc.name}</span>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                          background: doc.category === 'visa' ? '#fef3c7' : doc.category === 'financial' ? '#eff6ff' : '#f0fdf4',
                          color: doc.category === 'visa' ? '#92400e' : doc.category === 'financial' ? '#1d4ed8' : '#166534',
                        }}>{doc.category}</span>
                      </div>
                      {doc.description && <p style={{ fontSize: 12, color: '#737373', margin: '4px 0 0', lineHeight: 1.4 }}>{doc.description}</p>}
                      {doc.programSpecificNotes && <p style={{ fontSize: 12, color: '#525252', margin: '3px 0 0', fontStyle: 'italic' }}>{doc.programSpecificNotes}</p>}
                      {tool && (
                        <Link href={tool.url}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, padding: '6px 14px', background: '#dd0000', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                          <PenTool className="w-3 h-3" /> {tool.label}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Steps checklist */}
          <div style={{ ...card, padding: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Target className="w-5 h-5" style={{ color: '#dd0000' }} /> Your Application Steps
            </h2>
            <div style={{ display: 'grid', gap: 8 }}>
              {plan.steps.map((step) => {
                const isChecked = checklist[step.id] || step.autoCompleted;
                const isExpanded = expandedSteps.includes(step.id);
                const pc = priorityColor(step.priority);
                return (
                  <div key={step.id} style={{ border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden', background: isChecked ? '#fafff7' : '#fff' }}>
                    <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}
                      onClick={() => toggleExpand(step.id)}>
                      <button onClick={e => { e.stopPropagation(); toggleStep(step.id); }}
                        style={{ flexShrink: 0, marginTop: 2, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        {isChecked ? <CheckCircle2 className="w-5 h-5" style={{ color: '#22c55e' }} /> : <Circle className="w-5 h-5" style={{ color: '#d4d4d4' }} />}
                      </button>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: isChecked ? '#16a34a' : '#0a0a0a', textDecoration: isChecked ? 'line-through' : 'none' }}>{step.title}</span>
                          <span style={{ padding: '2px 8px', fontSize: 11, fontWeight: 600, borderRadius: 4, background: pc.bg, color: pc.text, border: `1px solid ${pc.border}` }}>{step.priority}</span>
                          {step.category && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#737373' }}>{categoryIcon(step.category)} {step.category}</span>}
                        </div>
                        <p style={{ fontSize: 13, color: '#737373', margin: '4px 0 0', lineHeight: 1.4 }}>{step.description}</p>
                        {step.deadline && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 12, color: '#dc2626', fontWeight: 600 }}><Clock className="w-3 h-3" /> {step.deadline}</span>}
                        {step.autoCompleted && step.autoCompletedReason && <p style={{ fontSize: 12, color: '#16a34a', margin: '4px 0 0', fontStyle: 'italic' }}>✓ {step.autoCompletedReason}</p>}
                      </div>
                      {(step.detailedInfo || step.resources?.length || step.action) && (
                        <div style={{ flexShrink: 0, marginTop: 2 }}>
                          {isExpanded ? <ChevronUp className="w-4 h-4" style={{ color: '#a3a3a3' }} /> : <ChevronDown className="w-4 h-4" style={{ color: '#a3a3a3' }} />}
                        </div>
                      )}
                    </div>
                    {isExpanded && (step.detailedInfo || step.resources?.length || step.action) && (
                      <div style={{ padding: '0 16px 14px 52px', borderTop: '1px solid #f0f0f0' }}>
                        {step.detailedInfo && <p style={{ fontSize: 13, color: '#525252', margin: '12px 0', lineHeight: 1.6 }}>{step.detailedInfo}</p>}
                        {step.resources && step.resources.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                            {step.resources.map((r, ri) => (
                              <a key={ri} href={r.url} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: '#f5f5f5', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#0a0a0a', textDecoration: 'none' }}>
                                {r.name} <ExternalLink className="w-3 h-3" />
                              </a>
                            ))}
                          </div>
                        )}
                        {step.action && (
                          <a href={step.action.url} target={step.action.url.startsWith('/') ? '_self' : '_blank'} rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '8px 16px', background: '#dd0000', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                            {step.action.label} <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating Chatbot */}
        <CourseAssistantChat programId={programId} programContext={programDetails} userProfile={userProfile} />
      </>
    );
  }

  // Fallback
  return (
    <>
      <SiteNav />
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <AlertCircle className="w-8 h-8" style={{ color: '#dc2626' }} />
        <p style={{ fontSize: 14, color: '#525252' }}>Something went wrong.</p>
        <button onClick={() => setPageState('questionnaire')} style={{ padding: '8px 16px', background: '#dd0000', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Try Again</button>
      </div>
    </>
  );
}

// ─── Wrapper with Suspense ───────────────────────────────────
export default function ApplicationPlanPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#dd0000' }} /></div>}>
      <PlanPageInner />
    </Suspense>
  );
}
