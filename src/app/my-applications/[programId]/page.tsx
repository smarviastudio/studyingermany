'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Loader2, ArrowLeft, CheckCircle2, Circle, Clock, AlertCircle,
  FileText, GraduationCap, Calendar, ExternalLink, Sparkles, ChevronRight
} from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';

const RED = '#dd0000';

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
  overview: string;
  estimatedTimeline: string;
  blockers: string[];
  steps: ApplicationStep[];
}

export default function ApplicationPlanPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const programId = params.programId as string;

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<ApplicationPlan | null>(null);
  const [programName, setProgramName] = useState('');
  const [university, setUniversity] = useState('');
  const [updatingStep, setUpdatingStep] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/my-applications');
      return;
    }

    if (status === 'authenticated' && programId) {
      fetchPlan();
    }
  }, [status, programId, router]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/programs/${programId}/application-plan`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch application plan');
      }

      const data = await response.json();
      if (data.plan) {
        setPlan(data.plan);
      }

      // Fetch program details from shortlist or applications
      const shortlistRes = await fetch('/api/shortlist');
      if (shortlistRes.ok) {
        const shortlistData = await shortlistRes.json();
        const program = shortlistData.items?.find((item: any) => item.programId === programId);
        if (program) {
          setProgramName(program.programName);
          setUniversity(program.university);
        }
      }

      // Fallback: fetch from application plans
      if (!programName) {
        const appsRes = await fetch('/api/application-plans');
        if (appsRes.ok) {
          const appsData = await appsRes.json();
          const app = appsData.plans?.find((p: any) => p.programId === programId);
          if (app) {
            setProgramName(app.programName);
            setUniversity(app.university);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load application plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = async (stepId: string, currentStatus: boolean) => {
    setUpdatingStep(stepId);
    try {
      const response = await fetch(`/api/programs/${programId}/application-plan`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, completed: !currentStatus }),
      });

      if (response.ok) {
        setPlan(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            steps: prev.steps.map(step =>
              step.id === stepId ? { ...step, completed: !currentStatus } : step
            ),
          };
        });
      }
    } catch (err) {
      console.error('Failed to update step:', err);
    } finally {
      setUpdatingStep(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        <SiteNav />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <Loader2 className="w-12 h-12 animate-spin" style={{ color: RED }} />
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        <SiteNav />
        <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <AlertCircle className="w-16 h-16" style={{ color: '#999', margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: 24, fontWeight: 600, color: '#111', marginBottom: 16 }}>No Application Plan Found</h2>
            <p style={{ fontSize: 16, color: '#737373', marginBottom: 24 }}>Create an application plan from your shortlist.</p>
            <Link href="/my-shortlist" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: RED, color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700 }}>
              Go to Shortlist
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const completedSteps = plan.steps.filter(s => s.completed).length;
  const totalSteps = plan.steps.length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <SiteNav />
      
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          <Link href="/my-applications" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#666', textDecoration: 'none', fontSize: 14, marginBottom: 16 }}>
            <ArrowLeft className="w-4 h-4" />
            Back to All Applications
          </Link>
          
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#0a0a0a', margin: '0 0 8px' }}>
              {programName || 'Application Plan'}
            </h1>
            <p style={{ fontSize: 16, color: '#737373', margin: 0 }}>{university}</p>
          </div>

          {/* Progress Overview */}
          <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, color: '#737373', marginBottom: 4 }}>Application Progress</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: progressPercent === 100 ? '#22c55e' : RED }}>
                  {progressPercent}%
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, color: '#737373', marginBottom: 4 }}>Timeline</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>{plan.estimatedTimeline}</div>
              </div>
            </div>
            
            <div style={{ height: 8, background: '#f5f5f5', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: progressPercent === 100 ? '#22c55e' : `linear-gradient(90deg, ${RED}, #7c3aed)`, borderRadius: 4, transition: 'width 0.3s ease' }} />
            </div>

            <div style={{ fontSize: 13, color: '#737373' }}>
              {completedSteps} of {totalSteps} steps completed
            </div>
          </div>
        </header>

        {/* Blockers */}
        {plan.blockers && plan.blockers.length > 0 && (
          <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, padding: 20, marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <AlertCircle className="w-5 h-5" style={{ color: '#dc2626' }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#dc2626', margin: 0 }}>Potential Blockers</h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#991b1b' }}>
              {plan.blockers.map((blocker, i) => (
                <li key={i} style={{ fontSize: 14, marginBottom: 6 }}>{blocker}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Overview */}
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24, marginBottom: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 12 }}>Overview</h3>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.6, margin: 0 }}>{plan.overview}</p>
        </div>

        {/* Steps */}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 20 }}>Application Steps</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {plan.steps.map((step, index) => (
              <div
                key={step.id}
                style={{
                  background: '#fff',
                  border: step.completed ? '2px solid #22c55e' : '1px solid #ebebeb',
                  borderRadius: 16,
                  padding: 20,
                  opacity: step.completed ? 0.7 : 1,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleStep(step.id, step.completed)}
                    disabled={updatingStep === step.id}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: step.completed ? '2px solid #22c55e' : '2px solid #d4d4d4',
                      background: step.completed ? '#22c55e' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {updatingStep === step.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" style={{ color: step.completed ? '#fff' : '#999' }} />
                    ) : step.completed ? (
                      <CheckCircle2 className="w-5 h-5" style={{ color: '#fff' }} />
                    ) : (
                      <Circle className="w-4 h-4" style={{ color: '#d4d4d4' }} />
                    )}
                  </button>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
                      <h4 style={{ fontSize: 16, fontWeight: 700, color: step.completed ? '#737373' : '#111', margin: 0, textDecoration: step.completed ? 'line-through' : 'none' }}>
                        {index + 1}. {step.title}
                      </h4>
                      {step.deadline && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 8, flexShrink: 0 }}>
                          <Calendar className="w-3.5 h-3.5" style={{ color: '#d97706' }} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#d97706' }}>{step.deadline}</span>
                        </div>
                      )}
                    </div>

                    <p style={{ fontSize: 14, color: '#555', lineHeight: 1.5, margin: '0 0 12px' }}>{step.description}</p>

                    {/* Action Button */}
                    {step.action && (
                      <Link
                        href={step.action.url}
                        target={step.action.type === 'external' ? '_blank' : undefined}
                        rel={step.action.type === 'external' ? 'noopener noreferrer' : undefined}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '8px 16px',
                          background: step.action.type === 'external' ? '#fff' : RED,
                          color: step.action.type === 'external' ? RED : '#fff',
                          border: step.action.type === 'external' ? `1px solid ${RED}` : 'none',
                          borderRadius: 10,
                          fontSize: 13,
                          fontWeight: 600,
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          if (step.action?.type === 'external') {
                            e.currentTarget.style.background = 'rgba(221,0,0,0.05)';
                          } else {
                            e.currentTarget.style.background = '#b91c1c';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (step.action?.type === 'external') {
                            e.currentTarget.style.background = '#fff';
                          } else {
                            e.currentTarget.style.background = RED;
                          }
                        }}
                      >
                        {step.action.type === 'cv' && <FileText className="w-4 h-4" />}
                        {step.action.type === 'letter' && <Sparkles className="w-4 h-4" />}
                        {step.action.type === 'document' && <FileText className="w-4 h-4" />}
                        {step.action.type === 'external' && <ExternalLink className="w-4 h-4" />}
                        {step.action.label}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        {progressPercent === 100 && (
          <div style={{ marginTop: 40, textAlign: 'center', padding: '32px 24px', background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.04))', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20 }}>
            <CheckCircle2 className="w-12 h-12" style={{ color: '#22c55e', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#16a34a', marginBottom: 8 }}>Application Complete!</h3>
            <p style={{ fontSize: 15, color: '#15803d', margin: 0 }}>You've completed all steps for this program. Good luck!</p>
          </div>
        )}
      </main>
    </div>
  );
}
