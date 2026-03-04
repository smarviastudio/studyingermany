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

const InputShell = ({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <div className="text-xs text-white/60 space-y-1">
    <span>
      {label}
      {required && <span className="text-red-300"> *</span>}
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
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
      <p className="text-sm font-medium text-white flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-indigo-300" /> {title}
      </p>
      <p className="text-xs text-white/60 mt-1 leading-relaxed">{body}</p>
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
    <div className="min-h-screen bg-[#04040d] text-white">
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-xs text-white/60 inline-flex items-center gap-2 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <NotebookPen className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold">Cover Letter Studio</span>
          </div>
          <div className="w-20" />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
          {/* Left Panel - Form */}
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">

            {/* Mode Selection */}
            <div className="flex items-center gap-3 text-xs">
              <span className="text-white/60">Mode:</span>
              <div className="flex rounded-lg border border-white/15 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMode('generate')}
                  className={`px-3 py-1.5 transition-colors ${mode === 'generate' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'}`}
                >
                  ✨ Generate
                </button>
                <button
                  type="button"
                  onClick={() => setMode('improve')}
                  className={`px-3 py-1.5 transition-colors ${mode === 'improve' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'}`}
                >
                  ♻️ Improve
                </button>
              </div>
            </div>

            {/* Job Details Section */}
            <section className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              <button
                onClick={() => toggleSection('job')}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">Job Details</span>
                  <span className="text-xs text-white/40">Required</span>
                </div>
                {expandedSections.job ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedSections.job && (
                <div className="px-4 pb-4 space-y-3">
                  <InputShell label="Role title" required>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 bg-white/5">
                      <Briefcase className="w-4 h-4 text-white/40" />
                      <input
                        type="text"
                        value={job.role}
                        onChange={(e) => setJob((p) => ({ ...p, role: e.target.value }))}
                        placeholder="e.g. Data Analyst Intern"
                        autoComplete="off"
                        className="flex-1 bg-transparent text-sm placeholder:text-white/30 outline-none"
                      />
                    </div>
                  </InputShell>
                  <InputShell label="Company" required>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 bg-white/5">
                      <Building2 className="w-4 h-4 text-white/40" />
                      <input
                        type="text"
                        value={job.company}
                        onChange={(e) => setJob((p) => ({ ...p, company: e.target.value }))}
                        placeholder="e.g. Siemens Mobility"
                        autoComplete="off"
                        className="flex-1 bg-transparent text-sm placeholder:text-white/30 outline-none"
                      />
                    </div>
                  </InputShell>
                  <InputShell label="Tone preference">
                    <select
                      value={job.tone}
                      onChange={(e) => setJob((p) => ({ ...p, tone: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-sm text-white outline-none"
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
                      className="w-full min-h-[80px] px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-sm placeholder:text-white/30 outline-none resize-none"
                    />
                  </InputShell>
                </div>
              )}
            </section>

            {/* Applicant Details Section */}
            <section className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              <button
                onClick={() => toggleSection('applicant')}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium">About You</span>
                  <span className="text-xs text-white/40">Required</span>
                </div>
                {expandedSections.applicant ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedSections.applicant && (
                <div className="px-4 pb-4 space-y-3">
                  <InputShell label="Full name" required>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5">
                      <User className="w-4 h-4 text-white/40" />
                      <input
                        type="text"
                        value={applicant.fullName}
                        onChange={(e) => setApplicant((p) => ({ ...p, fullName: e.target.value }))}
                        placeholder="e.g. Aisha Khan"
                        autoComplete="off"
                        className="flex-1 bg-transparent text-sm placeholder:text-white/30 outline-none"
                      />
                    </div>
                  </InputShell>
                  <InputShell label="Your elevator pitch" required>
                    <textarea
                      value={applicant.summary}
                      onChange={(e) => setApplicant((p) => ({ ...p, summary: e.target.value }))}
                      placeholder="One paragraph on who you are + what you bring."
                      className="w-full min-h-[80px] px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm placeholder:text-white/30 outline-none resize-none"
                    />
                  </InputShell>
                  <InputShell label="Strengths / skills">
                    <textarea
                      value={applicant.strengths}
                      onChange={(e) => setApplicant((p) => ({ ...p, strengths: e.target.value }))}
                      placeholder="Technical tools, languages, soft skills..."
                      className="w-full min-h-[70px] px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm placeholder:text-white/30 outline-none resize-none"
                    />
                  </InputShell>
                  <InputShell label="Achievements / proof">
                    <textarea
                      value={applicant.achievements}
                      onChange={(e) => setApplicant((p) => ({ ...p, achievements: e.target.value }))}
                      placeholder="Impact metrics, standout projects, leadership moments..."
                      className="w-full min-h-[70px] px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm placeholder:text-white/30 outline-none resize-none"
                    />
                  </InputShell>
                  <InputShell label="Closing preference">
                    <textarea
                      value={applicant.closing}
                      onChange={(e) => setApplicant((p) => ({ ...p, closing: e.target.value }))}
                      placeholder="Optional: specify availability, gratitude note, or CTA."
                      className="w-full min-h-[60px] px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm placeholder:text-white/30 outline-none resize-none"
                    />
                  </InputShell>
                </div>
              )}
            </section>

            {/* CV Upload Section */}
            <section className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] overflow-hidden">
              <button
                onClick={() => toggleSection('cv')}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium">Upload CV</span>
                  <span className="text-xs text-white/40">Optional</span>
                </div>
                {expandedSections.cv ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedSections.cv && (
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-xs text-white/60">We pull context (education, experience) to keep the letter personal.</p>
                  {cvSummary ? (
                    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
                      <div>
                        <p className="text-sm">{cvFileName}</p>
                        <p className="text-xs text-white/50">{Math.floor(cvSummary.length / 10)} words parsed</p>
                      </div>
                      <button onClick={removeCv} className="text-xs text-white/70 hover:text-white transition-colors">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 px-6 py-6 rounded-lg border border-dashed border-white/15 bg-white/[0.02] cursor-pointer text-sm text-white/70 hover:border-white/30 transition-colors">
                      {cvParsing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
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
                  {cvError && <p className="text-xs text-red-400">{cvError}</p>}
                </div>
              )}
            </section>

            {/* Tips */}
            <div className="space-y-2">
              <Tip title="Keep it specific" body="Mention 2-3 requirements from the job post so the letter mirrors what recruiters care about." />
              <Tip title="Show proof fast" body="Include one metric or result in your achievements field—the model will surface it in paragraph two." />
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-[#04040d] pt-4 pb-2 space-y-3">
              {error && <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">{error}</div>}
              <div className="flex gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={!requiredReady || loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-500 disabled:opacity-40 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
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
                  className="px-4 py-3 rounded-lg border border-white/10 text-sm text-white/70 hover:text-white hover:border-white/30 transition-colors"
                >
                  Reset
                </button>
              </div>
              {!requiredReady && (
                <p className="text-xs text-white/60 text-center">
                  Fill in role, company, your name, and a short summary to continue.
                </p>
              )}
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col h-full">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold">Preview</h2>
              </div>
              {letter && (
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {letter ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">
                    {letter}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-white/40">
                  <FileText className="w-12 h-12" />
                  <div>
                    <p className="text-sm font-medium text-white/60">
                      {mode === 'generate' ? 'Your AI-written letter will appear here' : 'Paste your draft below'}
                    </p>
                    <p className="text-xs mt-1">
                      {mode === 'generate'
                        ? 'Fill in the form and click "Draft Letter"'
                        : 'Add your draft in the textarea below and click "Improve Draft"'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {mode === 'improve' && (
              <div className="border-t border-white/10 p-4">
                <InputShell label="Your draft">
                  <textarea
                    value={letter}
                    onChange={(e) => setLetter(e.target.value)}
                    placeholder="Paste your existing cover letter here..."
                    className="w-full min-h-[120px] px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm placeholder:text-white/30 outline-none resize-none"
                  />
                </InputShell>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
