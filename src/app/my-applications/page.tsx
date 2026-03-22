'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import {
  Loader2, Sparkles, Calendar, FileText, Wallet, Languages, ListChecks,
  CheckCircle2, Circle, Clock, AlertTriangle, ArrowRight, ChevronDown, ChevronRight,
  ExternalLink, BookOpen, GraduationCap, Building2, MapPin, RefreshCw,
  CircleDollarSign, Shield, Home, Briefcase, Globe, Target, X
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  programId: string;
  programName: string;
  university: string;
  event: string;
  date: string;
  description: string;
  category: string;
  urgent: boolean;
}

interface Document {
  id: string;
  name: string;
  description: string;
  category: string;
  required: boolean;
  nationalitySpecific?: boolean;
  tips: string;
  completed?: boolean;
}

interface ProgramDocuments {
  programId: string;
  programName: string;
  university: string;
  documents: (Document & { completed?: boolean })[];
}

interface FinancialPlan {
  blockedAccount: {
    amount: number;
    monthlyAllowance: number;
    deadline: string;
    providers: { name: string; url: string; notes: string }[];
  };
  healthInsurance: {
    monthlyCost: string;
    providers: { name: string; url: string; notes: string }[];
    startDate: string;
  };
  livingCosts: {
    city: string;
    monthlyEstimate: string;
    breakdown: { rent: string; food: string; transport: string; misc: string };
  }[];
  scholarships: {
    name: string;
    deadline: string;
    amount: string;
    url: string;
    eligibility: string;
    applicablePrograms?: string[];
  }[];
}

interface LanguagePlan {
  programId: string;
  programName: string;
  university: string;
  languageRequired: string;
  tests: {
    language: string;
    testName: string;
    minimumScore: string;
    userCurrentLevel: string;
    status: string;
    prepMonthsNeeded: number;
    bookByDate: string;
    milestones: { month: number; task: string }[];
    resources: { name: string; url: string }[];
  }[];
}

interface WeekTask {
  id: string;
  task: string;
  category: string;
  programId: string;
  completed: boolean;
}

interface WeeklyPlan {
  id: string;
  weekNumber: number;
  monthLabel: string;
  weekLabel: string;
  tasks: WeekTask[];
}

interface Plan {
  timeline: TimelineEvent[];
  documents: {
    shared: Document[];
    perProgram: ProgramDocuments[];
  };
  financial: FinancialPlan;
  language: LanguagePlan[];
  weeklyTasks: WeeklyPlan[];
}

const TABS = [
  { id: 'timeline', label: 'Timeline', icon: Calendar, color: '#dd0000' },
  { id: 'documents', label: 'Documents', icon: FileText, color: '#ea580c' },
  { id: 'financial', label: 'Financial', icon: Wallet, color: '#16a34a' },
  { id: 'language', label: 'Language', icon: Languages, color: '#2563eb' },
  { id: 'tasks', label: 'Weekly Tasks', icon: ListChecks, color: '#7c3aed' },
];

const categoryColors: Record<string, string> = {
  application: '#dd0000',
  documents: '#ea580c',
  aps: '#d97706',
  visa: '#7c3aed',
  financial: '#16a34a',
  language: '#2563eb',
  academic: '#0891b2',
  identity: '#6366f1',
};

const categoryLabels: Record<string, string> = {
  application: 'Application',
  documents: 'Documents',
  aps: 'APS Certificate',
  visa: 'Visa',
  financial: 'Financial',
  language: 'Language',
  academic: 'Academic',
  identity: 'Identity',
};

