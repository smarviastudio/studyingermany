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

const sanitizeUserProfilePayload = (profile?: UserProfile | null) => {
  if (!profile) return null;
  const sanitized: Record<string, unknown> = {};
  Object.entries(profile).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;
    sanitized[key] = value;
  });
  return Object.keys(sanitized).length > 0 ? sanitized : null;
};

const getDocumentInfo = (docId: string, type: 'admission' | 'visa') => {
  const admissionDocs: Record<string, {description: string; tips: string; toolUrl?: string}> = {
    'transcript': {
      description: 'Official academic transcripts from all universities/colleges attended, showing courses taken and grades received.',
      tips: 'Request certified copies from your institution. Some universities require apostille or official translation.',
      toolUrl: undefined
    },
    'diploma': {
      description: 'Your degree certificate or diploma proving completion of your previous studies.',
      tips: 'Must be officially certified. If not in English/German, get it professionally translated.',
      toolUrl: undefined
    },
    'cv': {
      description: 'A comprehensive curriculum vitae highlighting your academic and professional background.',
      tips: 'Use our CV builder to create a professional German-style CV tailored for university applications.',
      toolUrl: '/cv-maker'
    },
    'motivation': {
      description: 'A letter explaining why you want to study this program and how it fits your career goals.',
      tips: 'Use our AI-powered tool to generate a personalized motivation letter for this specific program.',
      toolUrl: '/motivation-letter'
    },
    'language': {
      description: 'Official language proficiency certificate (IELTS, TOEFL, TestDaF, Goethe-Zertifikat, etc.).',
      tips: 'Check the specific score requirements for this program. Book your test early as slots fill up quickly.',
      toolUrl: undefined
    },
    'passport': {
      description: 'A valid passport with at least 6 months validity beyond your intended stay.',
      tips: 'Make sure your passport is valid. Renew it if it expires soon.',
      toolUrl: undefined
    },
    'recommendation': {
      description: 'Letters of recommendation from professors or employers who can attest to your qualifications.',
      tips: 'Request these early. Provide your recommenders with your CV and program details.',
      toolUrl: undefined
    },
    'aps': {
      description: 'Academic Evaluation Centre certificate required for applicants from certain countries (China, India, Vietnam, Mongolia).',
      tips: 'The APS process can take 2-4 months. Start early! Visit www.aps.org.cn or your local APS office.',
      toolUrl: undefined
    },
    'photo': {
      description: 'Biometric passport photos meeting German requirements.',
      tips: 'Usually 35mm x 45mm, recent, neutral expression, light background.',
      toolUrl: undefined
    }
  };

  const visaDocs: Record<string, {description: string; tips: string; toolUrl?: string}> = {
    'blocked-account': {
      description: 'A blocked bank account (Sperrkonto) with €11,904 for one year of living expenses in Germany.',
      tips: 'Open with Fintiba or Expatrio online. Funds must be deposited before visa application. This proves you can support yourself.',
      toolUrl: 'https://www.fintiba.com/'
    },
    'health-insurance': {
      description: 'Proof of health insurance coverage valid in Germany for the entire duration of your studies.',
      tips: 'Get statutory health insurance (TK, AOK) or private insurance. Must cover at least €30,000 in medical expenses.',
      toolUrl: 'https://www.tk.de/en'
    },
    'visa-application': {
      description: 'Completed visa application form for a student visa (national visa category D).',
      tips: 'Download from your local German embassy website. Fill out completely and accurately.',
      toolUrl: 'https://www.germany.info/'
    },
    'admission-letter': {
      description: 'Official admission letter (Zulassungsbescheid) from the German university.',
      tips: 'You need this before applying for a visa. Apply to the university first and wait for acceptance.',
      toolUrl: undefined
    },
    'accommodation': {
      description: 'Proof of accommodation in Germany (rental contract, dorm confirmation, or host declaration).',
      tips: 'Can be temporary. Student dorms, private rentals, or Anmeldung from a host are acceptable.',
      toolUrl: undefined
    },
    'financial-proof': {
      description: 'Additional proof of financial resources (scholarship letter, sponsor declaration, bank statements).',
      tips: 'If you have a scholarship or sponsor, include official documentation. Complements the blocked account.',
      toolUrl: undefined
    }
  };

  return type === 'admission' ? admissionDocs[docId] : visaDocs[docId];
};

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

