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
import type { Program } from '@/lib/types';

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
  const { status } = useSession();
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
    if (file.type !== 'application/pdf') {
      setCvError('Please upload a PDF file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCvError('File too large (max 5MB)');
      return;
    }
    try {
      setCvParsing(true);
      setCvError('');
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/parse-cv', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to parse CV');
      }
      const data = await res.json();
      setCvText(data.text);
      setCvFileName(file.name);

      // Try to auto-fill name from first line of CV text
      const lines = data.text.split('\n').map((l: string) => l.trim()).filter(Boolean);
      if (lines.length > 0 && !userInput.fullName) {
        // First non-empty line is often the name — use it if it's short enough (likely a name)
        const firstLine = lines[0];
        if (firstLine.length <= 60 && !/[@|\d{4}]/.test(firstLine)) {
          setUserInput(p => ({ ...p, fullName: firstLine }));
        }
      }
    } catch (err) {
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
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/motivation-letter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ program: programPayload, userInput, cvText: cvText || undefined })
      });
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

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <SiteNav />

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px 80px' }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #dd0000, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(221,0,0,0.2)' }}>
            <FileText className="w-8 h-8" style={{ color: '#fff' }} />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#0a0a0a', margin: '0 0 6px' }}>Motivation Letter Generator</h1>
            <p style={{ fontSize: 15, color: '#737373', margin: 0 }}>Share a few details and let AI craft a tailored letter.</p>
          </div>
        </header>

        {/* Program details */}
        <section style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 28, marginBottom: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>Program details</p>
              <p style={{ fontSize: 14, color: '#737373', margin: 0 }}>Only two quick fields required. Share more if you have it.</p>
            </div>
            {status === 'authenticated' && shortlist.length > 0 && (
              <div style={{ display: 'flex', fontSize: 13, borderRadius: 10, border: '1px solid #e5e5e5', overflow: 'hidden', alignSelf: 'flex-start' }}>
                <button
                  type="button"
                  onClick={() => setUseManualProgram(false)}
                  style={{ padding: '8px 16px', background: !useManualProgram ? '#dd0000' : 'transparent', color: !useManualProgram ? '#fff' : '#666', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                >Shortlist</button>
                <button
                  type="button"
                  onClick={() => setUseManualProgram(true)}
                  style={{ padding: '8px 16px', background: useManualProgram ? '#dd0000' : 'transparent', color: useManualProgram ? '#fff' : '#666', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                >Custom</button>
              </div>
            )}
          </div>

          {!useManualProgram ? (
            shortlistLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#999' }}>
                <Loader2 className="w-4 h-4 animate-spin" /> Loading shortlist...
              </div>
            ) : shortlist.length === 0 ? (
              <div style={{ fontSize: 14, color: '#999' }}>
                <p style={{ margin: '0 0 8px' }}>You have no shortlisted programs yet.</p>
                <Link href="/course-finder" style={{ color: '#dd0000', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                  Browse programs <ChevronDown className="w-3 h-3 -rotate-90" />
                </Link>
              </div>
            ) : (
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(prev => !prev)}
                  style={{ width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e5e5', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  {selectedItem ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(221,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <GraduationCap className="w-4 h-4" style={{ color: '#dd0000' }} />
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#111', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedItem.programName}</p>
                        <p style={{ fontSize: 12, color: '#999', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedItem.university}</p>
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: 14, color: '#999' }}>Select a shortlisted program</span>
                  )}
                  <ChevronDown className="w-4 h-4" style={{ color: '#999', transition: 'transform 0.2s', transform: showDropdown ? 'rotate(180deg)' : 'none' }} />
                </button>
                {showDropdown && (
                  <div style={{ position: 'absolute', left: 0, right: 0, marginTop: 8, borderRadius: 12, border: '1px solid #e5e5e5', background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', maxHeight: 256, overflowY: 'auto', zIndex: 9999 }}>
                    {shortlist.map(item => (
                      <button
                        key={item.id}
                        onClick={() => selectProgram(item.programId)}
                        style={{ width: '100%', textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: 12, background: item.programId === selectedProgramId ? 'rgba(221,0,0,0.05)' : 'transparent', cursor: 'pointer', transition: 'background 0.2s', border: 'none' }}
                        onMouseEnter={e => item.programId !== selectedProgramId && (e.currentTarget.style.background = '#fafafa')}
                        onMouseLeave={e => item.programId !== selectedProgramId && (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <GraduationCap className="w-3.5 h-3.5" style={{ color: '#999' }} />
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: '#111', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.programName}</p>
                          <p style={{ fontSize: 12, color: '#999', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.university}</p>
                        </div>
                        {item.programId === selectedProgramId && <CheckCircle2 className="w-4 h-4" style={{ color: '#dd0000' }} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          ) : (
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <label style={{ fontSize: 13, color: '#666', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontWeight: 600 }}>Program name *</span>
                <input
                  value={manualProgram.program_name}
                  onChange={e => setManualProgram(p => ({ ...p, program_name: e.target.value }))}
                  placeholder="e.g. M.Sc. Data Science"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none' }}
                />
              </label>
              <label style={{ fontSize: 13, color: '#666', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontWeight: 600 }}>University *</span>
                <input
                  value={manualProgram.university}
                  onChange={e => setManualProgram(p => ({ ...p, university: e.target.value }))}
                  placeholder="e.g. TU Munich"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none' }}
                />
              </label>
              <label style={{ fontSize: 13, color: '#666', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontWeight: 600 }}>Degree level</span>
                <input
                  value={manualProgram.degree_level}
                  onChange={e => setManualProgram(p => ({ ...p, degree_level: e.target.value }))}
                  placeholder="e.g. Master's"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none' }}
                />
              </label>
              <label style={{ fontSize: 13, color: '#666', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontWeight: 600 }}>Subject area</span>
                <input
                  value={manualProgram.subject_area}
                  onChange={e => setManualProgram(p => ({ ...p, subject_area: e.target.value }))}
                  placeholder="e.g. Computer Science"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none' }}
                />
              </label>
              <button
                type="button"
                onClick={() => setShowProgramExtras(prev => !prev)}
                style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', fontSize: 13, color: '#666', background: '#fff', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
              >
                More program details (optional)
                <ChevronDown className="w-4 h-4" style={{ transition: 'transform 0.2s', transform: showProgramExtras ? 'rotate(180deg)' : 'none' }} />
              </button>
              {showProgramExtras && (
                <label style={{ fontSize: 13, color: '#666', display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1 / -1' }}>
                  <span style={{ fontWeight: 600 }}>Program highlights</span>
                  <textarea
                    value={manualProgram.description}
                    onChange={e => setManualProgram(p => ({ ...p, description: e.target.value }))}
                    placeholder="Key modules, unique labs, special tracks..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none', minHeight: 90, resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </label>
              )}
            </div>
          )}
        </section>

        {/* Applicant input */}
        <section style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 28, marginBottom: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>Tell us about yourself</p>
            <p style={{ fontSize: 14, color: '#737373', margin: 0 }}>Just share the essentials. You can optionally add more context.</p>
          </div>
          <div style={{ fontSize: 13, color: '#666', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            <span style={{ fontWeight: 600 }}>Full name *</span>
            <E
              value={userInput.fullName}
              onChange={val => setUserInput(prev => ({ ...prev, fullName: val }))}
              placeholder="e.g. Aisha Khan"
              maxLength={100}
              wordLimit={5}
              showWordCount={true}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {primaryFields.map(field => {
              const Icon = field.icon;
              return (
                <label key={field.key} style={{ fontSize: 13, color: '#666', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14, color: '#111' }}>
                    <Icon className="w-4 h-4" style={{ color: '#dd0000' }} />
                    {field.label}
                  </span>
                  <E
                    value={(userInput as any)[field.key] as string}
                    onChange={val => setUserInput(prev => ({ ...prev, [field.key]: val }))}
                    placeholder={field.placeholder}
                    multiline={true}
                    wordLimit={field.key === 'background' ? 100 : 50}
                    showWordCount={true}
                    style={{ minHeight: 90 }}
                  />
                </label>
              );
            })}
            <button
              type="button"
              onClick={() => setShowOptionalDetails(prev => !prev)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 12, border: '1px solid #e5e5e5', fontSize: 13, color: '#666', background: '#fff', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
            >
              Add more story (optional)
              <ChevronDown className="w-4 h-4" style={{ transition: 'transform 0.2s', transform: showOptionalDetails ? 'rotate(180deg)' : 'none' }} />
            </button>
            {showOptionalDetails && optionalFields.map(field => {
              const Icon = field.icon;
              return (
                <label key={field.key} style={{ fontSize: 13, color: '#666', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14, color: '#111' }}>
                    <Icon className="w-4 h-4" style={{ color: '#dd0000' }} />
                    {field.label}
                  </span>
                  <E
                    value={(userInput as any)[field.key] as string}
                    onChange={val => setUserInput(prev => ({ ...prev, [field.key]: val }))}
                    placeholder={field.placeholder}
                    multiline={true}
                    wordLimit={50}
                    showWordCount={true}
                    style={{ minHeight: 90 }}
                  />
                </label>
              );
            })}
          </div>
        </section>

        {/* CV upload */}
        <section style={{ background: '#fff', border: '2px dashed #e5e5e5', borderRadius: 20, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 12, background: 'rgba(221,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload className="w-6 h-6" style={{ color: '#dd0000' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>Upload CV (optional)</p>
                <p style={{ fontSize: 13, color: '#737373', margin: 0 }}>We extract snippets to personalize the tone.</p>
              </div>
            </div>
            {cvText ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, border: '1px solid #e5e5e5', background: '#fafafa' }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#111', margin: '0 0 2px' }}>{cvFileName}</p>
                  <p style={{ fontSize: 12, color: '#999', margin: 0 }}>{Math.max(1, Math.floor(cvText.length / 12))} words parsed</p>
                </div>
                <button onClick={removeCv} style={{ fontSize: 13, color: '#dd0000', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
              </div>
            ) : (
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '32px 24px', borderRadius: 16, border: '2px dashed #e5e5e5', background: '#fafafa', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#dd0000'; e.currentTarget.style.background = 'rgba(221,0,0,0.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.background = '#fafafa'; }}>
                {cvParsing ? <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#dd0000' }} /> : <FileText className="w-7 h-7" style={{ color: '#999' }} />}
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>Drop PDF here or click to upload</span>
                <span style={{ fontSize: 12, color: '#999' }}>Max 5MB</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) parseCv(file);
                  }}
                  className="hidden"
                />
              </label>
            )}
            {cvError && <p style={{ fontSize: 13, color: '#dc2626', margin: 0 }}>{cvError}</p>}
          </div>
        </section>

        {/* Actions */}
        <section style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24, marginBottom: 24 }}>
          {error && <div style={{ fontSize: 14, color: '#dc2626', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>{error}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={generateLetter}
              disabled={!canGenerate || loading}
              style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 24px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: loading || !canGenerate ? '#ccc' : 'linear-gradient(135deg, #dd0000, #7c3aed)', color: '#fff', border: 'none', cursor: loading || !canGenerate ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: loading || !canGenerate ? 'none' : '0 4px 16px rgba(221,0,0,0.2)', opacity: loading || !canGenerate ? 0.5 : 1 }}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
              {loading ? 'Generating...' : 'Generate letter'}
            </button>
            <button
              type="button"
              onClick={() => {
                setUserInput({
                  fullName: '',
                  background: '',
                  motivation: '',
                  careerGoals: '',
                  whyThisProgram: '',
                  relevantExperience: '',
                });
                setLetter('');
                removeCv();
              }}
              style={{ padding: '12px 24px', borderRadius: 12, border: '1px solid #e5e5e5', fontSize: 14, color: '#666', background: '#fff', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
            >
              Reset form
            </button>
          </div>
          {!canGenerate && (
            <p style={{ fontSize: 13, color: '#999', margin: '12px 0 0', textAlign: 'center' }}>Enter your name, background, and program info to enable the generator.</p>
          )}
        </section>

        {/* Letter preview */}
        <section ref={letterRef} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: 0 }}>Generated letter</h2>
              {letter && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={copyToClipboard} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '8px 16px', borderRadius: 10, border: '1px solid #e5e5e5', color: copied ? '#10b981' : '#666', background: '#fff', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>
                    {copied ? <Check className="w-4 h-4" style={{ color: '#10b981' }} /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button onClick={downloadLetter} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '8px 16px', borderRadius: 10, border: '1px solid #e5e5e5', color: '#666', background: '#fff', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>
                    <Download className="w-4 h-4" /> Save
                  </button>
                </div>
              )}
            </div>
          </div>
          {letter ? (
            <div style={{ borderRadius: 12, background: '#fafafa', border: '1px solid #e5e5e5', padding: 24 }}>
              <E
                value={letter}
                onChange={setLetter}
                placeholder="Your generated letter will appear here..."
                multiline={true}
                wordLimit={500}
                showWordCount={true}
                style={{ fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-line', color: '#111', minHeight: 400 }}
              />
            </div>
          ) : (
            <p style={{ fontSize: 14, color: '#999', display: 'flex', alignItems: 'center', gap: 8, margin: 0, padding: '40px 0', justifyContent: 'center' }}>
              <Sparkles className="w-5 h-5" /> Your AI-written letter will appear here.
            </p>
          )}
        </section>
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