export default function MyApplicationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [expandedPrograms, setExpandedPrograms] = useState<Set<string>>(new Set());
  const [shortlist, setShortlist] = useState<any[]>([]);
  const [loadingShortlist, setLoadingShortlist] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/my-applications');
      return;
    }
    if (status === 'authenticated') {
      fetchPlan();
      fetchShortlist();
    }
  }, [status, router]);

  const fetchShortlist = async () => {
    try {
      setLoadingShortlist(true);
      const res = await fetch('/api/shortlist');
      if (res.ok) {
        const data = await res.json();
        setShortlist(data.shortlist || []);
      }
    } catch (err) {
      console.error('Failed to fetch shortlist:', err);
    } finally {
      setLoadingShortlist(false);
    }
  };

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/application-plan');
      if (!res.ok) throw new Error('Failed to fetch plan');
      const data = await res.json();
      if (data.plan) {
        setPlan(data.plan);
        setUpdatedAt(data.updatedAt);
        // Auto-expand first 4 weeks
        const firstWeeks = new Set<string>((data.plan.weeklyTasks || []).slice(0, 4).map((w: WeeklyPlan) => w.id));
        setExpandedWeeks(firstWeeks);
      }
    } catch (err) {
      console.error('Fetch plan error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async () => {
    try {
      setGenerating(true);
      setError('');
      const res = await fetch('/api/application-plan/generate', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || data.error || 'Failed to generate plan');
        return;
      }
      setPlan(data.plan);
      setUpdatedAt(new Date().toISOString());
      const firstWeeks = new Set<string>((data.plan.weeklyTasks || []).slice(0, 4).map((w: WeeklyPlan) => w.id));
      setExpandedWeeks(firstWeeks);
    } catch (err) {
      setError('Failed to generate plan. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const toggleTask = useCallback(async (taskId: string, completed: boolean) => {
    // Optimistic update
    setPlan(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        weeklyTasks: prev.weeklyTasks.map(week => ({
          ...week,
          tasks: week.tasks.map(t => t.id === taskId ? { ...t, completed } : t),
        })),
      };
    });
    // Persist
    try {
      await fetch('/api/application-plan', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, completed }),
      });
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  }, []);

  const toggleDocComplete = useCallback(async (docKey: string, completed: boolean) => {
    // Optimistic update for shared docs
    setPlan(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        documents: {
          ...prev.documents,
          shared: prev.documents.shared.map(d =>
            `doc-${d.id}` === docKey ? { ...d, completed } : d
          ),
          perProgram: prev.documents.perProgram.map(pg => ({
            ...pg,
            documents: pg.documents.map(d =>
              `doc-${pg.programId}-${d.id}` === docKey ? { ...d, completed } : d
            ),
          })),
        },
      };
    });
    try {
      await fetch('/api/application-plan', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: docKey, completed }),
      });
    } catch (err) {
      console.error('Failed to update doc:', err);
    }
  }, []);

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks(prev => {
      const next = new Set(prev);
      if (next.has(weekId)) next.delete(weekId);
      else next.add(weekId);
      return next;
    });
  };

  const toggleProgram = (programId: string) => {
    setExpandedPrograms(prev => {
      const next = new Set(prev);
      if (next.has(programId)) next.delete(programId);
      else next.add(programId);
      return next;
    });
  };

  // Compute overall task progress
  const totalTasks = plan?.weeklyTasks?.reduce((sum, w) => sum + w.tasks.length, 0) || 0;
  const completedTasks = plan?.weeklyTasks?.reduce((sum, w) => sum + w.tasks.filter(t => t.completed).length, 0) || 0;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (status === 'loading' || loading) {
    return (
      <>
        <SiteNav />
        <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#dd0000' }} />
        </div>
      </>
    );
  }

  return (
    <>
      <SiteNav />
      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px 100px' }}>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
              <div>
                <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, color: '#0a0a0a', margin: '0 0 6px' }}>
                  Application Plan
                </h1>
                <p style={{ fontSize: 15, color: '#737373', margin: 0 }}>
                  {plan ? 'Your personalized roadmap to studying in Germany' : 'Generate an AI-powered application roadmap'}
                </p>
              </div>
              <button
                onClick={generatePlan}
                disabled={generating}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 24px', background: '#dd0000', color: '#fff',
                  border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14,
                  cursor: generating ? 'not-allowed' : 'pointer', opacity: generating ? 0.7 : 1,
                  transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(221,0,0,0.2)',
                }}
              >
                {generating ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating Plan...</>
                ) : plan ? (
                  <><RefreshCw className="w-4 h-4" /> Regenerate Plan</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Generate Plan</>
                )}
              </button>
            </div>
            {updatedAt && (
              <p style={{ fontSize: 12, color: '#a3a3a3', margin: 0 }}>
                Last updated: {new Date(updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '14px 18px', borderRadius: 12, marginBottom: 24, fontSize: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle className="w-4 h-4" style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          {/* Shortlisted Programs */}
          {!loadingShortlist && shortlist.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, marginBottom: 24, border: '1px solid #e5e5e5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <GraduationCap className="w-5 h-5" style={{ color: '#dd0000' }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0a0a0a', margin: 0 }}>
                  Your Shortlisted Programs ({shortlist.length})
                </h3>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {shortlist.map((item: any) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#fafafa', borderRadius: 10, border: '1px solid #f0f0f0' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a', marginBottom: 4 }}>
                        {item.programName}
                      </div>
                      <div style={{ fontSize: 12, color: '#737373', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Building2 className="w-3.5 h-3.5" />
                        {item.university}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {!plan && (
                <p style={{ fontSize: 13, color: '#737373', margin: '16px 0 0', textAlign: 'center' }}>
                  Click "Generate Plan" to create a comprehensive roadmap for all these programs
                </p>
              )}
            </div>
          )}

          {/* No shortlist warning */}
          {!loadingShortlist && shortlist.length === 0 && !plan && (
            <div style={{ background: '#fef3f2', border: '1px solid #fecaca', borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
                <AlertTriangle className="w-5 h-5" style={{ color: '#dc2626', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#dc2626', margin: '0 0 6px' }}>
                    No programs shortlisted yet
                  </h3>
                  <p style={{ fontSize: 14, color: '#991b1b', margin: '0 0 12px' }}>
                    You need to shortlist programs before generating an application plan.
                  </p>
                  <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#dc2626', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                    <GraduationCap className="w-4 h-4" /> Browse Programs
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* No plan state */}
          {!plan && !generating && shortlist.length > 0 && (
            <div style={{ background: '#fff', border: '2px dashed #e5e5e5', borderRadius: 24, padding: '80px 24px', textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, rgba(221,0,0,0.08), rgba(221,0,0,0.04))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Target className="w-8 h-8" style={{ color: '#dd0000' }} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: '0 0 10px' }}>
                Ready to generate your plan
              </h2>
              <p style={{ fontSize: 15, color: '#737373', margin: '0 auto 8px', maxWidth: 520, lineHeight: 1.6 }}>
                Generate a personalized AI roadmap analyzing all {shortlist.length} shortlisted program{shortlist.length > 1 ? 's' : ''} with deadlines, document checklists, financial planning, and weekly tasks.
              </p>
              <p style={{ fontSize: 13, color: '#a3a3a3', margin: '0 auto 28px', maxWidth: 520 }}>
                Includes: Application Timeline • Document Checklist • Financial Plan • Language Path • Weekly Task Board
              </p>
              <button
                onClick={generatePlan}
                disabled={generating}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 32px', background: '#dd0000', color: '#fff',
                  border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15,
                  cursor: 'pointer', boxShadow: '0 4px 16px rgba(221,0,0,0.2)',
                }}
              >
                <Sparkles className="w-5 h-5" /> Generate My Plan
              </button>
            </div>
          )}

          {/* Generating state */}
          {generating && (
            <div style={{ background: '#fff', borderRadius: 24, padding: '80px 24px', textAlign: 'center', border: '1px solid #e5e5e5' }}>
              <Loader2 className="w-12 h-12 animate-spin" style={{ color: '#dd0000', margin: '0 auto 20px', display: 'block' }} />
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: '0 0 10px' }}>
                Generating your application plan...
              </h2>
              <p style={{ fontSize: 15, color: '#737373', margin: 0, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
                AI is analyzing your shortlisted programs and building a personalized roadmap. This may take 15-30 seconds.
              </p>
            </div>
          )}

          {/* Plan content */}
          {plan && !generating && (
            <>
              {/* Overall progress bar */}
              <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', marginBottom: 24, border: '1px solid #e5e5e5' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>Overall Progress</span>
                  <span style={{ fontSize: 13, color: '#737373', fontWeight: 600 }}>{completedTasks}/{totalTasks} tasks completed</span>
                </div>
                <div style={{ height: 8, background: '#f5f5f5', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg, #dd0000, #ea580c)', borderRadius: 99, transition: 'width 0.5s ease', width: `${progressPct}%` }} />
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 18px', border: 'none', borderRadius: 10,
                      fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      transition: 'all 0.2s', whiteSpace: 'nowrap',
                      background: activeTab === tab.id ? tab.color : '#fff',
                      color: activeTab === tab.id ? '#fff' : '#555',
                      boxShadow: activeTab === tab.id ? `0 4px 12px ${tab.color}30` : '0 1px 3px rgba(0,0,0,0.08)',
                    }}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {activeTab === 'timeline' && <TimelineSection timeline={plan.timeline} />}
              {activeTab === 'documents' && <DocumentsSection documents={plan.documents} onToggle={toggleDocComplete} />}
              {activeTab === 'financial' && <FinancialSection financial={plan.financial} />}
              {activeTab === 'language' && <LanguageSection language={plan.language} />}
              {activeTab === 'tasks' && (
                <TasksSection
                  weeklyTasks={plan.weeklyTasks}
                  expandedWeeks={expandedWeeks}
                  toggleWeek={toggleWeek}
                  toggleTask={toggleTask}
                />
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
}

/* ============================================ */
/* TIMELINE SECTION                              */
/* ============================================ */
function TimelineSection({ timeline }: { timeline: TimelineEvent[] }) {
  const sorted = [...timeline].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', border: '1px solid #e5e5e5', marginBottom: 4 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar className="w-5 h-5" style={{ color: '#dd0000' }} />
          Application Deadline Timeline
        </h3>
        <p style={{ fontSize: 13, color: '#737373', margin: 0 }}>
          Reverse-engineered calendar from your intake dates. Sorted by urgency.
        </p>
      </div>

      {sorted.map((event, i) => {
        const color = categoryColors[event.category] || '#555';
        const isUrgent = event.urgent;
        const dateStr = formatDate(event.date);

        return (
          <div key={event.id || i} style={{
            background: '#fff', borderRadius: 14, padding: '18px 22px',
            border: `1px solid ${isUrgent ? '#fecaca' : '#e5e5e5'}`,
            borderLeft: `4px solid ${color}`,
            boxShadow: isUrgent ? '0 2px 12px rgba(220,38,38,0.08)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  {isUrgent && <AlertTriangle className="w-4 h-4" style={{ color: '#dc2626' }} />}
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{event.event}</span>
                </div>
                <p style={{ fontSize: 13, color: '#555', margin: '0 0 8px', lineHeight: 1.5 }}>{event.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: color, background: `${color}10`, padding: '3px 10px', borderRadius: 6 }}>
                    {categoryLabels[event.category] || event.category}
                  </span>
                  <span style={{ fontSize: 12, color: '#737373' }}>
                    <Building2 className="w-3 h-3" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                    {event.programName} — {event.university}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: isUrgent ? '#dc2626' : '#111' }}>{dateStr}</span>
              </div>
            </div>
          </div>
        );
      })}

      {sorted.length === 0 && (
        <div style={{ background: '#fff', borderRadius: 14, padding: 40, textAlign: 'center', border: '1px solid #e5e5e5' }}>
          <p style={{ color: '#737373', fontSize: 14 }}>No timeline events generated.</p>
        </div>
      )}
    </div>
  );
}

/* ============================================ */
/* DOCUMENTS SECTION                             */
/* ============================================ */
function DocumentsSection({ documents, onToggle }: { documents: Plan['documents']; onToggle: (key: string, completed: boolean) => void }) {
  const sharedCompleted = documents.shared.filter(d => d.completed).length;
  const sharedTotal = documents.shared.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Shared documents */}
      <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e5e5' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f5f5f5' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText className="w-5 h-5" style={{ color: '#ea580c' }} />
              Shared Documents
            </h3>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', background: '#f0fdf4', padding: '4px 12px', borderRadius: 8 }}>
              {sharedCompleted}/{sharedTotal} ready
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#737373', margin: '4px 0 0' }}>Required for all your applications</p>
        </div>
        <div style={{ padding: '8px 12px' }}>
          {documents.shared.map(doc => (
            <label key={doc.id} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 12px',
              borderRadius: 10, cursor: 'pointer', transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ marginTop: 2, flexShrink: 0 }} onClick={() => onToggle(`doc-${doc.id}`, !doc.completed)}>
                {doc.completed ? (
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#16a34a' }} />
                ) : (
                  <Circle className="w-5 h-5" style={{ color: '#d4d4d4' }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: doc.completed ? '#a3a3a3' : '#111', textDecoration: doc.completed ? 'line-through' : 'none' }}>
                  {doc.name}
                </span>
                <p style={{ fontSize: 12, color: '#737373', margin: '2px 0 0', lineHeight: 1.5 }}>{doc.description}</p>
                {doc.tips && <p style={{ fontSize: 12, color: '#ea580c', margin: '4px 0 0', fontWeight: 500 }}>💡 {doc.tips}</p>}
                <span style={{
                  display: 'inline-block', marginTop: 6, fontSize: 10, fontWeight: 700,
                  color: categoryColors[doc.category] || '#555',
                  background: `${categoryColors[doc.category] || '#555'}10`,
                  padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase',
                }}>
                  {doc.category}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Per-program documents */}
      {documents.perProgram.map(prog => {
        const progCompleted = prog.documents.filter(d => d.completed).length;
        const progTotal = prog.documents.length;

        return (
          <div key={prog.programId} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e5e5' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #f5f5f5' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: 0 }}>{prog.programName}</h4>
                  <p style={{ fontSize: 12, color: '#737373', margin: '2px 0 0' }}>{prog.university}</p>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', background: '#f0fdf4', padding: '4px 12px', borderRadius: 8 }}>
                  {progCompleted}/{progTotal}
                </span>
              </div>
            </div>
            <div style={{ padding: '8px 12px' }}>
              {prog.documents.map(doc => (
                <label key={doc.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 12px',
                  cursor: 'pointer', borderRadius: 10, transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ marginTop: 2, flexShrink: 0 }} onClick={() => onToggle(`doc-${prog.programId}-${doc.id}`, !doc.completed)}>
                    {doc.completed ? (
                      <CheckCircle2 className="w-5 h-5" style={{ color: '#16a34a' }} />
                    ) : (
                      <Circle className="w-5 h-5" style={{ color: '#d4d4d4' }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: doc.completed ? '#a3a3a3' : '#111', textDecoration: doc.completed ? 'line-through' : 'none' }}>
                      {doc.name}
                    </span>
                    {doc.tips && <p style={{ fontSize: 12, color: '#737373', margin: '2px 0 0', lineHeight: 1.4 }}>💡 {doc.tips}</p>}
                  </div>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================ */
/* FINANCIAL SECTION                             */
/* ============================================ */
function FinancialSection({ financial }: { financial: FinancialPlan }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Blocked Account */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e5e5' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield className="w-5 h-5" style={{ color: '#16a34a' }} />
          Blocked Account (Sperrkonto)
        </h3>
        <p style={{ fontSize: 13, color: '#737373', margin: '0 0 16px' }}>
          Required for your student visa application
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
          <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', margin: '0 0 4px' }}>Total Required</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#111', margin: 0 }}>€{financial.blockedAccount.amount?.toLocaleString()}</p>
          </div>
          <div style={{ padding: 16, background: '#eff6ff', borderRadius: 12, border: '1px solid #bfdbfe' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', margin: '0 0 4px' }}>Monthly Allowance</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#111', margin: 0 }}>€{financial.blockedAccount.monthlyAllowance}/mo</p>
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#555', margin: '0 0 12px' }}>
          <Clock className="w-3.5 h-3.5" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
          <strong>Deadline:</strong> {financial.blockedAccount.deadline}
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {financial.blockedAccount.providers?.map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px',
              background: '#f5f5f5', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#333',
              textDecoration: 'none', border: '1px solid #e5e5e5', transition: 'all 0.2s',
            }}>
              {p.name} <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      </div>

      {/* Health Insurance */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e5e5' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield className="w-5 h-5" style={{ color: '#2563eb' }} />
          Health Insurance
        </h3>
        <p style={{ fontSize: 13, color: '#555', margin: '0 0 12px' }}>
          Estimated cost: <strong>€{financial.healthInsurance.monthlyCost}/month</strong> · {financial.healthInsurance.startDate}
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {financial.healthInsurance.providers?.map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px',
              background: '#f5f5f5', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#333',
              textDecoration: 'none', border: '1px solid #e5e5e5',
            }}>
              {p.name} <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      </div>

      {/* Living Costs */}
      {financial.livingCosts?.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e5e5' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Home className="w-5 h-5" style={{ color: '#ea580c' }} />
            Living Costs by City
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {financial.livingCosts.map((city, i) => (
              <div key={i} style={{ padding: 18, background: '#fafafa', borderRadius: 12, border: '1px solid #e5e5e5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <MapPin className="w-4 h-4" style={{ color: '#dd0000' }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{city.city}</span>
                </div>
                <p style={{ fontSize: 22, fontWeight: 800, color: '#dd0000', margin: '0 0 10px' }}>
                  €{city.monthlyEstimate}<span style={{ fontSize: 13, fontWeight: 500, color: '#737373' }}>/month</span>
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {city.breakdown && Object.entries(city.breakdown).map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#555' }}>
                      <span style={{ textTransform: 'capitalize' }}>{key}</span>
                      <span style={{ fontWeight: 600 }}>€{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scholarships */}
      {financial.scholarships?.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e5e5' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <GraduationCap className="w-5 h-5" style={{ color: '#7c3aed' }} />
            Scholarships & Funding
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {financial.scholarships.map((s, i) => (
              <div key={i} style={{ padding: 16, background: '#faf5ff', borderRadius: 12, border: '1px solid #e9d5ff' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>{s.name}</h4>
                    <p style={{ fontSize: 12, color: '#555', margin: '0 0 6px', lineHeight: 1.4 }}>{s.eligibility}</p>
                    <span style={{ fontSize: 12, color: '#7c3aed', fontWeight: 600 }}>
                      <Clock className="w-3 h-3" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                      Deadline: {s.deadline}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#16a34a' }}>{s.amount}</span>
                    {s.url && (
                      <div style={{ marginTop: 6 }}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#7c3aed', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                          Apply <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================ */
/* LANGUAGE SECTION                              */
/* ============================================ */
function LanguageSection({ language }: { language: LanguagePlan[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', border: '1px solid #e5e5e5', marginBottom: 4 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Languages className="w-5 h-5" style={{ color: '#2563eb' }} />
          Language Preparation Path
        </h3>
        <p style={{ fontSize: 13, color: '#737373', margin: 0 }}>
          Test requirements and preparation milestones for each program
        </p>
      </div>

      {language.map((prog, pi) => (
        <div key={pi} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e5e5' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #f5f5f5', background: '#fafafa' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: 0 }}>{prog.programName}</h4>
            <p style={{ fontSize: 12, color: '#737373', margin: '2px 0 0' }}>
              {prog.university} · Language: <strong>{prog.languageRequired}</strong>
            </p>
          </div>

          {prog.tests.map((test, ti) => {
            const statusColor = test.status === 'met' ? '#16a34a' : test.status === 'partial' ? '#d97706' : '#dc2626';
            const statusLabel = test.status === 'met' ? 'Requirement Met' : test.status === 'partial' ? 'Partially Met' : test.status === 'unknown' ? 'Unknown' : 'Not Met';

            return (
              <div key={ti} style={{ padding: '18px 24px', borderBottom: '1px solid #f5f5f5' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>
                      {test.language} — {test.testName}
                    </span>
                    <span style={{ fontSize: 13, color: '#737373', marginLeft: 10 }}>
                      Min: <strong>{test.minimumScore}</strong>
                    </span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: statusColor, background: `${statusColor}10`, padding: '4px 12px', borderRadius: 6 }}>
                    {statusLabel}
                  </span>
                </div>

                {test.userCurrentLevel && (
                  <p style={{ fontSize: 13, color: '#555', margin: '0 0 10px' }}>
                    Your level: <strong>{test.userCurrentLevel}</strong>
                    {test.prepMonthsNeeded > 0 && ` · ${test.prepMonthsNeeded} months preparation needed`}
                  </p>
                )}

                {test.bookByDate && (
                  <p style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, margin: '0 0 12px' }}>
                    📅 Book test by: {test.bookByDate}
                  </p>
                )}

                {/* Milestones */}
                {test.milestones?.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#555', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Milestones</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {test.milestones.map((m, mi) => (
                        <div key={mi} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: 4, flexShrink: 0 }}>
                            Month {m.month}
                          </span>
                          <span style={{ fontSize: 13, color: '#333' }}>{m.task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resources */}
                {test.resources?.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {test.resources.map((r, ri) => (
                      <a key={ri} href={r.url} target="_blank" rel="noopener noreferrer" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 12px',
                        background: '#eff6ff', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#2563eb',
                        textDecoration: 'none', border: '1px solid #bfdbfe',
                      }}>
                        {r.name} <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {language.length === 0 && (
        <div style={{ background: '#fff', borderRadius: 14, padding: 40, textAlign: 'center', border: '1px solid #e5e5e5' }}>
          <p style={{ color: '#737373', fontSize: 14 }}>No language requirements found.</p>
        </div>
      )}
    </div>
  );
}

/* ============================================ */
/* WEEKLY TASKS SECTION                          */
/* ============================================ */
function TasksSection({ weeklyTasks, expandedWeeks, toggleWeek, toggleTask }: {
  weeklyTasks: WeeklyPlan[];
  expandedWeeks: Set<string>;
  toggleWeek: (id: string) => void;
  toggleTask: (id: string, completed: boolean) => void;
}) {
  // Group by month
  const months: Record<string, WeeklyPlan[]> = {};
  weeklyTasks.forEach(week => {
    const key = week.monthLabel || `Month ${Math.ceil(week.weekNumber / 4)}`;
    if (!months[key]) months[key] = [];
    months[key].push(week);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', border: '1px solid #e5e5e5', marginBottom: 4 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <ListChecks className="w-5 h-5" style={{ color: '#7c3aed' }} />
          Weekly Task Board
        </h3>
        <p style={{ fontSize: 13, color: '#737373', margin: 0 }}>
          Your step-by-step guide. Check off tasks as you complete them.
        </p>
      </div>

      {Object.entries(months).map(([monthLabel, weeks]) => {
        const monthTotalTasks = weeks.reduce((s, w) => s + w.tasks.length, 0);
        const monthCompletedTasks = weeks.reduce((s, w) => s + w.tasks.filter(t => t.completed).length, 0);
        const monthPct = monthTotalTasks > 0 ? Math.round((monthCompletedTasks / monthTotalTasks) * 100) : 0;

        return (
          <div key={monthLabel}>
            {/* Month header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#111', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {monthLabel}
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 80, height: 5, background: '#f5f5f5', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#7c3aed', borderRadius: 99, width: `${monthPct}%`, transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: 11, color: '#737373', fontWeight: 600 }}>{monthPct}%</span>
              </div>
            </div>

            {/* Weeks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {weeks.map(week => {
                const isExpanded = expandedWeeks.has(week.id);
                const weekCompleted = week.tasks.filter(t => t.completed).length;
                const weekTotal = week.tasks.length;

                return (
                  <div key={week.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e5e5', overflow: 'hidden' }}>
                    <button
                      onClick={() => toggleWeek(week.id)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <ChevronRight className="w-4 h-4" style={{ color: '#999', transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{week.weekLabel}</span>
                      </div>
                      <span style={{ fontSize: 12, color: weekCompleted === weekTotal && weekTotal > 0 ? '#16a34a' : '#737373', fontWeight: 600 }}>
                        {weekCompleted}/{weekTotal}
                      </span>
                    </button>

                    {isExpanded && (
                      <div style={{ padding: '0 18px 14px' }}>
                        {week.tasks.map(task => {
                          const taskColor = categoryColors[task.category] || '#555';
                          return (
                            <div
                              key={task.id}
                              onClick={() => toggleTask(task.id, !task.completed)}
                              style={{
                                display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0',
                                borderBottom: '1px solid #f5f5f5', cursor: 'pointer',
                              }}
                            >
                              <div style={{ marginTop: 2, flexShrink: 0 }}>
                                {task.completed ? (
                                  <CheckCircle2 className="w-4 h-4" style={{ color: '#16a34a' }} />
                                ) : (
                                  <Circle className="w-4 h-4" style={{ color: '#d4d4d4' }} />
                                )}
                              </div>
                              <div style={{ flex: 1 }}>
                                <span style={{ fontSize: 13, color: task.completed ? '#a3a3a3' : '#333', textDecoration: task.completed ? 'line-through' : 'none' }}>
                                  {task.task}
                                </span>
                                <span style={{
                                  display: 'inline-block', marginLeft: 8, fontSize: 10, fontWeight: 700,
                                  color: taskColor, background: `${taskColor}10`,
                                  padding: '1px 6px', borderRadius: 4, verticalAlign: 'middle',
                                }}>
                                  {task.category}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {weeklyTasks.length === 0 && (
        <div style={{ background: '#fff', borderRadius: 14, padding: 40, textAlign: 'center', border: '1px solid #e5e5e5' }}>
          <p style={{ color: '#737373', fontSize: 14 }}>No weekly tasks generated.</p>
        </div>
      )}
    </div>
  );
}

/* ============================================ */
/* HELPER FUNCTIONS                              */
/* ============================================ */
function formatDate(dateStr: string): string {
  if (!dateStr) return 'TBD';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}