interface RequiredDocument {
  id: string;
  name: string;
  category: 'admission' | 'visa' | 'financial';
  required: boolean;
  description: string;
  programSpecificNotes?: string;
}

interface ApplicationSubmission {
  method: string;
  portalUrl?: string;
  deadline?: string;
  instructions: string;
}

interface UniversityInfo {
  cityName: string;
  cityDescription: string;
  jobProspects: string;
  accommodationInfo: string;
  livingCosts: string;
}

interface ApplicationPlan {
  criticalRequirements?: CriticalRequirement[];
  profileMatch?: ProfileMatch;
  requiredDocuments?: RequiredDocument[];
  applicationSubmission?: ApplicationSubmission;
  universityInfo?: UniversityInfo;
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
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [selectedDocInfo, setSelectedDocInfo] = useState<{id: string; label: string; type: 'admission' | 'visa'} | null>(null);
  const [expandedDocs, setExpandedDocs] = useState<string[]>([]);
  
  // Collapsible section states
  const [showRequirements, setShowRequirements] = useState(true);
  const [showProfileMatch, setShowProfileMatch] = useState(true);
  const [showOverview, setShowOverview] = useState(true);
  const [showBlockers, setShowBlockers] = useState(true);
  const [showSteps, setShowSteps] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/my-applications');
      return;
    }
    if (status === 'authenticated' && programId) {
      fetchPlan();
    }
  }, [status, programId, router]);

  const buildProgramPayload = (program: any) => ({
    id: String(program.id),
    program_name: program.program_name || 'Unknown Program',
    university: program.university || 'Unknown University',
    degree_level: program.degree_level || undefined,
    requirements: program.requirements ?? null,
    tab_requirements_registration: program.tab_requirements_registration ?? null,
    tab_costs_funding: program.tab_costs_funding ?? null,
    language_proficiency_required: typeof program.language_proficiency_required === 'boolean'
      ? program.language_proficiency_required
      : undefined,
    ielts_min_score: program.ielts_min_score || undefined,
    toefl_min_score: program.toefl_min_score || undefined,
    german_min_level: program.german_min_level || undefined,
    english_min_level: program.english_min_level || undefined,
    academic_background_requirements: program.academic_background_requirements || undefined,
    documents_required_list: typeof program.documents_required_list === 'string'
      ? program.documents_required_list
      : Array.isArray(program.documents_required_list)
        ? JSON.stringify(program.documents_required_list)
        : undefined,
    registration_deadline_date: program.registration_deadline_date || undefined,
    registration_deadline_text: program.registration_deadline_text || undefined,
    application_channel: program.application_channel || undefined,
    application_channel_notes: program.application_channel_notes || undefined,
  });

  const fetchPlan = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const profileRes = await fetch('/api/profile');
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.profile) {
          const sanitized = sanitizeUserProfilePayload(profileData.profile);
          if (sanitized) {
            setUserProfile(sanitized as UserProfile);
          }
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
        if (data.plan && data.plan.steps && Array.isArray(data.plan.steps)) {
          // Ensure criticalRequirements is valid array
          const validatedPlan = {
            ...data.plan,
            criticalRequirements: Array.isArray(data.plan.criticalRequirements) 
              ? data.plan.criticalRequirements.filter((r: any) => r && typeof r === 'object' && r.type && r.label)
              : [],
            profileMatch: data.plan.profileMatch && typeof data.plan.profileMatch === 'object'
              ? data.plan.profileMatch
              : null,
          };
          setPlan(validatedPlan);
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
      setGenerationError(null);
      
      // Ensure we have program details
      let programToUse = programDetails;
      if (!programToUse) {
        const programRes = await fetch(`/api/programs/${programId}`);
        if (programRes.ok) {
          const programData = await programRes.json();
          programToUse = programData.program;
          setProgramDetails(programData.program);
          if (programData.program?.program_name) setProgramName(programData.program.program_name);
          if (programData.program?.university) setUniversity(programData.program.university);
        }
      }
      
      if (!programToUse) {
        console.error('Could not fetch program details');
        return;
      }
      
      // Use already fetched profile or fetch fresh
      let profileToUse = userProfile;
      if (!profileToUse) {
        const profileRes = await fetch('/api/profile');
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          const sanitized = sanitizeUserProfilePayload(profileData.profile);
          profileToUse = sanitized as UserProfile | null;
          if (sanitized) {
            setUserProfile(sanitized as UserProfile);
          }
        }
      }

      const sanitizedProgram = buildProgramPayload(programToUse);
      const sanitizedProfilePayload = sanitizeUserProfilePayload(profileToUse);

      const payload = sanitizedProfilePayload
        ? { program: sanitizedProgram, userProfile: sanitizedProfilePayload }
        : { program: sanitizedProgram };

      const generateRes = await fetch(`/api/programs/${programId}/application-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (generateRes.ok) {
        const generatedData = await generateRes.json();
        if (generatedData && generatedData.plan && generatedData.plan.steps && Array.isArray(generatedData.plan.steps)) {
          // Ensure criticalRequirements is valid array
          const validatedPlan = {
            ...generatedData.plan,
            criticalRequirements: Array.isArray(generatedData.plan.criticalRequirements) 
              ? generatedData.plan.criticalRequirements.filter((r: any) => r && typeof r === 'object' && r.type && r.label)
              : [],
            profileMatch: generatedData.plan.profileMatch && typeof generatedData.plan.profileMatch === 'object'
              ? generatedData.plan.profileMatch
              : null,
          };
          setPlan(validatedPlan);
          setGenerationError(null);
        } else {
          setGenerationError('Invalid response from server. Please try again.');
          console.error('Invalid plan response:', generatedData);
        }
      } else {
        const errorData = await generateRes.json().catch(() => ({}));
        console.error('Generation failed with status:', generateRes.status);
        console.error('Error response:', errorData);
        
        // Show detailed validation errors if available
        if (errorData?.details && Array.isArray(errorData.details)) {
          console.error('Validation errors:', errorData.details);
          const validationMessages = errorData.details.map((d: any) => `${d.path?.join('.')}: ${d.message}`).join(', ');
          setGenerationError(`Validation failed: ${validationMessages}`);
        } else {
          const message = errorData?.message || errorData?.error || 'Failed to generate application plan. Please try again.';
          setGenerationError(message);
        }
      }
    } catch (err) {
      console.error('Failed to generate plan:', err);
      setGenerationError(err instanceof Error ? err.message : 'Unexpected error generating plan');
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

  const toggleDocExpansion = (docId: string) => {
    setExpandedDocs(prev =>
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

        {/* Course Details - Simple inline pills */}
        {programDetails && (
          <>
            <div className="app-plan-details-strip">
              <div className="app-plan-details-pills">
                {programDetails.city && (
                  <span className="app-plan-detail-pill">
                    <MapPin className="w-3.5 h-3.5" />
                    {programDetails.city}
                  </span>
                )}
                {programDetails.degree_level && (
                  <span className="app-plan-detail-pill">
                    <Award className="w-3.5 h-3.5" />
                    {programDetails.degree_level}
                  </span>
                )}
                {programDetails.languages_array?.length > 0 && (
                  <span className="app-plan-detail-pill">
                    <Globe className="w-3.5 h-3.5" />
                    {programDetails.languages_array.join(', ')}
                  </span>
                )}
                {programDetails.programme_duration && (
                  <span className="app-plan-detail-pill">
                    <Clock className="w-3.5 h-3.5" />
                    {programDetails.programme_duration}
                  </span>
                )}
                {programDetails.subject_area && (
                  <span className="app-plan-detail-pill">
                    <BookOpen className="w-3.5 h-3.5" />
                    {programDetails.subject_area}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
                {programDetails.detail_url && (
                  <a 
                    href={programDetails.detail_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="app-plan-daad-link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    DAAD
                  </a>
                )}
                {(programDetails.registration_deadline_date || programDetails.registration_deadline_text) && (
                  <div style={{ padding: '8px 16px', background: '#fef3c7', color: '#92400e', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar className="w-4 h-4" />
                    Deadline: {programDetails.registration_deadline_date || programDetails.registration_deadline_text}
                  </div>
                )}
              </div>
            </div>

            {/* Language Requirements & Fees Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16, padding: '16px 24px', background: '#f8fafc', borderRadius: 12 }}>
              {programDetails.language_requirements_english && (
                <div style={{ flex: '1 1 200px' }}>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>English Requirement</div>
                  <div style={{ fontSize: 14, color: '#0f172a', fontWeight: 600 }}>{programDetails.language_requirements_english}</div>
                </div>
              )}
              {programDetails.language_requirements_german && (
                <div style={{ flex: '1 1 200px' }}>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>German Requirement</div>
                  <div style={{ fontSize: 14, color: '#0f172a', fontWeight: 600 }}>{programDetails.language_requirements_german}</div>
                </div>
              )}
              {(programDetails.tuition_fee_number != null || programDetails.is_free) && (
                <div style={{ flex: '1 1 200px' }}>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>Semester Fee</div>
                  <div style={{ fontSize: 14, color: '#0f172a', fontWeight: 600 }}>
                    {programDetails.is_free ? 'Free (No tuition fees)' : `€${programDetails.tuition_fee_number?.toLocaleString()}`}
                  </div>
                </div>
              )}
              {programDetails.motivation_letter_required && (
                <div style={{ flex: '1 1 200px' }}>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>Motivation Letter</div>
                  <div style={{ fontSize: 14, color: '#dc2626', fontWeight: 600 }}>Required</div>
                </div>
              )}
            </div>
          </>
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

              {generationError && (
                <div className="app-plan-generate-error">
                  <AlertCircle className="w-4 h-4" />
                  <span>{generationError}</span>
                  <button onClick={generatePlan} disabled={generating}>
                    Try again
                  </button>
                </div>
              )}

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
            /* Has Plan - Simplified Layout */
            <div className="app-plan-simple">
              
              {/* Section 1: AI Profile Snapshot */}
              {plan.profileMatch && (
                <div className="simple-section simple-ai-snapshot">
                  <div className="simple-section-header">
                    <div className="simple-section-icon">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="simple-section-title">
                      <h2>AI Profile Analysis</h2>
                      <p>How well you match this program</p>
                    </div>
                    <div className="simple-match-badge" style={{
                      background: plan.profileMatch.score >= 80 ? '#22c55e' : 
                                  plan.profileMatch.score >= 60 ? '#f59e0b' : '#ef4444'
                    }}>
                      {plan.profileMatch.score}% Match
                    </div>
                  </div>
                  
                  <div className="simple-section-content">
                    <p className="simple-summary">{plan.profileMatch.summary}</p>
                    
                    <div className="simple-insights">
                      {plan.profileMatch.strengths?.[0] && (
                        <div className="simple-insight simple-insight-strength">
                          <CheckCircle2 className="w-4 h-4" />
                          <span><strong>Strength:</strong> {plan.profileMatch.strengths[0]}</span>
                        </div>
                      )}
                      {plan.profileMatch.gaps?.[0] && (
                        <div className="simple-insight simple-insight-gap">
                          <AlertCircle className="w-4 h-4" />
                          <span><strong>Gap:</strong> {plan.profileMatch.gaps[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Section 2: Admission Documents - AI Generated */}
              {plan.requiredDocuments && plan.requiredDocuments.filter(d => d.category === 'admission').length > 0 && (
                <div className="simple-section simple-admission-docs">
                  <div className="simple-section-header">
                    <div className="simple-section-icon">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="simple-section-title">
                      <h2>Admission Documents</h2>
                      <p>Required documents for your application</p>
                    </div>
                  </div>
                  
                  <div className="simple-section-content">
                    <div className="simple-doc-list">
                      {plan.requiredDocuments.filter(d => d.category === 'admission').map(doc => {
                        const isExpanded = expandedDocs.includes(doc.id);
                        return (
                          <div key={doc.id} className="simple-doc-item-wrapper">
                            <div className={`simple-doc-item ${checkedDocs.includes(doc.id) ? 'checked' : ''}`}>
                              <input
                                type="checkbox"
                                checked={checkedDocs.includes(doc.id)}
                                onChange={() => toggleDoc(doc.id)}
                              />
                              <span className="simple-doc-checkbox">
                                {checkedDocs.includes(doc.id) ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                  <Circle className="w-5 h-5" />
                                )}
                              </span>
                              <span className="simple-doc-label">{doc.name}</span>
                              {doc.required && (
                                <span className="simple-doc-badge" style={{ marginLeft: 'auto', padding: '2px 8px', background: '#fee2e2', color: '#dc2626', fontSize: 11, fontWeight: 600, borderRadius: 6 }}>Required</span>
                              )}
                              <button
                                onClick={() => toggleDocExpansion(doc.id)}
                                style={{ marginLeft: doc.required ? '8px' : 'auto', padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                                title={isExpanded ? 'Hide details' : 'Show details'}
                              >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </div>
                            {isExpanded && (
                              <div className="doc-drawer-content">
                                <p className="doc-description">{doc.description}</p>
                                {doc.programSpecificNotes && (
                                  <div className="doc-specific-notes">
                                    <strong>Program-specific notes:</strong> {doc.programSpecificNotes}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Section 4: Visa & Financial Requirements - AI Generated */}
              {plan.requiredDocuments && plan.requiredDocuments.filter(d => d.category === 'visa' || d.category === 'financial').length > 0 && (
                <div className="simple-section simple-visa-docs">
                  <div className="simple-section-header">
                    <div className="simple-section-icon">
                      <Plane className="w-5 h-5" />
                    </div>
                    <div className="simple-section-title">
                      <h2>Visa & Financial Requirements</h2>
                      <p>Documents needed for visa application</p>
                    </div>
                  </div>
                  
                  <div className="simple-section-content">
                    <div className="simple-doc-list">
                      {plan.requiredDocuments.filter(d => d.category === 'visa' || d.category === 'financial').map(doc => {
                        const isExpanded = expandedDocs.includes(doc.id);
                        return (
                          <div key={doc.id} className="simple-doc-item-wrapper">
                            <div className={`simple-doc-item ${checkedDocs.includes(doc.id) ? 'checked' : ''}`}>
                              <input
                                type="checkbox"
                                checked={checkedDocs.includes(doc.id)}
                                onChange={() => toggleDoc(doc.id)}
                              />
                              <span className="simple-doc-checkbox">
                                {checkedDocs.includes(doc.id) ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                  <Circle className="w-5 h-5" />
                                )}
                              </span>
                              <span className="simple-doc-label">{doc.name}</span>
                              {doc.required && (
                                <span className="simple-doc-badge" style={{ marginLeft: 'auto', padding: '2px 8px', background: '#fee2e2', color: '#dc2626', fontSize: 11, fontWeight: 600, borderRadius: 6 }}>Mandatory</span>
                              )}
                              <button
                                onClick={() => toggleDocExpansion(doc.id)}
                                style={{ marginLeft: doc.required ? '8px' : 'auto', padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                                title={isExpanded ? 'Hide details' : 'Show details'}
                              >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </div>
                            {isExpanded && (
                              <div className="doc-drawer-content">
                                <p className="doc-description">{doc.description}</p>
                                {doc.programSpecificNotes && (
                                  <div className="doc-specific-notes">
                                    <strong>Program-specific notes:</strong> {doc.programSpecificNotes}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Section 5: Application Submission - AI Generated */}
              {plan.applicationSubmission && (
                <div className="simple-section">
                  <div className="simple-section-header">
                    <div className="simple-section-icon">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="simple-section-title">
                      <h2>How to Submit Your Application</h2>
                      <p>Application process and deadlines</p>
                    </div>
                  </div>
                  
                  <div className="simple-section-content">
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'inline-block', padding: '6px 12px', background: '#f0fdf4', color: '#166534', borderRadius: 8, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                        Method: {plan.applicationSubmission.method}
                      </div>
                      {plan.applicationSubmission.deadline && (
                        <div style={{ display: 'inline-block', padding: '6px 12px', background: '#fef3c7', color: '#92400e', borderRadius: 8, fontSize: 13, fontWeight: 600, marginLeft: 8 }}>
                          Deadline: {plan.applicationSubmission.deadline}
                        </div>
                      )}
                    </div>
                    <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, marginBottom: 16 }}>{plan.applicationSubmission.instructions}</p>
                    {plan.applicationSubmission.portalUrl && (
                      <a href={plan.applicationSubmission.portalUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#dd0000', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
                        <ExternalLink className="w-4 h-4" />
                        Go to Application Portal
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Section 6: University & City Info - AI Generated */}
              {plan.universityInfo && (
                <div className="simple-section">
                  <div className="simple-section-header">
                    <div className="simple-section-icon">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="simple-section-title">
                      <h2>About {plan.universityInfo.cityName}</h2>
                      <p>Living and working in this city</p>
                    </div>
                  </div>
                  
                  <div className="simple-section-content">
                    <div style={{ marginBottom: 20 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>City Overview</h4>
                      <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{plan.universityInfo.cityDescription}</p>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Job Prospects</h4>
                      <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{plan.universityInfo.jobProspects}</p>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Accommodation</h4>
                      <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{plan.universityInfo.accommodationInfo}</p>
                    </div>
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Living Costs</h4>
                      <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{plan.universityInfo.livingCosts}</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
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

      {/* Document Info Drawer */}
      {selectedDocInfo && (() => {
        const info = getDocumentInfo(selectedDocInfo.id, selectedDocInfo.type);
        if (!info) return null;
        
        return (
          <div className="doc-info-overlay" onClick={() => setSelectedDocInfo(null)}>
            <div className="doc-info-drawer" onClick={e => e.stopPropagation()}>
              <div className="doc-info-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #dd0000, #9333ea)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>{selectedDocInfo.label}</h3>
                    <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Document Information</p>
                  </div>
                </div>
                <button onClick={() => setSelectedDocInfo(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#64748b' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="doc-info-content">
                <div className="doc-info-section">
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <BookOpen className="w-4 h-4" style={{ color: '#dd0000' }} />
                    What is this?
                  </h4>
                  <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: 0 }}>{info.description}</p>
                </div>
                
                <div className="doc-info-section">
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sparkles className="w-4 h-4" style={{ color: '#dd0000' }} />
                    Tips & Advice
                  </h4>
                  <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: 0 }}>{info.tips}</p>
                </div>
                
                {info.toolUrl && (
                  <div className="doc-info-section">
                    <Link 
                      href={info.toolUrl}
                      target={info.toolUrl.startsWith('http') ? '_blank' : undefined}
                      rel={info.toolUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: 8, 
                        padding: '12px 20px', 
                        background: '#dd0000', 
                        color: '#fff', 
                        borderRadius: 10, 
                        textDecoration: 'none', 
                        fontWeight: 600, 
                        fontSize: 14,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#b91c1c'}
                      onMouseLeave={e => e.currentTarget.style.background = '#dd0000'}
                    >
                      {selectedDocInfo.id === 'cv' && <FileText className="w-4 h-4" />}
                      {selectedDocInfo.id === 'motivation' && <Sparkles className="w-4 h-4" />}
                      {selectedDocInfo.id !== 'cv' && selectedDocInfo.id !== 'motivation' && <ExternalLink className="w-4 h-4" />}
                      {selectedDocInfo.id === 'cv' ? 'Create CV' : selectedDocInfo.id === 'motivation' ? 'Generate Letter' : 'Learn More'}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

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
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px 100px;
  }
  
  /* Two-column layout */
  .app-plan-layout {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 32px;
    align-items: start;
  }
  
  .app-plan-main-content {
    min-width: 0;
  }
  
  .app-plan-sidebar {
    position: relative;
  }
  
  .app-plan-sidebar-sticky {
    position: sticky;
    top: 24px;
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
  
  /* Course Details Strip */
  .app-plan-details-strip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 16px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    margin-bottom: 24px;
  }
  
  .app-plan-details-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .app-plan-detail-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #475569;
  }
  
  .app-plan-detail-pill svg {
    color: #94a3b8;
  }
  
  .app-plan-daad-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #fff;
    color: #64748b;
    font-weight: 600;
    font-size: 12px;
    text-decoration: none;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .app-plan-daad-link:hover {
    border-color: ${RED};
    color: ${RED};
    background: rgba(221,0,0,0.04);
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
  
  .app-plan-generate-error {
    margin-top: 16px;
    padding: 12px 16px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #991b1b;
    font-size: 13px;
  }
  
  .app-plan-generate-error button {
    margin-left: auto;
    background: transparent;
    border: none;
    color: #b91c1c;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
  }
  
  .app-plan-features {
    display: flex;
    gap: 24px;
    margin-top: 24px;
    justify-content: center;
  }
  
  .app-plan-feature {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .app-plan-feature span {
    color: #555;
  }
  
  /* AI Profile Match Summary - Clean Design */
  .app-plan-ai-summary {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 24px;
  }

  .app-plan-ai-summary-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .app-plan-ai-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, #dd0000, #9333ea);
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
    font-size: 15px;
    font-weight: 600;
    color: #0f172a;
    margin: 0;
  }
  
  .app-plan-ai-summary-header span {
    font-size: 12px;
    color: #94a3b8;
  }
  
  .app-plan-match-score {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 12px;
    color: #fff;
    flex-shrink: 0;
  }
  
  .app-plan-match-score .score-value {
    font-size: 20px;
    font-weight: 700;
    line-height: 1;
  }
  
  .app-plan-match-score .score-label {
    font-size: 10px;
    font-weight: 600;
    opacity: 0.9;
    margin-top: 2px;
  }

  .app-plan-ai-summary-textbox {
    margin: 16px 0;
    padding: 14px;
    background: #f8fafc;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
  }

  .app-plan-ai-summary-textbox p {
    font-size: 14px;
    color: #475569;
    line-height: 1.6;
    margin: 0;
  }
  
  .app-plan-ai-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .app-plan-ai-section {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 14px;
  }

  .app-plan-ai-section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }

  .app-plan-ai-section-header h4 {
    font-size: 13px;
    font-weight: 600;
    margin: 0;
  }
  
  .app-plan-ai-strengths {
    background: #f0fdf4;
    border-color: #bbf7d0;
  }
  
  .app-plan-ai-gaps {
    background: #fef2f2;
    border-color: #fecaca;
  }
  
  .app-plan-ai-strengths .app-plan-ai-section-header {
    color: #16a34a;
  }
  
  .app-plan-ai-gaps .app-plan-ai-section-header {
    color: #dc2626;
  }
  
  .app-plan-ai-section ul {
    margin: 0;
    padding-left: 16px;
    font-size: 13px;
    line-height: 1.5;
  }
  
  .app-plan-ai-strengths ul {
    color: #166534;
  }
  
  .app-plan-ai-gaps ul {
    color: #991b1b;
  }
  
  .app-plan-ai-section li {
    margin-bottom: 4px;
  }

  .app-plan-ai-callout {
    padding: 14px;
    border-radius: 10px;
    border: 1px solid #bfdbfe;
    background: #eff6ff;
  }

  .app-plan-ai-callout-header {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #1d4ed8;
    margin-bottom: 10px;
  }

  .app-plan-ai-callout-header h4 {
    font-size: 13px;
    font-weight: 600;
    margin: 0;
  }

  .app-plan-ai-callout ul {
    margin: 0;
    padding-left: 16px;
    font-size: 13px;
    line-height: 1.5;
    color: #1e40af;
  }

  .app-plan-ai-callout li {
    margin-bottom: 4px;
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
    margin: 0;
  }
  
  .app-plan-overview p {
    font-size: 15px;
    color: #555;
    line-height: 1.6;
    margin: 16px 0 0;
  }
  
  /* Collapsible Section Toggle */
  .app-plan-section-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
    transition: opacity 0.2s;
  }
  
  .app-plan-section-toggle:hover {
    opacity: 0.7;
  }
  
  .app-plan-section-toggle svg {
    flex-shrink: 0;
    color: #737373;
    transition: transform 0.2s;
  }
  
  .app-plan-steps-toggle h2 {
    margin: 0;
  }
  
  /* Steps */
  .app-plan-steps {
    margin-bottom: 24px;
  }
  
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
  
  /* Inline Document Checklist */
  .app-plan-doc-checklist {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px;
    margin: 12px 0;
  }
  
  .app-plan-doc-checklist-header {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #475569;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .app-plan-doc-checklist-count {
    margin-left: auto;
    background: #e2e8f0;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    color: #64748b;
  }
  
  .app-plan-doc-checklist-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 8px;
  }
  
  .app-plan-doc-check-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;
  }
  
  .app-plan-doc-check-item:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
  }
  
  .app-plan-doc-check-item.checked {
    background: #f0fdf4;
    border-color: #86efac;
  }
  
  .app-plan-doc-check-item input {
    display: none;
  }
  
  .app-plan-doc-check-box {
    color: #cbd5e1;
    flex-shrink: 0;
  }
  
  .app-plan-doc-check-item.checked .app-plan-doc-check-box {
    color: #22c55e;
  }
  
  .app-plan-doc-check-label {
    flex: 1;
    font-size: 13px;
    font-weight: 500;
    color: #334155;
  }
  
  .app-plan-doc-check-item.checked .app-plan-doc-check-label {
    color: #166534;
    text-decoration: line-through;
  }
  
  .app-plan-doc-check-category {
    font-size: 10px;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
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
  @media (max-width: 1024px) {
    .app-plan-layout {
      grid-template-columns: 1fr;
    }
    
    .app-plan-sidebar {
      order: -1;
    }
    
    .app-plan-sidebar-sticky {
      position: relative;
      top: 0;
    }
  }
  
  @media (max-width: 768px) {
    .app-plan-main {
      padding: 20px 16px 100px;
    }
    
    .app-plan-layout {
      gap: 20px;
    }
    
    .app-plan-hero {
      border-radius: 16px;
    }
    
    .app-plan-hero-content {
      padding: 28px 20px;
    }
    
    .app-plan-title {
      font-size: 22px;
    }
    
    .app-plan-university {
      font-size: 14px;
    }
    
    .app-plan-details-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
    
    .app-plan-detail-item {
      padding: 12px 14px;
    }
    
    .app-plan-generate {
      padding: 32px 20px;
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
      padding: 16px;
      gap: 12px;
    }
    
    .app-plan-step-header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .app-plan-step-header h4 {
      font-size: 15px;
    }
    
    .app-plan-step-title-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    
    .app-plan-ai-summary {
      padding: 20px;
    }
    
    .app-plan-ai-summary-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    
    .app-plan-match-score {
      align-self: flex-start;
    }
    
    .app-plan-ai-grid {
      grid-template-columns: 1fr;
    }
    
    .app-plan-progress-card {
      padding: 20px;
    }
    
    .app-plan-progress-percent {
      font-size: 32px;
    }
    
    .app-plan-blockers,
    .app-plan-overview {
      padding: 18px;
    }
    
    .app-plan-step-resources-list {
      flex-direction: column;
    }
    
    .app-plan-step-action {
      padding: 12px 16px;
      font-size: 14px;
    }
    
    .app-plan-section-toggle svg {
      width: 20px;
      height: 20px;
    }
    
    .app-plan-steps h2 {
      font-size: 18px;
    }
  }

  /* Simplified Layout Styles */
  .app-plan-simple {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 20px 40px;
  }

  .simple-section {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
  }

  .simple-section-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;
  }

  .simple-section-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, #dd0000, #9333ea);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
  }

  .simple-section-title {
    flex: 1;
  }

  .simple-section-title h2 {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 4px;
  }

  .simple-section-title p {
    font-size: 13px;
    color: #64748b;
    margin: 0;
  }

  .simple-match-badge {
    padding: 8px 16px;
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
  }

  .simple-section-content {
    padding-top: 4px;
  }

  .simple-summary {
    font-size: 15px;
    color: #475569;
    line-height: 1.6;
    margin: 0 0 16px;
  }

  .simple-insights {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .simple-insight {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px;
    border-radius: 10px;
    font-size: 14px;
    line-height: 1.5;
  }

  .simple-insight svg {
    flex-shrink: 0;
    margin-top: 2px;
  }

  .simple-insight-strength {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
  }

  .simple-insight-gap {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #991b1b;
  }

  .simple-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .simple-info-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .simple-info-label {
    font-size: 12px;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .simple-info-value {
    font-size: 15px;
    font-weight: 600;
    color: #0f172a;
  }

  .simple-doc-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .simple-doc-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .simple-doc-item:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }

  .simple-doc-item.checked {
    background: #f0fdf4;
    border-color: #86efac;
  }

  .simple-doc-item input {
    display: none;
  }

  .simple-doc-checkbox {
    color: #cbd5e1;
    flex-shrink: 0;
  }

  .simple-doc-item.checked .simple-doc-checkbox {
    color: #22c55e;
  }

  .simple-doc-label {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    color: #334155;
  }

  .simple-doc-item.checked .simple-doc-label {
    color: #166534;
  }

  .simple-doc-item-wrapper {
    margin-bottom: 8px;
  }

  .doc-drawer-content {
    padding: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-top: none;
    border-radius: 0 0 10px 10px;
    margin-top: -8px;
  }

  .doc-description {
    font-size: 14px;
    color: #475569;
    line-height: 1.6;
    margin: 0 0 12px;
  }

  .doc-specific-notes {
    padding: 12px;
    background: #fff7ed;
    border-left: 3px solid #f59e0b;
    border-radius: 6px;
    font-size: 13px;
    color: #78350f;
    line-height: 1.5;
  }

  .doc-specific-notes strong {
    color: #92400e;
  }

  @media (max-width: 768px) {
    .app-plan-simple {
      padding: 0 16px 32px;
    }

    .simple-section {
      padding: 20px;
    }

    .simple-section-header {
      flex-direction: column;
      gap: 12px;
    }

    .simple-match-badge {
      align-self: flex-start;
    }

    .simple-info-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }

  /* Document Info Drawer */
  .doc-info-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .doc-info-drawer {
    background: #fff;
    border-radius: 20px;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-height: 80vh;
    overflow-y: auto;
  }

  .doc-info-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
  }

  .doc-info-content {
    padding: 24px;
  }

  .doc-info-section {
    margin-bottom: 24px;
  }

  .doc-info-section:last-child {
    margin-bottom: 0;
  }
`;
