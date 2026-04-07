'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  ArrowLeft, Loader2, Download, Copy, Check, Sparkles, GraduationCap,
  ChevronDown, FileText, Wand2, User, BookOpen, Target, Briefcase,
  Heart, RefreshCw, CheckCircle2, Upload, X, Edit3
} from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';
import { PaywallModal } from '@/components/PaywallModal';
import type { Program } from '@/lib/types';
import { useProfileData } from '@/hooks/useProfileData';

interface ShortlistItem {
  id: string;
  programId: string;
  programName: string;
  university: string;
}

// Inline editable component like CV maker
const E = ({
  value,
  onChange,
  placeholder = '',
  maxLength,
  showWordCount = false,
  wordLimit,
  multiline = false,
  style = {},
  ...props
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  maxLength?: number;
  showWordCount?: boolean;
  wordLimit?: number;
  multiline?: boolean;
  style?: React.CSSProperties;
  [key: string]: any;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (multiline) {
        const textarea = inputRef.current as HTMLTextAreaElement;
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      }
    }
  }, [isEditing, multiline]);

  const handleSave = () => {
    if (wordLimit && tempValue.split(' ').filter(w => w).length > wordLimit) {
      return; // Don't save if over word limit
    }
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && !multiline) {
      handleSave();
    }
  };

  const wordCount = tempValue.split(' ').filter(w => w).length;
  const isOverLimit = wordLimit && wordCount > wordLimit;

  if (isEditing) {
    return (
      <div style={{ position: 'relative', ...style }}>
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={tempValue}
            onChange={e => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e5e5e5',
              borderRadius: 8,
              fontSize: 14,
              fontFamily: 'inherit',
              resize: 'vertical',
              minHeight: 60,
              outline: 'none',
              ...props
            }}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={tempValue}
            onChange={e => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e5e5e5',
              borderRadius: 8,
              fontSize: 14,
              fontFamily: 'inherit',
              outline: 'none',
              ...props
            }}
          />
        )}
        {showWordCount && (
          <div style={{
            position: 'absolute',
            bottom: multiline ? -20 : -18,
            right: 0,
            fontSize: 11,
            color: isOverLimit ? '#dc2626' : '#999',
            fontWeight: 600
          }}>
            {wordCount}{wordLimit ? `/${wordLimit}` : ''} words
          </div>
        )}
        <div style={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: 4 }}>
          <button
            onClick={handleSave}
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              border: 'none',
              background: '#10b981',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Save"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            onClick={handleCancel}
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              border: 'none',
              background: '#ef4444',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Cancel"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      style={{
        padding: '8px 12px',
        border: '1px dashed #e5e5e5',
        borderRadius: 8,
        minHeight: multiline ? 60 : 36,
        cursor: 'pointer',
        display: 'flex',
        alignItems: multiline ? 'flex-start' : 'center',
        justifyContent: value ? 'flex-start' : 'center',
        transition: 'all 0.2s',
        ...style
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#dd0000'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e5e5'}
    >
      {value ? (
        <div style={{ width: '100%' }}>
          <div style={{ fontSize: 14, color: '#111', whiteSpace: multiline ? 'pre-wrap' : 'nowrap', overflow: multiline ? 'visible' : 'hidden', textOverflow: 'ellipsis' }}>
            {value}
          </div>
          {showWordCount && (
            <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
              {wordCount}{wordLimit ? `/${wordLimit}` : ''} words
            </div>
          )}
        </div>
      ) : (
        <span style={{ fontSize: 14, color: '#999' }}>{placeholder}</span>
      )}
      <Edit3 className="w-3 h-3" style={{ color: '#999', marginLeft: 8, flexShrink: 0 }} />
    </div>
  );
};

function MotivationLetterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const initialProgramId = searchParams.get('programId');

  const [shortlist, setShortlist] = useState<ShortlistItem[]>([]);
  const [shortlistLoading, setShortlistLoading] = useState(true);
  const [selectedProgramId, setSelectedProgramId] = useState<string>(initialProgramId || '');
  const [program, setProgram] = useState<Program | null>(null);
  const [useManualProgram, setUseManualProgram] = useState<boolean>(status !== 'authenticated');
  const [manualProgram, setManualProgram] = useState({
    program_name: '',
    university: '',
    degree_level: '',
    subject_area: '',
    description: ''
  });
  const [programLoading, setProgramLoading] = useState(false);
  const [letter, setLetter] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallData, setPaywallData] = useState<{ current: number; limit: number } | null>(null);
  const [signInPrompt, setSignInPrompt] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProgramExtras, setShowProgramExtras] = useState(false);
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [cvText, setCvText] = useState<string>('');
  const [cvFileName, setCvFileName] = useState<string>('');
  const [cvParsing, setCvParsing] = useState(false);
  const [cvError, setCvError] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userInput, setUserInput] = useState({
    fullName: '',
    background: '',
    motivation: '',
    careerGoals: '',
    whyThisProgram: '',
    relevantExperience: '',
  });
  const [lastProgramName, setLastProgramName] = useState('letter');

  const profileEnabled = status === 'authenticated';
  const { profile: profileData } = useProfileData(profileEnabled);

  useEffect(() => {
    if (!profileData) return;
    setUserInput((prev) => {
      let changed = false;
      const next = { ...prev };
      if (!next.fullName && profileData.fullName) {
        next.fullName = profileData.fullName;
        changed = true;
      }
      const profileBackground = profileData.backgroundSummary || profileData.academicBackground;
      if (!next.background && profileBackground) {
        next.background = profileBackground;
        changed = true;
      }
      if (!next.motivation && profileData.experienceHighlights) {
        next.motivation = profileData.experienceHighlights;
        changed = true;
      }
      if (!next.careerGoals && profileData.careerGoals) {
        next.careerGoals = profileData.careerGoals;
        changed = true;
      }
      if (!next.relevantExperience && profileData.skills) {
        next.relevantExperience = profileData.skills;
        changed = true;
      }
      return changed ? next : prev;
    });
  }, [profileData]);

  // Fetch shortlist
  useEffect(() => {
    if (status !== 'authenticated') return;
    const load = async () => {
      try {
        const res = await fetch('/api/shortlist');
        if (!res.ok) return;
        const data = await res.json();
        setShortlist(data.shortlists || []);
      } catch { /* silent */ } finally {
        setShortlistLoading(false);
      }
    };
    load();
  }, [status]);

  // Fetch program details when selected
  useEffect(() => {
    if (!selectedProgramId) return;
    const load = async () => {
      setProgramLoading(true);
      try {
        const res = await fetch(`/api/programs/${selectedProgramId}`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setProgram(data.program);
      } catch {
        setProgram(null);
      } finally {
        setProgramLoading(false);
      }
    };
    load();
  }, [selectedProgramId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (status !== 'authenticated') {
      setUseManualProgram(true);
    }
  }, [status]);

  const selectProgram = (id: string) => {
    setSelectedProgramId(id);
    setShowDropdown(false);
    setLetter('');
    setError(null);
  };

  const parseCv = async (file: File) => {
    console.log('[CV Parser Frontend] Starting CV parse for file:', file.name);
    
    if (file.type !== 'application/pdf') {
      console.log('[CV Parser Frontend] Invalid file type:', file.type);
      setCvError('Please upload a PDF file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      console.log('[CV Parser Frontend] File too large:', file.size);
      setCvError('File too large (max 5MB)');
      return;
    }
    try {
      setCvParsing(true);
      setCvError('');
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('[CV Parser Frontend] Sending request to API');
      const res = await fetch('/api/parse-cv', { method: 'POST', body: formData });
      
      console.log('[CV Parser Frontend] API response status:', res.status);
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.log('[CV Parser Frontend] API error:', err);
        throw new Error(err.error || 'Failed to parse CV');
      }
      
      const data = await res.json();
      console.log('[CV Parser Frontend] Successfully parsed CV, text length:', data.text?.length || 0);
      
      setCvText(data.text);
      setCvFileName(file.name);

      // Try to auto-fill name from first line of CV text
      const lines = data.text.split('\n').map((l: string) => l.trim()).filter(Boolean);
      if (lines.length > 0 && !userInput.fullName) {
        // First non-empty line is often the name — use it if it's short enough (likely a name)
        const firstLine = lines[0];
        if (firstLine.length <= 60 && !/[@|\d{4}]/.test(firstLine)) {
          console.log('[CV Parser Frontend] Auto-filling name:', firstLine);
          setUserInput(p => ({ ...p, fullName: firstLine }));
        }
      }
    } catch (err) {
      console.error('[CV Parser Frontend] Error:', err);
      setCvError(err instanceof Error ? err.message : 'Failed to parse CV');
    } finally {
      setCvParsing(false);
    }
  };

  const removeCv = () => {
    setCvText('');
    setCvFileName('');
    setCvError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resolvedProgram = () => {
    if (useManualProgram) {
      if (!manualProgram.program_name.trim() || !manualProgram.university.trim()) return null;
      return {
        program_name: manualProgram.program_name,
        university: manualProgram.university,
        degree_level: manualProgram.degree_level || undefined,
        subject_area: manualProgram.subject_area || undefined,
        description: manualProgram.description || null,
        tab_overview: null,
      } as Program;
    }
    return program;
  };

  const generateLetter = async () => {
    const programPayload = resolvedProgram();
    if (!programPayload) return;
    if (!session) { setSignInPrompt(true); return; }
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/motivation-letter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ program: programPayload, userInput, cvText: cvText || undefined })
      });
      if (response.status === 402) {
        const errData = await response.json().catch(() => ({}));
        setPaywallData({ current: errData.current ?? 0, limit: errData.limit ?? 3 });
        setPaywallOpen(true);
        return;
      }
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || errData.error || 'Failed to generate motivation letter');
      }
      const data = await response.json();
      setLetter(data.letter);
      setLastProgramName(programPayload.program_name || 'letter');
      setTimeout(() => letterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate letter');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadLetter = () => {
    const blob = new Blob([letter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `motivation-letter-${(lastProgramName || program?.program_name || 'letter').replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const selectedItem = shortlist.find(s => s.programId === selectedProgramId);
  const canGenerate = userInput.fullName.trim() && userInput.background.trim() && resolvedProgram();

  const primaryFields = [
    { key: 'background', label: 'Your background', placeholder: 'Give a quick intro - studies, standout achievements, passions.', icon: BookOpen },
    { key: 'whyThisProgram', label: 'Why this program?', placeholder: '2-3 lines on why this course & university excite you.', icon: Heart },
  ] as const;

  const optionalFields = [
    { key: 'motivation', label: 'Motivation & goals', placeholder: 'Describe what you want to achieve and how this program helps.', icon: Target },
    { key: 'careerGoals', label: 'Career vision', placeholder: 'Share long-term plans or dream roles after graduation.', icon: Sparkles },
    { key: 'relevantExperience', label: 'Relevant experience', placeholder: 'Projects, internships, jobs, research that prove your fit.', icon: Briefcase },
  ] as const;

  const iStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 14, color: '#1e293b', outline: 'none', background: '#f8fafc', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.2s ease', cursor: 'text' };
  const taStyle2: React.CSSProperties = { ...iStyle, resize: 'vertical', minHeight: 100, lineHeight: 1.7 };

  const mlSteps = [
    { id: 1, label: 'Program', done: !!resolvedProgram() },
    { id: 2, label: 'About you', done: !!(userInput.fullName && userInput.background) },
    { id: 3, label: 'Letter', done: !!letter },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <PaywallModal isOpen={paywallOpen} onClose={() => setPaywallOpen(false)} feature="motivation letter generations" currentUsage={paywallData?.current} limit={paywallData?.limit} />

      {signInPrompt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' }} onClick={() => setSignInPrompt(false)}>
          <div style={{ background: '#fff', borderRadius: 24, padding: '40px 36px', maxWidth: 400, width: '100%', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto', textAlign: 'center', boxShadow: '0 32px 80px rgba(0,0,0,0.22)', margin: 'auto 0' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(135deg,#dd0000,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><FileText size={26} color="#fff" /></div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', margin: '0 0 8px' }}>Sign in to generate</h2>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, margin: '0 0 24px' }}>Free account gives you 3 motivation letters per month — no credit card needed.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="/auth/signin?callbackUrl=/motivation-letter" style={{ padding: '13px', borderRadius: 12, background: 'linear-gradient(135deg,#dd0000,#7c3aed)', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'block' }}>Sign in</a>
              <a href="/auth/register?callbackUrl=/motivation-letter" style={{ padding: '13px', borderRadius: 12, background: '#f5f5f5', color: '#111', fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'block' }}>Create free account</a>
            </div>
            <button onClick={() => setSignInPrompt(false)} style={{ marginTop: 14, background: 'none', border: 'none', color: '#aaa', fontSize: 13, cursor: 'pointer' }}>Maybe later</button>
          </div>
        </div>
      )}

      <SiteNav />

      {/* Hero bar - Cleaner design */}
      <div className="tool-hero-bar" style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', padding: '32px 24px 28px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Link href="/motivation-letter/landing" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none', marginBottom: 16, fontWeight: 500 }}>
            <ArrowLeft size={14} /> Back
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="tool-hero-icon" style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={22} color="#fff" />
            </div>
            <div>
              <h1 className="tool-hero-title" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 700, color: '#fff', margin: '0 0 2px' }}>Motivation Letter</h1>
              <p className="tool-hero-subtitle" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>AI-powered letters for German universities</p>
            </div>
          </div>
          {/* Progress Steps - Simplified */}
          <div className="tool-progress-steps" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
            {mlSteps.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, background: s.done ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: s.done ? '#22c55e' : 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {s.done ? <Check size={11} color="#fff" /> : <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{s.id}</span>}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: s.done ? '#86efac' : 'rgba(255,255,255,0.7)' }}>{s.label}</span>
                </div>
                {i < mlSteps.length - 1 && <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.2)' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="tool-main" style={{ maxWidth: 1100, margin: '0 auto', padding: '98px 24px 80px' }}>
        <div className="tool-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Program card - Cleaner design */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#8b5cf6,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(139,92,246,0.2)' }}>
                    <GraduationCap size={18} color="#fff" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: 0 }}>Target Program</h2>
                    <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Select or enter program details</p>
                  </div>
                </div>
                {status === 'authenticated' && shortlist.length > 0 && (
                  <div style={{ display: 'flex', borderRadius: 8, border: '1px solid #e5e5e5', overflow: 'hidden', fontSize: 12 }}>
                    <button onClick={() => setUseManualProgram(false)} style={{ padding: '5px 12px', background: !useManualProgram ? '#dd0000' : 'transparent', color: !useManualProgram ? '#fff' : '#666', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>Shortlist</button>
                    <button onClick={() => setUseManualProgram(true)} style={{ padding: '5px 12px', background: useManualProgram ? '#dd0000' : 'transparent', color: useManualProgram ? '#fff' : '#666', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>Custom</button>
                  </div>
                )}
              </div>

              {!useManualProgram ? (
                shortlistLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#9ca3af' }}><Loader2 size={16} className="animate-spin" /> Loading…</div>
                ) : shortlist.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: '0 0 10px' }}>No shortlisted programs yet.</p>
                    <Link href="/" style={{ fontSize: 13, color: '#dd0000', fontWeight: 700, textDecoration: 'none' }}>Browse programs →</Link>
                  </div>
                ) : (
                  <div style={{ position: 'relative' }} ref={dropdownRef}>
                    <button onClick={() => setShowDropdown(p => !p)} style={{ width: '100%', textAlign: 'left', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #e5e5e5', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                      {selectedItem ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
                          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><GraduationCap size={13} color="#7c3aed" /></div>
                          <div style={{ overflow: 'hidden' }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedItem.programName}</p>
                            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{selectedItem.university}</p>
                          </div>
                        </div>
                      ) : <span style={{ fontSize: 13, color: '#9ca3af' }}>Select a program from your shortlist</span>}
                      <ChevronDown size={15} color="#9ca3af" style={{ transform: showDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                    </button>
                    {showDropdown && (
                      <div style={{ position: 'absolute', left: 0, right: 0, marginTop: 6, borderRadius: 12, border: '1px solid #e5e5e5', background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', maxHeight: 240, overflowY: 'auto', zIndex: 9999 }}>
                        {shortlist.map(item => (
                          <button key={item.id} onClick={() => selectProgram(item.programId)} style={{ width: '100%', textAlign: 'left', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, background: item.programId === selectedProgramId ? 'rgba(124,58,237,0.05)' : 'transparent', cursor: 'pointer', border: 'none', borderBottom: '1px solid #f5f5f5' }}>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                              <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.programName}</p>
                              <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{item.university}</p>
                            </div>
                            {item.programId === selectedProgramId && <CheckCircle2 size={14} color="#7c3aed" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="tool-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Program name <span style={{ color: '#dd0000' }}>*</span></label>
                      <input style={iStyle} value={manualProgram.program_name} onChange={e => setManualProgram(p => ({ ...p, program_name: e.target.value }))} placeholder="e.g. M.Sc. Data Science" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>University <span style={{ color: '#dd0000' }}>*</span></label>
                      <input style={iStyle} value={manualProgram.university} onChange={e => setManualProgram(p => ({ ...p, university: e.target.value }))} placeholder="e.g. TU Munich" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Degree level</label>
                      <input style={iStyle} value={manualProgram.degree_level} onChange={e => setManualProgram(p => ({ ...p, degree_level: e.target.value }))} placeholder="e.g. Master's" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Subject area</label>
                      <input style={iStyle} value={manualProgram.subject_area} onChange={e => setManualProgram(p => ({ ...p, subject_area: e.target.value }))} placeholder="e.g. Computer Science" />
                    </div>
                  </div>
                  <button onClick={() => setShowProgramExtras(p => !p)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e5e5', fontSize: 12, color: '#666', background: '#f9fafb', cursor: 'pointer', fontWeight: 600 }}>
                    Program highlights (optional) <ChevronDown size={13} style={{ transform: showProgramExtras ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {showProgramExtras && <textarea style={taStyle2} value={manualProgram.description} onChange={e => setManualProgram(p => ({ ...p, description: e.target.value }))} placeholder="Key modules, unique labs, special tracks..." rows={3} />}
                </div>
              )}
            </div>

            {/* About you card - Cleaner design */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#ef4444,#f87171)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(239,68,68,0.2)' }}>
                  <User size={18} color="#fff" />
                </div>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: 0 }}>About You</h2>
                  <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Tell us about yourself</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Full name <span style={{ color: '#dd0000' }}>*</span></label>
                  <input style={iStyle} value={userInput.fullName} onChange={e => setUserInput(p => ({ ...p, fullName: e.target.value }))} placeholder="e.g. Aisha Khan" />
                </div>
                {primaryFields.map(field => {
                  const Icon = field.icon;
                  return (
                    <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Icon size={11} color="#dd0000" /> {field.label} <span style={{ color: '#dd0000' }}>*</span>
                      </label>
                      <textarea style={taStyle2} value={(userInput as any)[field.key]} onChange={e => setUserInput(p => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder} rows={3} />
                    </div>
                  );
                })}
                <button onClick={() => setShowOptionalDetails(p => !p)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e5e5', fontSize: 12, color: '#666', background: '#f9fafb', cursor: 'pointer', fontWeight: 600 }}>
                  Add more details (optional) <ChevronDown size={13} style={{ transform: showOptionalDetails ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {showOptionalDetails && optionalFields.map(field => {
                  const Icon = field.icon;
                  return (
                    <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Icon size={11} color="#7c3aed" /> {field.label}
                      </label>
                      <textarea style={taStyle2} value={(userInput as any)[field.key]} onChange={e => setUserInput(p => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder} rows={2} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CV Upload - Cleaner design */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '2px dashed #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Upload size={18} color="#ef4444" /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', margin: '0 0 2px' }}>Upload CV <span style={{ color: '#64748b', fontWeight: 400, fontSize: 12 }}>(optional)</span></p>
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>We&apos;ll extract relevant details for your letter</p>
                </div>
                {!cvText ? (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: '#f5f5f5', border: '1px solid #e5e5e5', fontSize: 13, color: '#555', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {cvParsing ? <Loader2 size={14} className="animate-spin" style={{ color: '#dd0000' }} /> : <Upload size={14} />}
                    {cvParsing ? 'Reading…' : 'Upload PDF'}
                    <input ref={fileInputRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) parseCv(f); }} />
                  </label>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, padding: '6px 12px' }}>
                    <Check size={13} color="#22c55e" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cvFileName}</span>
                    <button onClick={removeCv} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' }}><X size={12} /></button>
                  </div>
                )}
              </div>
              {cvError && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 8, marginBottom: 0 }}>{cvError}</p>}
            </div>

            {/* Generate - Cleaner design */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
              {error && <div style={{ fontSize: 13, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>{error}</div>}
              <button onClick={generateLetter} disabled={!canGenerate || loading} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '16px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: !canGenerate || loading ? '#e2e8f0' : 'linear-gradient(135deg,#8b5cf6,#ef4444)', color: !canGenerate || loading ? '#94a3b8' : '#fff', border: 'none', cursor: !canGenerate || loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: !canGenerate || loading ? 'none' : '0 4px 16px rgba(139,92,246,0.25)' }}>
                {loading ? <><Loader2 size={18} className="animate-spin" /> Generating…</> : <><Wand2 size={18} /> Generate Letter</>}
              </button>
              {!canGenerate && <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 8, marginBottom: 0 }}>Complete required fields to continue</p>}
              <button type="button" onClick={() => { setUserInput({ fullName: '', background: '', motivation: '', careerGoals: '', whyThisProgram: '', relevantExperience: '' }); setLetter(''); removeCv(); }} style={{ width: '100%', marginTop: 12, padding: '10px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, color: '#64748b', background: 'transparent', cursor: 'pointer', fontWeight: 500 }}>
                <RefreshCw size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Clear form
              </button>
            </div>
          </div>

          {/* RIGHT — Preview - Cleaner design */}
          <div ref={letterRef} className="tool-result-col" style={{ position: 'sticky', top: 24 }}>
            {!letter ? (
              <div style={{ background: '#fff', borderRadius: 16, padding: '48px 32px', textAlign: 'center', border: '2px dashed #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,rgba(139,92,246,0.08),rgba(239,68,68,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <FileText size={24} color="#94a3b8" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#64748b', margin: '0 0 8px' }}>Your letter will appear here</h3>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>Complete the form and click<br /><strong style={{ color: '#64748b' }}>Generate Letter</strong></p>
                <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
                  {['Tailored to your program & university', 'Highlights your background & goals', 'German academic style formatting', 'Fully editable after generation'].map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#64748b' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={11} color="#94a3b8" /></div>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg,rgba(124,58,237,0.03),rgba(221,0,0,0.03))' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#dd0000)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles size={14} color="#fff" /></div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#111', margin: 0 }}>Motivation Letter</p>
                      <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{letter.split(/\s+/).filter(Boolean).length} words · click to edit</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={copyToClipboard} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid #e5e5e5', fontSize: 12, color: copied ? '#16a34a' : '#555', background: copied ? 'rgba(34,197,94,0.06)' : '#fff', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>
                      {copied ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}{copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={downloadLetter} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid #e5e5e5', fontSize: 12, color: '#555', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                      <Download size={13} /> Save
                    </button>
                    <button onClick={generateLetter} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#dd0000)', border: 'none', fontSize: 12, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, opacity: loading ? 0.7 : 1 }}>
                      {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Regenerate
                    </button>
                  </div>
                </div>
                <div style={{ padding: 24 }}>
                  <textarea value={letter} onChange={e => setLetter(e.target.value)} style={{ width: '100%', border: 'none', outline: 'none', fontSize: 14, lineHeight: 1.8, color: '#1f2937', fontFamily: 'Georgia, serif', resize: 'none', minHeight: 520, background: 'transparent', boxSizing: 'border-box' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );

}

export default function MotivationLetterPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#dd0000' }} />
      </div>
    }>
      <MotivationLetterContent />
    </Suspense>
  );
}
