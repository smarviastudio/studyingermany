'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Loader2, ArrowLeft, CheckCircle2, Circle, AlertCircle,
  FileText, Calendar, ExternalLink, Sparkles,
  Globe, Clock, ChevronDown, ChevronUp,
  Wallet, Plane, Target, Building2
} from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';
import { GermanPulseLoader } from '@/components/GermanPulseLoader';

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
  englishLevel: string;
  englishCert: string;
  englishScore: string;
  germanLevel: string;
  germanCert: string;
  financialReady: string;
  additionalNotes: string;
}

// ─── Helpers ──────────────────────────────────────────────────
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

// ─── Inner Component (uses useSearchParams) ──────────────────
function PlanPageInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const programId = params.programId as string;
  const forceNew = searchParams.get('new') === '1';

  // Page state
  type PageState = 'loading' | 'questionnaire' | 'generating' | 'plan' | 'error';
  const [pageState, setPageState] = useState<PageState>('loading');
  const [plan, setPlan] = useState<ApplicationPlan | null>(null);
  const [programName, setProgramName] = useState('');
  const [university, setUniversity] = useState('');
  const [programDetails, setProgramDetails] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  const [qStep, setQStep] = useState(0);
  const [qData, setQData] = useState<QuestionnaireData>({
    nationality: '', currentCountry: '', plannedStart: '',
    englishLevel: '', englishCert: '', englishScore: '',
    germanLevel: '', germanCert: '', financialReady: '', additionalNotes: '',
  });

  // ─── Load data on mount ──────────────────────────────────
  const loadData = async () => {
    try {
      setPageState('loading');

      // Fetch profile
      const profileRes = await fetch('/api/profile');
      if (profileRes.ok) {
        const pd = await profileRes.json();
        if (pd.profile) setUserProfile(pd.profile);
      }

      // Fetch program details
      const shortlistRes = await fetch('/api/shortlist');
      if (shortlistRes.ok) {
        const sd = await shortlistRes.json();
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

      // If ?new=1, delete old plan and go to questionnaire
      if (forceNew) {
        await fetch(`/api/programs/${programId}/application-plan`, { method: 'DELETE' });
        window.history.replaceState({}, '', `/my-applications/${programId}`);
        setPageState('questionnaire');
        return;
      }

      // Check for existing plan
      const planRes = await fetch(`/api/programs/${programId}/application-plan`);
      if (planRes.ok) {
        const data = await planRes.json();
        if (data.plan?.steps?.length) {
          setPlan(data.plan);
          if (data.checklistState) {
            try { setChecklist(JSON.parse(data.checklistState)); } catch {}
          }
          setPageState('plan');
          return;
        }
      }

      // No plan → questionnaire
      setPageState('questionnaire');
    } catch (err) {
      console.error('Load error:', err);
      setPageState('questionnaire');
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/my-applications');
      return;
    }
    if (status === 'authenticated' && programId) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, programId]);

  // ─── Generate plan ───────────────────────────────────────
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
        englishLevel: qData.englishLevel,
        englishCert: qData.englishCert,
        englishScore: qData.englishScore,
        germanLevel: qData.germanLevel,
        germanCert: qData.germanCert,
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
        if (data.plan?.steps?.length) {
          setPlan(data.plan);
          setPageState('plan');
          return;
        }
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

  // ─── Toggle step checklist ─────────────────────────────
  const toggleStep = async (stepId: string) => {
    const newVal = !checklist[stepId];
    setChecklist(prev => ({ ...prev, [stepId]: newVal }));
    try {
      await fetch(`/api/programs/${programId}/application-plan`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, completed: newVal }),
      });
    } catch {}
  };

  const toggleExpand = (id: string) => {
    setExpandedSteps(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // ─── Regenerate ────────────────────────────────────────
  const regenerate = async () => {
    await fetch(`/api/programs/${programId}/application-plan`, { method: 'DELETE' });
    setPlan(null);
    setPageState('questionnaire');
    setQStep(0);
  };

  // ─── Shared styles ─────────────────────────────────────
  const card = { background: '#fff', borderRadius: 16, border: '1px solid #e5e5e5', overflow: 'hidden' as const };
  const inputStyle = { width: '100%', padding: '12px 14px', border: '1px solid #d4d4d4', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const };
  const selectStyle = { ...inputStyle, background: '#fff' };
  const labelStyle = { display: 'block' as const, fontSize: 14, fontWeight: 600, color: '#0a0a0a', marginBottom: 8 };

  // ─── RENDER: Loading ───────────────────────────────────
  if (pageState === 'loading') {
    return (
      <>
        <SiteNav />
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#dd0000' }} />
        </div>
      </>
    );
  }

  // ─── RENDER: Questionnaire ─────────────────────────────
  if (pageState === 'questionnaire') {
    return (
      <>
        <SiteNav />
        <div style={{ maxWidth: 640, margin: '40px auto', padding: '0 20px' }}>
          {/* Back link */}
          <Link href="/my-applications" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#737373', textDecoration: 'none', marginBottom: 24 }}>
            <ArrowLeft className="w-4 h-4" /> Back to My Applications
          </Link>

          {/* Program header */}
          {programName && (
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0a0a0a', margin: '0 0 4px' }}>{programName}</h1>
              <p style={{ fontSize: 14, color: '#737373', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Building2 className="w-4 h-4" /> {university}
              </p>
            </div>
          )}

          {/* Error */}
          {errorMsg && (
            <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle className="w-4 h-4" style={{ color: '#dc2626' }} />
              <span style={{ fontSize: 13, color: '#dc2626' }}>{errorMsg}</span>
            </div>
          )}

          <div style={card}>
            {/* Questionnaire header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0a0a0a', margin: '0 0 2px' }}>
                  {qStep === 0 ? 'About You' : qStep === 1 ? 'Language Skills' : 'Financial & Timeline'}
                </h2>
                <p style={{ fontSize: 13, color: '#737373', margin: 0 }}>Step {qStep + 1} of 3</p>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 32, height: 4, borderRadius: 2, background: i <= qStep ? '#dd0000' : '#e5e5e5' }} />
                ))}
              </div>
            </div>

            <div style={{ padding: 24 }}>
              {/* Step 0: About You */}
              {qStep === 0 && (
                <div style={{ display: 'grid', gap: 18 }}>
                  <div>
                    <label style={labelStyle}>What is your nationality? *</label>
                    <input type="text" placeholder="e.g. Indian, Pakistani, Nigerian..." value={qData.nationality}
                      onChange={e => setQData(p => ({ ...p, nationality: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Which country are you currently in? *</label>
                    <input type="text" placeholder="e.g. India, Pakistan, Germany..." value={qData.currentCountry}
                      onChange={e => setQData(p => ({ ...p, currentCountry: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>When do you want to start studying?</label>
                    <select value={qData.plannedStart} onChange={e => setQData(p => ({ ...p, plannedStart: e.target.value }))} style={selectStyle}>
                      <option value="">Select intake...</option>
                      <option value="Winter 2025/26">Winter 2025/26 (Oct 2025)</option>
                      <option value="Summer 2026">Summer 2026 (Apr 2026)</option>
                      <option value="Winter 2026/27">Winter 2026/27 (Oct 2026)</option>
                      <option value="Summer 2027">Summer 2027 (Apr 2027)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 1: Language Skills */}
              {qStep === 1 && (
                <div style={{ display: 'grid', gap: 18 }}>
                  <div>
                    <label style={labelStyle}>English proficiency level</label>
                    <select value={qData.englishLevel} onChange={e => setQData(p => ({ ...p, englishLevel: e.target.value }))} style={selectStyle}>
                      <option value="">Select level...</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate (B1-B2)">Intermediate (B1-B2)</option>
                      <option value="Advanced (C1)">Advanced (C1)</option>
                      <option value="Fluent / Native (C2)">Fluent / Native (C2)</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>English test certificate?</label>
                    <select value={qData.englishCert} onChange={e => setQData(p => ({ ...p, englishCert: e.target.value }))} style={selectStyle}>
                      <option value="">Select...</option>
                      <option value="IELTS">IELTS</option>
                      <option value="TOEFL">TOEFL</option>
                      <option value="Cambridge">Cambridge (CAE/CPE)</option>
                      <option value="None yet">No certificate yet</option>
                    </select>
                  </div>
                  {qData.englishCert && qData.englishCert !== 'None yet' && (
                    <div>
                      <label style={labelStyle}>Your {qData.englishCert} score</label>
                      <input type="text" placeholder={qData.englishCert === 'IELTS' ? 'e.g. 6.5' : 'e.g. 90'} value={qData.englishScore}
                        onChange={e => setQData(p => ({ ...p, englishScore: e.target.value }))} style={inputStyle} />
                    </div>
                  )}
                  <div>
                    <label style={labelStyle}>German proficiency level</label>
                    <select value={qData.germanLevel} onChange={e => setQData(p => ({ ...p, germanLevel: e.target.value }))} style={selectStyle}>
                      <option value="">Select level...</option>
                      <option value="None">No German</option>
                      <option value="A1-A2">Beginner (A1-A2)</option>
                      <option value="B1-B2">Intermediate (B1-B2)</option>
                      <option value="C1-C2">Advanced (C1-C2)</option>
                    </select>
                  </div>
                  {qData.germanLevel && qData.germanLevel !== 'None' && (
                    <div>
                      <label style={labelStyle}>German certificate (if any)</label>
                      <select value={qData.germanCert} onChange={e => setQData(p => ({ ...p, germanCert: e.target.value }))} style={selectStyle}>
                        <option value="">Select...</option>
                        <option value="Goethe-Zertifikat">Goethe-Zertifikat</option>
                        <option value="TestDaF">TestDaF</option>
                        <option value="DSH">DSH</option>
                        <option value="telc">telc</option>
                        <option value="None yet">No certificate yet</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Financial & Notes */}
              {qStep === 2 && (
                <div style={{ display: 'grid', gap: 18 }}>
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
                    <textarea placeholder="e.g. I have work experience, I need a visa, I already live in Germany..."
                      value={qData.additionalNotes} onChange={e => setQData(p => ({ ...p, additionalNotes: e.target.value }))}
                      rows={3} style={{ ...inputStyle, resize: 'vertical' as const }} />
                  </div>
                </div>
              )}

              {/* Nav buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                <button onClick={() => qStep === 0 ? router.push('/my-applications') : setQStep(p => p - 1)}
                  style={{ padding: '10px 20px', background: '#fff', border: '1px solid #d4d4d4', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#525252', cursor: 'pointer' }}>
                  {qStep === 0 ? 'Cancel' : 'Back'}
                </button>
                {qStep < 2 ? (
                  <button onClick={() => setQStep(p => p + 1)}
                    disabled={qStep === 0 && (!qData.nationality || !qData.currentCountry)}
                    style={{
                      padding: '10px 24px', background: '#dd0000', color: '#fff', border: 'none', borderRadius: 10,
                      fontSize: 14, fontWeight: 600, cursor: (qStep === 0 && (!qData.nationality || !qData.currentCountry)) ? 'not-allowed' : 'pointer',
                      opacity: (qStep === 0 && (!qData.nationality || !qData.currentCountry)) ? 0.5 : 1,
                    }}>
                    Next
                  </button>
                ) : (
                  <button onClick={generatePlan}
                    style={{ padding: '10px 24px', background: '#dd0000', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Sparkles className="w-4 h-4" /> Generate My Plan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─── RENDER: Generating ────────────────────────────────
  if (pageState === 'generating') {
    return (
      <>
        <SiteNav />
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GermanPulseLoader headline="Creating your personalized roadmap..." progressLabel="Analyzing program requirements" subline="This takes about 15-30 seconds" />
        </div>
      </>
    );
  }

  // ─── RENDER: Plan ──────────────────────────────────────
  if (pageState === 'plan' && plan) {
    const completedCount = plan.steps.filter(s => checklist[s.id] || s.autoCompleted).length;
    const totalSteps = plan.steps.length;
    const progress = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

    return (
      <>
        <SiteNav />
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px 80px' }}>
          {/* Back + Regenerate */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <Link href="/my-applications" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#737373', textDecoration: 'none' }}>
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <button onClick={regenerate} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#525252', cursor: 'pointer' }}>
              <Sparkles className="w-3.5 h-3.5" /> Regenerate
            </button>
          </div>

          {/* Program header */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0a0a0a', margin: '0 0 4px' }}>{programName}</h1>
            <p style={{ fontSize: 14, color: '#737373', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Building2 className="w-4 h-4" /> {university}
            </p>
            {/* Progress bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: progress === 100 ? '#22c55e' : '#dd0000', borderRadius: 4, transition: 'width 0.3s' }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: progress === 100 ? '#22c55e' : '#dd0000' }}>{progress}%</span>
            </div>
            <p style={{ fontSize: 12, color: '#a3a3a3', margin: '4px 0 0' }}>{completedCount} of {totalSteps} steps completed</p>
          </div>

          {/* Match score + overview */}
          {plan.profileMatch && (
            <div style={{ ...card, marginBottom: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles className="w-5 h-5" style={{ color: '#dd0000' }} /> Profile Match
                </h2>
                <span style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700, color: '#fff',
                  background: plan.profileMatch.score >= 80 ? '#22c55e' : plan.profileMatch.score >= 60 ? '#f59e0b' : '#ef4444'
                }}>
                  {plan.profileMatch.score}%
                </span>
              </div>
              <p style={{ fontSize: 14, color: '#525252', margin: '0 0 12px', lineHeight: 1.6 }}>{plan.profileMatch.summary}</p>
              {plan.profileMatch.strengths?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {plan.profileMatch.strengths.map((s, i) => (
                    <span key={i} style={{ padding: '4px 10px', background: '#f0fdf4', color: '#16a34a', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                      ✓ {s}
                    </span>
                  ))}
                </div>
              )}
              {plan.profileMatch.gaps?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {plan.profileMatch.gaps.map((g, i) => (
                    <span key={i} style={{ padding: '4px 10px', background: '#fef2f2', color: '#dc2626', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                      ✗ {g}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submission info */}
          {plan.applicationSubmission && (
            <div style={{ ...card, marginBottom: 16, padding: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar className="w-5 h-5" style={{ color: '#dd0000' }} /> How to Apply
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                <span style={{ padding: '4px 10px', background: '#eff6ff', color: '#2563eb', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                  Method: {plan.applicationSubmission.method}
                </span>
                {plan.applicationSubmission.deadline && (
                  <span style={{ padding: '4px 10px', background: '#fef2f2', color: '#dc2626', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                    Deadline: {plan.applicationSubmission.deadline}
                  </span>
                )}
              </div>
              <p style={{ fontSize: 13, color: '#525252', margin: 0, lineHeight: 1.6 }}>{plan.applicationSubmission.instructions}</p>
              {plan.applicationSubmission.portalUrl && (
                <a href={plan.applicationSubmission.portalUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 13, color: '#dd0000', fontWeight: 600, textDecoration: 'none' }}>
                  Open Application Portal <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Required Documents */}
          {plan.requiredDocuments && plan.requiredDocuments.length > 0 && (
            <div style={{ ...card, marginBottom: 16, padding: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText className="w-5 h-5" style={{ color: '#dd0000' }} /> Required Documents
              </h2>
              <div style={{ display: 'grid', gap: 8 }}>
                {plan.requiredDocuments.map((doc, i) => (
                  <div key={doc.id || i} style={{ padding: '10px 14px', background: '#fafafa', borderRadius: 10, border: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a' }}>{doc.name}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                        background: doc.category === 'visa' ? '#fef3c7' : doc.category === 'financial' ? '#eff6ff' : '#f0fdf4',
                        color: doc.category === 'visa' ? '#92400e' : doc.category === 'financial' ? '#1d4ed8' : '#166534',
                      }}>
                        {doc.category}
                      </span>
                    </div>
                    {doc.description && <p style={{ fontSize: 12, color: '#737373', margin: '4px 0 0', lineHeight: 1.4 }}>{doc.description}</p>}
                  </div>
                ))}
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
                      {/* Checkbox */}
                      <button onClick={e => { e.stopPropagation(); toggleStep(step.id); }}
                        style={{ flexShrink: 0, marginTop: 2, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        {isChecked
                          ? <CheckCircle2 className="w-5 h-5" style={{ color: '#22c55e' }} />
                          : <Circle className="w-5 h-5" style={{ color: '#d4d4d4' }} />}
                      </button>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: isChecked ? '#16a34a' : '#0a0a0a', textDecoration: isChecked ? 'line-through' : 'none' }}>
                            {step.title}
                          </span>
                          <span style={{ padding: '2px 8px', fontSize: 11, fontWeight: 600, borderRadius: 4, background: pc.bg, color: pc.text, border: `1px solid ${pc.border}` }}>
                            {step.priority}
                          </span>
                          {step.category && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#737373' }}>
                              {categoryIcon(step.category)} {step.category}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 13, color: '#737373', margin: '4px 0 0', lineHeight: 1.4 }}>{step.description}</p>
                        {step.deadline && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 12, color: '#dc2626', fontWeight: 600 }}>
                            <Clock className="w-3 h-3" /> {step.deadline}
                          </span>
                        )}
                        {step.autoCompleted && step.autoCompletedReason && (
                          <p style={{ fontSize: 12, color: '#16a34a', margin: '4px 0 0', fontStyle: 'italic' }}>✓ {step.autoCompletedReason}</p>
                        )}
                      </div>

                      {/* Expand arrow */}
                      {(step.detailedInfo || step.resources?.length || step.action) && (
                        <div style={{ flexShrink: 0, marginTop: 2 }}>
                          {isExpanded ? <ChevronUp className="w-4 h-4" style={{ color: '#a3a3a3' }} /> : <ChevronDown className="w-4 h-4" style={{ color: '#a3a3a3' }} />}
                        </div>
                      )}
                    </div>

                    {/* Expanded content */}
                    {isExpanded && (step.detailedInfo || step.resources?.length || step.action) && (
                      <div style={{ padding: '0 16px 14px 52px', borderTop: '1px solid #f0f0f0' }}>
                        {step.detailedInfo && (
                          <p style={{ fontSize: 13, color: '#525252', margin: '12px 0', lineHeight: 1.6 }}>{step.detailedInfo}</p>
                        )}
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
        <button onClick={() => setPageState('questionnaire')} style={{ padding: '8px 16px', background: '#dd0000', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Try Again
        </button>
      </div>
    </>
  );
}

// ─── Wrapper with Suspense (required for useSearchParams) ─
export default function ApplicationPlanPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#dd0000' }} /></div>}>
      <PlanPageInner />
    </Suspense>
  );
}