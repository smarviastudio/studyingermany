'use client';

import { useState, useRef } from 'react';
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
} from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';

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

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #dd0000, #7c3aed)', marginBottom: 16, boxShadow: '0 8px 24px rgba(221,0,0,0.2)' }}>
            <NotebookPen className="w-8 h-8" style={{ color: '#fff' }} />
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#0a0a0a', margin: '0 0 12px' }}>Cover Letter Studio</h1>
          <p style={{ fontSize: 16, color: '#737373', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>Create professional cover letters in minutes with AI assistance</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 24 }}>
          {/* Left Panel - Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

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

            {/* Job Details Section */}
            <section style={{ borderRadius: 16, border: '1px solid #ebebeb', background: '#fff', overflow: 'hidden' }}>
              <button
                onClick={() => toggleSection('job')}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Briefcase className="w-5 h-5" style={{ color: '#dd0000' }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>Job Details</span>
                  <span style={{ fontSize: 12, color: '#999', fontWeight: 600 }}>Required</span>
                </div>
                {expandedSections.job ? <ChevronUp className="w-4 h-4" style={{ color: '#999' }} /> : <ChevronDown className="w-4 h-4" style={{ color: '#999' }} />}
              </button>
              {expandedSections.job && (
                <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <InputShell label="Role title" required>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff' }}>
                      <Briefcase className="w-4 h-4" style={{ color: '#999' }} />
                      <input
                        type="text"
                        value={job.role}
                        onChange={(e) => setJob((p) => ({ ...p, role: e.target.value }))}
                        placeholder="e.g. Data Analyst Intern"
                        autoComplete="off"
                        style={{ flex: 1, background: 'transparent', fontSize: 14, color: '#111', border: 'none', outline: 'none' }}
                      />
                    </div>
                  </InputShell>
                  <InputShell label="Company" required>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff' }}>
                      <Building2 className="w-4 h-4" style={{ color: '#999' }} />
                      <input
                        type="text"
                        value={job.company}
                        onChange={(e) => setJob((p) => ({ ...p, company: e.target.value }))}
                        placeholder="e.g. Siemens Mobility"
                        autoComplete="off"
                        style={{ flex: 1, background: 'transparent', fontSize: 14, color: '#111', border: 'none', outline: 'none' }}
                      />
                    </div>
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
                    <textarea
                      value={job.jobDescription}
                      onChange={(e) => setJob((p) => ({ ...p, jobDescription: e.target.value }))}
                      placeholder="Paste key requirements or highlights..."
                      style={{ width: '100%', minHeight: 80, padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </InputShell>
                </div>
              )}
            </section>

            {/* Applicant Details Section */}
            <section style={{ borderRadius: 16, border: '1px solid #ebebeb', background: '#fff', overflow: 'hidden' }}>
              <button
                onClick={() => toggleSection('applicant')}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <User className="w-5 h-5" style={{ color: '#dd0000' }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>About You</span>
                  <span style={{ fontSize: 12, color: '#999', fontWeight: 600 }}>Required</span>
                </div>
                {expandedSections.applicant ? <ChevronUp className="w-4 h-4" style={{ color: '#999' }} /> : <ChevronDown className="w-4 h-4" style={{ color: '#999' }} />}
              </button>
              {expandedSections.applicant && (
                <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <InputShell label="Full name" required>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff' }}>
                      <User className="w-4 h-4" style={{ color: '#999' }} />
                      <input
                        type="text"
                        value={applicant.fullName}
                        onChange={(e) => setApplicant((p) => ({ ...p, fullName: e.target.value }))}
                        placeholder="e.g. Aisha Khan"
                        autoComplete="off"
                        style={{ flex: 1, background: 'transparent', fontSize: 14, color: '#111', border: 'none', outline: 'none' }}
                      />
                    </div>
                  </InputShell>
                  <InputShell label="Your elevator pitch" required>
                    <textarea
                      value={applicant.summary}
                      onChange={(e) => setApplicant((p) => ({ ...p, summary: e.target.value }))}
                      placeholder="One paragraph on who you are + what you bring."
                      style={{ width: '100%', minHeight: 80, padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </InputShell>
                  <InputShell label="Strengths / skills">
                    <textarea
                      value={applicant.strengths}
                      onChange={(e) => setApplicant((p) => ({ ...p, strengths: e.target.value }))}
                      placeholder="Technical tools, languages, soft skills..."
                      style={{ width: '100%', minHeight: 70, padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </InputShell>
                  <InputShell label="Achievements / proof">
                    <textarea
                      value={applicant.achievements}
                      onChange={(e) => setApplicant((p) => ({ ...p, achievements: e.target.value }))}
                      placeholder="Impact metrics, standout projects, leadership moments..."
                      style={{ width: '100%', minHeight: 70, padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </InputShell>
                  <InputShell label="Closing preference">
                    <textarea
                      value={applicant.closing}
                      onChange={(e) => setApplicant((p) => ({ ...p, closing: e.target.value }))}
                      placeholder="Optional: specify availability, gratitude note, or CTA."
                      style={{ width: '100%', minHeight: 60, padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </InputShell>
                </div>
              )}
            </section>

            {/* CV Upload Section */}
            <section style={{ borderRadius: 16, border: '2px dashed #e5e5e5', background: '#fff', overflow: 'hidden' }}>
              <button
                onClick={() => toggleSection('cv')}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Upload className="w-5 h-5" style={{ color: '#dd0000' }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>Upload CV</span>
                  <span style={{ fontSize: 12, color: '#999', fontWeight: 600 }}>Optional</span>
                </div>
                {expandedSections.cv ? <ChevronUp className="w-4 h-4" style={{ color: '#999' }} /> : <ChevronDown className="w-4 h-4" style={{ color: '#999' }} />}
              </button>
              {expandedSections.cv && (
                <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p style={{ fontSize: 13, color: '#999' }}>We pull context (education, experience) to keep the letter personal.</p>
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
              )}
            </section>

            {/* Tips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Tip title="Keep it specific" body="Mention 2-3 requirements from the job post so the letter mirrors what recruiters care about." />
              <Tip title="Show proof fast" body="Include one metric or result in your achievements field—the model will surface it in paragraph two." />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '20px', background: '#fff', borderRadius: 16, border: '1px solid #ebebeb', position: 'sticky', bottom: 24 }}>
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
          </div>

          {/* Right Panel - Preview */}
          <div style={{ borderRadius: 16, border: '1px solid #ebebeb', background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f5f5f5', background: '#fafafa' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText className="w-5 h-5" style={{ color: '#dd0000' }} />
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: 0 }}>Preview</h2>
              </div>
              {letter && (
                <button
                  onClick={copyToClipboard}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '8px 16px', borderRadius: 10, border: '1px solid #e5e5e5', color: copied ? '#10b981' : '#666', background: '#fff', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                >
                  {copied ? <Check className="w-4 h-4" style={{ color: '#10b981' }} /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
              {letter ? (
                <div style={{ whiteSpace: 'pre-wrap', fontSize: 15, lineHeight: 1.8, color: '#111' }}>
                  {letter}
                </div>
              ) : (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 12, color: '#999' }}>
                  <FileText className="w-12 h-12" />
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#666', margin: 0 }}>
                      {mode === 'generate' ? 'Your AI-written letter will appear here' : 'Paste your draft below'}
                    </p>
                    <p style={{ fontSize: 13, marginTop: 4, margin: '4px 0 0' }}>
                      {mode === 'generate'
                        ? 'Fill in the form and click "Draft Letter"'
                        : 'Add your draft in the textarea below and click "Improve Draft"'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {mode === 'improve' && (
              <div style={{ borderTop: '1px solid #f5f5f5', padding: 16 }}>
                <InputShell label="Your draft">
                  <textarea
                    value={letter}
                    onChange={(e) => setLetter(e.target.value)}
                    placeholder="Paste your existing cover letter here..."
                    style={{ width: '100%', minHeight: 120, padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </InputShell>
              </div>
            )}
          </div>
        </div>
      </main>

    </div>
  );
}
