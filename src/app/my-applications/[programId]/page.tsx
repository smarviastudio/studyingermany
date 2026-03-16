'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Loader2, ArrowLeft, CheckCircle2, Circle, AlertCircle,
  FileText, GraduationCap, Calendar, ExternalLink, Sparkles,
  MapPin, Euro, Globe, Award, BookOpen, Zap, Clock, ChevronDown, ChevronUp,
  X, FolderOpen, FileCheck, ClipboardList, ChevronRight, Info, TrendingUp,
  Shield, Wallet, Plane, Heart, RefreshCw, User, Target, Star
} from 'lucide-react';
import Image from 'next/image';
import { SiteNav } from '@/components/SiteNav';
import { CourseAssistantChat } from '@/components/CourseAssistantChat';
import { GermanPulseLoader } from '@/components/GermanPulseLoader';
import { CriticalRequirementsCard } from '@/components/CriticalRequirementsCard';

const RED = '#dd0000';

interface StepResource {
  name: string;
  url: string;
  description: string;
}

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
  category?: 'language' | 'documents' | 'application' | 'financial' | 'visa';
  resources?: StepResource[];
  action?: {
    type: 'cv' | 'letter' | 'document' | 'external' | 'info';
    label: string;
    url: string;
  };
}

interface CriticalRequirement {
  type: string;
  label: string;
  programRequirement: string;
  userProvided: string;
  status: 'met' | 'partial' | 'missing' | 'unknown';
  statusScore: number;
  notes: string;
  askUserQuestions?: string[];
}

interface ProfileMatch {
  score: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}

interface ApplicationPlan {
  criticalRequirements?: CriticalRequirement[];
  profileMatch?: ProfileMatch;
  overview: string;
  estimatedTimeline: string;
  blockers: string[];
  steps: ApplicationStep[];
}

interface UserProfile {
  fullName?: string;
  nationality?: string;
  germanLevel?: string;
  englishLevel?: string;
  ieltsScore?: number | null;
  toeflScore?: number | null;
  academicBackground?: string;
  backgroundSummary?: string;
  targetDegreeLevel?: string;
  hasScholarship?: boolean;
  maxTuitionEur?: number | null;
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
  const [showCourseDetails, setShowCourseDetails] = useState(true);
  const [docDrawerOpen, setDocDrawerOpen] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [stepInfoDrawer, setStepInfoDrawer] = useState<ApplicationStep | null>(null);

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
      
