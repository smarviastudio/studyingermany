'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  ArrowLeft, Loader2, Download, Copy, Check, Sparkles, GraduationCap,
  ChevronDown, FileText, Wand2, User, BookOpen, Target, Briefcase,
  Heart, RefreshCw, CheckCircle2, Upload, X
} from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';
import type { Program } from '@/lib/types';

interface ShortlistItem {
  id: string;
  programId: string;
  programName: string;
  university: string;
}

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
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading shortlist...
              </div>
            ) : shortlist.length === 0 ? (
              <div className="text-sm text-white/60 space-y-2">
                <p>You have no shortlisted programs yet.</p>
                <Link href="/course-finder" className="text-blue-300 hover:text-blue-200 inline-flex items-center gap-1 text-xs">
                  Browse programs <ChevronDown className="w-3 h-3 -rotate-90" />
                </Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(prev => !prev)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between"
                >
                  {selectedItem ? (
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-blue-300" />
                      </div>
                      <div className="truncate">
                        <p className="text-sm truncate">{selectedItem.programName}</p>
                        <p className="text-xs text-white/50 truncate">{selectedItem.university}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-white/40">Select a shortlisted program</span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-white/40 transition ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showDropdown && (
                  <div className="absolute left-0 right-0 mt-2 rounded-xl border border-white/10 bg-[#111126] shadow-2xl shadow-black/40 max-h-64 overflow-auto z-40">
                    {shortlist.map(item => (
                      <button
                        key={item.id}
                        onClick={() => selectProgram(item.programId)}
                        className={`w-full text-left px-4 py-3 border-b border-white/5 last:border-0 flex items-center gap-3 hover:bg-white/5 transition ${item.programId === selectedProgramId ? 'bg-blue-500/10' : ''}`}
                      >
                        <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center">
                          <GraduationCap className="w-3.5 h-3.5 text-white/60" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm truncate">{item.programName}</p>
                          <p className="text-xs text-white/50 truncate">{item.university}</p>
                        </div>
                        {item.programId === selectedProgramId && <CheckCircle2 className="w-4 h-4 text-blue-400 ml-auto" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-xs text-white/60 space-y-1">
                <span>Program name *</span>
                <input
                  value={manualProgram.program_name}
                  onChange={e => setManualProgram(p => ({ ...p, program_name: e.target.value }))}
                  placeholder="e.g. M.Sc. Data Science"
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02] text-sm placeholder:text-white/30"
                />
              </label>
              <label className="text-xs text-white/60 space-y-1">
                <span>University *</span>
                <input
                  value={manualProgram.university}
                  onChange={e => setManualProgram(p => ({ ...p, university: e.target.value }))}
                  placeholder="e.g. TU Munich"
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02] text-sm placeholder:text-white/30"
                />
              </label>
              <label className="text-xs text-white/60 space-y-1">
                <span>Degree level</span>
                <input
                  value={manualProgram.degree_level}
                  onChange={e => setManualProgram(p => ({ ...p, degree_level: e.target.value }))}
                  placeholder="e.g. Master's"
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02] text-sm placeholder:text-white/30"
                />
              </label>
              <label className="text-xs text-white/60 space-y-1">
                <span>Subject area</span>
                <input
                  value={manualProgram.subject_area}
                  onChange={e => setManualProgram(p => ({ ...p, subject_area: e.target.value }))}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02] text-sm placeholder:text-white/30"
                />
              </label>
              <button
                type="button"
                onClick={() => setShowProgramExtras(prev => !prev)}
                className="md:col-span-2 flex items-center justify-between px-3 py-2 rounded-lg border border-white/10 text-xs text-white/70 hover:text-white"
              >
                More program details (optional)
                <ChevronDown className={`w-4 h-4 transition ${showProgramExtras ? 'rotate-180' : ''}`} />
              </button>
              {showProgramExtras && (
                <label className="text-xs text-white/60 space-y-1 md:col-span-2">
                  <span>Program highlights</span>
                  <textarea
                    value={manualProgram.description}
                    onChange={e => setManualProgram(p => ({ ...p, description: e.target.value }))}
                    placeholder="Key modules, unique labs, special tracks..."
                    className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02] text-sm placeholder:text-white/30 min-h-[90px]"
                  />
                </label>
              )}
            </div>
          )}
        </section>

        {/* Applicant input */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
          <div>
            <p className="text-sm font-medium">Tell us about yourself</p>
            <p className="text-xs text-white/50">Just share the essentials. You can optionally add more context.</p>
          </div>
          <label className="text-xs text-white/60 space-y-1">
            <span>Full name *</span>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02]">
              <User className="w-4 h-4 text-white/40" />
              <input
                value={userInput.fullName}
                onChange={e => setUserInput(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="e.g. Aisha Khan"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/30"
              />
            </div>
          </label>
          <div className="grid gap-4">
            {primaryFields.map(field => {
              const Icon = field.icon;
              return (
                <label key={field.key} className="text-xs text-white/60 space-y-2">
                  <span className="inline-flex items-center gap-2 text-white/80 text-[13px]">
                    <Icon className="w-3.5 h-3.5 text-white/40" />
                    {field.label}
                  </span>
                  <textarea
                    value={(userInput as any)[field.key] as string}
                    onChange={e => setUserInput(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/[0.02] text-sm leading-6 placeholder:text-white/30 min-h-[90px]"
                  />
                </label>
              );
            })}
            <button
              type="button"
              onClick={() => setShowOptionalDetails(prev => !prev)}
              className="flex items-center justify-between px-3 py-2 rounded-xl border border-white/10 text-xs text-white/70 hover:text-white"
            >
              Add more story (optional)
              <ChevronDown className={`w-4 h-4 transition ${showOptionalDetails ? 'rotate-180' : ''}`} />
            </button>
            {showOptionalDetails && optionalFields.map(field => {
              const Icon = field.icon;
              return (
                <label key={field.key} className="text-xs text-white/60 space-y-2">
                  <span className="inline-flex items-center gap-2 text-white/80 text-[13px]">
                    <Icon className="w-3.5 h-3.5 text-white/40" />
                    {field.label}
                  </span>
                  <textarea
                    value={(userInput as any)[field.key] as string}
                    onChange={e => setUserInput(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/[0.02] text-sm leading-6 placeholder:text-white/30 min-h-[90px]"
                  />
                </label>
              );
            })}
          </div>
        </section>

        {/* CV upload */}
        <section className="rounded-2xl border border-dashed border-white/15 bg-white/[0.01] p-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
              <Upload className="w-5 h-5 text-white/50" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-sm font-medium">Upload CV (optional)</p>
                <p className="text-xs text-white/50">We extract snippets to personalize the tone.</p>
              </div>
              {cvText ? (
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <div>
                    <p className="text-sm">{cvFileName}</p>
                    <p className="text-xs text-white/50">{Math.max(1, Math.floor(cvText.length / 12))} words parsed</p>
                  </div>
                  <button onClick={removeCv} className="text-xs text-white/60 hover:text-white">Remove</button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 px-6 py-8 rounded-2xl border border-white/10 bg-white/[0.02] cursor-pointer">
                  {cvParsing ? <Loader2 className="w-5 h-5 text-white/60 animate-spin" /> : <FileText className="w-6 h-6 text-white/50" />}
                  <span className="text-sm">Drop PDF here or click to upload</span>
                  <span className="text-xs text-white/40">Max 5MB</span>
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
              {cvError && <p className="text-xs text-red-400">{cvError}</p>}
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
          {error && <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">{error}</div>}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={generateLetter}
              disabled={!canGenerate || loading}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-500 disabled:opacity-40"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
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
              className="px-4 py-3 rounded-xl border border-white/10 text-sm text-white/70 hover:text-white"
            >
              Reset form
            </button>
          </div>
          {!canGenerate && (
            <p className="text-xs text-white/50">Enter your name, background, and program info to enable the generator.</p>
          )}
        </section>

        {/* Letter preview */}
        <section ref={letterRef} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h2 className="text-lg font-semibold">Generated letter</h2>
            {letter && (
              <div className="flex items-center gap-2">
                <button onClick={copyToClipboard} className="inline-flex items-center gap-1 text-xs px-3 py-2 rounded-lg border border-white/10 text-white/80">
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button onClick={downloadLetter} className="inline-flex items-center gap-1 text-xs px-3 py-2 rounded-lg border border-white/10 text-white/80">
                  <Download className="w-4 h-4" /> Save
                </button>
              </div>
            )}
          </div>
          {letter ? (
            <div className="rounded-xl bg-black/25 border border-white/5 p-5 text-sm leading-7 whitespace-pre-line text-white/90">
              {letter}
            </div>
          ) : (
            <p className="text-sm text-white/50 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Your AI-written letter will appear here.
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
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    }>
      <MotivationLetterContent />
    </Suspense>
  );
}
