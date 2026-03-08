'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  Wand2,
  User,
  Building2,
  Briefcase,
  Target,
  NotebookPen,
  Paperclip,
  FileText,
  Sparkles,
  Upload,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Edit3,
  Save,
  X,
} from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';

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

const InputShell = ({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <div style={{ fontSize: 13, color: '#666', display: 'flex', flexDirection: 'column', gap: 6 }}>
    <span style={{ fontWeight: 600 }}>
      {label}
      {required && <span style={{ color: '#dd0000' }}> *</span>}
    </span>
    {children}
  </div>
);

const initialJob = {
  role: '',
  company: '',
  jobDescription: '',
  tone: 'Professional & warm',
};

const initialApplicant = {
  fullName: '',
  summary: '',
  strengths: '',
  achievements: '',
  closing: '',
};

function Tip({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ borderRadius: 12, border: '1px solid #e5e5e5', background: 'rgba(221,0,0,0.03)', padding: '12px 16px' }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: '#111', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
        <Sparkles className="w-4 h-4" style={{ color: '#dd0000' }} /> {title}
      </p>
      <p style={{ fontSize: 13, color: '#666', marginTop: 4, lineHeight: 1.5, margin: '4px 0 0' }}>{body}</p>
    </div>
  );
}

export default function CoverLetterPage() {
  const [mode, setMode] = useState<'generate' | 'improve'>('generate');
  const [job, setJob] = useState(initialJob);
  const [applicant, setApplicant] = useState(initialApplicant);
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [cvParsing, setCvParsing] = useState(false);
  const [cvError, setCvError] = useState('');
  const [cvSummary, setCvSummary] = useState('');
  const [cvFileName, setCvFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [expandedSections, setExpandedSections] = useState({
    job: true,
    applicant: true,
    cv: false,
  });

  const toggleSection = (section: 'job' | 'applicant' | 'cv') => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const requiredReady =
    job.role.trim() &&
    job.company.trim() &&
    applicant.fullName.trim() &&
    applicant.summary.trim() &&
    (mode === 'generate' ? true : letter.trim().length > 80);

  const parseCv = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setCvError('Please upload a PDF file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCvError('File too large (max 5MB).');
      return;
    }
    try {
      setCvParsing(true);
      setCvError('');
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/parse-cv', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to parse CV');
      }
      const data = await res.json();
      setCvSummary(data.text);
      setCvFileName(file.name);
      if (!applicant.summary.trim()) {
        const snippet = data.text.split('\n').slice(0, 3).join(' ').slice(0, 160);
        setApplicant((prev) => ({ ...prev, summary: snippet }));
      }
    } catch (err) {
      setCvError(err instanceof Error ? err.message : 'Failed to parse CV');
    } finally {
      setCvParsing(false);
    }
  };

  const removeCv = () => {
    setCvSummary('');
    setCvFileName('');
    setCvError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (!requiredReady) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          job,
          applicant,
          draftText: mode === 'improve' ? letter : undefined,
          cvText: cvSummary || undefined,
        }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || errData.error || 'Failed to generate cover letter');
      }
      const data = await response.json();
      setLetter(data.letter);
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate cover letter');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <SiteNav />

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px 80px' }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #dd0000, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(221,0,0,0.2)' }}>
            <NotebookPen className="w-8 h-8" style={{ color: '#fff' }} />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#0a0a0a', margin: '0 0 6px' }}>Cover Letter Studio</h1>
            <p style={{ fontSize: 15, color: '#737373', margin: 0 }}>Create professional cover letters in minutes with AI assistance</p>
          </div>
        </header>

        {/* Job Details Section */}
        <section style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 28, marginBottom: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>Job details</p>
              <p style={{ fontSize: 14, color: '#737373', margin: 0 }}>Fill in the job information you're applying for.</p>
            </div>
            {/* Mode Selection */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
              <span style={{ color: '#999', fontWeight: 600 }}>Mode:</span>
              <div style={{ display: 'flex', borderRadius: 10, border: '1px solid #e5e5e5', overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setMode('generate')}
                  style={{ padding: '8px 16px', background: mode === 'generate' ? '#dd0000' : 'transparent', color: mode === 'generate' ? '#fff' : '#666', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                >
                  ✨ Generate
                </button>
                <button
                  type="button"
                  onClick={() => setMode('improve')}
                  style={{ padding: '8px 16px', background: mode === 'improve' ? '#dd0000' : 'transparent', color: mode === 'improve' ? '#fff' : '#666', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                >
                  ♻️ Improve
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <InputShell label="Role title" required>
              <E
                value={job.role}
                onChange={val => setJob(prev => ({ ...prev, role: val }))}
                placeholder="e.g. Data Analyst Intern"
                maxLength={100}
                wordLimit={10}
                showWordCount={true}
              />
            </InputShell>
            <InputShell label="Company" required>
              <E
                value={job.company}
                onChange={val => setJob(prev => ({ ...prev, company: val }))}
                placeholder="e.g. Siemens Mobility"
                maxLength={100}
                wordLimit={5}
                showWordCount={true}
              />
            </InputShell>
            <InputShell label="Tone preference">
              <select
                value={job.tone}
                onChange={(e) => setJob((p) => ({ ...p, tone: e.target.value }))}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                <option value="Professional & warm">Professional & warm</option>
                <option value="Bold & confident">Bold & confident</option>
                <option value="Humble & eager">Humble & eager</option>
              </select>
            </InputShell>
            <InputShell label="Job description">
              <E
                value={job.jobDescription}
                onChange={val => setJob(prev => ({ ...prev, jobDescription: val }))}
                placeholder="Paste key requirements or highlights..."
                multiline={true}
                wordLimit={150}
                showWordCount={true}
              />
            </InputShell>
          </div>
        </section>

        {/* Applicant Details Section */}
        <section style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 28, marginBottom: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>About you</p>
              <p style={{ fontSize: 14, color: '#737373', margin: 0 }}>Tell us about yourself and your qualifications.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <InputShell label="Full name" required>
              <E
                value={applicant.fullName}
                onChange={val => setApplicant(prev => ({ ...prev, fullName: val }))}
                placeholder="e.g. Aisha Khan"
                maxLength={100}
                wordLimit={5}
                showWordCount={true}
              />
            </InputShell>
            <InputShell label="Your elevator pitch" required>
              <E
                value={applicant.summary}
                onChange={val => setApplicant(prev => ({ ...prev, summary: val }))}
                placeholder="One paragraph on who you are + what you bring."
                multiline={true}
                wordLimit={50}
                showWordCount={true}
              />
            </InputShell>
            <InputShell label="Strengths / skills">
              <E
                value={applicant.strengths}
                onChange={val => setApplicant(prev => ({ ...prev, strengths: val }))}
                placeholder="Technical tools, languages, soft skills..."
                multiline={true}
                wordLimit={100}
                showWordCount={true}
              />
            </InputShell>
            <InputShell label="Achievements / proof">
              <E
                value={applicant.achievements}
                onChange={val => setApplicant(prev => ({ ...prev, achievements: val }))}
                placeholder="Impact metrics, standout projects, leadership moments..."
                multiline={true}
                wordLimit={100}
                showWordCount={true}
              />
            </InputShell>
            <InputShell label="Closing preference">
              <E
                value={applicant.closing}
                onChange={val => setApplicant(prev => ({ ...prev, closing: val }))}
                placeholder="Optional: specify availability, gratitude note, or CTA."
                multiline={true}
                wordLimit={50}
                showWordCount={true}
              />
            </InputShell>
          </div>
        </section>

        {/* CV Upload Section */}
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
            {cvSummary ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, border: '1px solid #e5e5e5', background: '#fafafa' }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#111', margin: '0 0 2px' }}>{cvFileName}</p>
                  <p style={{ fontSize: 12, color: '#999', margin: 0 }}>{Math.floor(cvSummary.length / 10)} words parsed</p>
                </div>
                <button onClick={removeCv} style={{ fontSize: 13, color: '#dd0000', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Remove
                </button>
              </div>
            ) : (
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '24px', borderRadius: 12, border: '2px dashed #e5e5e5', background: '#fafafa', cursor: 'pointer', fontSize: 14, color: '#666', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#dd0000'; e.currentTarget.style.background = 'rgba(221,0,0,0.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.background = '#fafafa'; }}>
                {cvParsing ? <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#dd0000' }} /> : <Paperclip className="w-5 h-5" />}
                Upload PDF (max 5MB)
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) parseCv(file);
                  }}
                />
              </label>
            )}
            {cvError && <p style={{ fontSize: 13, color: '#dc2626', margin: 0 }}>{cvError}</p>}
          </div>
        </section>

        {/* Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          <Tip title="Keep it specific" body="Mention 2-3 requirements from the job post so the letter mirrors what recruiters care about." />
          <Tip title="Show proof fast" body="Include one metric or result in your achievements field—the model will surface it in paragraph two." />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '20px', background: '#fff', borderRadius: 16, border: '1px solid #ebebeb', marginBottom: 24 }}>
          {error && <div style={{ fontSize: 14, color: '#dc2626', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 16px' }}>{error}</div>}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handleGenerate}
              disabled={!requiredReady || loading}
              style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 24px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: loading || !requiredReady ? '#ccc' : 'linear-gradient(135deg, #dd0000, #7c3aed)', color: '#fff', border: 'none', cursor: loading || !requiredReady ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: loading || !requiredReady ? 'none' : '0 4px 16px rgba(221,0,0,0.2)', opacity: loading || !requiredReady ? 0.5 : 1 }}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
              {mode === 'generate' ? 'Draft Letter' : 'Improve Draft'}
            </button>
            <button
              type="button"
              onClick={() => {
                setLetter('');
                setJob(initialJob);
                setApplicant(initialApplicant);
                removeCv();
              }}
              style={{ padding: '12px 24px', borderRadius: 12, border: '1px solid #e5e5e5', fontSize: 14, color: '#666', background: '#fff', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
            >
              Reset
            </button>
          </div>
          {!requiredReady && (
            <p style={{ fontSize: 13, color: '#999', textAlign: 'center', margin: 0 }}>
              Fill in role, company, your name, and a short summary to continue.
            </p>
          )}
        </div>

        {/* Letter Preview with Inline Editing */}
        {letter && (
          <section style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 28 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: 0 }}>Generated letter</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={copyToClipboard} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '8px 16px', borderRadius: 10, border: '1px solid #e5e5e5', color: copied ? '#10b981' : '#666', background: '#fff', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>
                    {copied ? <Check className="w-4 h-4" style={{ color: '#10b981' }} /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button onClick={() => window.print()} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '8px 16px', borderRadius: 10, border: '1px solid #e5e5e5', color: '#666', background: '#fff', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>
                    <FileText className="w-4 h-4" /> Save
                  </button>
                </div>
              </div>
            </div>
            <div style={{ padding: 20, background: '#fafafa', borderRadius: 12, border: '1px solid #f5f5f5' }}>
              <E
                value={letter}
                onChange={setLetter}
                placeholder="Your generated letter will appear here..."
                multiline={true}
                wordLimit={500}
                showWordCount={true}
                style={{ minHeight: 400 }}
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

            
