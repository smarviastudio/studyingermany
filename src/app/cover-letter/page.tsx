'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  ArrowLeft, Loader2, Wand2, NotebookPen,
  FileText, Sparkles, Check, Copy, RefreshCw,
  Briefcase, User, Download,
} from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';
import { PaywallModal } from '@/components/PaywallModal';
import { useProfileData } from '@/hooks/useProfileData';

const Field = ({
  label, required, hint, children,
}: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {label}{required && <span style={{ color: '#dd0000', marginLeft: 2 }}>*</span>}
    </label>
    {children}
    {hint && <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{hint}</p>}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0',
  fontSize: 14, color: '#1e293b', outline: 'none', background: '#f8fafc', fontFamily: 'inherit',
  transition: 'all 0.2s ease', cursor: 'text', boxSizing: 'border-box',
};

const taStyle: React.CSSProperties = {
  ...inputStyle, resize: 'vertical', minHeight: 100, lineHeight: 1.7,
};

const TONES = ['Professional & warm', 'Bold & confident', 'Humble & eager', 'Formal & structured'];

export default function CoverLetterPage() {
  const { data: session } = useSession();
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('Professional & warm');
  const [fullName, setFullName] = useState('');
  const [background, setBackground] = useState('');
  const [strengths, setStrengths] = useState('');
  const [achievements, setAchievements] = useState('');
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallData, setPaywallData] = useState<{ current: number; limit: number } | null>(null);
  const [signInPrompt, setSignInPrompt] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const requiredReady2 = role.trim() && company.trim() && fullName.trim() && background.trim();

  const profileEnabled = !!session?.user;
  const { profile: profileData } = useProfileData(profileEnabled);

  useEffect(() => {
    if (!profileData) return;
    if (!fullName && profileData.fullName) setFullName(profileData.fullName);
    const profileBackground = profileData.backgroundSummary || profileData.academicBackground;
    if (!background && profileBackground) setBackground(profileBackground);
    if (!strengths && profileData.skills) setStrengths(profileData.skills);
    if (!achievements && profileData.experienceHighlights) setAchievements(profileData.experienceHighlights);
  }, [profileData, fullName, background, strengths, achievements]);

  const handleGenerate = async () => {
    if (!requiredReady2) return;
    if (!session) { setSignInPrompt(true); return; }
    try {
      setLoading(true); setError(null);
      const response = await fetch('/api/cover-letter/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'generate', job: { role, company, jobDescription, tone }, applicant: { fullName, summary: background, strengths, achievements, closing: '' } }),
      });
      if (response.status === 402) { const e = await response.json().catch(() => ({})); setPaywallData({ current: e.current ?? 0, limit: e.limit ?? 3 }); setPaywallOpen(true); return; }
      if (!response.ok) { const e = await response.json().catch(() => ({})); throw new Error(e.message || e.error || 'Failed'); }
      const data = await response.json();
      setLetter(data.letter);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to generate'); }
    finally { setLoading(false); }
  };

  const copyToClipboard = () => { navigator.clipboard.writeText(letter); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const downloadLetter = () => {
    const blob = new Blob([letter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `cover-letter-${company || 'letter'}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const steps = [
    { id: 1, label: 'Job details', icon: Briefcase, done: !!(role && company) },
    { id: 2, label: 'About you', icon: User, done: !!(fullName && background) },
    { id: 3, label: 'Generate', icon: Sparkles, done: !!letter },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <PaywallModal isOpen={paywallOpen} onClose={() => setPaywallOpen(false)} feature="cover letter generations" currentUsage={paywallData?.current} limit={paywallData?.limit} />

      {signInPrompt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' }} onClick={() => setSignInPrompt(false)}>
          <div style={{ background: '#fff', borderRadius: 24, padding: '40px 36px', maxWidth: 400, width: '100%', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto', textAlign: 'center', boxShadow: '0 32px 80px rgba(0,0,0,0.22)', margin: 'auto 0' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(135deg,#dd0000,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><NotebookPen size={26} color="#fff" /></div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', margin: '0 0 8px' }}>Sign in to generate</h2>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, margin: '0 0 24px' }}>Free account gives you 3 cover letters per month — no credit card needed.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="/auth/signin?callbackUrl=/cover-letter" style={{ padding: '13px', borderRadius: 12, background: 'linear-gradient(135deg,#dd0000,#7c3aed)', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'block' }}>Sign in</a>
              <a href="/auth/register?callbackUrl=/cover-letter" style={{ padding: '13px', borderRadius: 12, background: '#f5f5f5', color: '#111', fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'block' }}>Create free account</a>
            </div>
            <button onClick={() => setSignInPrompt(false)} style={{ marginTop: 14, background: 'none', border: 'none', color: '#aaa', fontSize: 13, cursor: 'pointer' }}>Maybe later</button>
          </div>
        </div>
      )}

      <SiteNav />

      {/* Hero bar */}
      {/* Hero bar - Cleaner design */}
      <div className="tool-hero-bar" style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', padding: '32px 24px 28px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Link href="/cover-letter/landing" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none', marginBottom: 16, fontWeight: 500 }}>
            <ArrowLeft size={14} /> Back
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="tool-hero-icon" style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <NotebookPen size={22} color="#fff" />
            </div>
            <div>
              <h1 className="tool-hero-title" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 700, color: '#fff', margin: '0 0 2px' }}>Cover Letter</h1>
              <p className="tool-hero-subtitle" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>AI-powered letters for German employers</p>
            </div>
          </div>

          {/* Progress Steps - Simplified */}
          <div className="tool-progress-steps" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
            {steps.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, background: s.done ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: s.done ? '#22c55e' : 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {s.done ? <Check size={11} color="#fff" /> : <s.icon size={10} color="rgba(255,255,255,0.7)" />}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: s.done ? '#86efac' : 'rgba(255,255,255,0.7)' }}>{s.label}</span>
                </div>
                {i < steps.length - 1 && <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.2)' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="tool-main" style={{ maxWidth: 1100, margin: '0 auto', padding: '98px 24px 80px' }}>
        <div className="tool-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

          {/* LEFT — Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Job Card - Cleaner design */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#ef4444,#f87171)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(239,68,68,0.2)' }}>
                  <Briefcase size={18} color="#fff" />
                </div>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: 0 }}>Job Details</h2>
                  <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Position information</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="tool-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="Role title" required>
                    <input style={inputStyle} value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Data Analyst Intern" />
                  </Field>
                  <Field label="Company" required>
                    <input style={inputStyle} value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Siemens Mobility" />
                  </Field>
                </div>
                <Field label="Writing tone">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {TONES.map(t => (
                      <button key={t} onClick={() => setTone(t)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, border: `1.5px solid ${tone === t ? '#dd0000' : '#e5e5e5'}`, background: tone === t ? 'rgba(221,0,0,0.06)' : '#fff', color: tone === t ? '#dd0000' : '#666', cursor: 'pointer', transition: 'all 0.18s' }}>{t}</button>
                    ))}
                  </div>
                </Field>
                <Field label="Job description" hint="Paste 3-5 key requirements for a tailored result">
                  <textarea style={taStyle} value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste the job description or key requirements..." rows={4} />
                </Field>
              </div>
            </div>

            {/* About You Card - Cleaner design */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#8b5cf6,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(139,92,246,0.2)' }}>
                  <User size={18} color="#fff" />
                </div>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: 0 }}>About You</h2>
                  <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Your background & strengths</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="Full name" required>
                  <input style={inputStyle} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Aisha Khan" />
                </Field>
                <Field label="Your background" required hint="A short intro — studies, key skills, what drives you">
                  <textarea style={taStyle} value={background} onChange={e => setBackground(e.target.value)} placeholder="Computer Science graduate with 2 years in data engineering, passionate about AI..." rows={3} />
                </Field>
                <Field label="Key strengths & skills" hint="Tools, languages, soft skills">
                  <textarea style={{ ...taStyle, minHeight: 70 }} value={strengths} onChange={e => setStrengths(e.target.value)} placeholder="Python, SQL, teamwork, communication..." rows={2} />
                </Field>
                <Field label="Standout achievement" hint="One metric or result that proves your value">
                  <textarea style={{ ...taStyle, minHeight: 70 }} value={achievements} onChange={e => setAchievements(e.target.value)} placeholder="Built a dashboard that reduced reporting time by 40%..." rows={2} />
                </Field>
              </div>
            </div>

            {/* Generate Button */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' }}>
              {error && <div style={{ fontSize: 13, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>{error}</div>}
              <button
                onClick={handleGenerate}
                disabled={!requiredReady2 || loading}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '15px', borderRadius: 14, fontSize: 15, fontWeight: 800, background: !requiredReady2 || loading ? '#e5e7eb' : 'linear-gradient(135deg,#dd0000,#7c3aed)', color: !requiredReady2 || loading ? '#9ca3af' : '#fff', border: 'none', cursor: !requiredReady2 || loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: !requiredReady2 || loading ? 'none' : '0 4px 20px rgba(221,0,0,0.25)' }}
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Generating…</> : <><Wand2 size={18} /> Generate Cover Letter</>}
              </button>
              {!requiredReady2 && <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 8, marginBottom: 0 }}>Fill in role, company, your name and background to continue</p>}
              <button onClick={() => { setRole(''); setCompany(''); setJobDescription(''); setTone('Professional & warm'); setFullName(''); setBackground(''); setStrengths(''); setAchievements(''); setLetter(''); }} style={{ width: '100%', marginTop: 10, padding: '10px', borderRadius: 10, border: '1px solid #e5e5e5', fontSize: 13, color: '#666', background: 'transparent', cursor: 'pointer', fontWeight: 600 }}>
                <RefreshCw size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Reset all
              </button>
            </div>
          </div>

          {/* RIGHT — Preview / Result */}
          <div ref={resultRef} className="tool-result-col" style={{ position: 'sticky', top: 24 }}>
            {!letter ? (
              <div style={{ background: '#fff', borderRadius: 20, padding: '60px 32px', textAlign: 'center', border: '2px dashed #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg,rgba(221,0,0,0.08),rgba(124,58,237,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <FileText size={28} color="#d1d5db" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#9ca3af', margin: '0 0 8px' }}>Your letter will appear here</h3>
                <p style={{ fontSize: 13, color: '#d1d5db', margin: 0, lineHeight: 1.6 }}>Fill in the form on the left and click<br /><strong style={{ color: '#bbb' }}>Generate Cover Letter</strong></p>
                <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
                  {['Tailored to the specific role & company', 'Highlights your most relevant skills', 'Professional German employer tone', 'Ready to edit and download'].map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#9ca3af' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={11} color="#d1d5db" />
                      </div>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                {/* Result Header */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg,rgba(221,0,0,0.03),rgba(124,58,237,0.03))' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#dd0000,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles size={14} color="#fff" />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#111', margin: 0 }}>Generated Letter</p>
                      <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{letter.split(/\s+/).filter(Boolean).length} words</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={copyToClipboard} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid #e5e5e5', fontSize: 12, color: copied ? '#16a34a' : '#555', background: copied ? 'rgba(34,197,94,0.06)' : '#fff', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>
                      {copied ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}{copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={downloadLetter} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid #e5e5e5', fontSize: 12, color: '#555', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                      <Download size={13} /> Save
                    </button>
                    <button onClick={handleGenerate} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, background: 'linear-gradient(135deg,#dd0000,#7c3aed)', border: 'none', fontSize: 12, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, opacity: loading ? 0.7 : 1 }}>
                      {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Regenerate
                    </button>
                  </div>
                </div>
                {/* Letter body */}
                <div style={{ padding: 24 }}>
                  <textarea
                    value={letter}
                    onChange={e => setLetter(e.target.value)}
                    style={{ width: '100%', border: 'none', outline: 'none', fontSize: 14, lineHeight: 1.8, color: '#1f2937', fontFamily: 'Georgia, serif', resize: 'none', minHeight: 520, background: 'transparent', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
