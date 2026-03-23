'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import {
  Loader2, Calendar, AlertTriangle, ArrowRight,
  GraduationCap, Building2, CheckCircle2, Circle, Clock, Target
} from 'lucide-react';

interface ProgramPlan {
  id: string;
  programId: string;
  programName: string;
  university: string;
  planData: any;
  checklistState: any;
  createdAt: string;
  updatedAt: string;
}

interface TimelineEvent {
  date: string;
  event: string;
  programName: string;
  university: string;
  category: string;
  urgent?: boolean;
}

export default function MyApplicationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState<ProgramPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [shortlist, setShortlist] = useState<any[]>([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/my-applications');
      return;
    }
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plansRes, shortlistRes] = await Promise.all([
        fetch('/api/application-plans'),
        fetch('/api/shortlist')
      ]);
      
      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData.plans || []);
      }
      
      if (shortlistRes.ok) {
        const shortlistData = await shortlistRes.json();
        setShortlist(shortlistData.shortlist || []);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Compute aggregate stats across all plans
  let totalSteps = 0;
  let totalCompleted = 0;
  let totalCritical = 0;
  const allTimelineEvents: TimelineEvent[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const criticalStepsList: { step: any; programName: string; programId: string }[] = [];

  plans.forEach(plan => {
    const steps = plan.planData?.steps || [];
    const cl = plan.checklistState ? (typeof plan.checklistState === 'string' ? JSON.parse(plan.checklistState) : plan.checklistState) : {};
    steps.forEach((step: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      totalSteps++;
      if (cl[step.id] || step.autoCompleted) totalCompleted++;
      if (step.priority === 'high' && !cl[step.id] && !step.autoCompleted) {
        totalCritical++;
        criticalStepsList.push({ step, programName: plan.programName, programId: plan.programId });
      }
      if (step.deadline) {
        allTimelineEvents.push({
          date: step.deadline,
          event: step.title,
          programName: plan.programName,
          university: plan.university,
          category: step.category || 'general',
          urgent: step.priority === 'high'
        });
      }
    });
  });

  allTimelineEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const programsWithoutPlans = shortlist.filter(s => 
    !plans.some(p => p.programId === s.programId)
  );
  const overallProgress = totalSteps > 0 ? Math.round((totalCompleted / totalSteps) * 100) : 0;

  const deleteAllPlans = async () => {
    if (!confirm('Delete all application plans? You can recreate them anytime.')) return;
    try {
      setDeleting(true);
      const res = await fetch('/api/application-plans/delete-all', { method: 'DELETE' });
      if (res.ok) {
        setPlans([]);
        alert('All plans deleted successfully');
      }
    } catch (err) {
      console.error('Failed to delete plans:', err);
    } finally {
      setDeleting(false);
    }
  };

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
          <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, color: '#0a0a0a', margin: '0 0 6px' }}>
                My Applications
              </h1>
              <p style={{ fontSize: 15, color: '#737373', margin: 0 }}>
                Track your application progress and deadlines
              </p>
            </div>
            {plans.length > 0 && (
              <button
                onClick={deleteAllPlans}
                disabled={deleting}
                style={{
                  padding: '8px 16px', background: '#fff', border: '1px solid #e5e5e5',
                  borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#dc2626',
                  cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.5 : 1
                }}
              >
                {deleting ? 'Deleting...' : 'Reset All Plans'}
              </button>
            )}
          </div>

          {/* Overview Stats */}
          {plans.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
              <div style={{ background: '#fff', borderRadius: 14, padding: '18px 16px', border: '1px solid #e5e5e5', textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#dd0000' }}>{overallProgress}%</div>
                <div style={{ fontSize: 12, color: '#737373', fontWeight: 600, marginTop: 2 }}>Overall Progress</div>
                <div style={{ marginTop: 8, height: 5, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${overallProgress}%`, height: '100%', background: overallProgress === 100 ? '#22c55e' : '#dd0000', borderRadius: 3 }} />
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: 14, padding: '18px 16px', border: '1px solid #e5e5e5', textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#22c55e' }}>{totalCompleted}</div>
                <div style={{ fontSize: 12, color: '#737373', fontWeight: 600, marginTop: 2 }}>Steps Done</div>
                <div style={{ fontSize: 11, color: '#a3a3a3', marginTop: 4 }}>of {totalSteps} total</div>
              </div>
              <div style={{ background: '#fff', borderRadius: 14, padding: '18px 16px', border: '1px solid #e5e5e5', textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#dc2626' }}>{totalCritical}</div>
                <div style={{ fontSize: 12, color: '#737373', fontWeight: 600, marginTop: 2 }}>Critical Steps</div>
                <div style={{ fontSize: 11, color: '#a3a3a3', marginTop: 4 }}>high priority</div>
              </div>
              <div style={{ background: '#fff', borderRadius: 14, padding: '18px 16px', border: '1px solid #e5e5e5', textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#d97706' }}>{allTimelineEvents.length}</div>
                <div style={{ fontSize: 12, color: '#737373', fontWeight: 600, marginTop: 2 }}>Deadlines</div>
                <div style={{ fontSize: 11, color: '#a3a3a3', marginTop: 4 }}>tracked</div>
              </div>
            </div>
          )}

          {/* Critical Steps Alert */}
          {criticalStepsList.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 24, border: '1px solid #fecaca', borderLeft: '4px solid #dc2626' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <AlertTriangle className="w-5 h-5" style={{ color: '#dc2626' }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#dc2626', margin: 0 }}>Critical Steps Requiring Attention</h3>
              </div>
              <div style={{ display: 'grid', gap: 8 }}>
                {criticalStepsList.slice(0, 5).map((item, idx) => (
                  <Link key={idx} href={`/my-applications/${item.programId}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#fef2f2', borderRadius: 10, textDecoration: 'none' }}>
                    <Circle className="w-4 h-4" style={{ color: '#dc2626', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a' }}>{item.step.title}</div>
                      <div style={{ fontSize: 12, color: '#737373' }}>{item.programName}</div>
                    </div>
                    {item.step.deadline && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Clock className="w-3 h-3" /> {item.step.deadline}
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4" style={{ color: '#dc2626' }} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No shortlist warning */}
          {shortlist.length === 0 && (
            <div style={{ background: '#fef3f2', border: '1px solid #fecaca', borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
                <AlertTriangle className="w-5 h-5" style={{ color: '#dc2626', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#dc2626', margin: '0 0 6px' }}>
                    No programs shortlisted yet
                  </h3>
                  <p style={{ fontSize: 14, color: '#991b1b', margin: '0 0 12px' }}>
                    Shortlist programs to start creating application plans.
                  </p>
                  <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#dc2626', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                    <GraduationCap className="w-4 h-4" /> Browse Programs
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Overview */}
          {allTimelineEvents.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, marginBottom: 24, border: '1px solid #e5e5e5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Calendar className="w-5 h-5" style={{ color: '#dd0000' }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0a0a0a', margin: 0 }}>
                  Upcoming Deadlines
                </h3>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {allTimelineEvents.slice(0, 10).map((event, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 16, padding: 14, background: event.urgent ? '#fef2f2' : '#fafafa', borderRadius: 10, border: `1px solid ${event.urgent ? '#fecaca' : '#f0f0f0'}` }}>
                    <div style={{ minWidth: 80 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: event.urgent ? '#dc2626' : '#dd0000' }}>
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div style={{ fontSize: 11, color: '#737373' }}>
                        {new Date(event.date).getFullYear()}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a', marginBottom: 4 }}>
                        {event.event}
                      </div>
                      <div style={{ fontSize: 12, color: '#737373' }}>
                        {event.programName} • {event.university}
                      </div>
                    </div>
                    {event.urgent && (
                      <Clock className="w-4 h-4" style={{ color: '#dc2626', flexShrink: 0 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shortlisted Programs */}
          {shortlist.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e5e5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <GraduationCap className="w-5 h-5" style={{ color: '#dd0000' }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0a0a0a', margin: 0 }}>
                  Your Programs ({shortlist.length})
                </h3>
              </div>
              <div style={{ display: 'grid', gap: 16 }}>
                {shortlist.map((item: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                  const planObj = plans.find(p => p.programId === item.programId);
                  const hasPlan = !!planObj;
                  let pSteps = 0, pDone = 0, pProg = 0;
                  if (planObj) {
                    const st = planObj.planData?.steps || [];
                    const cl = planObj.checklistState ? (typeof planObj.checklistState === 'string' ? JSON.parse(planObj.checklistState) : planObj.checklistState) : {};
                    pSteps = st.length;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    pDone = st.filter((s: any) => cl[s.id] || s.autoCompleted).length;
                    pProg = pSteps > 0 ? Math.round((pDone / pSteps) * 100) : 0;
                  }
                  return (
                    <div key={item.id} style={{ padding: 20, background: '#fafafa', borderRadius: 12, border: '1px solid #f0f0f0' }}>
                      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 16 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#0a0a0a', marginBottom: 6 }}>
                            {item.programName}
                          </div>
                          <div style={{ fontSize: 13, color: '#737373', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                            <Building2 className="w-3.5 h-3.5" />
                            {item.university}
                          </div>
                          {hasPlan ? (
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                <div style={{ flex: 1, maxWidth: 160, height: 5, background: '#e5e5e5', borderRadius: 3, overflow: 'hidden' }}>
                                  <div style={{ width: `${pProg}%`, height: '100%', background: pProg === 100 ? '#22c55e' : '#dd0000', borderRadius: 3 }} />
                                </div>
                                <span style={{ fontSize: 12, fontWeight: 700, color: pProg === 100 ? '#22c55e' : '#dd0000' }}>{pProg}%</span>
                              </div>
                              <div style={{ fontSize: 12, color: '#737373' }}>{pDone} of {pSteps} steps done</div>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#737373' }}>
                              <Circle className="w-4 h-4" />
                              No application plan yet
                            </div>
                          )}
                        </div>
                        <Link
                          href={hasPlan ? `/my-applications/${item.programId}` : `/my-applications/${item.programId}?new=1`}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '10px 18px', background: hasPlan ? '#fff' : '#dd0000', color: hasPlan ? '#dd0000' : '#fff',
                            border: hasPlan ? '1px solid #dd0000' : 'none',
                            borderRadius: 10, fontSize: 14, fontWeight: 600,
                            textDecoration: 'none', whiteSpace: 'nowrap'
                          }}
                        >
                          {hasPlan ? 'View Plan' : 'Create Plan'}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Programs without plans */}
              {programsWithoutPlans.length > 0 && (
                <div style={{ marginTop: 24, padding: 16, background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Target className="w-4 h-4" style={{ color: '#f59e0b' }} />
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#92400e' }}>
                      {programsWithoutPlans.length} program{programsWithoutPlans.length > 1 ? 's' : ''} without application plan
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#78350f', margin: 0 }}>
                    Click "Create Plan" on each program to generate a personalized application roadmap.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