      // Fetch user profile
      const profileRes = await fetch('/api/profile');
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.profile) {
          setUserProfile(profileData.profile);
        }
      }
      
      const shortlistRes = await fetch('/api/shortlist');
      if (shortlistRes.ok) {
        const shortlistData = await shortlistRes.json();
        const shortlistItem = shortlistData.shortlists?.find((item: any) => item.programId === programId);
        if (shortlistItem) {
          setProgramName(shortlistItem.programName);
          setUniversity(shortlistItem.university);
        }
      }
      const programRes = await fetch(`/api/programs/${programId}`);
      if (programRes.ok) {
        const programData = await programRes.json();
        setProgramDetails(programData.program);
        if (!programName && programData.program?.program_name) {
          setProgramName(programData.program.program_name);
        }
        if (!university && programData.program?.university) {
          setUniversity(programData.program.university);
        }
      }
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
      // Use already fetched profile or fetch fresh
      let profileToUse = userProfile;
      if (!profileToUse) {
        const profileRes = await fetch('/api/profile');
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          profileToUse = profileData.profile;
          setUserProfile(profileData.profile);
        }
      }
      const generateRes = await fetch(`/api/programs/${programId}/application-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ program: programDetails, userProfile: profileToUse }),
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

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'language': return <Globe className="w-4 h-4" />;
      case 'documents': return <FileText className="w-4 h-4" />;
      case 'application': return <ClipboardList className="w-4 h-4" />;
      case 'financial': return <Wallet className="w-4 h-4" />;
      case 'visa': return <Plane className="w-4 h-4" />;
      default: return <FileCheck className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#6b7280';
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
      <div className="app-plan-page">
        <SiteNav />
        <div className="app-plan-loading">
          <GermanPulseLoader
            headline="Crafting your German-ready roadmap…"
            progressLabel="Syncing verified resources"
            subline="Personalizing requirements and milestones"
          />
        </div>
        <style jsx global>{styles}</style>
      </div>
    );
  }

  const toggleDoc = (docId: string) => {
    setCheckedDocs(prev => 
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const isDocumentStep = (title: string) => {
    return title.toLowerCase().includes('document') || title.toLowerCase().includes('gather');
  };

  const documentList = [
    { id: 'passport', label: 'Valid Passport', category: 'Personal' },
    { id: 'photo', label: 'Passport-sized Photos', category: 'Personal' },
    { id: 'diploma', label: 'High School Diploma / Bachelor Certificate', category: 'Academic' },
    { id: 'transcript', label: 'Academic Transcripts', category: 'Academic' },
    { id: 'language', label: 'Language Proficiency Certificate (IELTS/TOEFL/TestDaF)', category: 'Language' },
    { id: 'cv', label: 'Curriculum Vitae (CV)', category: 'Personal' },
    { id: 'motivation', label: 'Motivation Letter', category: 'Personal' },
    { id: 'recommendation', label: 'Letters of Recommendation', category: 'Academic' },
    { id: 'financial', label: 'Financial Proof / Blocked Account', category: 'Financial' },
    { id: 'insurance', label: 'Health Insurance Proof', category: 'Health' },
  ];
  const completedSteps = plan?.steps?.filter(s => s.completed).length || 0;
  const totalSteps = plan?.steps?.length || 0;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="app-plan-page">
      <SiteNav />
      
      <main className="app-plan-main">
        {/* Back Button */}
        <Link href="/my-shortlist" className="app-plan-back">
          <ArrowLeft className="w-4 h-4" />
          Back to Shortlist
        </Link>

        {/* Hero Section with Course Info */}
        <div className="app-plan-hero">
          <div className="app-plan-hero-bg">
            {programDetails?.image_url && (
              <Image 
                src={programDetails.image_url} 
                alt={programName} 
                fill 
                style={{ objectFit: 'cover', opacity: 0.15 }} 
                sizes="1400px" 
                unoptimized 
              />
            )}
            <div className="app-plan-hero-overlay" />
          </div>
          
          <div className="app-plan-hero-content">
            <div className="app-plan-hero-badges">
              {programDetails?.degree_level && (
                <span className="app-plan-badge app-plan-badge-white">
                  <Award className="w-3.5 h-3.5" />
                  {programDetails.degree_level}
                </span>
              )}
              {programDetails?.is_free && (
                <span className="app-plan-badge app-plan-badge-green">
                  <Euro className="w-3.5 h-3.5" />
                  No Tuition
                </span>
              )}
            </div>
            
            <h1 className="app-plan-title">{programName || 'Your Application'}</h1>
            
            <div className="app-plan-university">
              <GraduationCap className="w-5 h-5" />
              <span>{university}</span>
              {programDetails?.city && (
                <>
                  <span className="app-plan-dot">•</span>
                  <MapPin className="w-4 h-4" />
                  <span>{programDetails.city}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Course Details Expandable */}
        {programDetails && (
          <div className="app-plan-details-card">
            <button 
              className="app-plan-details-toggle"
              onClick={() => setShowCourseDetails(!showCourseDetails)}
            >
              <div className="app-plan-details-toggle-left">
                <BookOpen className="w-5 h-5" />
                <span>Course Details</span>
              </div>
              {showCourseDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {showCourseDetails && (
              <div className="app-plan-details-grid">
                {programDetails.city && (
                  <div className="app-plan-detail-item">
                    <MapPin className="w-4 h-4" />
                    <div>
                      <span className="app-plan-detail-label">Location</span>
                      <span className="app-plan-detail-value">{programDetails.city}</span>
                    </div>
                  </div>
                )}
                {programDetails.degree_level && (
                  <div className="app-plan-detail-item">
                    <Award className="w-4 h-4" />
                    <div>
                      <span className="app-plan-detail-label">Degree</span>
                      <span className="app-plan-detail-value">{programDetails.degree_level}</span>
                    </div>
                  </div>
                )}
                {(programDetails.tuition_fee_number != null || programDetails.is_free) && (
                  <div className="app-plan-detail-item">
                    <Euro className="w-4 h-4" />
                    <div>
                      <span className="app-plan-detail-label">Tuition</span>
                      <span className="app-plan-detail-value">
                        {programDetails.is_free ? 'Free' : `€${programDetails.tuition_fee_number?.toLocaleString()}/semester`}
                      </span>
                    </div>
                  </div>
                )}
                {programDetails.languages_array?.length > 0 && (
                  <div className="app-plan-detail-item">
                    <Globe className="w-4 h-4" />
                    <div>
                      <span className="app-plan-detail-label">Language</span>
                      <span className="app-plan-detail-value">{programDetails.languages_array.join(', ')}</span>
                    </div>
                  </div>
                )}
                {programDetails.programme_duration && (
                  <div className="app-plan-detail-item">
                    <Clock className="w-4 h-4" />
                    <div>
                      <span className="app-plan-detail-label">Duration</span>
                      <span className="app-plan-detail-value">{programDetails.programme_duration}</span>
                    </div>
                  </div>
                )}
                {programDetails.subject_area && (
                  <div className="app-plan-detail-item app-plan-detail-full">
                    <BookOpen className="w-4 h-4" />
                    <div>
                      <span className="app-plan-detail-label">Subject Area</span>
                      <span className="app-plan-detail-value">{programDetails.subject_area}</span>
                    </div>
                  </div>
                )}
                {programDetails.detail_url && (
                  <a 
                    href={programDetails.detail_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="app-plan-daad-link"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on DAAD
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Main Content Area */}
        <div className="app-plan-content">
          {!plan ? (
            /* No Plan - Generate CTA */
            <div className="app-plan-generate">
              <div className="app-plan-generate-icon">
                <Sparkles className="w-12 h-12" />
              </div>
              <h2>Ready to Start Your Application?</h2>
              <p>Generate a personalized AI-powered application plan tailored to this program's requirements and your profile.</p>
              
              <button
                onClick={generatePlan}
                disabled={generating}
                className="app-plan-generate-btn"
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

              <div className="app-plan-features">
                <div className="app-plan-feature">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Personalized Steps</span>
                </div>
                <div className="app-plan-feature">
                  <Clock className="w-5 h-5" />
                  <span>Timeline Tracking</span>
                </div>
                <div className="app-plan-feature">
                  <AlertCircle className="w-5 h-5" />
                  <span>Blocker Detection</span>
                </div>
              </div>
            </div>
          ) : (
            /* Has Plan - Show Progress and Steps */
            <>
              {/* Critical Requirements Card */}
              {plan.criticalRequirements && plan.criticalRequirements.length > 0 && (
                <CriticalRequirementsCard 
                  requirements={plan.criticalRequirements}
                  onAnswerQuestion={(type, answers) => {
                    // TODO: Handle updating profile with answers
                    console.log('Answer questions for', type, answers);
                  }}
                />
              )}

              {/* AI Profile Match Summary */}
              {plan.profileMatch && (
                <div className="app-plan-ai-summary">
                  <div className="app-plan-ai-summary-header">
                    <div className="app-plan-ai-icon">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3>AI Profile Analysis</h3>
                      <span>How your profile matches this program</span>
                    </div>
                    <div className="app-plan-match-score" style={{ 
                      background: plan.profileMatch.score >= 80 ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 
                                  plan.profileMatch.score >= 60 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 
                                  'linear-gradient(135deg, #ef4444, #dc2626)'
                    }}>
                      <span className="score-value">{plan.profileMatch.score}%</span>
                      <span className="score-label">Match</span>
                    </div>
                  </div>
                  
                  <p className="app-plan-ai-summary-text">{plan.profileMatch.summary}</p>
                  
                  <div className="app-plan-ai-grid">
                    {plan.profileMatch.strengths?.length > 0 && (
                      <div className="app-plan-ai-section app-plan-ai-strengths">
                        <h4><CheckCircle2 className="w-4 h-4" /> Your Strengths</h4>
                        <ul>
                          {plan.profileMatch.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {plan.profileMatch.gaps?.length > 0 && (
                      <div className="app-plan-ai-section app-plan-ai-gaps">
                        <h4><AlertCircle className="w-4 h-4" /> Areas to Address</h4>
                        <ul>
                          {plan.profileMatch.gaps.map((g, i) => (
                            <li key={i}>{g}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {plan.profileMatch.recommendations?.length > 0 && (
                    <div className="app-plan-ai-recommendations">
                      <h4><Target className="w-4 h-4" /> Recommendations</h4>
                      <ul>
                        {plan.profileMatch.recommendations.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Progress Card */}
              <div className="app-plan-progress-card">
                <div className="app-plan-progress-header">
                  <div>
                    <span className="app-plan-progress-label">Application Progress</span>
                    <div className="app-plan-progress-percent" style={{ color: progressPercent === 100 ? '#22c55e' : RED }}>
                      {progressPercent}%
                    </div>
                  </div>
                  <div className="app-plan-progress-right">
                    <span className="app-plan-progress-label">Timeline</span>
                    <div className="app-plan-progress-timeline">{plan.estimatedTimeline}</div>
                  </div>
                </div>
                
                <div className="app-plan-progress-bar">
                  <div 
                    className="app-plan-progress-fill" 
                    style={{ 
                      width: `${progressPercent}%`,
                      background: progressPercent === 100 ? '#22c55e' : `linear-gradient(90deg, ${RED}, #7c3aed)`
                    }} 
                  />
                </div>
                
                <div className="app-plan-progress-steps">
                  {completedSteps} of {totalSteps} steps completed
                </div>
              </div>

              {/* Blockers */}
              {plan.blockers?.length > 0 && (
                <div className="app-plan-blockers">
                  <div className="app-plan-blockers-header">
                    <AlertCircle className="w-5 h-5" />
                    <h3>Potential Blockers</h3>
                  </div>
                  <ul>
                    {plan.blockers.map((blocker, i) => (
                      <li key={i}>{blocker}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Overview */}
              <div className="app-plan-overview">
                <h3>Overview</h3>
                <p>{plan.overview}</p>
              </div>

              {/* Steps */}
              <div className="app-plan-steps">
                <h2>Application Steps</h2>
                <div className="app-plan-steps-list">
                  {plan.steps.map((step, index) => (
                    <div 
                      key={step.id} 
                      className={`app-plan-step ${step.completed || step.autoCompleted ? 'app-plan-step-done' : ''} ${step.autoCompleted ? 'app-plan-step-auto' : ''}`}
                    >
                      <button
                        onClick={() => !step.autoCompleted && toggleStep(step.id, step.completed)}
                        disabled={updatingStep === step.id || step.autoCompleted}
                        className="app-plan-step-check"
                        title={step.autoCompleted ? 'Auto-completed based on your profile' : 'Mark as complete'}
                      >
                        {updatingStep === step.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : step.completed || step.autoCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                      
                      <div className="app-plan-step-content">
                        <div className="app-plan-step-header">
                          <div className="app-plan-step-title-row">
                            <span className="app-plan-step-category" style={{ color: getPriorityColor(step.priority) }}>
                              {getCategoryIcon(step.category)}
                            </span>
                            <h4>{index + 1}. {step.title}</h4>
                            {step.priority && (
                              <span className="app-plan-step-priority" style={{ 
                                background: `${getPriorityColor(step.priority)}15`,
                                color: getPriorityColor(step.priority),
                                borderColor: getPriorityColor(step.priority)
                              }}>
                                {step.priority}
                              </span>
                            )}
                          </div>
                          {step.deadline && (
                            <span className="app-plan-step-deadline">
                              <Calendar className="w-3.5 h-3.5" />
                              {step.deadline}
                            </span>
                          )}
                        </div>
                        
                        {step.autoCompleted && step.autoCompletedReason && (
                          <div className="app-plan-step-auto-badge">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Auto-verified: {step.autoCompletedReason}</span>
                          </div>
                        )}
                        
                        <p>{step.description}</p>
                        
                        {/* Detailed Info Toggle */}
                        {step.detailedInfo && (
                          <button 
                            className="app-plan-step-info-toggle"
                            onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                          >
                            <Info className="w-4 h-4" />
                            {expandedStep === step.id ? 'Hide details' : 'Learn more about this step'}
                            <ChevronDown className={`w-4 h-4 transition-transform ${expandedStep === step.id ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                        
                        {expandedStep === step.id && step.detailedInfo && (
                          <div className="app-plan-step-detailed">
                            <p>{step.detailedInfo}</p>
                          </div>
                        )}
                        
                        {/* Resources */}
                        {step.resources && step.resources.length > 0 && (
                          <div className="app-plan-step-resources">
                            <span className="app-plan-step-resources-label">Helpful Resources:</span>
                            <div className="app-plan-step-resources-list">
                              {step.resources.map((resource, ri) => (
                                <a 
                                  key={ri}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="app-plan-step-resource"
                                  title={resource.description}
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  {resource.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Document List for Document Gathering step */}
                        {isDocumentStep(step.title) && (
                          <div className="app-plan-doc-preview">
                            <div className="app-plan-doc-preview-header">
                              <FolderOpen className="w-4 h-4" />
                              <span>Required Documents ({documentList.length} items)</span>
                            </div>
                            <div className="app-plan-doc-preview-list">
                              {documentList.slice(0, 4).map(doc => (
                                <div key={doc.id} className="app-plan-doc-preview-item">
                                  {checkedDocs.includes(doc.id) ? (
                                    <CheckCircle2 className="w-4 h-4" style={{ color: '#22c55e' }} />
                                  ) : (
                                    <FileText className="w-4 h-4" style={{ color: '#999' }} />
                                  )}
                                  <span className={checkedDocs.includes(doc.id) ? 'checked' : ''}>{doc.label}</span>
                                </div>
                              ))}
                              {documentList.length > 4 && (
                                <div className="app-plan-doc-preview-more">
                                  +{documentList.length - 4} more
                                </div>
                              )}
                            </div>
                            <button 
                              className="app-plan-doc-preview-btn"
                              onClick={() => setDocDrawerOpen(true)}
                            >
                              <ClipboardList className="w-4 h-4" />
                              Open Document Checklist
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        
                        {step.action && (
                          <Link
                            href={step.action.url}
                            target={step.action.type === 'external' ? '_blank' : undefined}
                            rel={step.action.type === 'external' ? 'noopener noreferrer' : undefined}
                            className={`app-plan-step-action ${step.action.type === 'external' ? 'app-plan-step-action-outline' : ''}`}
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
                  ))}
                </div>
              </div>

              {/* Completion */}
              {progressPercent === 100 && (
                <div className="app-plan-complete">
                  <CheckCircle2 className="w-16 h-16" />
                  <h3>Application Complete!</h3>
                  <p>You've completed all steps for this program. Good luck!</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* AI Course Assistant Chatbot */}
      {plan && programDetails && (
        <CourseAssistantChat 
          programId={programId}
          programContext={programDetails}
          userProfile={userProfile}
        />
      )}

      {/* Document Drawer */}
      {docDrawerOpen && (
        <div className="app-plan-drawer-overlay" onClick={() => setDocDrawerOpen(false)}>
          <div className="app-plan-drawer" onClick={e => e.stopPropagation()}>
            <div className="app-plan-drawer-header">
              <div className="app-plan-drawer-title">
                <ClipboardList className="w-5 h-5" />
                <h3>Required Documents</h3>
                <span className="app-plan-drawer-count">{checkedDocs.length}/{documentList.length} completed</span>
              </div>
              <button 
                className="app-plan-drawer-close"
                onClick={() => setDocDrawerOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="app-plan-drawer-content">
              <p className="app-plan-drawer-desc">
                Check off documents as you gather them. These are typically required for German university applications.
              </p>
              
              <div className="app-plan-drawer-progress">
                <div className="app-plan-drawer-progress-bar">
                  <div 
                    className="app-plan-drawer-progress-fill"
                    style={{ width: `${(checkedDocs.length / documentList.length) * 100}%` }}
                  />
                </div>
                <span>{Math.round((checkedDocs.length / documentList.length) * 100)}%</span>
              </div>
              
              <div className="app-plan-doc-list">
                {documentList.map(doc => (
                  <label 
                    key={doc.id} 
                    className={`app-plan-doc-item ${checkedDocs.includes(doc.id) ? 'checked' : ''}`}
                  >
                    <div className="app-plan-doc-checkbox">
                      {checkedDocs.includes(doc.id) ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={checkedDocs.includes(doc.id)}
                      onChange={() => toggleDoc(doc.id)}
                    />
                    <div className="app-plan-doc-info">
                      <span className="app-plan-doc-name">{doc.label}</span>
                      <span className="app-plan-doc-category">{doc.category}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="app-plan-drawer-footer">
              <button 
                className="app-plan-drawer-done"
                onClick={() => setDocDrawerOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{styles}</style>
    </div>
  );
}

const styles = `
  .app-plan-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #fafafa 0%, #fff 100%);
  }
  
  .app-plan-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 70vh;
  }
  
  
  .app-plan-main {
    max-width: 1000px;
    margin: 0 auto;
    padding: 32px 24px 100px;
  }
  
  .app-plan-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #666;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 24px;
    transition: color 0.2s;
  }
  
  .app-plan-back:hover {
    color: ${RED};
  }
  
  /* Hero Section */
  .app-plan-hero {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    margin-bottom: 24px;
  }
  
  .app-plan-hero-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, ${RED} 0%, #7c3aed 100%);
  }
  
  .app-plan-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
  }
  
  .app-plan-hero-content {
    position: relative;
    z-index: 1;
    padding: 48px 32px;
  }
  
  .app-plan-hero-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
  }
  
  .app-plan-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .app-plan-badge-white {
    background: rgba(255,255,255,0.95);
    color: ${RED};
  }
  
  .app-plan-badge-green {
    background: #22c55e;
    color: #fff;
  }
  
  .app-plan-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 800;
    color: #fff;
    margin: 0 0 12px;
    line-height: 1.2;
    text-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  
  .app-plan-university {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    color: rgba(255,255,255,0.9);
    font-size: 16px;
  }
  
  .app-plan-dot {
    opacity: 0.5;
  }
  
  /* Course Details Card */
  .app-plan-details-card {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  
  .app-plan-details-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    color: #333;
  }
  
  .app-plan-details-toggle-left {
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${RED};
  }
  
  .app-plan-details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    padding: 0 20px 20px;
    border-top: 1px solid #f0f0f0;
    padding-top: 16px;
  }
  
  .app-plan-detail-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    color: ${RED};
  }
  
  .app-plan-detail-item > div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .app-plan-detail-label {
    font-size: 11px;
    font-weight: 600;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .app-plan-detail-value {
    font-size: 14px;
    font-weight: 600;
    color: #111;
  }
  
  .app-plan-detail-full {
    grid-column: 1 / -1;
  }
  
  .app-plan-daad-link {
    grid-column: 1 / -1;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: ${RED};
    color: #fff;
    border-radius: 10px;
    text-decoration: none;
    font-size: 13px;
    font-weight: 600;
    width: fit-content;
    transition: all 0.2s;
  }
  
  .app-plan-daad-link:hover {
    background: #b91c1c;
    transform: translateY(-1px);
  }
  
  /* Generate CTA */
  .app-plan-generate {
    background: linear-gradient(135deg, rgba(221,0,0,0.03), rgba(124,58,237,0.03));
    border: 2px dashed #e0e0e0;
    border-radius: 24px;
    padding: 60px 32px;
    text-align: center;
  }
  
  .app-plan-generate-icon {
    width: 100px;
    height: 100px;
    border-radius: 24px;
    background: linear-gradient(135deg, ${RED}, #7c3aed);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 28px;
    color: #fff;
    animation: pulse 2s infinite;
    box-shadow: 0 8px 32px rgba(221,0,0,0.25);
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  .app-plan-generate h2 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #111;
    margin: 0 0 12px;
  }
  
  .app-plan-generate > p {
    font-size: 16px;
    color: #666;
    line-height: 1.6;
    max-width: 500px;
    margin: 0 auto 32px;
  }
  
  .app-plan-generate-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 18px 36px;
    background: linear-gradient(135deg, ${RED}, #b91c1c);
    color: #fff;
    border: none;
    border-radius: 14px;
    font-size: 17px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 28px rgba(221,0,0,0.35);
    transition: all 0.3s;
  }
  
  .app-plan-generate-btn:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 12px 36px rgba(221,0,0,0.4);
  }
  
  .app-plan-generate-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .app-plan-features {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 24px;
    margin-top: 36px;
  }
  
  .app-plan-feature {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #22c55e;
    font-size: 14px;
    font-weight: 500;
  }
  
  .app-plan-feature span {
    color: #555;
  }
  
  /* AI Profile Match Summary */
  .app-plan-ai-summary {
    background: linear-gradient(135deg, rgba(221,0,0,0.03), rgba(124,58,237,0.03));
    border: 1px solid rgba(221,0,0,0.15);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 24px;
  }
  
  .app-plan-ai-summary-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 16px;
  }
  
  .app-plan-ai-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: linear-gradient(135deg, ${RED}, #7c3aed);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
  }
  
  .app-plan-ai-summary-header > div:nth-child(2) {
    flex: 1;
  }
  
  .app-plan-ai-summary-header h3 {
    font-size: 18px;
    font-weight: 700;
    color: #111;
    margin: 0 0 4px;
  }
  
  .app-plan-ai-summary-header span {
    font-size: 13px;
    color: #666;
  }
  
  .app-plan-match-score {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    border-radius: 16px;
    color: #fff;
    flex-shrink: 0;
  }
  
  .app-plan-match-score .score-value {
    font-size: 24px;
    font-weight: 800;
    line-height: 1;
  }
  
  .app-plan-match-score .score-label {
    font-size: 11px;
    font-weight: 600;
    opacity: 0.9;
    margin-top: 2px;
  }
  
  .app-plan-ai-summary-text {
    font-size: 15px;
    color: #444;
    line-height: 1.6;
    margin: 0 0 20px;
    padding: 16px;
    background: rgba(255,255,255,0.7);
    border-radius: 12px;
  }
  
  .app-plan-ai-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
  }
  
  .app-plan-ai-section {
    padding: 16px;
    border-radius: 12px;
  }
  
  .app-plan-ai-strengths {
    background: rgba(34,197,94,0.08);
    border: 1px solid rgba(34,197,94,0.2);
  }
  
  .app-plan-ai-gaps {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
  }
  
  .app-plan-ai-section h4 {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 700;
    margin: 0 0 12px;
  }
  
  .app-plan-ai-strengths h4 {
    color: #16a34a;
  }
  
  .app-plan-ai-gaps h4 {
    color: #dc2626;
  }
  
  .app-plan-ai-section ul {
    margin: 0;
    padding-left: 18px;
    font-size: 13px;
    line-height: 1.6;
  }
  
  .app-plan-ai-strengths ul {
    color: #15803d;
  }
  
  .app-plan-ai-gaps ul {
    color: #991b1b;
  }
  
  .app-plan-ai-section li {
    margin-bottom: 6px;
  }
  
  .app-plan-ai-recommendations {
    padding: 16px;
    background: rgba(59,130,246,0.08);
    border: 1px solid rgba(59,130,246,0.2);
    border-radius: 12px;
  }
  
  .app-plan-ai-recommendations h4 {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 700;
    color: #1d4ed8;
    margin: 0 0 12px;
  }
  
  .app-plan-ai-recommendations ul {
    margin: 0;
    padding-left: 18px;
    font-size: 13px;
    line-height: 1.6;
    color: #1e40af;
  }
  
  .app-plan-ai-recommendations li {
    margin-bottom: 6px;
  }

  /* Progress Card */
  .app-plan-progress-card {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  }
  
  .app-plan-progress-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }
  
  .app-plan-progress-label {
    font-size: 13px;
    color: #737373;
    display: block;
    margin-bottom: 4px;
  }
  
  .app-plan-progress-percent {
    font-size: 36px;
    font-weight: 800;
    line-height: 1;
  }
  
  .app-plan-progress-right {
    text-align: right;
  }
  
  .app-plan-progress-timeline {
    font-size: 18px;
    font-weight: 700;
    color: #111;
  }
  
  .app-plan-progress-bar {
    height: 10px;
    background: #f0f0f0;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 12px;
  }
  
  .app-plan-progress-fill {
    height: 100%;
    border-radius: 5px;
    transition: width 0.4s ease;
  }
  
  .app-plan-progress-steps {
    font-size: 13px;
    color: #737373;
  }
  
  /* Blockers */
  .app-plan-blockers {
    background: rgba(239,68,68,0.05);
    border: 1px solid rgba(239,68,68,0.15);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 24px;
  }
  
  .app-plan-blockers-header {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #dc2626;
    margin-bottom: 12px;
  }
  
  .app-plan-blockers-header h3 {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
  }
  
  .app-plan-blockers ul {
    margin: 0;
    padding-left: 20px;
    color: #991b1b;
  }
  
  .app-plan-blockers li {
    font-size: 14px;
    margin-bottom: 6px;
  }
  
  /* Overview */
  .app-plan-overview {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 32px;
  }
  
  .app-plan-overview h3 {
    font-size: 18px;
    font-weight: 700;
    color: #111;
    margin: 0 0 12px;
  }
  
  .app-plan-overview p {
    font-size: 15px;
    color: #555;
    line-height: 1.6;
    margin: 0;
  }
  
  /* Steps */
  .app-plan-steps h2 {
    font-size: 20px;
    font-weight: 700;
    color: #111;
    margin: 0 0 20px;
  }
  
  .app-plan-steps-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .app-plan-step {
    display: flex;
    gap: 16px;
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 16px;
    padding: 20px;
    transition: all 0.2s;
  }
  
  .app-plan-step:hover {
    border-color: #d0d0d0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  }
  
  .app-plan-step-done {
    border-color: #22c55e;
    background: rgba(34,197,94,0.02);
  }
  
  .app-plan-step-auto {
    border-color: #3b82f6;
    background: rgba(59,130,246,0.02);
  }
  
  .app-plan-step-auto .app-plan-step-check {
    border-color: #3b82f6;
    background: #3b82f6;
    color: #fff;
    cursor: default;
  }
  
  .app-plan-step-check {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #d4d4d4;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    color: #d4d4d4;
    transition: all 0.2s;
  }
  
  .app-plan-step-done .app-plan-step-check {
    border-color: #22c55e;
    background: #22c55e;
    color: #fff;
  }
  
  .app-plan-step-content {
    flex: 1;
  }
  
  .app-plan-step-header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
  }
  
  .app-plan-step-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  
  .app-plan-step-category {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .app-plan-step-header h4 {
    font-size: 16px;
    font-weight: 700;
    color: #111;
    margin: 0;
  }
  
  .app-plan-step-priority {
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: 1px solid;
  }
  
  .app-plan-step-done .app-plan-step-header h4 {
    color: #737373;
    text-decoration: line-through;
  }
  
  .app-plan-step-auto-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(59,130,246,0.1);
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    color: #1d4ed8;
    margin-bottom: 10px;
  }
  
  .app-plan-step-deadline {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background: #fef3c7;
    border: 1px solid #fbbf24;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    color: #d97706;
  }
  
  .app-plan-step-info-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: #f5f5f5;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #555;
    cursor: pointer;
    margin: 10px 0;
    transition: all 0.2s;
  }
  
  .app-plan-step-info-toggle:hover {
    background: #eee;
    border-color: #d0d0d0;
    color: #333;
  }
  
  .app-plan-step-detailed {
    padding: 16px;
    background: #fafafa;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    margin: 12px 0;
  }
  
  .app-plan-step-detailed p {
    font-size: 14px;
    color: #444;
    line-height: 1.7;
    margin: 0;
  }
  
  .app-plan-step-resources {
    margin: 12px 0;
  }
  
  .app-plan-step-resources-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #666;
    margin-bottom: 8px;
  }
  
  .app-plan-step-resources-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .app-plan-step-resource {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    color: #555;
    text-decoration: none;
    transition: all 0.2s;
  }
  
  .app-plan-step-resource:hover {
    border-color: ${RED};
    color: ${RED};
    background: rgba(221,0,0,0.03);
  }
  
  .app-plan-step-content > p {
    font-size: 14px;
    color: #555;
    line-height: 1.5;
    margin: 0 0 12px;
  }
  
  .app-plan-step-action {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: ${RED};
    color: #fff;
    border-radius: 10px;
    text-decoration: none;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s;
  }
  
  .app-plan-step-action:hover {
    background: #b91c1c;
    transform: translateY(-1px);
  }
  
  .app-plan-step-action-outline {
    background: #fff;
    color: ${RED};
    border: 1px solid ${RED};
  }
  
  .app-plan-step-action-outline:hover {
    background: rgba(221,0,0,0.05);
  }
  
  /* Document Preview in Step */
  .app-plan-doc-preview {
    background: #fafafa;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 16px;
    margin: 12px 0;
  }
  
  .app-plan-doc-preview-header {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #dd0000;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  .app-plan-doc-preview-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
  }
  
  .app-plan-doc-preview-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #555;
  }
  
  .app-plan-doc-preview-item .checked {
    text-decoration: line-through;
    color: #22c55e;
  }
  
  .app-plan-doc-preview-more {
    font-size: 12px;
    color: #999;
    padding-left: 24px;
    font-style: italic;
  }
  
  .app-plan-doc-preview-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    background: #dd0000;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .app-plan-doc-preview-btn:hover {
    background: #b91c1c;
    transform: translateY(-1px);
  }
  
  /* Document Drawer */
  .app-plan-drawer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .app-plan-drawer {
    width: 100%;
    max-width: 480px;
    height: 100%;
    max-height: 90vh;
    background: #fff;
    border-radius: 24px 24px 0 0;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s ease;
    box-shadow: 0 -8px 32px rgba(0,0,0,0.15);
  }
  
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  
  .app-plan-drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .app-plan-drawer-title {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #dd0000;
  }
  
  .app-plan-drawer-title h3 {
    font-size: 18px;
    font-weight: 700;
    color: #111;
    margin: 0;
  }
  
  .app-plan-drawer-count {
    font-size: 12px;
    color: #22c55e;
    font-weight: 600;
    background: rgba(34,197,94,0.1);
    padding: 4px 10px;
    border-radius: 12px;
  }
  
  .app-plan-drawer-close {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: none;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #666;
    transition: all 0.2s;
  }
  
  .app-plan-drawer-close:hover {
    background: #e5e5e5;
    color: #111;
  }
  
  .app-plan-drawer-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
  }
  
  .app-plan-drawer-desc {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
    margin: 0 0 16px;
  }
  
  .app-plan-drawer-progress {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }
  
  .app-plan-drawer-progress-bar {
    flex: 1;
    height: 8px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .app-plan-drawer-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #dd0000, #7c3aed);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  
  .app-plan-drawer-progress span {
    font-size: 14px;
    font-weight: 700;
    color: #111;
    min-width: 40px;
    text-align: right;
  }
  
  .app-plan-doc-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .app-plan-doc-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: #fafafa;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .app-plan-doc-item:hover {
    background: #f5f5f5;
    border-color: #d0d0d0;
  }
  
  .app-plan-doc-item.checked {
    background: rgba(34,197,94,0.05);
    border-color: #22c55e;
  }
  
  .app-plan-doc-item input[type="checkbox"] {
    display: none;
  }
  
  .app-plan-doc-checkbox {
    color: #d4d4d4;
    flex-shrink: 0;
  }
  
  .app-plan-doc-item.checked .app-plan-doc-checkbox {
    color: #22c55e;
  }
  
  .app-plan-doc-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .app-plan-doc-name {
    font-size: 14px;
    font-weight: 600;
    color: #111;
  }
  
  .app-plan-doc-item.checked .app-plan-doc-name {
    text-decoration: line-through;
    color: #22c55e;
  }
  
  .app-plan-doc-category {
    font-size: 12px;
    color: #999;
  }
  
  .app-plan-drawer-footer {
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;
  }
  
  .app-plan-drawer-done {
    width: 100%;
    padding: 14px 24px;
    background: #dd0000;
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .app-plan-drawer-done:hover {
    background: #b91c1c;
    transform: translateY(-1px);
  }
  
  @media (min-width: 769px) {
    .app-plan-drawer-overlay {
      align-items: center;
      justify-content: center;
      padding: 40px;
    }
    
    .app-plan-drawer {
      max-height: 85vh;
      border-radius: 24px;
      animation: fadeIn 0.2s ease;
    }
  }
  
  /* Complete */
  .app-plan-complete {
    text-align: center;
    padding: 48px 24px;
    background: linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02));
    border: 1px solid rgba(34,197,94,0.2);
    border-radius: 24px;
    margin-top: 40px;
    color: #22c55e;
  }
  
  .app-plan-complete h3 {
    font-size: 24px;
    font-weight: 700;
    color: #16a34a;
    margin: 16px 0 8px;
  }
  
  .app-plan-complete p {
    font-size: 16px;
    color: #15803d;
    margin: 0;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .app-plan-main {
      padding: 24px 16px 100px;
    }
    
    .app-plan-hero-content {
      padding: 32px 20px;
    }
    
    .app-plan-title {
      font-size: 24px;
    }
    
    .app-plan-details-grid {
      grid-template-columns: 1fr 1fr;
    }
    
    .app-plan-generate {
      padding: 40px 20px;
    }
    
    .app-plan-generate h2 {
      font-size: 22px;
    }
    
    .app-plan-generate-btn {
      width: 100%;
      justify-content: center;
    }
    
    .app-plan-features {
      flex-direction: column;
      align-items: center;
    }
    
    .app-plan-progress-header {
      flex-direction: column;
      gap: 16px;
    }
    
    .app-plan-progress-right {
      text-align: left;
    }
    
    .app-plan-step {
      flex-direction: column;
      gap: 12px;
    }
    
    .app-plan-step-header {
      flex-direction: column;
    }
  }
`;
