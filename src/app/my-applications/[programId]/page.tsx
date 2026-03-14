'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Loader2, ArrowLeft, CheckCircle2, Circle, Clock, AlertCircle,
  FileText, GraduationCap, Calendar, ExternalLink, Sparkles, ChevronRight,
  MapPin, Euro, Globe, Award, BookOpen, Zap, Target, TrendingUp
} from 'lucide-react';
import Image from 'next/image';
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
  const [programDetails, setProgramDetails] = useState<any>(null);
  const [generating, setGenerating] = useState(false);

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
      
      // Get program details from shortlist
      const shortlistRes = await fetch('/api/shortlist');
      if (shortlistRes.ok) {
        const shortlistData = await shortlistRes.json();
        const shortlistItem = shortlistData.shortlists?.find((item: any) => item.programId === programId);
        if (shortlistItem) {
          setProgramName(shortlistItem.programName);
          setUniversity(shortlistItem.university);
        }
      }
      
      // Fetch full program details
      const programRes = await fetch(`/api/programs/${programId}`);
      if (programRes.ok) {
        const programData = await programRes.json();
        setProgramDetails(programData.program);
      }
      
      // Try to fetch existing plan (don't auto-generate)
      const response = await fetch(`/api/programs/${programId}/application-plan`);
      if (response.ok) {
        const data = await response.json();
        if (data.plan) {
          setPlan(data.plan);
        }
      }
    } catch (err) {
      console.error('Failed to load application plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async () => {
    try {
      setGenerating(true);
      
      // Fetch user profile
      const profileRes = await fetch('/api/profile');
      let userProfile = null;
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        userProfile = profileData.profile;
      }
      
      // Generate plan
      const generateRes = await fetch(`/api/programs/${programId}/application-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ program: programDetails, userProfile }),
      });
      
      if (generateRes.ok) {
        const generatedData = await generateRes.json();
        setPlan(generatedData.plan);
      }
    } catch (err) {
      console.error('Failed to generate plan:', err);
    } finally {
      setGenerating(false);
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
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #fafafa, #fff)' }}>
        <SiteNav />
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
          {/* Header */}
          <Link href="/my-shortlist" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#666', textDecoration: 'none', fontSize: 14, marginBottom: 24 }}>
            <ArrowLeft className="w-4 h-4" />
            Back to Shortlist
          </Link>

          {/* Course Info Section */}
          {programDetails && (
            <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', border: '1px solid #e5e5e5', marginBottom: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              {/* Header with gradient */}
              <div style={{ position: 'relative', height: 200, background: 'linear-gradient(135deg, #dd0000 0%, #7c3aed 100%)', padding: 32 }}>
                {programDetails.image_url && (
                  <Image src={programDetails.image_url} alt={programName} fill style={{ objectFit: 'cover', opacity: 0.15 }} sizes="1200px" unoptimized />
                )}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 32, fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.2 }}>
                    {programName}
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
                    <GraduationCap className="w-5 h-5" />
                    <span>{university}</span>
                  </div>
                </div>
              </div>

              {/* Course Details Grid */}
              <div style={{ padding: 32 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 24 }}>
                  {programDetails.city && (
                    <div style={{ padding: 16, background: '#fafafa', borderRadius: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <MapPin className="w-4 h-4" style={{ color: RED }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</span>
                      </div>
                      <p style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>{programDetails.city}</p>
                    </div>
                  )}
                  {programDetails.degree_level && (
                    <div style={{ padding: 16, background: '#fafafa', borderRadius: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <Award className="w-4 h-4" style={{ color: RED }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Degree</span>
                      </div>
                      <p style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>{programDetails.degree_level}</p>
                    </div>
                  )}
                  {(programDetails.tuition_fee_number != null || programDetails.is_free) && (
                    <div style={{ padding: 16, background: '#fafafa', borderRadius: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <Euro className="w-4 h-4" style={{ color: RED }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tuition</span>
                      </div>
                      <p style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>
                        {programDetails.is_free ? 'Free' : `€${programDetails.tuition_fee_number?.toLocaleString()}`}
                      </p>
                    </div>
                  )}
                  {programDetails.languages_array && programDetails.languages_array.length > 0 && (
                    <div style={{ padding: 16, background: '#fafafa', borderRadius: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <Globe className="w-4 h-4" style={{ color: RED }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Language</span>
                      </div>
                      <p style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>{programDetails.languages_array[0]}</p>
                    </div>
                  )}
                </div>

                {programDetails.subject_area && (
                  <div style={{ padding: 16, background: 'rgba(221,0,0,0.05)', border: '1px solid rgba(221,0,0,0.1)', borderRadius: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <BookOpen className="w-4 h-4" style={{ color: RED }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: RED, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject Area</span>
                    </div>
                    <p style={{ fontSize: 15, color: '#555', margin: 0 }}>{programDetails.subject_area}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Generate Plan CTA */}
          <div style={{ background: 'linear-gradient(135deg, rgba(221,0,0,0.05), rgba(124,58,237,0.05))', border: '2px dashed #e5e5e5', borderRadius: 24, padding: '60px 32px', textAlign: 'center' }}>
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
              <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #dd0000, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', animation: 'pulse 2s infinite' }}>
                <Sparkles className="w-10 h-10" style={{ color: '#fff' }} />
              </div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 12 }}>Ready to Start Your Application?</h2>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.6, marginBottom: 32 }}>Generate a personalized AI-powered application plan tailored to this program's requirements and your profile.</p>
              
              <button
                onClick={generatePlan}
                disabled={generating}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 32px', background: 'linear-gradient(135deg, #dd0000, #b91c1c)', color: '#fff', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: generating ? 'not-allowed' : 'pointer', boxShadow: '0 8px 24px rgba(221,0,0,0.3)', transition: 'all 0.3s', opacity: generating ? 0.7 : 1 }}
                onMouseEnter={e => !generating && (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 12px 32px rgba(221,0,0,0.4)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'none', e.currentTarget.style.boxShadow = '0 8px 24px rgba(221,0,0,0.3)')}
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Your Plan...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate Application Plan
                  </>
                )}
              </button>

              <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Target className="w-4 h-4" style={{ color: '#22c55e' }} />
                  <span style={{ fontSize: 13, color: '#666' }}>Personalized Steps</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TrendingUp className="w-4 h-4" style={{ color: '#22c55e' }} />
                  <span style={{ fontSize: 13, color: '#666' }}>Timeline Tracking</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertCircle className="w-4 h-4" style={{ color: '#22c55e' }} />
                  <span style={{ fontSize: 13, color: '#666' }}>Blocker Detection</span>
                </div>
              </div>
            </div>
          </div>

          <style jsx global>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
          `}</style>
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
