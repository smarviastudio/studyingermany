'use client';
import { useState, useCallback, useRef, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import Link from 'next/link';
import {
  ArrowLeft, Download, Sparkles, Plus, Trash2,
  GraduationCap, Loader2, Check, Palette, Camera,
  ChevronRight, X, Wand2, Printer, Save, Type, AArrowUp, User, LogIn, FolderOpen, Crown, FileText,
  ChevronDown, CheckCircle2, Eye, EyeOff
} from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';
import { PaywallModal } from '@/components/PaywallModal';
import type { CVData, CVExperience, CVEducation } from '@/lib/cv-maker/cvStore';
import { templates as TEMPLATE_LIBRARY } from '@/lib/cv-maker/templates';
import { useProfileData } from '@/hooks/useProfileData';
import type { Program } from '@/lib/types';
import { canAccessCvTemplate, getTemplateAccessLabel, PROMO_UNLOCK_PREMIUM_TEMPLATES_FOR_AUTH } from '@/lib/plans';

interface ShortlistItem {
  id: string;
  programId: string;
  programName: string;
  university: string;
}

/* ── SAMPLE DATA ── */
const SAMPLE: CVData = {
  name: 'Maria Schmidt',
  title: 'Computer Science Graduate',
  photo: null,
  email: 'maria.schmidt@email.de',
  phone: '+49 176 1234 5678',
  location: 'Munich, Germany',
  summary: 'Motivated Computer Science graduate from TU Munich with hands-on experience in full-stack web development and machine learning. Seeking a challenging role in software engineering where I can apply my technical skills and passion for building user-centric applications.',
  experience: [
    { role: 'Software Engineering Intern', company: 'SAP SE, Walldorf', period: 'Mar 2023 — Sep 2023', description: '', bullets: ['Developed RESTful APIs using Java Spring Boot, improving data processing speed by 40%', 'Collaborated with a cross-functional team of 8 to deliver a customer analytics dashboard', 'Wrote unit and integration tests achieving 92% code coverage'] },
    { role: 'Working Student — Frontend Developer', company: 'Siemens AG, Munich', period: 'Oct 2022 — Feb 2023', description: '', bullets: ['Built responsive React components for an internal project management tool', 'Implemented accessibility improvements following WCAG 2.1 guidelines'] },
  ],
  education: [
    { degree: 'B.Sc. Computer Science', school: 'Technical University of Munich (TUM)', period: '2020 — 2024' },
    { degree: 'Abitur (Grade: 1.3)', school: 'Gymnasium München-Nord', period: '2012 — 2020' },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Python', 'Java', 'SQL', 'Git', 'Docker', 'Machine Learning'],
  customSections: [],
  sectionTitles: { summary: 'PROFESSIONAL SUMMARY', experience: 'WORK EXPERIENCE', skills: 'SKILLS', education: 'EDUCATION' },
  nationality: 'German',
  dateOfBirth: '15/03/1998',
  gender: 'Female',
  linkedin: 'linkedin.com/in/maria-schmidt',
};

/* ── TEMPLATES — Germany-relevant for education & jobs ── */
interface CVTemplate { id: string; name: string; accent: string; description: string; hasPhoto: boolean; layout: string; font: string; }

const formatFontFamily = (fonts: { heading: string; body: string }) => {
  const heading = fonts?.heading || 'Inter, sans-serif';
  const body = fonts?.body || heading;
  return heading === body ? heading : `${heading}, ${body}`;
};

const TEMPLATES: CVTemplate[] = TEMPLATE_LIBRARY.map((tpl) => ({
  id: tpl.id,
  name: tpl.name,
  accent: tpl.accent,
  description: tpl.description,
  hasPhoto: Boolean(tpl.hasPhoto),
  layout: tpl.layout,
  font: formatFontFamily(tpl.fonts),
}));
const COLORS = ['#2563EB', '#003399', '#1E3A5F', '#7C3AED', '#0F766E', '#DC2626', '#EA580C', '#CA8A04', '#475569', '#DB2777', '#38BDF8', '#34D399', '#FBBF24', '#F472B6', '#A78BFA', '#2DD4BF', '#FB923C', '#F87171', '#818CF8', '#4ADE80'];
const SIDEBAR_COLORS = ['#111827', '#1E293B', '#0F172A', '#1A1A2E', '#1B2A4A', '#1A3C5E', '#1E3A5F', '#2D3748', '#1C1C3A', '#3B0764', '#701A75', '#7F1D1D', '#14532D', '#134E4A', '#0C4A6E'];
const SIDEBAR_LAYOUTS = ['dark-sidebar', 'split-color', 'professional-sidebar'];

/* ══════════════════════════════════════════════════════════
   Mini CV preview for template picker (static, uses SAMPLE)
   ══════════════════════════════════════════════════════════ */
function MiniCV({ tpl }: { tpl: CVTemplate }) {
  const d = SAMPLE;
  const a = tpl.accent;
  const W = 210;
  const H = 297;

  /* ── shared micro-components ── */
  const Sec = ({ t, col = a }: { t: string; col?: string }) => (
    <div style={{ fontSize: 5.5, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 0.8, color: col, borderBottom: `1px solid ${col}`, paddingBottom: 1.5, marginBottom: 3, marginTop: 7 }}>{t}</div>
  );
  const SecPlain = ({ t }: { t: string }) => (
    <div style={{ fontSize: 5.5, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 0.8, color: '#111', marginBottom: 3, marginTop: 6 }}>{t}</div>
  );
  const Pic = ({ sz = 28, bg = '#E5E7EB', tc = '#999', sq = false }: { sz?: number; bg?: string; tc?: string; sq?: boolean }) => (
    <div style={{ width: sz, height: sz, borderRadius: sq ? 4 : 999, background: bg, border: `1.5px solid ${a}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
      <svg viewBox="0 0 100 100" width={sz * 0.85} height={sz * 0.85} style={{ display: 'block' }}>
        <circle cx="50" cy="36" r="18" fill={tc} opacity="0.7" />
        <ellipse cx="50" cy="82" rx="28" ry="22" fill={tc} opacity="0.5" />
      </svg>
    </div>
  );
  const Exp = ({ n = 2 }: { n?: number }) => (
    <>{d.experience.slice(0, n).map((e, i) => (
      <div key={i} style={{ marginBottom: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 5.5, color: '#111' }}>{e.role}</span>
          <span style={{ fontSize: 4, color: '#9CA3AF' }}>{e.period}</span>
        </div>
        <div style={{ fontSize: 4.5, color: a, fontWeight: 600 }}>{e.company}</div>
        <div style={{ fontSize: 4, color: '#6B7280', marginTop: 0.5 }}>{e.bullets[0]?.slice(0, 52)}…</div>
      </div>
    ))}</>
  );
  const Edu = () => (
    <div style={{ marginBottom: 3 }}>
      <div style={{ fontWeight: 700, fontSize: 5.5, color: '#111' }}>{d.education[0].degree}</div>
      <div style={{ fontSize: 4.5, color: '#6B7280' }}>{d.education[0].school} · {d.education[0].period}</div>
    </div>
  );
  const Pills = ({ n = 5, bg = `${a}18`, tc = a }: { n?: number; bg?: string; tc?: string }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 2 }}>
      {d.skills.slice(0, n).map((s, i) => <span key={i} data-export-chip="true" style={{ fontSize: 3.8, background: bg, color: tc, padding: '0 5px', borderRadius: 99, fontWeight: 600, display: 'inline-block', height: 10, lineHeight: '10px', boxSizing: 'border-box', verticalAlign: 'top', whiteSpace: 'nowrap' }}><span data-export-chip-text="true">{s}</span></span>)}
    </div>
  );
  const BarsLight = ({ n = 4 }: { n?: number }) => (
    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 2.5 }}>
      {d.skills.slice(0, n).map((s, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 3.8, color: '#6B7280', marginBottom: 1 }}>
            <span>{s}</span><span style={{ color: a }}>{85 - i * 9}%</span>
          </div>
          <div style={{ height: 2.5, background: '#E5E7EB', borderRadius: 99 }}>
            <div style={{ width: `${85 - i * 9}%`, height: '100%', background: a, borderRadius: 99 }} />
          </div>
        </div>
      ))}
    </div>
  );
  const BarsDark = ({ n = 5 }: { n?: number }) => (
    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 2.5 }}>
      {d.skills.slice(0, n).map((s, i) => (
        <div key={i}>
          <div style={{ fontSize: 3.8, color: 'rgba(255,255,255,0.55)', marginBottom: 1 }}>{s}</div>
          <div style={{ height: 2.5, background: 'rgba(255,255,255,0.1)', borderRadius: 99 }}>
            <div style={{ width: `${85 - i * 9}%`, height: '100%', background: a, borderRadius: 99 }} />
          </div>
        </div>
      ))}
    </div>
  );

  /* ── 1. EU CLASSIC — European format with blue left stripe ── */
  if (tpl.layout === 'europass') return (
    <div style={{ width: W, height: H, fontFamily: 'Arial, sans-serif', background: '#fff', overflow: 'hidden', display: 'flex' }}>
      <div style={{ width: 4, background: a, flexShrink: 0 }} />
      <div style={{ flex: 1, padding: '6px 8px 4px 8px' }}>
        {/* Header */}
        <div style={{ fontSize: 11, fontWeight: 700, color: '#111', marginBottom: 1 }}>{d.name}</div>
        <div style={{ fontSize: 3.2, color: '#6B7280', lineHeight: 1.5, marginBottom: 1 }}>
          <span style={{ fontWeight: 600 }}>Nationality:</span> {d.nationality} &nbsp;&nbsp; <span style={{ fontWeight: 600 }}>DOB:</span> {d.dateOfBirth} &nbsp;&nbsp; <span style={{ fontWeight: 600 }}>Gender:</span> {d.gender}
        </div>
        <div style={{ fontSize: 3.2, color: '#6B7280', marginBottom: 1 }}>✉ {d.email} &nbsp;&nbsp; ☎ {d.phone}</div>
        <div style={{ borderBottom: `1px solid ${a}30`, marginBottom: 3, marginTop: 2 }} />
        {/* About Me */}
        <div style={{ fontSize: 5, fontWeight: 800, color: a, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 1.5, borderBottom: `0.5px solid ${a}30`, paddingBottom: 1 }}>About Me</div>
        <div style={{ fontSize: 3.5, color: '#374151', lineHeight: 1.4, marginBottom: 3 }}>{d.summary.slice(0, 100)}…</div>
        {/* Work Experience */}
        <div style={{ fontSize: 5, fontWeight: 800, color: a, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 1.5, borderBottom: `0.5px solid ${a}30`, paddingBottom: 1 }}>Work Experience</div>
        {d.experience.slice(0, 2).map((e, i) => (
          <div key={i} style={{ marginBottom: 2.5 }}>
            <div style={{ fontWeight: 700, fontSize: 4.5, color: a }}>{e.role}</div>
            <div style={{ fontSize: 3.5, color: '#6B7280', fontStyle: 'italic' as const }}>{e.company} [ {e.period} ]</div>
            <div style={{ fontSize: 3.2, color: '#6B7280', marginTop: 0.5 }}>City: Munich &nbsp; Country: Germany</div>
            {e.bullets.slice(0, 2).map((b, j) => <div key={j} style={{ fontSize: 3.3, color: '#374151', marginLeft: 5, lineHeight: 1.3 }}>· {b.slice(0, 60)}…</div>)}
          </div>
        ))}
        {/* Education */}
        <div style={{ fontSize: 5, fontWeight: 800, color: a, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 1.5, marginTop: 2, borderBottom: `0.5px solid ${a}30`, paddingBottom: 1 }}>Education and Training</div>
        {d.education.slice(0, 2).map((e, i) => (
          <div key={i} style={{ marginBottom: 2 }}>
            <div style={{ fontWeight: 700, fontSize: 4, color: a }}>{e.degree}</div>
            <div style={{ fontSize: 3.5, color: '#6B7280', fontStyle: 'italic' as const }}>{e.school}</div>
            <div style={{ fontSize: 3.2, color: '#6B7280' }}>City: Munich &nbsp; Country: Germany</div>
          </div>
        ))}
        {/* Skills */}
        <div style={{ fontSize: 5, fontWeight: 800, color: a, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 1.5, marginTop: 2, borderBottom: `0.5px solid ${a}30`, paddingBottom: 1 }}>Skills</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 2 }}>
          {d.skills.slice(0, 6).map((s, i) => <span key={i} style={{ fontSize: 3.3, color: '#374151' }}>• {s}</span>)}
        </div>
      </div>
    </div>
  );

  /* ── EU PHOTO — European-style with photo header ── */
  if (tpl.layout === 'eu-photo') return (
    <div style={{ width: W, height: H, fontFamily: 'Arial, sans-serif', background: '#fff', overflow: 'hidden', display: 'flex' }}>
      <div style={{ width: 4, background: a, flexShrink: 0 }} />
      <div style={{ flex: 1, padding: '6px 8px 4px 8px' }}>
        {/* Header with photo */}
        <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', marginBottom: 3, paddingBottom: 3, borderBottom: `1px solid ${a}25` }}>
          <Pic sz={30} bg={`${a}15`} tc={a} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#111' }}>{d.name}</div>
            <div style={{ fontSize: 4, color: a, fontWeight: 600, marginBottom: 1 }}>{d.title}</div>
            <div style={{ fontSize: 3.2, color: '#6B7280', lineHeight: 1.5 }}>
              ✉ {d.email} &nbsp; ☎ {d.phone}
            </div>
            <div style={{ fontSize: 3.2, color: '#6B7280', lineHeight: 1.5 }}>
              <span style={{ fontWeight: 600 }}>Nationality:</span> {d.nationality} &nbsp; <span style={{ fontWeight: 600 }}>DOB:</span> {d.dateOfBirth}
            </div>
          </div>
        </div>
        {/* About Me */}
        <div style={{ fontSize: 5, fontWeight: 800, color: a, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 1.5, borderBottom: `0.5px solid ${a}30`, paddingBottom: 1 }}>About Me</div>
        <div style={{ fontSize: 3.5, color: '#374151', lineHeight: 1.4, marginBottom: 3 }}>{d.summary.slice(0, 90)}…</div>
        {/* Work Experience */}
        <div style={{ fontSize: 5, fontWeight: 800, color: a, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 1.5, borderBottom: `0.5px solid ${a}30`, paddingBottom: 1 }}>Work Experience</div>
        {d.experience.slice(0, 2).map((e, i) => (
          <div key={i} style={{ marginBottom: 2.5 }}>
            <div style={{ fontWeight: 700, fontSize: 4.5, color: a }}>{e.role}</div>
            <div style={{ fontSize: 3.5, color: '#6B7280', fontStyle: 'italic' as const }}>{e.company} [ {e.period} ]</div>
            {e.bullets.slice(0, 1).map((b, j) => <div key={j} style={{ fontSize: 3.3, color: '#374151', marginLeft: 5 }}>· {b.slice(0, 55)}…</div>)}
          </div>
        ))}
        {/* Education */}
        <div style={{ fontSize: 5, fontWeight: 800, color: a, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 1.5, marginTop: 1, borderBottom: `0.5px solid ${a}30`, paddingBottom: 1 }}>Education</div>
        {d.education.slice(0, 2).map((e, i) => (
          <div key={i} style={{ marginBottom: 1.5 }}>
            <div style={{ fontWeight: 700, fontSize: 4, color: a }}>{e.degree}</div>
            <div style={{ fontSize: 3.5, color: '#6B7280', fontStyle: 'italic' as const }}>{e.school}</div>
          </div>
        ))}
        {/* Skills */}
        <div style={{ fontSize: 5, fontWeight: 800, color: a, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 1.5, marginTop: 1, borderBottom: `0.5px solid ${a}30`, paddingBottom: 1 }}>Skills</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 2 }}>
          {d.skills.slice(0, 5).map((s, i) => <span key={i} style={{ fontSize: 3.3, color: '#374151' }}>• {s}</span>)}
        </div>
      </div>
    </div>
  );

  /* ── 2. DARK SIDEBAR — black panel + skill bars, white content ── */
  if (tpl.layout === 'dark-sidebar') return (
    <div style={{ width: W, height: H, display: 'flex', fontFamily: tpl.font, overflow: 'hidden' }}>
      <div style={{ width: 72, background: '#111827', padding: 8, display: 'flex', flexDirection: 'column' as const, gap: 5 }}>
        <Pic sz={36} bg={`${a}33`} tc={a} />
        <div>
          <div style={{ fontSize: 5.5, fontWeight: 700, color: '#fff' }}>{d.name}</div>
          <div style={{ fontSize: 4, color: a, marginTop: 2 }}>{d.title}</div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 4 }}>
          <div style={{ fontSize: 4.5, fontWeight: 700, color: a, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 3 }}>Contact</div>
          {[d.email, d.phone, d.location].map((v, i) => <div key={i} style={{ fontSize: 3.5, color: 'rgba(255,255,255,0.4)', marginBottom: 1.5 }}>{v}</div>)}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 4 }}>
          <div style={{ fontSize: 4.5, fontWeight: 700, color: a, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 4 }}>Skills</div>
          <BarsDark n={5} />
        </div>
      </div>
      <div style={{ flex: 1, padding: '10px 10px', background: '#fff' }}>
        <Sec t="Summary" />
        <div style={{ fontSize: 4.5, color: '#374151', lineHeight: 1.4 }}>{d.summary.slice(0, 75)}…</div>
        <Sec t="Experience" /><Exp n={2} />
        <Sec t="Education" /><Edu />
      </div>
    </div>
  );

  /* ── 3. TIMELINE — dot-and-line connector ── */
  if (tpl.layout === 'timeline') return (
    <div style={{ width: W, height: H, fontFamily: tpl.font, background: '#fff', overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px 6px', borderBottom: `3px solid ${a}` }}>
        <div style={{ fontSize: 12, fontWeight: 900, color: '#111', letterSpacing: -0.5 }}>{d.name}</div>
        <div style={{ fontSize: 5.5, color: a, fontWeight: 600 }}>{d.title}</div>
        <div style={{ fontSize: 4, color: '#9CA3AF' }}>{d.email} · {d.phone}</div>
      </div>
      <div style={{ padding: '4px 14px' }}>
        <SecPlain t="Experience" />
        {d.experience.map((e, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', width: 14, flexShrink: 0 }}>
              <div style={{ width: 8, height: 8, borderRadius: 999, background: a, flexShrink: 0 }} />
              {i < d.experience.length - 1 && <div style={{ width: 1.5, flex: 1, background: `${a}40`, marginTop: 2 }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 5.5, color: '#111' }}>{e.role}</div>
              <div style={{ fontSize: 4.5, color: a, fontWeight: 600 }}>{e.company} · <span style={{ color: '#9CA3AF', fontWeight: 400 }}>{e.period}</span></div>
              <div style={{ fontSize: 4, color: '#6B7280' }}>{e.bullets[0]?.slice(0, 52)}…</div>
            </div>
          </div>
        ))}
        <SecPlain t="Education" />
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: 999, background: a, flexShrink: 0, marginTop: 2 }} />
          <Edu />
        </div>
        <SecPlain t="Skills" /><Pills n={7} />
      </div>
    </div>
  );

  /* ── 4. BANNER HERO — gradient header + square photo ── */
  if (tpl.layout === 'top-banner') return (
    <div style={{ width: W, height: H, fontFamily: tpl.font, background: '#fff', overflow: 'hidden' }}>
      <div style={{ background: `linear-gradient(120deg,${a},${a}99)`, padding: '12px 14px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Pic sz={38} bg="rgba(255,255,255,0.2)" tc="#fff" sq />
        <div>
          <div style={{ fontSize: 12, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>{d.name}</div>
          <div style={{ fontSize: 5.5, color: 'rgba(255,255,255,0.85)' }}>{d.title}</div>
          <div style={{ fontSize: 4, color: 'rgba(255,255,255,0.6)' }}>{d.email} · {d.phone}</div>
        </div>
      </div>
      <div style={{ padding: '4px 14px' }}>
        <Sec t="About" />
        <div style={{ fontSize: 4.5, color: '#374151', lineHeight: 1.4 }}>{d.summary.slice(0, 85)}…</div>
        <Sec t="Experience" /><Exp n={2} />
        <Sec t="Skills" /><Pills n={6} />
      </div>
    </div>
  );

  /* ── 5. TWO COLUMN — 58/42 symmetric split ── */
  if (tpl.layout === 'two-column') return (
    <div style={{ width: W, height: H, fontFamily: tpl.font, background: '#fff', overflow: 'hidden' }}>
      <div style={{ padding: '8px 12px 5px', borderBottom: `2.5px solid ${a}` }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#111', letterSpacing: -0.3 }}>{d.name}</div>
        <div style={{ fontSize: 5, color: a, fontWeight: 600 }}>{d.title} · {d.email}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '58% 42%', height: 'calc(100% - 30px)' }}>
        <div style={{ padding: '4px 8px 4px 12px', borderRight: '1px solid #E5E7EB' }}>
          <Sec t="Summary" />
          <div style={{ fontSize: 4.5, color: '#374151', lineHeight: 1.4 }}>{d.summary.slice(0, 85)}…</div>
          <Sec t="Experience" /><Exp n={2} />
        </div>
        <div style={{ padding: '4px 10px 4px 8px' }}>
          <Sec t="Education" /><Edu />
          <Sec t="Skills" />
          {d.skills.slice(0, 7).map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 1.5 }}>
              <div style={{ width: 3, height: 3, borderRadius: 999, background: a, flexShrink: 0 }} />
              <span style={{ fontSize: 4, color: '#374151' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ── 6. INFOGRAPHIC — tinted header + skill progress bars sidebar ── */
  if (tpl.layout === 'infographic') return (
    <div style={{ width: W, height: H, fontFamily: tpl.font, background: '#fff', overflow: 'hidden' }}>
      <div style={{ background: `${a}15`, padding: '8px 12px 6px', borderBottom: `3px solid ${a}`, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Pic sz={34} bg={`${a}25`} tc={a} />
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#111' }}>{d.name}</div>
          <div style={{ fontSize: 5, color: a, fontWeight: 700 }}>{d.title}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px', padding: '4px 10px 4px 12px', gap: 8 }}>
        <div><Sec t="Experience" /><Exp n={2} /><Sec t="Education" /><Edu /></div>
        <div style={{ borderLeft: `2px solid ${a}22`, paddingLeft: 8 }}>
          <Sec t="Skills" /><BarsLight n={5} />
        </div>
      </div>
    </div>
  );

  /* ── 7. ULTRA MINIMAL — no color, pure black typography ── */
  if (tpl.layout === 'minimal-clean') return (
    <div style={{ width: W, height: H, fontFamily: 'Helvetica,Arial,sans-serif', background: '#fff', padding: '14px 16px', overflow: 'hidden' }}>
      <div style={{ borderBottom: '2px solid #111', paddingBottom: 6, marginBottom: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: '#111', letterSpacing: -0.5 }}>{d.name}</div>
        <div style={{ fontSize: 5.5, color: '#555' }}>{d.title} · {d.email} · {d.phone}</div>
      </div>
      <SecPlain t="Summary" />
      <div style={{ fontSize: 4.5, color: '#333', lineHeight: 1.5 }}>{d.summary.slice(0, 85)}…</div>
      <SecPlain t="Experience" /><Exp n={2} />
      <SecPlain t="Education" /><Edu />
      <SecPlain t="Skills" />
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 2 }}>
        {d.skills.slice(0, 6).map((s, i) => <span key={i} style={{ fontSize: 4, border: '1px solid #999', color: '#333', padding: '1px 5px', borderRadius: 2 }}>{s}</span>)}
      </div>
    </div>
  );

  /* ── 8. ACADEMIC CV — centred header, publications list ── */
  if (tpl.layout === 'academic-cv') return (
    <div style={{ width: W, height: H, fontFamily: 'Georgia,serif', background: '#fff', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center' as const, padding: '10px 14px 7px', borderBottom: `1px solid #D1D5DB` }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: a }}>{d.name}</div>
        <div style={{ fontSize: 5.5, color: '#555' }}>{d.title}</div>
        <div style={{ fontSize: 4, color: '#9CA3AF' }}>{d.email} · {d.phone}</div>
      </div>
      <div style={{ padding: '4px 14px' }}>
        <Sec t="Research Interests" />
        <div style={{ fontSize: 4.5, color: '#374151', lineHeight: 1.4 }}>{d.summary.slice(0, 85)}…</div>
        <Sec t="Education" /><Edu />
        <Sec t="Experience" /><Exp n={2} />
        <Sec t="Publications" />
        {['DFG Grant 2023 — ML Research', 'NeurIPS 2022 — Deep Learning'].map((p, i) => (
          <div key={i} style={{ fontSize: 4.5, color: '#374151', marginBottom: 2 }}>• {p}</div>
        ))}
      </div>
    </div>
  );

  /* ── 9. DIN 5008 — German standard: right photo, address block ── */
  if (tpl.layout === 'din5008') return (
    <div style={{ width: W, height: H, fontFamily: 'Arial,sans-serif', background: '#fff', padding: '12px 14px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#111' }}>{d.name}</div>
          <div style={{ fontSize: 5, color: '#6B7280' }}>{d.title}</div>
          <div style={{ fontSize: 4, color: '#9CA3AF' }}>{d.location} · {d.email}</div>
        </div>
        <Pic sz={30} bg="#E5E7EB" tc="#999" sq />
      </div>
      <div style={{ borderTop: '1px solid #374151', borderBottom: '1px solid #374151', padding: '3px 0', marginBottom: 5 }}>
        <div style={{ fontSize: 5.5, fontWeight: 700, color: '#111' }}>Bewerbung als {d.title}</div>
      </div>
      <div style={{ fontSize: 4.5, color: '#374151', lineHeight: 1.5, marginBottom: 4 }}>{d.summary.slice(0, 80)}…</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div><SecPlain t="Berufserfahrung" /><Exp n={2} /></div>
        <div><SecPlain t="Ausbildung" /><Edu /><SecPlain t="Kenntnisse" /><Pills n={5} /></div>
      </div>
    </div>
  );

  /* ── 10. PHOTO LEFT — large photo card left, bold name right ── */
  if (tpl.layout === 'photo-left') return (
    <div style={{ width: W, height: H, fontFamily: tpl.font, background: '#fff', overflow: 'hidden', display: 'flex' }}>
      <div style={{ width: 66, background: `${a}12`, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', padding: '12px 6px 8px', gap: 6 }}>
        <div style={{ width: 50, height: 50, borderRadius: 4, background: `${a}25`, border: `2px solid ${a}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: a }}>MS</span>
        </div>
        <div style={{ fontSize: 3.5, color: '#6B7280', textAlign: 'center' as const, lineHeight: 1.6 }}>
          <div>{d.email}</div><div>{d.phone}</div><div>{d.location}</div>
        </div>
        <div style={{ width: '100%' }}>
          <div style={{ fontSize: 4, fontWeight: 700, color: a, textTransform: 'uppercase' as const, marginBottom: 3 }}>Skills</div>
          {d.skills.slice(0, 5).map((s, i) => <div key={i} style={{ fontSize: 3.8, color: '#374151' }}>• {s}</div>)}
        </div>
      </div>
      <div style={{ flex: 1, padding: '10px 10px' }}>
        <div style={{ borderBottom: `2px solid ${a}`, paddingBottom: 5, marginBottom: 2 }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: '#111', letterSpacing: -0.3 }}>{d.name}</div>
          <div style={{ fontSize: 5.5, color: a, fontWeight: 700 }}>{d.title}</div>
        </div>
        <Sec t="Summary" /><div style={{ fontSize: 4.5, color: '#374151', lineHeight: 1.4 }}>{d.summary.slice(0, 70)}…</div>
        <Sec t="Experience" /><Exp n={2} />
        <Sec t="Education" /><Edu />
      </div>
    </div>
  );

  /* ── 11. COLORED HEADER — solid block header, white body ── */
  if (tpl.layout === 'colored-header') return (
    <div style={{ width: W, height: H, fontFamily: tpl.font, background: '#fff', overflow: 'hidden' }}>
      <div style={{ background: a, padding: '12px 14px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Pic sz={36} bg="rgba(255,255,255,0.2)" tc="#fff" />
          <div>
            <div style={{ fontSize: 12, fontWeight: 900, color: '#fff', letterSpacing: -0.3 }}>{d.name}</div>
            <div style={{ fontSize: 5.5, color: 'rgba(255,255,255,0.85)' }}>{d.title}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 7 }}>
          {[d.email, d.phone, d.location].map((v, i) => (
            <div key={i} style={{ fontSize: 4, color: 'rgba(255,255,255,0.7)' }}>◆ {v}</div>
          ))}
        </div>
      </div>
      <div style={{ padding: '6px 14px' }}>
        <Sec t="Profile" /><div style={{ fontSize: 4.5, color: '#374151', lineHeight: 1.4 }}>{d.summary.slice(0, 75)}…</div>
        <Sec t="Experience" /><Exp n={2} />
        <Sec t="Skills" /><Pills n={6} />
      </div>
    </div>
  );

  /* ── 12. COMPACT GRID — dark tech header, dense grid ── */
  if (tpl.layout === 'compact-grid') return (
    <div style={{ width: W, height: H, fontFamily: tpl.font, background: '#fff', overflow: 'hidden' }}>
      <div style={{ background: '#1E1B4B', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 900, color: '#fff' }}>{d.name}</div>
          <div style={{ fontSize: 5, color: a }}>{d.title}</div>
        </div>
        <div style={{ textAlign: 'right' as const, fontSize: 4, color: 'rgba(255,255,255,0.5)' }}>
          <div>{d.email}</div><div>{d.phone}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 78px', padding: '4px 10px 4px 12px', gap: 8 }}>
        <div>
          <div style={{ fontSize: 4.5, color: '#374151', lineHeight: 1.4, marginTop: 4 }}>{d.summary.slice(0, 70)}…</div>
          <Sec t="Experience" /><Exp n={2} />
          <Sec t="Education" /><Edu />
        </div>
        <div style={{ borderLeft: `1px solid ${a}33`, paddingLeft: 8 }}>
          <Sec t="Stack" />
          {d.skills.map((s, i) => (
            <div key={i} style={{ fontSize: 3.8, background: `${a}15`, color: a, padding: '1px 4px', borderRadius: 2, marginBottom: 2, fontWeight: 600 }}>{s}</div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ── 13. ELEGANT SERIF — cream bg, warm tones, centred ── */
  if (tpl.layout === 'elegant-serif') return (
    <div style={{ width: W, height: H, fontFamily: 'Georgia,serif', background: '#FFFBF5', overflow: 'hidden', padding: '14px 16px' }}>
      <div style={{ textAlign: 'center' as const, borderBottom: `1px solid ${a}`, paddingBottom: 8, marginBottom: 2 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: a, letterSpacing: 1 }}>{d.name.toUpperCase()}</div>
        <div style={{ fontSize: 5.5, color: '#78350F', marginTop: 2, fontStyle: 'italic' as const }}>{d.title}</div>
        <div style={{ fontSize: 4, color: '#92400E', marginTop: 2 }}>{d.email} · {d.phone}</div>
      </div>
      <div style={{ fontSize: 4.5, color: '#451A03', lineHeight: 1.6, marginTop: 4 }}>{d.summary.slice(0, 80)}…</div>
      <Sec t="Professional Experience" col="#78350F" /><Exp n={2} />
      <Sec t="Education" col="#78350F" /><Edu />
      <Sec t="Core Competencies" col="#78350F" />
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 3 }}>
        {d.skills.slice(0, 6).map((s, i) => <span key={i} style={{ fontSize: 4, border: `1px solid ${a}`, color: a, padding: '1px 6px', borderRadius: 2 }}>{s}</span>)}
      </div>
    </div>
  );

  /* ── 14. SPLIT COLOR — half-colored left panel, white right ── */
  if (tpl.layout === 'split-color') return (
    <div style={{ width: W, height: H, fontFamily: tpl.font, background: '#fff', overflow: 'hidden', display: 'flex' }}>
      <div style={{ width: 80, background: a, padding: '14px 8px', display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
        <Pic sz={38} bg="rgba(255,255,255,0.2)" tc="#fff" />
        <div>
          <div style={{ fontSize: 7, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>{d.name}</div>
          <div style={{ fontSize: 4.5, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{d.title}</div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 5 }}>
          <div style={{ fontSize: 4.5, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' as const, marginBottom: 3 }}>Contact</div>
          {[d.email, d.phone, d.location].map((v, i) => <div key={i} style={{ fontSize: 3.5, color: 'rgba(255,255,255,0.55)', marginBottom: 2 }}>{v}</div>)}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 5 }}>
          <div style={{ fontSize: 4.5, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' as const, marginBottom: 3 }}>Skills</div>
          {d.skills.slice(0, 5).map((s, i) => <div key={i} style={{ fontSize: 3.8, color: 'rgba(255,255,255,0.75)', marginBottom: 2 }}>· {s}</div>)}
        </div>
      </div>
      <div style={{ flex: 1, padding: '10px 10px' }}>
        <Sec t="About" />
        <div style={{ fontSize: 4.5, color: '#374151', lineHeight: 1.4 }}>{d.summary.slice(0, 70)}…</div>
        <Sec t="Experience" /><Exp n={2} />
        <Sec t="Education" /><Edu />
      </div>
    </div>
  );

  /* ── 15. MODERN TECH — dark top bar, monospace name, green accent ── */
  if (tpl.layout === 'modern-tech') return (
    <div style={{ width: W, height: H, fontFamily: tpl.font, background: '#F8FAFC', overflow: 'hidden' }}>
      <div style={{ background: '#0F172A', padding: '10px 14px', borderBottom: `3px solid ${a}` }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: a, letterSpacing: 1, fontFamily: 'monospace' }}>{d.name}</div>
        <div style={{ fontSize: 5, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{d.title}</div>
        <div style={{ fontSize: 4, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>{d.email} · {d.phone}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px', padding: '4px 10px 4px 14px', gap: 8 }}>
        <div>
          <div style={{ fontSize: 4.5, color: '#475569', lineHeight: 1.4, marginTop: 4 }}>{d.summary.slice(0, 70)}…</div>
          <Sec t="Experience" /><Exp n={2} />
          <Sec t="Education" /><Edu />
        </div>
        <div style={{ borderLeft: `1px solid ${a}44`, paddingLeft: 8 }}>
          <Sec t="Stack" />
          {d.skills.map((s, i) => (
            <div key={i} style={{ fontSize: 3.8, color: a, fontFamily: 'monospace', marginBottom: 2 }}>$ {s}</div>
          ))}
        </div>
      </div>
    </div>
  );

  if (tpl.layout === 'ats-classic') return (
    <div style={{ width: W, height: H, fontFamily: 'Arial,sans-serif', background: '#fff', overflow: 'hidden', padding: '14px 16px' }}>
      <div style={{ borderBottom: `2px solid ${a}`, paddingBottom: 6, marginBottom: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: '#111' }}>{d.name}</div>
        <div style={{ fontSize: 5.5, color: a, fontWeight: 700 }}>{d.title}</div>
        <div style={{ fontSize: 4, color: '#9CA3AF' }}>{d.email} · {d.phone} · {d.location}</div>
      </div>
      <SecPlain t="Professional Summary" />
      <div style={{ fontSize: 4.5, color: '#374151', lineHeight: 1.45 }}>{d.summary.slice(0, 85)}…</div>
      <SecPlain t="Experience" /><Exp n={2} />
      <SecPlain t="Education" /><Edu />
      <SecPlain t="Core Skills" />
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 2 }}>
        {d.skills.slice(0, 8).map((s, i) => <span key={i} style={{ fontSize: 4, color: '#374151', border: '1px solid #D1D5DB', padding: '1px 5px', borderRadius: 2 }}>{s}</span>)}
      </div>
    </div>
  );

  if (tpl.layout === 'student-first') return (
    <div style={{ width: W, height: H, fontFamily: tpl.font, background: '#fff', overflow: 'hidden' }}>
      <div style={{ background: `${a}10`, borderBottom: `3px solid ${a}`, padding: '10px 14px 8px' }}>
        <div style={{ fontSize: 12, fontWeight: 900, color: '#111' }}>{d.name}</div>
        <div style={{ fontSize: 5.5, color: a, fontWeight: 700 }}>{d.title}</div>
        <div style={{ fontSize: 4, color: '#6B7280', marginTop: 2 }}>{d.email} · {d.phone}</div>
      </div>
      <div style={{ padding: '4px 14px' }}>
        <Sec t="Profile" />
        <div style={{ fontSize: 4.5, color: '#374151', lineHeight: 1.4 }}>{d.summary.slice(0, 75)}…</div>
        <Sec t="Education" /><Edu />
        <Sec t="Projects & Experience" /><Exp n={2} />
        <Sec t="Skills" /><Pills n={7} bg={`${a}14`} tc={a} />
      </div>
    </div>
  );

  if (tpl.layout === 'hybrid-pro') return (
    <div style={{ width: W, height: H, fontFamily: tpl.font, background: '#fff', overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px 7px', borderBottom: `2px solid ${a}` }}>
        <div style={{ fontSize: 12, fontWeight: 900, color: '#111' }}>{d.name}</div>
        <div style={{ fontSize: 5.5, color: a, fontWeight: 700 }}>{d.title}</div>
        <div style={{ fontSize: 4, color: '#9CA3AF', marginTop: 2 }}>{d.email} · {d.phone} · {d.location}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '84px 1fr', height: 'calc(100% - 38px)' }}>
        <div style={{ background: '#FAF5FF', padding: '8px 7px', borderRight: `1px solid ${a}22` }}>
          <Sec t="Skills" />
          <BarsLight n={5} />
        </div>
        <div style={{ padding: '4px 12px' }}>
          <Sec t="Summary" />
          <div style={{ fontSize: 4.5, color: '#374151', lineHeight: 1.4 }}>{d.summary.slice(0, 72)}…</div>
          <Sec t="Experience" /><Exp n={2} />
          <Sec t="Education" /><Edu />
        </div>
      </div>
    </div>
  );

  if (tpl.layout === 'executive-brief') return (
    <div style={{ width: W, height: H, fontFamily: tpl.font, background: '#fff', overflow: 'hidden', padding: '14px 16px' }}>
      <div style={{ borderBottom: `3px solid ${a}`, paddingBottom: 7, marginBottom: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#111' }}>{d.name}</div>
            <div style={{ fontSize: 5.5, color: '#374151', fontWeight: 700 }}>{d.title}</div>
          </div>
          <div style={{ fontSize: 4, color: '#6B7280', textAlign: 'right' as const }}>{d.email}<div>{d.phone}</div></div>
        </div>
      </div>
      <SecPlain t="Executive Summary" />
      <div style={{ fontSize: 4.5, color: '#374151', lineHeight: 1.45 }}>{d.summary.slice(0, 80)}…</div>
      <SecPlain t="Core Competencies" />
      <Pills n={6} bg="#F3F4F6" tc="#111827" />
      <SecPlain t="Leadership Experience" /><Exp n={2} />
      <SecPlain t="Education" /><Edu />
    </div>
  );

  if (tpl.layout === 'consulting-clean') return (
    <div style={{ width: W, height: H, fontFamily: 'Calibri,Arial,sans-serif', background: '#fff', overflow: 'hidden', padding: '14px 16px' }}>
      <div style={{ borderBottom: `2px solid ${a}`, paddingBottom: 6, marginBottom: 2, textAlign: 'center' as const }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: '#111' }}>{d.name}</div>
        <div style={{ fontSize: 5.5, color: a, fontWeight: 700 }}>{d.title}</div>
        <div style={{ fontSize: 4, color: '#6B7280' }}>{d.email} · {d.phone} · {d.location}</div>
      </div>
      <Sec t="Profile" />
      <div style={{ fontSize: 4.5, color: '#374151', lineHeight: 1.45 }}>{d.summary.slice(0, 78)}…</div>
      <Sec t="Selected Experience" /><Exp n={2} />
      <Sec t="Education" /><Edu />
      <Sec t="Capabilities" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        {d.skills.slice(0, 6).map((s, i) => <div key={i} style={{ fontSize: 4, color: '#374151' }}>• {s}</div>)}
      </div>
    </div>
  );

  /* ── PROFESSIONAL SIDEBAR — dark teal sidebar with photo, white content ── */
  if (tpl.layout === 'professional-sidebar') return (
    <div style={{ width: W, height: H, display: 'flex', fontFamily: tpl.font, overflow: 'hidden' }}>
      <div style={{ width: 72, background: a, padding: '10px 6px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 5 }}>
        <div style={{ fontSize: 9, fontWeight: 900, color: '#fff', textTransform: 'uppercase' as const, letterSpacing: 0.5, textAlign: 'center' as const, lineHeight: 1.2, marginBottom: 2 }}>{d.name}</div>
        <div style={{ fontSize: 4, color: 'rgba(255,255,255,0.7)', textAlign: 'center' as const }}>{d.title}</div>
        <Pic sz={32} bg="rgba(255,255,255,0.15)" tc="#fff" />
        <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 4, marginTop: 2 }}>
          {[d.email, d.phone, d.location].map((v, i) => <div key={i} style={{ fontSize: 3.2, color: 'rgba(255,255,255,0.5)', marginBottom: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>• {v}</div>)}
        </div>
        <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 4 }}>
          <div style={{ fontSize: 4.5, fontWeight: 700, color: '#fff', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 3 }}>Skills</div>
          <BarsDark n={4} />
        </div>
        <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 4 }}>
          <div style={{ fontSize: 4.5, fontWeight: 700, color: '#fff', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 3 }}>Languages</div>
          {['English', 'Japanese', 'Chinese'].map((lang, i) => <div key={i} style={{ fontSize: 3.5, color: 'rgba(255,255,255,0.6)', marginBottom: 1 }}>• {lang}</div>)}
        </div>
      </div>
      <div style={{ flex: 1, padding: '8px 10px', background: '#fff' }}>
        <Sec t="Objective" />
        <div style={{ fontSize: 4.5, color: '#374151', lineHeight: 1.4 }}>{d.summary.slice(0, 75)}…</div>
        <Sec t="Education" /><Edu />
        <Sec t="Experience" /><Exp n={2} />
        <Sec t="Honors & Awards" />
        <div style={{ fontSize: 4, color: '#374151' }}>• Dean&apos;s List 2022–2023</div>
      </div>
    </div>
  );

  /* ── CORPORATE BANNER — teal header with photo, two-column body ── */
  if (tpl.layout === 'corporate-banner') return (
    <div style={{ width: W, height: H, fontFamily: tpl.font, background: '#fff', overflow: 'hidden' }}>
      <div style={{ background: a, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Pic sz={34} bg="rgba(255,255,255,0.15)" tc="#fff" />
        <div>
          <div style={{ fontSize: 10, fontWeight: 900, color: '#fff', textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>{d.name}</div>
          <div style={{ fontSize: 5, color: 'rgba(255,255,255,0.8)' }}>{d.title}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '68px 1fr', height: 'calc(100% - 54px)' }}>
        <div style={{ padding: '6px 5px', background: '#f8f8f8', borderRight: '1px solid #e5e7eb' }}>
          {[d.email, d.phone, d.location].map((v, i) => <div key={i} style={{ fontSize: 3.2, color: '#6B7280', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 2 }}>• {v}</div>)}
          <div style={{ fontSize: 4.5, fontWeight: 700, color: a, textTransform: 'uppercase' as const, marginTop: 5, marginBottom: 3, borderBottom: `1px solid ${a}40`, paddingBottom: 2 }}>Skills</div>
          {d.skills.slice(0, 4).map((s, i) => <div key={i} style={{ fontSize: 3.5, color: '#374151', marginBottom: 1 }}>• {s}</div>)}
          <div style={{ fontSize: 4.5, fontWeight: 700, color: a, textTransform: 'uppercase' as const, marginTop: 5, marginBottom: 3, borderBottom: `1px solid ${a}40`, paddingBottom: 2 }}>Languages</div>
          {['English', 'Japanese', 'Chinese'].map((lang, i) => <div key={i} style={{ fontSize: 3.5, color: '#374151', marginBottom: 1 }}>• {lang}</div>)}
        </div>
        <div style={{ padding: '6px 10px' }}>
          <Sec t="Objective" />
          <div style={{ fontSize: 4.5, color: '#374151', lineHeight: 1.4 }}>{d.summary.slice(0, 70)}…</div>
          <Sec t="Education" /><Edu />
          <Sec t="Experience" /><Exp n={2} />
          <Sec t="Activities" />
          <div style={{ fontSize: 4, color: '#374151' }}>• Member of US Ambassador · 2014–2016</div>
        </div>
      </div>
    </div>
  );

  /* ── DEFAULT fallback ── */
  return (
    <div style={{ width: W, height: H, fontFamily: tpl.font, background: '#fff', padding: '14px 16px', overflow: 'hidden' }}>
      <div style={{ borderBottom: `2px solid ${a}`, paddingBottom: 6, marginBottom: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: '#111' }}>{d.name}</div>
        <div style={{ fontSize: 5.5, color: a }}>{d.title}</div>
        <div style={{ fontSize: 4, color: '#9CA3AF' }}>{d.email} · {d.phone}</div>
      </div>
      <Sec t="Summary" /><div style={{ fontSize: 4.5, color: '#374151', lineHeight: 1.4 }}>{d.summary.slice(0, 85)}…</div>
      <Sec t="Experience" /><Exp n={2} />
      <Sec t="Education" /><Edu />
      <Sec t="Skills" /><Pills n={6} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════════════════ */
function CVMakerContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const initialProgramId = searchParams.get('programId');
  
  const [phase, setPhase] = useState<'templates' | 'editor'>('templates');
  const [tplId, setTplId] = useState('professional');
  const [planType, setPlanType] = useState('free');
  const [accent, setAccent] = useState('#2563EB');
  const [sidebarColor, setSidebarColor] = useState('#111827');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal');
  const [textColor, setTextColor] = useState('#111827');
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [skillLevels, setSkillLevels] = useState<number[]>([]);
  const [cv, setCv] = useState<CVData>({ ...SAMPLE });
  const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDone, setAiDone] = useState(false);
  const [aiError, setAiError] = useState('');
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [mobileTab, setMobileTab] = useState<'design' | 'preview'>('design');
  const [hiddenFields, setHiddenFields] = useState<Record<string, boolean>>({});
  
  // Program selection states
  const [shortlist, setShortlist] = useState<ShortlistItem[]>([]);
  const [shortlistLoading, setShortlistLoading] = useState(true);
  const [selectedProgramId, setSelectedProgramId] = useState<string>(initialProgramId || '');
  const [program, setProgram] = useState<Program | null>(null);
  const [programLoading, setProgramLoading] = useState(false);
  const [useManualInput, setUseManualInput] = useState<boolean>(status !== 'authenticated');
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  
  const cvRef = useRef<HTMLDivElement>(null);
  const tpl = TEMPLATES.find(t => t.id === tplId) || TEMPLATES[0];
  const selectedTemplateIndex = Math.max(TEMPLATES.findIndex((template) => template.id === tplId), 0);
  const isPremiumTemplate = !canAccessCvTemplate(planType, selectedTemplateIndex);

  const up = useCallback((f: keyof CVData, v: CVData[keyof CVData]) => setCv(p => ({ ...p, [f]: v })), []);
  const upExp = useCallback((i: number, f: keyof CVExperience, v: string) => setCv(p => ({ ...p, experience: p.experience.map((e, idx) => idx === i ? { ...e, [f]: v } : e) })), []);
  const upBullet = useCallback((ei: number, bi: number, v: string) => setCv(p => ({ ...p, experience: p.experience.map((e, idx) => idx === ei ? { ...e, bullets: e.bullets.map((b, bidx) => bidx === bi ? v : b) } : e) })), []);
  const addBullet = useCallback((ei: number) => setCv(p => ({ ...p, experience: p.experience.map((e, idx) => idx === ei ? { ...e, bullets: [...e.bullets, ''] } : e) })), []);
  const rmBullet = useCallback((ei: number, bi: number) => setCv(p => ({ ...p, experience: p.experience.map((e, idx) => idx === ei ? { ...e, bullets: e.bullets.filter((_, bidx) => bidx !== bi) } : e) })), []);
  const addExp = useCallback(() => setCv(p => ({ ...p, experience: [...p.experience, { role: '', company: '', period: '', description: '', bullets: [''] }] })), []);
  const rmExp = useCallback((i: number) => setCv(p => ({ ...p, experience: p.experience.filter((_, idx) => idx !== i) })), []);
  const upEdu = useCallback((i: number, f: keyof CVEducation, v: string) => setCv(p => ({ ...p, education: p.education.map((e, idx) => idx === i ? { ...e, [f]: v } : e) })), []);
  const addEdu = useCallback(() => setCv(p => ({ ...p, education: [...p.education, { degree: '', school: '', period: '' }] })), []);
  const rmEdu = useCallback((i: number) => setCv(p => ({ ...p, education: p.education.filter((_, idx) => idx !== i) })), []);
  const rmSkill = useCallback((i: number) => setCv(p => ({ ...p, skills: p.skills.filter((_, idx) => idx !== i) })), []);
  const addCustom = useCallback(() => setCv(p => ({ ...p, customSections: [...p.customSections, { title: 'New Section', content: '' }] })), []);
  const upCustom = useCallback((i: number, f: 'title' | 'content', v: string) => setCv(p => ({ ...p, customSections: p.customSections.map((s, idx) => idx === i ? { ...s, [f]: v } : s) })), []);
  const rmCustom = useCallback((i: number) => setCv(p => ({ ...p, customSections: p.customSections.filter((_, idx) => idx !== i) })), []);

  const handlePhoto = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = ev => up('photo', ev.target?.result as string); r.readAsDataURL(f);
  }, [up]);

  // Check auth status on mount
  const { profile: profileData } = useProfileData(true);
  const autoFillDoneRef = useRef(false);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (status !== 'authenticated') {
      setPlanType('free');
      return;
    }

    // Promo: every signed-in user gets premium templates for free during launch.
    if (PROMO_UNLOCK_PREMIUM_TEMPLATES_FOR_AUTH) {
      setPlanType('pro');
      return;
    }

    fetch('/api/user/subscription')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setPlanType(data?.subscription?.planType || 'free'))
      .catch(() => setPlanType('free'));
  }, [status]);

  // Fetch shortlist
  useEffect(() => {
    if (status !== 'authenticated') {
      setShortlistLoading(false);
      return;
    }
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
      } catch (err) {
        console.error('Failed to load program:', err);
        setProgram(null);
      } finally {
        setProgramLoading(false);
      }
    };
    load();
  }, [selectedProgramId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => setShowProgramDropdown(false);
    if (showProgramDropdown) {
      document.addEventListener('click', handler);
      return () => document.removeEventListener('click', handler);
    }
  }, [showProgramDropdown]);

  useEffect(() => {
    if (!profileData || autoFillDoneRef.current) return;

    let didChange = false;
    setCv(prev => {
      const next = { ...prev };

      const assign = (field: keyof CVData, value?: string, sampleValue?: string) => {
        if (!value) return;
        const current = prev[field];
        if (typeof current === 'string') {
          if (!current.trim() || (sampleValue && current === sampleValue)) {
            (next[field] as string) = value;
            didChange = true;
          }
        }
      };

      assign('name', profileData.fullName, SAMPLE.name);
      const titleFromProfile = profileData.targetDegreeLevel ? `${profileData.targetDegreeLevel} Applicant` : profileData.careerGoals;
      assign('title', titleFromProfile, SAMPLE.title);
      assign('phone', profileData.phone, SAMPLE.phone);
      assign('location', profileData.address || profileData.nationality ? `${profileData.address || ''}`.trim() || `${profileData.nationality}, Germany` : undefined, SAMPLE.location);
      const summaryFromProfile = profileData.backgroundSummary || profileData.academicBackground || profileData.careerGoals;
      assign('summary', summaryFromProfile, SAMPLE.summary);

      if (profileData.skills) {
        const parsed = profileData.skills
          .split(/[,\n]/)
          .map(s => s.trim())
          .filter(Boolean);
        const isSampleSkills = JSON.stringify(prev.skills) === JSON.stringify(SAMPLE.skills);
        if (parsed.length && (isSampleSkills || prev.skills.length === 0)) {
          next.skills = parsed;
          didChange = true;
        }
      }

      return didChange ? next : prev;
    });

    if (didChange) autoFillDoneRef.current = true;
  }, [profileData]);

  const handleSave = async () => {
    if (!user) {
      setSaveMessage('Please sign in to save');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch('/api/cv-maker/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cv.name || 'Untitled CV',
          templateId: tplId,
          accent,
          fontFamily,
          fontSize,
          data: cv,
          isDefault: false
        })
      });
      if (res.ok) {
        setSaveMessage('Saved!');
      } else {
        setSaveMessage('Failed to save');
      }
    } catch {
      setSaveMessage('Failed to save');
    }
    setIsSaving(false);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const defaultSkillLevel = (index: number) => Math.max(30, 90 - index * 7);

  useEffect(() => {
    setSkillLevels(prev => cv.skills.map((_, idx) => prev[idx] ?? defaultSkillLevel(idx)));
    setEditingSkillIndex(prev => (prev !== null && prev >= cv.skills.length ? null : prev));
  }, [cv.skills]);

  const handleAI = async (fd: Record<string, unknown>) => {
    setAiLoading(true);
    setAiDone(false);
    setAiError('');
    try {
      const res = await fetch('/api/cv-maker/ai/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fd) });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('AI API error:', res.status, errData);
        throw new Error(errData.message || `API error ${res.status}`);
      }
      const data = await res.json();
      setCv(p => ({ ...p, name: (fd.name as string) || p.name, title: (fd.jobTitle as string) || p.title, summary: data.summary || p.summary, experience: data.experience || p.experience, skills: data.skills || p.skills, education: data.education || p.education }));
      setAiDone(true);
      setTimeout(() => { setShowAI(false); setAiDone(false); }, 1500);
    } catch (err) {
      console.error('AI generation failed:', err);
      setAiError(err instanceof Error ? err.message : 'Generation failed. Please try again.');
    } finally { setAiLoading(false); }
  };

  const handleDownload = () => setShowPrintPreview(true);

  const handlePrint = async () => {
    try {
      // Show loading state
      const btn = document.querySelector('[data-pdf-btn]') as HTMLButtonElement;
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Generating PDF...';
      }

      // Wait a bit to ensure button state updates
      await new Promise(resolve => setTimeout(resolve, 50));

      // Use the existing rendered CV element instead of creating a new one
      const previewElement = document.querySelector('.cv-preview-container') as HTMLElement;
      if (!previewElement) {
        throw new Error('CV preview not found');
      }

      const exportRoot = document.createElement('div');
      exportRoot.style.position = 'fixed';
      exportRoot.style.left = '-99999px';
      exportRoot.style.top = '0';
      exportRoot.style.width = '595px';
      exportRoot.style.background = '#ffffff';
      exportRoot.style.zIndex = '-1';

      const exportNode = previewElement.cloneNode(true) as HTMLElement;
      exportNode.style.transform = 'none';
      exportNode.style.width = '595px';
      exportNode.style.background = '#ffffff';

      // Hide all interactive edit elements (buttons, inputs, forms) from the PDF
      exportNode.querySelectorAll('button, form, input, [contenteditable="true"]').forEach(el => {
        const element = el as HTMLElement;
        // Keep contenteditable text visible but remove editability
        if (element.getAttribute('contenteditable') === 'true') {
          element.removeAttribute('contenteditable');
          return;
        }
        // Hide edit buttons and forms
        element.style.display = 'none';
      });

      // Also remove any dashed borders (edit indicators)
      exportNode.querySelectorAll('*').forEach(el => {
        const element = el as HTMLElement;
        if (element.style.borderStyle === 'dashed') {
          element.style.borderStyle = 'none';
        }
      });

      const chipCandidates = Array.from(exportNode.querySelectorAll('[data-export-chip="true"]')) as HTMLElement[];
      chipCandidates.forEach((node) => {
        const textNode = node.querySelector('[data-export-chip-text="true"]') as HTMLElement | null;
        const currentFontSize = parseFloat(node.style.fontSize || '10');
        const targetHeight = Math.max(18, Math.round(currentFontSize * 2.1));
        const borderTop = parseFloat(node.style.borderTopWidth || '1');
        const borderBottom = parseFloat(node.style.borderBottomWidth || '1');
        const innerHeight = Math.max(currentFontSize + 1, targetHeight - borderTop - borderBottom);

        node.style.display = 'inline-block';
        node.style.height = `${targetHeight}px`;
        node.style.lineHeight = `${innerHeight}px`;
        node.style.paddingTop = '0';
        node.style.paddingBottom = '0';
        node.style.boxSizing = 'border-box';
        node.style.verticalAlign = 'top';
        node.style.whiteSpace = 'nowrap';
        node.style.overflow = 'hidden';

        if (textNode) {
          textNode.style.display = 'inline-block';
          textNode.style.lineHeight = '1';
          textNode.style.transform = 'translateY(-1px)';
        }
      });

      exportRoot.appendChild(exportNode);
      document.body.appendChild(exportRoot);

      // Wait for layout to settle in the off-screen clone
      await new Promise(resolve => setTimeout(resolve, 150));

      // Capture with high quality
      console.log('[PDF] Starting html2canvas capture...');
      const canvas = await html2canvas(exportNode, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        width: 595,
        height: 842,
        allowTaint: true,
        foreignObjectRendering: false
      });

      console.log('[PDF] Canvas created:', canvas.width, 'x', canvas.height);
      document.body.removeChild(exportRoot);

      // Create PDF
      console.log('[PDF] Creating PDF document...');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [595, 842]
      });

      console.log('[PDF] Converting canvas to image...');
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      console.log('[PDF] Adding image to PDF...');
      pdf.addImage(imgData, 'PNG', 0, 0, 595, 842, undefined, 'FAST');
      
      // Download
      console.log('[PDF] Saving PDF...');
      pdf.save(`${cv.name || 'CV'}.pdf`);

      console.log('[PDF] PDF download complete!');
      // Close modal
      setTimeout(() => setShowPrintPreview(false), 500);
    } catch (error) {
      console.error('[PDF] Failed to generate PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to generate PDF: ${errorMessage}\n\nPlease check the console for details.`);
    } finally {
      // Reset button
      const btn = document.querySelector('[data-pdf-btn]') as HTMLButtonElement;
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Download PDF';
      }
    }
  };

  const getSkillLevel = (idx: number) => skillLevels[idx] ?? defaultSkillLevel(idx);
  const closeSkillEditor = () => setEditingSkillIndex(null);

  /* ── Inline editable ── */
  const E = ({ v, onChange, k, cls = '', ph = 'Click to edit', multi = false, sty = {}, dark = false }: { v: string; onChange: (v: string) => void; k: string; cls?: string; ph?: string; multi?: boolean; sty?: React.CSSProperties; dark?: boolean }) => {
    if (editing === k) {
      const shared = `${cls} outline-none rounded px-1.5 py-0.5 w-full ${
        dark
          ? 'bg-white/10 border border-white/50 text-white placeholder:text-white/60'
          : 'bg-blue-50 border-2 border-blue-400 text-gray-900'
      }`;
      return multi
        ? <textarea autoFocus value={v} onChange={e => onChange(e.target.value)} onBlur={() => setEditing(null)} className={shared + ' resize-none'} style={sty} rows={3} />
        : <input autoFocus value={v} onChange={e => onChange(e.target.value)} onBlur={() => setEditing(null)} onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditing(null); }} className={shared} style={sty} placeholder={ph} />;
    }
    return (
      <span onClick={() => setEditing(k)} className={`${cls} cursor-pointer hover:bg-blue-100/60 rounded px-0.5 transition-colors ${!v ? 'text-gray-400 italic' : ''}`} style={sty} title="Click to edit">
        {v || ph}
      </span>
    );
  };

  /* ═══════════════════════════════════════════════════════
     PHASE 1: TEMPLATE PICKER
     ═══════════════════════════════════════════════════════ */
  if (phase === 'templates') {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        <SiteNav />

        {/* Back button to landing page */}
        <div style={{ padding: '0 24px', marginTop: 24 }}>
          <Link href="/cv-maker/landing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#666', textDecoration: 'none', padding: '8px 16px', borderRadius: 8, transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#dd0000'; e.currentTarget.style.background = '#fff5f5'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#666'; e.currentTarget.style.background = 'transparent'; }}>
            <ArrowLeft className="w-4 h-4" /> Back to CV Maker Info
          </Link>
        </div>

        <div className="cvmaker-page-wrap" style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#0a0a0a', margin: '0 0 12px' }}>Create your CV</h1>
            <p style={{ fontSize: 16, color: '#737373', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>Choose a template designed for German universities and employers. Click any text to edit directly.</p>
          </div>

          {/* AI Banner */}
          <div className="cvmaker-ai-banner" style={{ marginBottom: 40, borderRadius: 20, border: '2px solid rgba(221,0,0,0.15)', background: 'linear-gradient(135deg, rgba(221,0,0,0.05), rgba(124,58,237,0.05))', padding: 24, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #dd0000, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 24px rgba(221,0,0,0.2)' }}>
              <Wand2 className="w-7 h-7" style={{ color: '#fff' }} />
            </div>
            <div style={{ flex: 1, minWidth: 250 }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>Let AI write your CV</h3>
              <p style={{ fontSize: 14, color: '#666', margin: 0, lineHeight: 1.5 }}>Tell us about yourself and AI generates professional content for every section.</p>
            </div>
            <button onClick={() => { if (!session) { window.location.href = '/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href); return; } setPhase('editor'); setTimeout(() => setShowAI(true), 400); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 24px', borderRadius: 12, background: '#dd0000', color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(221,0,0,0.2)', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.background = '#b91c1c'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#dd0000'; e.currentTarget.style.transform = 'none'; }}>
              <Sparkles className="w-5 h-5" /> Generate with AI
            </button>
          </div>

          {/* Promo unlock banner */}
          {PROMO_UNLOCK_PREMIUM_TEMPLATES_FOR_AUTH && status === 'authenticated' && (
            <div style={{ marginBottom: 24, borderRadius: 14, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(135deg, rgba(221,0,0,0.08), rgba(139,92,246,0.1))', border: '1px solid rgba(139,92,246,0.25)' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#dd0000,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }}>
                <Crown size={16} color="#fff" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0a0a0a', margin: 0 }}>All premium templates unlocked for you</p>
                <p style={{ fontSize: 12, color: '#525252', margin: 0 }}>Limited-time launch offer — enjoy every template free while you have an account.</p>
              </div>
            </div>
          )}

          {/* Template Grid */}
          <div className="cvmaker-template-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16, paddingBottom: 100 }}>
            {TEMPLATES.map((t, idx) => {
              const isPremiumTpl = getTemplateAccessLabel(idx) !== null;
              const isLocked = !canAccessCvTemplate(planType, idx);
              const accessLabel = getTemplateAccessLabel(idx);
              return (
                <button key={t.id} onClick={() => {
                  setTplId(t.id); setAccent(t.accent);
                }} className="cv-template-card" style={{ position: 'relative', textAlign: 'left', borderRadius: 16, overflow: 'hidden', border: `2px solid ${tplId === t.id ? (isPremiumTpl ? '#f59e0b' : '#dd0000') : isPremiumTpl ? 'rgba(234,179,8,0.4)' : '#ebebeb'}`, background: '#fff', cursor: 'pointer', transition: 'all 0.3s', boxShadow: tplId === t.id ? (isPremiumTpl ? '0 8px 24px rgba(245,158,11,0.2)' : '0 8px 24px rgba(221,0,0,0.15)') : 'none' }}>
                  <div style={{ background: '#fff', overflow: 'hidden', display: 'flex', justifyContent: 'center', height: 180, position: 'relative' }}>
                    <MiniCV tpl={t} />
                    {isPremiumTpl && (
                      <>
                        {/* Diagonal watermark text — only if locked */}
                        {isLocked && (
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', overflow: 'hidden' }}>
                            <span style={{ transform: 'rotate(-30deg)', fontSize: 22, fontWeight: 900, color: 'rgba(234,179,8,0.22)', letterSpacing: '0.12em', whiteSpace: 'nowrap', userSelect: 'none', textTransform: 'uppercase' }}>PREMIUM</span>
                          </div>
                        )}
                        {/* Top-right badge — always show if premium template */}
                        <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', gap: 4, background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 20, padding: '3px 8px 3px 5px', boxShadow: '0 2px 8px rgba(245,158,11,0.4)' }}>
                          <Crown size={10} color="#fff" />
                          <span style={{ fontSize: 9, fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>PRO</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div style={{ padding: '12px 14px', background: isPremiumTpl ? '#fefce8' : '#fafafa', borderTop: `1px solid ${isPremiumTpl ? 'rgba(234,179,8,0.3)' : '#ebebeb'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#111', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</p>
                        <p style={{ fontSize: 11, color: isPremiumTpl ? '#a16207' : '#999', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{isPremiumTpl ? `✦ ${accessLabel}` : t.description}</p>
                      </div>
                      {isPremiumTpl
                        ? <Crown size={14} color="#f59e0b" style={{ flexShrink: 0 }} />
                        : t.hasPhoto && (
                          <span style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(221,0,0,0.1)', color: '#dd0000', fontSize: 10, fontWeight: 600, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Camera className="w-3 h-3" />Photo
                          </span>
                        )}
                    </div>
                  </div>
                  {tplId === t.id && <div style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: 999, background: isPremiumTpl ? 'linear-gradient(135deg,#f59e0b,#d97706)' : '#dd0000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isPremiumTpl ? '0 4px 12px rgba(245,158,11,0.4)' : '0 4px 12px rgba(221,0,0,0.3)' }}><Check className="w-4 h-4" style={{ color: '#fff' }} /></div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sticky bottom bar */}
        <div style={{ position: 'sticky', bottom: 0, zIndex: 30, borderTop: `1px solid ${isPremiumTemplate ? 'rgba(245,158,11,0.3)' : '#e5e5e5'}`, background: isPremiumTemplate ? 'rgba(255,252,235,0.97)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontSize: 14, color: '#999' }}>Selected: <span style={{ color: '#111', fontWeight: 700 }}>{tpl.name}</span>{isPremiumTemplate && <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: '#d97706', background: 'rgba(245,158,11,0.12)', padding: '2px 8px', borderRadius: 20 }}>✦ Pro template</span>}</div>
              {isPremiumTemplate && <div style={{ fontSize: 12, color: '#a16207' }}>You can edit freely — upgrade to Pro to download as PDF</div>}
            </div>
            <button onClick={() => setPhase('editor')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 12, background: isPremiumTemplate ? 'linear-gradient(135deg,#f59e0b,#d97706)' : '#dd0000', color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: isPremiumTemplate ? '0 4px 16px rgba(245,158,11,0.3)' : '0 4px 16px rgba(221,0,0,0.2)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
              Start editing <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     PHASE 2: EDITOR — click-to-edit on the CV
     ═══════════════════════════════════════════════════════ */
  const renderCV = (forPrint = false) => {
    // Calculate font size multiplier
    const sizeMultiplier = fontSize === 'small' ? 0.9 : fontSize === 'large' ? 1.1 : 1;
    const baseFontSize = 12 * sizeMultiplier;
    
    // Use selected font family or fall back to template font
    const effectiveFont = fontFamily || 'Inter, sans-serif';
    const effectiveTextColor = textColor || '#111827';

    const isFieldHidden = (field: string) => hiddenFields[field] === true;
    const toggleField = (field: string) => setHiddenFields(prev => ({ ...prev, [field]: !prev[field] }));
    const FieldToggle = ({ field, children }: { field: string; children: React.ReactNode }) => {
      const hidden = isFieldHidden(field);
      if (forPrint && hidden) return null;
      return (
        <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 2, opacity: hidden ? 0.35 : 1, textDecoration: hidden ? 'line-through' : 'none' }} className={forPrint ? '' : 'group/field'}>
          {children}
          {!forPrint && (
            <button
              onClick={(e) => { e.stopPropagation(); toggleField(field); }}
              className="opacity-0 group-hover/field:opacity-100 transition-opacity"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}
              title={hidden ? 'Show this field' : 'Hide this field'}
            >
              {hidden ? <EyeOff className="w-2.5 h-2.5 text-red-400" /> : <Eye className="w-2.5 h-2.5 text-gray-400" />}
            </button>
          )}
        </span>
      );
    };

    const SH = ({ children, id }: { children: string; id: string }) => (
      <div style={{ fontSize: 10 * sizeMultiplier, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: 4, marginBottom: 10, marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{children}</span>
        {!forPrint && id === 'exp' && <button onClick={addExp} className="text-[10px] text-blue-500 hover:text-blue-700 font-medium flex items-center gap-0.5 normal-case tracking-normal" style={{ letterSpacing: 0 }}><Plus className="w-3 h-3" />Add</button>}
        {!forPrint && id === 'edu' && <button onClick={addEdu} className="text-[10px] text-blue-500 hover:text-blue-700 font-medium flex items-center gap-0.5 normal-case tracking-normal" style={{ letterSpacing: 0 }}><Plus className="w-3 h-3" />Add</button>}
      </div>
    );

    const expBlock = cv.experience.map((exp, i) => (
      <div key={i} style={{ marginBottom: 12 }} className={forPrint ? '' : 'group/exp relative'}>
        {!forPrint && <button onClick={() => rmExp(i)} className="absolute -left-5 top-0 opacity-0 group-hover/exp:opacity-100 transition-opacity text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          {forPrint ? <span style={{ fontWeight: 600, fontSize: 12, color: effectiveTextColor }}>{exp.role}</span> : <E v={exp.role} onChange={v => upExp(i, 'role', v)} k={`exp-role-${i}`} cls="font-semibold text-[12px]" sty={{ color: effectiveTextColor }} ph="Job Title" />}
          {forPrint ? <span style={{ fontSize: 10, color: effectiveTextColor, opacity: 0.5 }}>{exp.period}</span> : <E v={exp.period} onChange={v => upExp(i, 'period', v)} k={`exp-period-${i}`} cls="text-[10px]" sty={{ color: effectiveTextColor, opacity: 0.5 }} ph="Period" />}
        </div>
        {forPrint ? <div style={{ fontSize: 11, color: effectiveTextColor, opacity: 0.65 }}>{exp.company}</div> : <E v={exp.company} onChange={v => upExp(i, 'company', v)} k={`exp-company-${i}`} cls="text-[11px]" sty={{ color: effectiveTextColor, opacity: 0.65 }} ph="Company Name" />}
        <ul style={{ margin: '4px 0 0 16px', fontSize: 11, color: effectiveTextColor, lineHeight: 1.6 }}>
          {exp.bullets.map((b, bi) => (
            <li key={bi} className={forPrint ? '' : 'group/bullet relative'}>
              {forPrint ? b : <E v={b} onChange={v => upBullet(i, bi, v)} k={`exp-b-${i}-${bi}`} cls="text-[11px]" ph="Add achievement..." />}
              {!forPrint && <button onClick={() => rmBullet(i, bi)} className="absolute -right-4 top-0 opacity-0 group-hover/bullet:opacity-100 text-red-400 hover:text-red-600"><X className="w-3 h-3" /></button>}
            </li>
          ))}
        </ul>
        {!forPrint && <button onClick={() => addBullet(i)} className="text-[10px] text-blue-500 hover:text-blue-700 mt-1 ml-4">+ Add bullet</button>}
      </div>
    ));

    const eduBlock = cv.education.map((edu, i) => (
      <div key={i} style={{ marginBottom: 8 }} className={forPrint ? '' : 'group/edu relative'}>
        {!forPrint && <button onClick={() => rmEdu(i)} className="absolute -left-5 top-0 opacity-0 group-hover/edu:opacity-100 transition-opacity text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          {forPrint ? <span style={{ fontWeight: 600, fontSize: 12, color: effectiveTextColor }}>{edu.degree}</span> : <E v={edu.degree} onChange={v => upEdu(i, 'degree', v)} k={`edu-deg-${i}`} cls="font-semibold text-[12px]" sty={{ color: effectiveTextColor }} ph="Degree" />}
          {forPrint ? <span style={{ fontSize: 10, color: '#9CA3AF' }}>{edu.period}</span> : <E v={edu.period} onChange={v => upEdu(i, 'period', v)} k={`edu-period-${i}`} cls="text-[10px] text-gray-500" ph="Period" />}
        </div>
        {forPrint ? <div style={{ fontSize: 11, color: '#6B7280' }}>{edu.school}</div> : <E v={edu.school} onChange={v => upEdu(i, 'school', v)} k={`edu-school-${i}`} cls="text-[11px] text-gray-600" ph="University" />}
      </div>
    ));

    const skillsBlock = (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', maxWidth: '100%' }}>
        {cv.skills.map((s, i) => (
          <span key={i} data-export-chip="true" className={forPrint ? '' : 'group/skill relative'} style={{ fontSize: 10, background: `${accent}15`, color: accent, padding: '0 10px', borderRadius: 999, border: `1px solid ${accent}30`, whiteSpace: 'nowrap', flexShrink: 0, display: 'inline-block', height: 22, lineHeight: '20px', boxSizing: 'border-box', verticalAlign: 'top' }}>
            <span data-export-chip-text="true">{s}</span>
            {!forPrint && <button onClick={() => rmSkill(i)} className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white opacity-0 group-hover/skill:opacity-100 transition-opacity flex items-center justify-center"><X className="w-2 h-2" /></button>}
          </span>
        ))}
        {!forPrint && (
          <form onSubmit={e => { e.preventDefault(); if (newSkill.trim()) { setCv(p => ({ ...p, skills: [...p.skills, newSkill.trim()] })); setNewSkill(''); } }} className="inline-flex">
            <input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="+ Add skill" className="text-[10px] bg-transparent border border-dashed border-gray-300 rounded-full px-2 py-0.5 outline-none focus:border-blue-400 w-20" />
          </form>
        )}
      </div>
    );

    const customSectionsBlock = (
      <>
        {cv.customSections.map((sec, i) => (
          <div key={i} style={{ marginTop: 18 }} className={forPrint ? '' : 'group/custom relative'}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: 4, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {forPrint ? <span>{sec.title}</span> : <E v={sec.title} onChange={v => upCustom(i, 'title', v)} k={`custom-title-${i}`} cls="text-[10px] font-bold uppercase" ph="Section Title" sty={{ color: accent }} />}
              {!forPrint && <button onClick={() => rmCustom(i)} className="text-[10px] text-red-400 hover:text-red-600 font-medium flex items-center gap-0.5 normal-case tracking-normal" style={{ letterSpacing: 0 }}><Trash2 className="w-3 h-3" />Remove</button>}
            </div>
            {forPrint ? <div style={{ fontSize: 11, color: '#374151', lineHeight: 1.6 }}>{sec.content}</div> : <E v={sec.content} onChange={v => upCustom(i, 'content', v)} k={`custom-content-${i}`} cls="text-[11px] text-gray-700 leading-relaxed block" ph="Add content here (e.g., hobbies, certifications, languages...)" multi />}
          </div>
        ))}
        {!forPrint && (
          <button onClick={addCustom} className="mt-4 flex items-center gap-1.5 text-[10px] text-blue-500 hover:text-blue-700 font-medium border border-dashed border-blue-300 rounded-lg px-3 py-2 hover:bg-blue-50 transition-colors w-full justify-center">
            <Plus className="w-3.5 h-3.5" /> Add section (Hobbies, Languages, Certifications...)
          </button>
        )}
      </>
    );

    const photoEl = (
      <div onClick={forPrint ? undefined : () => document.getElementById('photo-upload')?.click()} className={forPrint ? '' : 'cursor-pointer group/photo relative'} style={{ width: 72, height: 72, borderRadius: 999, background: '#E5E7EB', border: `3px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
        {cv.photo ? <img src={cv.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 22, color: '#9CA3AF', fontWeight: 600 }}>{cv.name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'CV'}</span>}
        {!forPrint && <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center"><Camera className="w-5 h-5 text-white" /></div>}
      </div>
    );

    const nameEl = forPrint ? <div style={{ fontSize: 20, fontWeight: 700, color: effectiveTextColor }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[20px] font-bold block" sty={{ color: effectiveTextColor }} ph="Your Name" />;
    const titleEl = forPrint ? <div style={{ fontSize: 12, color: effectiveTextColor, opacity: 0.6, marginTop: 2 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[12px] block mt-0.5" sty={{ color: effectiveTextColor, opacity: 0.6 }} ph="Job Title" />;
    const summaryEl = forPrint ? <div style={{ fontSize: 11, color: effectiveTextColor, lineHeight: 1.6 }}>{cv.summary}</div> : <E v={cv.summary} onChange={v => up('summary', v)} k="summary" cls="text-[11px] leading-relaxed block" sty={{ color: effectiveTextColor }} ph="Write your summary..." multi />;

    const contactLine = forPrint
      ? <div style={{ fontSize: 10, color: effectiveTextColor, opacity: 0.5, marginTop: 4 }}>{cv.email} · {cv.phone} · {cv.location}</div>
      : (
        <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <E v={cv.email} onChange={v => up('email', v)} k="email" cls="text-[10px]" ph="email" />
          <span>·</span>
          <E v={cv.phone} onChange={v => up('phone', v)} k="phone" cls="text-[10px]" ph="phone" />
          <span>·</span>
          <E v={cv.location} onChange={v => up('location', v)} k="loc" cls="text-[10px]" ph="location" />
        </div>
      );

    // Sidebar layout
    if (tpl.layout === 'sidebar') {
      const sidebarSkills = (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
          {cv.skills.map((s, i) => (
            <span key={i} className={forPrint ? '' : 'group/skill relative'} style={{ fontSize: 9, background: 'rgba(255,255,255,0.1)', color: '#CBD5E1', padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
              {s}
              {!forPrint && <button onClick={() => rmSkill(i)} className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 text-white opacity-0 group-hover/skill:opacity-100 transition-opacity flex items-center justify-center"><X className="w-2 h-2" /></button>}
            </span>
          ))}
          {!forPrint && (
            <form onSubmit={e => { e.preventDefault(); if (newSkill.trim()) { setCv(p => ({ ...p, skills: [...p.skills, newSkill.trim()] })); setNewSkill(''); } }} className="inline-flex">
              <input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="+ Add" className="text-[9px] bg-transparent border border-dashed border-white/20 rounded px-1.5 py-0.5 outline-none focus:border-blue-400 w-14 text-white/60 placeholder:text-white/30" />
            </form>
          )}
        </div>
      );
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, display: 'flex', fontFamily: effectiveFont, fontSize: baseFontSize }} className="bg-white shadow-2xl">
          <div style={{ width: 175, background: '#1E293B', color: '#fff', padding: '24px 18px' }}>
            <div onClick={forPrint ? undefined : () => document.getElementById('photo-upload')?.click()} className={forPrint ? '' : 'cursor-pointer group/photo relative'} style={{ width: 72, height: 72, borderRadius: 999, background: '#334155', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {cv.photo ? <img src={cv.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 22, color: '#94A3B8' }}>{cv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>}
              {!forPrint && <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center"><Camera className="w-4 h-4 text-white" /></div>}
            </div>
            <div className="text-center mb-3">
              {forPrint ? <div style={{ fontSize: 13, fontWeight: 700, color: accent }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[13px] font-bold block" sty={{ color: accent }} ph="Your Name" />}
              {forPrint ? <div style={{ fontSize: 9, opacity: 0.7, marginTop: 2 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[9px] opacity-70 block mt-1" ph="Job Title" />}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10, marginTop: 8 }}>
              <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: accent, marginBottom: 4 }}>Contact</div>
              <div style={{ fontSize: 8, opacity: 0.6, lineHeight: 1.8 }}>
                {forPrint ? <><div>{cv.email}</div><div>{cv.phone}</div><div>{cv.location}</div></> : <>
                  <E v={cv.email} onChange={v => up('email', v)} k="email" cls="block text-[8px]" ph="email" />
                  <E v={cv.phone} onChange={v => up('phone', v)} k="phone" cls="block text-[8px]" ph="phone" />
                  <E v={cv.location} onChange={v => up('location', v)} k="loc" cls="block text-[8px]" ph="location" />
                </>}
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10, marginTop: 10 }}>
              <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: accent, marginBottom: 6 }}>Skills</div>
              {sidebarSkills}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10, marginTop: 10 }}>
              <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: accent, marginBottom: 4 }}>Education</div>
              {cv.education.map((edu, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  {forPrint ? <div style={{ fontSize: 9, fontWeight: 600 }}>{edu.degree}</div> : <E v={edu.degree} onChange={v => upEdu(i, 'degree', v)} k={`edu-deg-${i}`} cls="font-semibold text-[9px] block" ph="Degree" />}
                  {forPrint ? <div style={{ fontSize: 8, opacity: 0.6 }}>{edu.school}</div> : <E v={edu.school} onChange={v => upEdu(i, 'school', v)} k={`edu-school-${i}`} cls="text-[8px] opacity-60 block" ph="School" />}
                  {forPrint ? <div style={{ fontSize: 7, opacity: 0.4 }}>{edu.period}</div> : <E v={edu.period} onChange={v => upEdu(i, 'period', v)} k={`edu-period-${i}`} cls="text-[7px] opacity-40 block" ph="Period" />}
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, padding: 24 }}>
            <SH id="sum">Summary</SH>
            {summaryEl}
            <SH id="exp">Experience</SH>
            {expBlock}
            {customSectionsBlock}
          </div>
        </div>
      );
    }

    // Modern layout
    if (tpl.layout === 'modern') {
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: effectiveFont, fontSize: baseFontSize }} className="bg-white shadow-2xl">
          <div style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, color: '#fff', padding: '28px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div onClick={forPrint ? undefined : () => document.getElementById('photo-upload')?.click()} className={forPrint ? '' : 'cursor-pointer group/photo relative'} style={{ width: 70, height: 70, borderRadius: 999, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {cv.photo ? <img src={cv.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 24, fontWeight: 700 }}>{cv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>}
              {!forPrint && <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center"><Camera className="w-5 h-5 text-white" /></div>}
            </div>
            <div>
              {forPrint ? <div style={{ fontSize: 20, fontWeight: 700 }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[20px] font-bold block" ph="Your Name" />}
              {forPrint ? <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[12px] opacity-85 block mt-0.5" ph="Job Title" />}
              <div style={{ fontSize: 9, opacity: 0.6, marginTop: 4, display: 'flex', gap: 10 }}>
                {forPrint ? <span>{cv.email} · {cv.phone} · {cv.location}</span> : <>
                  <E v={cv.email} onChange={v => up('email', v)} k="email" cls="text-[9px]" ph="email" />
                  <E v={cv.phone} onChange={v => up('phone', v)} k="phone" cls="text-[9px]" ph="phone" />
                  <E v={cv.location} onChange={v => up('location', v)} k="loc" cls="text-[9px]" ph="location" />
                </>}
              </div>
            </div>
          </div>
          <div style={{ padding: 24 }}>
            <SH id="sum">Summary</SH>
            {summaryEl}
            <SH id="exp">Experience</SH>
            {expBlock}
            <SH id="edu">Education</SH>
            {eduBlock}
            <SH id="skills">Skills</SH>
            {skillsBlock}
            {customSectionsBlock}
          </div>
        </div>
      );
    }

    // ── EUROPASS — official EU format with blue left stripe
    if (tpl.layout === 'europass') {
      const EuroSH = ({ children, id }: { children: React.ReactNode; id: string }) => (
        <div id={`section-${id}`} style={{ fontSize: 14, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 18, marginBottom: 8, paddingBottom: 4, borderBottom: `1px solid ${accent}40`, textDecoration: 'underline', textUnderlineOffset: 4 }}>
          {children}
        </div>
      );
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: 'Arial, sans-serif', fontSize: 12, display: 'flex' }} className="bg-white shadow-2xl">
          {/* Blue left stripe */}
          <div style={{ width: 12, background: accent, flexShrink: 0 }} />
          <div style={{ flex: 1, padding: '28px 32px 28px 24px' }}>
            {/* Header: name */}
            <div style={{ marginBottom: 6 }}>
              {forPrint ? <div style={{ fontSize: 28, fontWeight: 700, color: '#111' }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[28px] font-bold block text-gray-900" ph="Your Name" />}
            </div>
            {/* Personal info row */}
            <div style={{ fontSize: 10, color: '#374151', marginBottom: 4, display: 'flex', flexWrap: 'wrap', gap: 12, lineHeight: 1.7, alignItems: 'center' }}>
              <FieldToggle field="nationality">
                <strong>Nationality:</strong>&nbsp;{forPrint ? (cv.nationality || 'N/A') : <E v={cv.nationality || ''} onChange={v => setCv(p => ({ ...p, nationality: v }))} k="nationality" cls="text-[10px] inline" ph="Nationality" />}
              </FieldToggle>
              <FieldToggle field="dob">
                <strong>Date of birth:</strong>&nbsp;{forPrint ? (cv.dateOfBirth || 'N/A') : <E v={cv.dateOfBirth || ''} onChange={v => setCv(p => ({ ...p, dateOfBirth: v }))} k="dob" cls="text-[10px] inline" ph="DD/MM/YYYY" />}
              </FieldToggle>
              <FieldToggle field="gender">
                <strong>Gender:</strong>&nbsp;{forPrint ? (cv.gender || 'N/A') : <E v={cv.gender || ''} onChange={v => setCv(p => ({ ...p, gender: v }))} k="gender" cls="text-[10px] inline" ph="Gender" />}
              </FieldToggle>
              <FieldToggle field="phone">
                <strong>Phone:</strong>&nbsp;{forPrint ? cv.phone : <E v={cv.phone} onChange={v => up('phone', v)} k="phone" cls="text-[10px] inline" ph="phone" />}
              </FieldToggle>
            </div>
            {/* Contact row */}
            <div style={{ fontSize: 10, color: accent, marginBottom: 12, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <FieldToggle field="email">
                ✉ Email:&nbsp;{forPrint ? cv.email : <E v={cv.email} onChange={v => up('email', v)} k="email" cls="text-[10px] inline" sty={{ color: accent }} ph="email@example.com" />}
              </FieldToggle>
              <FieldToggle field="linkedin">
                🔗 LinkedIn:&nbsp;{forPrint ? (cv.linkedin || '') : <E v={cv.linkedin || ''} onChange={v => setCv(p => ({ ...p, linkedin: v }))} k="linkedin" cls="text-[10px] inline" sty={{ color: accent }} ph="linkedin.com/in/yourname" />}
              </FieldToggle>
            </div>
            <div style={{ borderBottom: `1px solid ${accent}25`, marginBottom: 4 }} />
            {/* About Me */}
            <EuroSH id="sum">{cv.sectionTitles?.summary || 'About Me'}</EuroSH>
            {summaryEl}
            {/* Work Experience */}
            <EuroSH id="exp">{cv.sectionTitles?.experience || 'Work Experience'}</EuroSH>
            {expBlock}
            {/* Education */}
            <EuroSH id="edu">{cv.sectionTitles?.education || 'Education and Training'}</EuroSH>
            {eduBlock}
            {/* Skills */}
            <EuroSH id="skills">{cv.sectionTitles?.skills || 'Skills'}</EuroSH>
            {skillsBlock}
            {customSectionsBlock}
            {/* Page number */}
            <div style={{ textAlign: 'right', fontSize: 9, color: '#9CA3AF', marginTop: 24 }}>1 / 1</div>
          </div>
        </div>
      );
    }

    // ── EU PHOTO — European-style with photo header
    if (tpl.layout === 'eu-photo') {
      const EuroSH = ({ children, id }: { children: React.ReactNode; id: string }) => (
        <div id={`section-${id}`} style={{ fontSize: 14, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 18, marginBottom: 8, paddingBottom: 4, borderBottom: `1px solid ${accent}40`, textDecoration: 'underline', textUnderlineOffset: 4 }}>
          {children}
        </div>
      );
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: 'Arial, sans-serif', fontSize: 12, display: 'flex' }} className="bg-white shadow-2xl">
          {/* Blue left stripe */}
          <div style={{ width: 12, background: accent, flexShrink: 0 }} />
          <div style={{ flex: 1, padding: '28px 32px 28px 24px' }}>
            {/* Header with photo */}
            <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', marginBottom: 12, paddingBottom: 14, borderBottom: `2px solid ${accent}25` }}>
              <div onClick={forPrint ? undefined : () => document.getElementById('photo-upload')?.click()} className={forPrint ? '' : 'cursor-pointer group/photo relative'} style={{ width: 80, height: 80, borderRadius: 999, background: `${accent}15`, border: `2px solid ${accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                {cv.photo ? <img src={cv.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 24, color: accent, fontWeight: 700 }}>{cv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>}
                {!forPrint && <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center"><Camera className="w-4 h-4 text-white" /></div>}
              </div>
              <div style={{ flex: 1 }}>
                {forPrint ? <div style={{ fontSize: 26, fontWeight: 700, color: '#111' }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[26px] font-bold block text-gray-900" ph="Your Name" />}
                {forPrint ? <div style={{ fontSize: 12, color: accent, fontWeight: 600, marginTop: 2 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[12px] font-semibold block mt-0.5" sty={{ color: accent }} ph="Job Title" />}
                <div style={{ fontSize: 10, color: '#6B7280', marginTop: 6, lineHeight: 1.8 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <FieldToggle field="email">
                      ✉&nbsp;{forPrint ? cv.email : <E v={cv.email} onChange={v => up('email', v)} k="email" cls="text-[10px] inline" ph="email" />}
                    </FieldToggle>
                    <FieldToggle field="phone">
                      ☎&nbsp;{forPrint ? cv.phone : <E v={cv.phone} onChange={v => up('phone', v)} k="phone" cls="text-[10px] inline" ph="phone" />}
                    </FieldToggle>
                    <FieldToggle field="location">
                      📍&nbsp;{forPrint ? cv.location : <E v={cv.location} onChange={v => up('location', v)} k="loc" cls="text-[10px] inline" ph="location" />}
                    </FieldToggle>
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 2, alignItems: 'center' }}>
                    <FieldToggle field="nationality">
                      <strong>Nationality:</strong>&nbsp;{forPrint ? (cv.nationality || 'N/A') : <E v={cv.nationality || ''} onChange={v => setCv(p => ({ ...p, nationality: v }))} k="nationality" cls="text-[10px] inline" ph="Nationality" />}
                    </FieldToggle>
                    <FieldToggle field="dob">
                      <strong>DOB:</strong>&nbsp;{forPrint ? (cv.dateOfBirth || 'N/A') : <E v={cv.dateOfBirth || ''} onChange={v => setCv(p => ({ ...p, dateOfBirth: v }))} k="dob" cls="text-[10px] inline" ph="DD/MM/YYYY" />}
                    </FieldToggle>
                    <FieldToggle field="gender">
                      <strong>Gender:</strong>&nbsp;{forPrint ? (cv.gender || 'N/A') : <E v={cv.gender || ''} onChange={v => setCv(p => ({ ...p, gender: v }))} k="gender" cls="text-[10px] inline" ph="Gender" />}
                    </FieldToggle>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 2, alignItems: 'center' }}>
                    <FieldToggle field="linkedin">
                      🔗&nbsp;{forPrint ? (cv.linkedin || '') : <E v={cv.linkedin || ''} onChange={v => setCv(p => ({ ...p, linkedin: v }))} k="linkedin" cls="text-[10px] inline" sty={{ color: accent }} ph="linkedin.com/in/yourname" />}
                    </FieldToggle>
                  </div>
                </div>
              </div>
            </div>
            {/* About Me */}
            <EuroSH id="sum">{cv.sectionTitles?.summary || 'About Me'}</EuroSH>
            {summaryEl}
            {/* Work Experience */}
            <EuroSH id="exp">{cv.sectionTitles?.experience || 'Work Experience'}</EuroSH>
            {expBlock}
            {/* Education */}
            <EuroSH id="edu">{cv.sectionTitles?.education || 'Education and Training'}</EuroSH>
            {eduBlock}
            {/* Skills */}
            <EuroSH id="skills">{cv.sectionTitles?.skills || 'Skills'}</EuroSH>
            {skillsBlock}
            {customSectionsBlock}
            <div style={{ textAlign: 'right', fontSize: 9, color: '#9CA3AF', marginTop: 24 }}>1 / 1</div>
          </div>
        </div>
      );
    }

    // ── DARK SIDEBAR — near-black left panel + skill bars
    if (tpl.layout === 'dark-sidebar') {
      const darkSkills = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {cv.skills.map((s, i) => {
            const level = getSkillLevel(i);
            return (
              <div key={i} className={forPrint ? '' : 'group/skill relative'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.7)', marginBottom: 4, alignItems: 'center', gap: 6 }}>
                  <span>{s}</span>
                  {!forPrint ? (
                    <button type="button" onClick={() => setEditingSkillIndex(editingSkillIndex === i ? null : i)} style={{ color: accent, background: 'none', border: 'none', cursor: 'pointer', fontSize: 9, padding: 0 }} title="Click to edit percentage">{level}%</button>
                  ) : (
                    <span style={{ color: accent }}>{level}%</span>
                  )}
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 99 }}>
                  <div style={{ width: `${level}%`, height: '100%', background: accent, borderRadius: 99 }} />
                </div>
                {!forPrint && (
                  editingSkillIndex === i ? (
                    <div className="mt-1 flex items-center gap-2 text-[8px] text-white/60" onMouseLeave={closeSkillEditor}>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={level}
                        onChange={e => setSkillLevels(prev => prev.map((val, idx) => (idx === i ? Number(e.target.value) : val)))}
                        onMouseUp={closeSkillEditor}
                        onTouchEnd={closeSkillEditor}
                        className="flex-1"
                      />
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={level}
                        onChange={e => {
                          const next = Math.min(100, Math.max(0, Number(e.target.value)));
                          setSkillLevels(prev => prev.map((val, idx) => (idx === i ? next : val)));
                        }}
                        onBlur={closeSkillEditor}
                        className="w-10 bg-white/10 border border-white/20 rounded px-1 py-0.5 text-white text-[8px]"
                      />
                    </div>
                  ) : null
                )}
                {!forPrint && <button onClick={() => rmSkill(i)} className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 text-white opacity-0 group-hover/skill:opacity-100 transition-opacity flex items-center justify-center"><X className="w-2 h-2" /></button>}
              </div>
            );
          })}
          {!forPrint && <form onSubmit={e => { e.preventDefault(); if (newSkill.trim()) { setCv(p => ({ ...p, skills: [...p.skills, newSkill.trim()] })); setNewSkill(''); } }} className="inline-flex"><input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="+ Add skill" className="text-[9px] bg-transparent border border-dashed border-white/20 rounded px-2 py-0.5 outline-none focus:border-blue-400 w-20 text-white/60 placeholder:text-white/30" /></form>}
        </div>
      );
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, display: 'flex', fontFamily: tpl.font, fontSize: 12 }} className="bg-white shadow-2xl">
          <div style={{ width: 185, background: sidebarColor, color: '#fff', padding: '28px 18px', flexShrink: 0 }}>
            <div onClick={forPrint ? undefined : () => document.getElementById('photo-upload')?.click()} className={forPrint ? '' : 'cursor-pointer group/photo relative'} style={{ width: 80, height: 80, borderRadius: 999, background: `${accent}33`, border: `3px solid ${accent}`, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {cv.photo ? <img src={cv.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 26, color: accent, fontWeight: 700 }}>{cv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>}
              {!forPrint && <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center"><Camera className="w-4 h-4 text-white" /></div>}
            </div>
            <div className="text-center mb-4">
              {forPrint ? <div style={{ fontSize: 13, fontWeight: 700, color: accent }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[13px] font-bold block" sty={{ color: accent }} ph="Your Name" />}
              {forPrint ? <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[9px] block mt-1" sty={{ color: 'rgba(255,255,255,0.85)' }} ph="Job Title" />}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10, marginBottom: 10 }}>
              <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: accent, marginBottom: 5 }}>Contact</div>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                {forPrint ? <><div>{cv.email}</div><div>{cv.phone}</div><div>{cv.location}</div></> : <><E v={cv.email} onChange={v => up('email', v)} k="email" cls="block text-[8px]" ph="email" /><E v={cv.phone} onChange={v => up('phone', v)} k="phone" cls="block text-[8px]" ph="phone" /><E v={cv.location} onChange={v => up('location', v)} k="loc" cls="block text-[8px]" ph="location" /></>}
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10 }}>
              <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: accent, marginBottom: 8 }}>Skills</div>
              {darkSkills}
            </div>
          </div>
          <div style={{ flex: 1, padding: '24px 24px' }}>
            <SH id="sum">{cv.sectionTitles?.summary || 'Summary'}</SH>{summaryEl}
            <SH id="exp">{cv.sectionTitles?.experience || 'Experience'}</SH>{expBlock}
            <SH id="edu">{cv.sectionTitles?.education || 'Education'}</SH>{eduBlock}
            {customSectionsBlock}
          </div>
        </div>
      );
    }

    // ── TIMELINE — dot-and-line connector between entries
    if (tpl.layout === 'timeline') {
      const timelineExp = cv.experience.map((exp, i) => (
        <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 16 }} className={forPrint ? '' : 'group/exp relative'}>
          {!forPrint && <button onClick={() => rmExp(i)} className="absolute -left-4 top-0 opacity-0 group-hover/exp:opacity-100 text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: accent, flexShrink: 0, border: '2px solid white', boxShadow: `0 0 0 2px ${accent}` }} />
            {i < cv.experience.length - 1 && <div style={{ width: 2, flex: 1, background: `${accent}30`, marginTop: 4 }} />}
          </div>
          <div style={{ flex: 1, paddingBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              {forPrint ? <span style={{ fontWeight: 600, fontSize: 12 }}>{exp.role}</span> : <E v={exp.role} onChange={v => upExp(i, 'role', v)} k={`exp-role-${i}`} cls="font-semibold text-[12px] text-gray-900" ph="Job Title" />}
              {forPrint ? <span style={{ fontSize: 10, color: accent }}>{exp.period}</span> : <E v={exp.period} onChange={v => upExp(i, 'period', v)} k={`exp-period-${i}`} cls="text-[10px]" sty={{ color: accent }} ph="Period" />}
            </div>
            {forPrint ? <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>{exp.company}</div> : <E v={exp.company} onChange={v => upExp(i, 'company', v)} k={`exp-company-${i}`} cls="text-[11px] text-gray-600 font-semibold" ph="Company" />}
            <ul style={{ margin: '4px 0 0 14px', fontSize: 11, color: '#374151', lineHeight: 1.6 }}>
              {exp.bullets.map((b, bi) => <li key={bi} className={forPrint ? '' : 'group/bullet relative'}>{forPrint ? b : <E v={b} onChange={v => upBullet(i, bi, v)} k={`exp-b-${i}-${bi}`} cls="text-[11px]" ph="Achievement..." />}{!forPrint && <button onClick={() => rmBullet(i, bi)} className="absolute -right-4 top-0 opacity-0 group-hover/bullet:opacity-100 text-red-400 hover:text-red-600"><X className="w-3 h-3" /></button>}</li>)}
            </ul>
            {!forPrint && <button onClick={() => addBullet(i)} className="text-[10px] text-blue-500 hover:text-blue-700 mt-1 ml-3">+ Add bullet</button>}
          </div>
        </div>
      ));
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: tpl.font, fontSize: 12, padding: 28 }} className="bg-white shadow-2xl">
          <div style={{ borderBottom: `3px solid ${accent}`, paddingBottom: 12, marginBottom: 4 }}>
            {nameEl}{titleEl}{contactLine}
          </div>
          <SH id="sum">{cv.sectionTitles?.summary || 'Summary'}</SH>{summaryEl}
          <SH id="exp">{cv.sectionTitles?.experience || 'Experience'}</SH>
          {timelineExp}
          {!forPrint && <button onClick={addExp} className="text-[10px] text-blue-500 hover:text-blue-700 font-medium flex items-center gap-0.5 mb-2"><Plus className="w-3 h-3" />Add experience</button>}
          <SH id="edu">{cv.sectionTitles?.education || 'Education'}</SH>{eduBlock}
          <SH id="skills">{cv.sectionTitles?.skills || 'Skills'}</SH>{skillsBlock}
          {customSectionsBlock}
        </div>
      );
    }

    // ── BANNER HERO — gradient header + square photo
    if (tpl.layout === 'top-banner') {
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: effectiveFont, fontSize: 12 }} className="bg-white shadow-2xl">
          <div style={{ background: `linear-gradient(120deg,${accent},${accent}99)`, padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
            <div onClick={forPrint ? undefined : () => document.getElementById('photo-upload')?.click()} className={forPrint ? '' : 'cursor-pointer group/photo relative'} style={{ width: 80, height: 80, borderRadius: 8, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {cv.photo ? <img src={cv.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>{cv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>}
              {!forPrint && <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center"><Camera className="w-5 h-5 text-white" /></div>}
            </div>
            <div>
              {forPrint ? <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[24px] font-black block" sty={{ color: '#fff' }} ph="Your Name" />}
              {forPrint ? <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[12px] block mt-0.5" sty={{ color: 'rgba(255,255,255,0.85)' }} ph="Job Title" />}
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 6, display: 'flex', gap: 8 }}>
                {forPrint ? <span>{cv.email} · {cv.phone} · {cv.location}</span> : <><E v={cv.email} onChange={v => up('email', v)} k="email" cls="text-[10px]" ph="email" /><span>·</span><E v={cv.phone} onChange={v => up('phone', v)} k="phone" cls="text-[10px]" ph="phone" /><span>·</span><E v={cv.location} onChange={v => up('location', v)} k="loc" cls="text-[10px]" ph="location" /></>}
              </div>
            </div>
          </div>
          <div style={{ padding: '16px 28px 28px' }}>
            <SH id="sum">{cv.sectionTitles?.summary || 'About'}</SH>{summaryEl}
            <SH id="exp">{cv.sectionTitles?.experience || 'Experience'}</SH>{expBlock}
            <SH id="edu">{cv.sectionTitles?.education || 'Education'}</SH>{eduBlock}
            <SH id="skills">{cv.sectionTitles?.skills || 'Skills'}</SH>{skillsBlock}
            {customSectionsBlock}
          </div>
        </div>
      );
    }

    // ── TWO COLUMN — 58/42 split
    if (tpl.layout === 'two-column') {
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: effectiveFont, fontSize: 12 }} className="bg-white shadow-2xl">
          <div style={{ borderBottom: `3px solid ${accent}`, padding: '18px 28px 14px' }}>
            {forPrint ? <div style={{ fontSize: 24, fontWeight: 800, color: '#111' }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[24px] font-bold block text-gray-900" ph="Your Name" />}
            {forPrint ? <div style={{ fontSize: 12, color: accent, fontWeight: 600 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[12px] font-semibold block" sty={{ color: accent }} ph="Job Title" />}
            {contactLine}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '58% 42%', minHeight: 700 }}>
            <div style={{ padding: '16px 20px 28px 28px', borderRight: '1px solid #E5E7EB' }}>
              <SH id="sum">{cv.sectionTitles?.summary || 'Summary'}</SH>{summaryEl}
              <SH id="exp">{cv.sectionTitles?.experience || 'Experience'}</SH>{expBlock}
              {customSectionsBlock}
            </div>
            <div style={{ padding: '16px 24px 28px 20px' }}>
              <SH id="edu">{cv.sectionTitles?.education || 'Education'}</SH>{eduBlock}
              <SH id="skills">{cv.sectionTitles?.skills || 'Skills'}</SH>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {cv.skills.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }} className={forPrint ? '' : 'group/skill relative'}>
                    <div style={{ width: 6, height: 6, borderRadius: 999, background: accent, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#111827', fontWeight: 700 }}>{s}</span>
                    {!forPrint && <button onClick={() => rmSkill(i)} className="ml-auto w-3.5 h-3.5 rounded-full bg-red-500 text-white opacity-0 group-hover/skill:opacity-100 flex items-center justify-center"><X className="w-2 h-2" /></button>}
                  </div>
                ))}
                {!forPrint && <form onSubmit={e => { e.preventDefault(); if (newSkill.trim()) { setCv(p => ({ ...p, skills: [...p.skills, newSkill.trim()] })); setNewSkill(''); } }}><input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="+ Add skill" className="text-[10px] bg-transparent border border-dashed border-gray-300 rounded-full px-2 py-0.5 outline-none focus:border-blue-400 w-24" /></form>}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ── INFOGRAPHIC — tinted header + skill bars sidebar
    if (tpl.layout === 'infographic') {
      const infoSkills = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cv.skills.map((s, i) => (
            <div key={i} className={forPrint ? '' : 'group/skill relative'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#111827', marginBottom: 3, fontWeight: 700 }}>
                <span>{s}</span><span style={{ color: accent, fontWeight: 600 }}>{85 - (i % 6) * 9}%</span>
              </div>
              <div style={{ height: 4, background: '#F3F4F6', borderRadius: 99 }}>
                <div style={{ width: `${85 - (i % 6) * 9}%`, height: '100%', background: accent, borderRadius: 99 }} />
              </div>
              {!forPrint && <button onClick={() => rmSkill(i)} className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white opacity-0 group-hover/skill:opacity-100 flex items-center justify-center"><X className="w-2 h-2" /></button>}
            </div>
          ))}
          {!forPrint && <form onSubmit={e => { e.preventDefault(); if (newSkill.trim()) { setCv(p => ({ ...p, skills: [...p.skills, newSkill.trim()] })); setNewSkill(''); } }}><input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="+ Add skill" className="text-[10px] bg-transparent border border-dashed border-gray-300 rounded-full px-2 py-0.5 outline-none focus:border-blue-400 w-24" /></form>}
        </div>
      );
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: effectiveFont, fontSize: 12 }} className="bg-white shadow-2xl">
          <div style={{ background: `${accent}15`, borderBottom: `3px solid ${accent}`, padding: '18px 28px 14px', display: 'flex', alignItems: 'center', gap: 16 }}>
            {photoEl}
            <div>
              {forPrint ? <div style={{ fontSize: 22, fontWeight: 800, color: '#111' }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[22px] font-bold block text-gray-900" ph="Your Name" />}
              {forPrint ? <div style={{ fontSize: 12, color: accent, fontWeight: 700 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[12px] font-bold block" sty={{ color: accent }} ph="Job Title" />}
              {contactLine}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', minHeight: 680 }}>
            <div style={{ padding: '16px 20px 28px 28px', borderRight: `2px solid ${accent}22` }}>
              <SH id="exp">{cv.sectionTitles?.experience || 'Experience'}</SH>{expBlock}
              <SH id="edu">{cv.sectionTitles?.education || 'Education'}</SH>{eduBlock}
              {customSectionsBlock}
            </div>
            <div style={{ padding: '16px 24px 28px 18px' }}>
              <SH id="sum">{cv.sectionTitles?.summary || 'Profile'}</SH>{summaryEl}
              <SH id="skills">{cv.sectionTitles?.skills || 'Skills'}</SH>{infoSkills}
            </div>
          </div>
        </div>
      );
    }

    // ── MINIMAL CLEAN — pure black, no color
    if (tpl.layout === 'minimal-clean') {
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: 'Helvetica,Arial,sans-serif', fontSize: 12, padding: 40 }} className="bg-white shadow-2xl">
          <div style={{ borderBottom: '2.5px solid #111', paddingBottom: 14, marginBottom: 4 }}>
            {forPrint ? <div style={{ fontSize: 28, fontWeight: 900, color: '#111', letterSpacing: -1 }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[28px] font-black block text-gray-900" ph="Your Name" />}
            {forPrint ? <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[13px] text-gray-600 block mt-1" ph="Job Title" />}
            {forPrint ? <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>{cv.email} · {cv.phone} · {cv.location}</div> : (
              <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <E v={cv.email} onChange={v => up('email', v)} k="email" cls="text-[10px]" ph="email" /><span>·</span>
                <E v={cv.phone} onChange={v => up('phone', v)} k="phone" cls="text-[10px]" ph="phone" /><span>·</span>
                <E v={cv.location} onChange={v => up('location', v)} k="loc" cls="text-[10px]" ph="location" />
              </div>
            )}
          </div>
          <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 1.5, color: '#111', borderBottom: '1.5px solid #111', paddingBottom: 4, marginBottom: 10, marginTop: 20 }}>Summary</div>
          {summaryEl}
          <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 1.5, color: '#111', borderBottom: '1.5px solid #111', paddingBottom: 4, marginBottom: 10, marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
            <span>Experience</span>{!forPrint && <button onClick={addExp} className="text-[9px] text-blue-500 normal-case tracking-normal" style={{ letterSpacing: 0 }}><Plus className="w-3 h-3 inline" />Add</button>}
          </div>
          {expBlock}
          <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 1.5, color: '#111', borderBottom: '1.5px solid #111', paddingBottom: 4, marginBottom: 10, marginTop: 20 }}>Education</div>
          {eduBlock}
          <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 1.5, color: '#111', borderBottom: '1.5px solid #111', paddingBottom: 4, marginBottom: 10, marginTop: 20 }}>Skills</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {cv.skills.map((s, i) => (
              <span key={i} data-export-chip="true" style={{ fontSize: 10, border: '1px solid #999', color: '#333', padding: '0 10px', borderRadius: 2, display: 'inline-block', height: 22, lineHeight: '20px', boxSizing: 'border-box', verticalAlign: 'top', whiteSpace: 'nowrap' }} className={forPrint ? '' : 'group/skill relative'}>
                <span data-export-chip-text="true">{s}</span>{!forPrint && <button onClick={() => rmSkill(i)} className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white opacity-0 group-hover/skill:opacity-100 flex items-center justify-center"><X className="w-2 h-2" /></button>}
              </span>
            ))}
            {!forPrint && <form onSubmit={e => { e.preventDefault(); if (newSkill.trim()) { setCv(p => ({ ...p, skills: [...p.skills, newSkill.trim()] })); setNewSkill(''); } }}><input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="+ Add skill" className="text-[10px] bg-transparent border border-dashed border-gray-400 rounded px-2 py-0.5 outline-none focus:border-gray-600 w-20" /></form>}
          </div>
          {customSectionsBlock}
        </div>
      );
    }

    // ── ACADEMIC CV — centred header, serif font
    if (tpl.layout === 'academic-cv') {
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: 'Georgia,serif', fontSize: 12, padding: 36 }} className="bg-white shadow-2xl">
          <div style={{ textAlign: 'center', borderBottom: `1px solid ${accent}`, paddingBottom: 16, marginBottom: 4 }}>
            {forPrint ? <div style={{ fontSize: 26, fontWeight: 700, color: accent }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[26px] font-bold block text-center" sty={{ color: accent }} ph="Your Name" />}
            {forPrint ? <div style={{ fontSize: 12, color: '#555', marginTop: 4, fontStyle: 'italic' }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[12px] italic text-gray-600 block mt-1 text-center" ph="Academic Title / Field" />}
            {forPrint ? <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 6 }}>{cv.email} · {cv.phone} · {cv.location}</div> : (
              <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 6, display: 'flex', justifyContent: 'center', gap: 8 }}>
                <E v={cv.email} onChange={v => up('email', v)} k="email" cls="text-[10px]" ph="email" /><span>·</span>
                <E v={cv.phone} onChange={v => up('phone', v)} k="phone" cls="text-[10px]" ph="phone" /><span>·</span>
                <E v={cv.location} onChange={v => up('location', v)} k="loc" cls="text-[10px]" ph="location" />
              </div>
            )}
          </div>
          <SH id="sum">Research Interests</SH>{summaryEl}
          <SH id="edu">{cv.sectionTitles?.education || 'Education'}</SH>{eduBlock}
          <SH id="exp">{cv.sectionTitles?.experience || 'Experience'}</SH>{expBlock}
          <SH id="skills">{cv.sectionTitles?.skills || 'Skills'}</SH>{skillsBlock}
          {customSectionsBlock}
        </div>
      );
    }

    // ── DIN 5008
    if (tpl.layout === 'din5008') {
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: 'Arial,sans-serif', fontSize: 12, padding: '32px 36px' }} className="bg-white shadow-2xl">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              {forPrint ? <div style={{ fontSize: 24, fontWeight: 700, color: '#111' }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[24px] font-bold block text-gray-900" ph="Your Name" />}
              {forPrint ? <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[12px] text-gray-600 block mt-1" ph="Job Title" />}
              {contactLine}
            </div>
            <div onClick={forPrint ? undefined : () => document.getElementById('photo-upload')?.click()} className={forPrint ? '' : 'cursor-pointer group/photo relative'} style={{ width: 72, height: 90, borderRadius: 4, background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {cv.photo ? <img src={cv.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 20, color: '#9CA3AF', fontWeight: 600 }}>{cv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>}
              {!forPrint && <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center"><Camera className="w-4 h-4 text-white" /></div>}
            </div>
          </div>
          <div style={{ borderTop: '2px solid #374151', borderBottom: '1px solid #374151', padding: '6px 0', marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#111' }}>Bewerbung als {cv.title || 'Position'}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, minHeight: 600 }}>
            <div><SH id="exp">{cv.sectionTitles?.experience || 'Berufserfahrung'}</SH>{expBlock}{customSectionsBlock}</div>
            <div><SH id="sum">{cv.sectionTitles?.summary || 'Profil'}</SH>{summaryEl}<SH id="edu">{cv.sectionTitles?.education || 'Ausbildung'}</SH>{eduBlock}<SH id="skills">{cv.sectionTitles?.skills || 'Kenntnisse'}</SH>{skillsBlock}</div>
          </div>
        </div>
      );
    }

    // ── PHOTO LEFT
    if (tpl.layout === 'photo-left') {
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: tpl.font, fontSize: 12, display: 'flex' }} className="bg-white shadow-2xl">
          <div style={{ width: 170, background: `${accent}10`, borderRight: `3px solid ${accent}`, padding: '28px 16px', display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
            <div onClick={forPrint ? undefined : () => document.getElementById('photo-upload')?.click()} className={forPrint ? '' : 'cursor-pointer group/photo relative'} style={{ width: 110, height: 110, borderRadius: 6, background: `${accent}25`, border: `3px solid ${accent}`, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {cv.photo ? <img src={cv.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 32, color: accent, fontWeight: 700 }}>{cv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>}
              {!forPrint && <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center"><Camera className="w-5 h-5 text-white" /></div>}
            </div>
            <div style={{ borderTop: `1px solid ${accent}33`, paddingTop: 10 }}>
              <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.8, color: accent, marginBottom: 6 }}>Contact</div>
              <div style={{ fontSize: 9, color: '#6B7280', lineHeight: 1.8 }}>
                {forPrint ? <><div>{cv.email}</div><div>{cv.phone}</div><div>{cv.location}</div></> : <><E v={cv.email} onChange={v => up('email', v)} k="email" cls="block text-[9px]" ph="email" /><E v={cv.phone} onChange={v => up('phone', v)} k="phone" cls="block text-[9px]" ph="phone" /><E v={cv.location} onChange={v => up('location', v)} k="loc" cls="block text-[9px]" ph="location" /></>}
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${accent}33`, paddingTop: 10 }}>
              <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.8, color: accent, marginBottom: 6 }}>Skills</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {cv.skills.map((s, i) => <div key={i} style={{ fontSize: 9, color: '#374151' }} className={forPrint ? '' : 'group/skill relative'}>• {s}{!forPrint && <button onClick={() => rmSkill(i)} className="absolute -right-1 top-0 opacity-0 group-hover/skill:opacity-100 text-red-400"><X className="w-2.5 h-2.5" /></button>}</div>)}
                {!forPrint && <form onSubmit={e => { e.preventDefault(); if (newSkill.trim()) { setCv(p => ({ ...p, skills: [...p.skills, newSkill.trim()] })); setNewSkill(''); } }}><input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="+ Add" className="text-[9px] bg-transparent border border-dashed border-gray-300 rounded px-1.5 py-0.5 outline-none w-20" /></form>}
              </div>
            </div>
          </div>
          <div style={{ flex: 1, padding: '28px 24px' }}>
            <div style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 12, marginBottom: 4 }}>
              {forPrint ? <div style={{ fontSize: 22, fontWeight: 900, color: '#111' }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[22px] font-black block text-gray-900" ph="Your Name" />}
              {forPrint ? <div style={{ fontSize: 12, color: accent, fontWeight: 700 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[12px] font-bold block" sty={{ color: accent }} ph="Job Title" />}
            </div>
            <SH id="sum">{cv.sectionTitles?.summary || 'Summary'}</SH>{summaryEl}
            <SH id="exp">{cv.sectionTitles?.experience || 'Experience'}</SH>{expBlock}
            <SH id="edu">{cv.sectionTitles?.education || 'Education'}</SH>{eduBlock}
            {customSectionsBlock}
          </div>
        </div>
      );
    }

    // ── COLORED HEADER
    if (tpl.layout === 'colored-header') {
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: effectiveFont, fontSize: 12 }} className="bg-white shadow-2xl">
          <div style={{ background: accent, padding: '24px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              {photoEl}
              <div>
                {forPrint ? <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[24px] font-black block" sty={{ color: '#fff' }} ph="Your Name" />}
                {forPrint ? <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[12px] block mt-0.5" sty={{ color: 'rgba(255,255,255,0.9)' }} ph="Job Title" />}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 10, color: 'rgba(255,255,255,0.95)' }}>
              {forPrint ? <><span>◆ {cv.email}</span><span>◆ {cv.phone}</span><span>◆ {cv.location}</span></> : <><span>◆ </span><E v={cv.email} onChange={v => up('email', v)} k="email" cls="text-[10px]" sty={{ color: 'rgba(255,255,255,0.95)' }} ph="email" /><span>◆ </span><E v={cv.phone} onChange={v => up('phone', v)} k="phone" cls="text-[10px]" sty={{ color: 'rgba(255,255,255,0.95)' }} ph="phone" /><span>◆ </span><E v={cv.location} onChange={v => up('location', v)} k="loc" cls="text-[10px]" sty={{ color: 'rgba(255,255,255,0.95)' }} ph="location" /></>}
            </div>
          </div>
          <div style={{ padding: '16px 28px 28px' }}>
            <SH id="sum">{cv.sectionTitles?.summary || 'Profile'}</SH>{summaryEl}
            <SH id="exp">{cv.sectionTitles?.experience || 'Experience'}</SH>{expBlock}
            <SH id="edu">{cv.sectionTitles?.education || 'Education'}</SH>{eduBlock}
            <SH id="skills">{cv.sectionTitles?.skills || 'Skills'}</SH>{skillsBlock}
            {customSectionsBlock}
          </div>
        </div>
      );
    }

    // ── COMPACT GRID
    if (tpl.layout === 'compact-grid') {
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: effectiveFont, fontSize: 12 }} className="bg-white shadow-2xl">
          <div style={{ background: '#1E1B4B', padding: '18px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {forPrint ? <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[22px] font-black block" sty={{ color: '#fff' }} ph="Your Name" />}
              {forPrint ? <div style={{ fontSize: 11, color: accent, marginTop: 2 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[11px] block mt-0.5" sty={{ color: accent }} ph="Job Title" />}
            </div>
            <div style={{ textAlign: 'right' as const, fontSize: 9, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
              {forPrint ? <><div>{cv.email}</div><div>{cv.phone}</div></> : <><E v={cv.email} onChange={v => up('email', v)} k="email" cls="block text-[9px] text-right" ph="email" /><E v={cv.phone} onChange={v => up('phone', v)} k="phone" cls="block text-[9px] text-right" ph="phone" /></>}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', minHeight: 680 }}>
            <div style={{ padding: '16px 20px 28px 28px', borderRight: `1px solid ${accent}33` }}>
              <SH id="sum">{cv.sectionTitles?.summary || 'Summary'}</SH>{summaryEl}
              <SH id="exp">{cv.sectionTitles?.experience || 'Experience'}</SH>{expBlock}
              <SH id="edu">{cv.sectionTitles?.education || 'Education'}</SH>{eduBlock}
              {customSectionsBlock}
            </div>
            <div style={{ padding: '16px 24px 28px 18px' }}>
              <SH id="skills">{cv.sectionTitles?.skills || 'Tech Stack'}</SH>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {cv.skills.map((s, i) => <div key={i} style={{ fontSize: 10, background: `${accent}15`, color: accent, padding: '3px 10px', borderRadius: 3, fontWeight: 600 }} className={forPrint ? '' : 'group/skill relative'}>{s}{!forPrint && <button onClick={() => rmSkill(i)} className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white opacity-0 group-hover/skill:opacity-100 flex items-center justify-center"><X className="w-2 h-2" /></button>}</div>)}
                {!forPrint && <form onSubmit={e => { e.preventDefault(); if (newSkill.trim()) { setCv(p => ({ ...p, skills: [...p.skills, newSkill.trim()] })); setNewSkill(''); } }}><input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="+ Add skill" className="text-[10px] bg-transparent border border-dashed border-gray-300 rounded px-2 py-0.5 outline-none w-24" /></form>}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ── ELEGANT SERIF
    if (tpl.layout === 'elegant-serif') {
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: 'Georgia,serif', fontSize: 12, padding: 40, background: '#FFFBF5' }} className="shadow-2xl">
          <div style={{ textAlign: 'center' as const, borderBottom: `1px solid ${accent}`, paddingBottom: 16, marginBottom: 4 }}>
            {forPrint ? <div style={{ fontSize: 28, fontWeight: 700, color: accent, letterSpacing: 2 }}>{cv.name.toUpperCase()}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[28px] font-bold block text-center tracking-widest" sty={{ color: accent }} ph="YOUR NAME" />}
            {forPrint ? <div style={{ fontSize: 13, color: '#78350F', marginTop: 4, fontStyle: 'italic' }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[13px] italic block mt-1 text-center" sty={{ color: '#78350F' }} ph="Professional Title" />}
            {forPrint ? <div style={{ fontSize: 10, color: '#92400E', marginTop: 6 }}>{cv.email} · {cv.phone} · {cv.location}</div> : <div style={{ fontSize: 10, color: '#92400E', marginTop: 6, display: 'flex', justifyContent: 'center', gap: 8 }}><E v={cv.email} onChange={v => up('email', v)} k="email" cls="text-[10px]" ph="email" /><span>·</span><E v={cv.phone} onChange={v => up('phone', v)} k="phone" cls="text-[10px]" ph="phone" /><span>·</span><E v={cv.location} onChange={v => up('location', v)} k="loc" cls="text-[10px]" ph="location" /></div>}
          </div>
          <SH id="sum">Professional Summary</SH>{summaryEl}
          <SH id="exp">{cv.sectionTitles?.experience || 'Professional Experience'}</SH>{expBlock}
          <SH id="edu">{cv.sectionTitles?.education || 'Education'}</SH>{eduBlock}
          <SH id="skills">{cv.sectionTitles?.skills || 'Core Competencies'}</SH>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {cv.skills.map((s, i) => <span key={i} data-export-chip="true" style={{ fontSize: 10, border: `1px solid ${accent}`, color: accent, padding: '0 12px', borderRadius: 3, display: 'inline-block', height: 22, lineHeight: '20px', boxSizing: 'border-box', verticalAlign: 'top', whiteSpace: 'nowrap' }} className={forPrint ? '' : 'group/skill relative'}><span data-export-chip-text="true">{s}</span>{!forPrint && <button onClick={() => rmSkill(i)} className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white opacity-0 group-hover/skill:opacity-100 flex items-center justify-center"><X className="w-2 h-2" /></button>}</span>)}
            {!forPrint && <form onSubmit={e => { e.preventDefault(); if (newSkill.trim()) { setCv(p => ({ ...p, skills: [...p.skills, newSkill.trim()] })); setNewSkill(''); } }}><input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="+ Add" className="text-[10px] bg-transparent border border-dashed border-amber-400 rounded px-2 py-0.5 outline-none w-20" /></form>}
          </div>
          {customSectionsBlock}
        </div>
      );
    }

    // ── SPLIT COLOR
    if (tpl.layout === 'split-color') {
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: tpl.font, fontSize: 12, display: 'flex' }} className="bg-white shadow-2xl">
          <div style={{ width: 200, background: sidebarColor, padding: '28px 18px', display: 'flex', flexDirection: 'column', gap: 14, flexShrink: 0 }}>
            <div onClick={forPrint ? undefined : () => document.getElementById('photo-upload')?.click()} className={forPrint ? '' : 'cursor-pointer group/photo relative'} style={{ width: 90, height: 90, borderRadius: 999, background: 'rgba(255,255,255,0.2)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {cv.photo ? <img src={cv.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 28, color: '#fff', fontWeight: 700 }}>{cv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>}
              {!forPrint && <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center"><Camera className="w-5 h-5 text-white" /></div>}
            </div>
            <div className="text-center">
              {forPrint ? <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[16px] font-black block text-center" sty={{ color: '#fff' }} ph="Your Name" />}
              {forPrint ? <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 3 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[10px] block mt-0.5 text-center" sty={{ color: 'rgba(255,255,255,0.8)' }} ph="Job Title" />}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 12 }}>
              <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.8, marginBottom: 6 }}>Contact</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.9)', lineHeight: 1.9 }}>
                {forPrint ? <><div>{cv.email}</div><div>{cv.phone}</div><div>{cv.location}</div></> : <><E v={cv.email} onChange={v => up('email', v)} k="email" cls="block text-[9px]" ph="email" /><E v={cv.phone} onChange={v => up('phone', v)} k="phone" cls="block text-[9px]" ph="phone" /><E v={cv.location} onChange={v => up('location', v)} k="loc" cls="block text-[9px]" ph="location" /></>}
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 12 }}>
              <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.8, marginBottom: 6 }}>Skills</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {cv.skills.map((s, i) => <div key={i} style={{ fontSize: 9, color: 'rgba(255,255,255,0.95)' }} className={forPrint ? '' : 'group/skill relative'}>· {s}{!forPrint && <button onClick={() => rmSkill(i)} className="absolute -right-1 top-0 opacity-0 group-hover/skill:opacity-100 text-red-300"><X className="w-2.5 h-2.5" /></button>}</div>)}
                {!forPrint && <form onSubmit={e => { e.preventDefault(); if (newSkill.trim()) { setCv(p => ({ ...p, skills: [...p.skills, newSkill.trim()] })); setNewSkill(''); } }}><input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="+ Add" className="text-[9px] bg-transparent border border-dashed border-white/30 rounded px-1.5 py-0.5 outline-none text-white/60 w-16" /></form>}
              </div>
            </div>
          </div>
          <div style={{ flex: 1, padding: '28px 24px' }}>
            <SH id="sum">{cv.sectionTitles?.summary || 'About'}</SH>{summaryEl}
            <SH id="exp">{cv.sectionTitles?.experience || 'Experience'}</SH>{expBlock}
            <SH id="edu">{cv.sectionTitles?.education || 'Education'}</SH>{eduBlock}
            {customSectionsBlock}
          </div>
        </div>
      );
    }

    // ── MODERN TECH — dark bar, monospace name, green accent
    if (tpl.layout === 'modern-tech') {
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: effectiveFont, fontSize: baseFontSize, background: '#F8FAFC' }} className="shadow-2xl">
          <div style={{ background: '#0F172A', padding: '20px 28px', borderBottom: `3px solid ${accent}` }}>
            {forPrint ? <div style={{ fontSize: 22, fontWeight: 900, color: accent, letterSpacing: 1, fontFamily: 'monospace' }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[22px] font-black block" sty={{ color: accent, fontFamily: 'monospace', letterSpacing: 1 }} ph="Your Name" />}
            {forPrint ? <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 3 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[11px] block mt-0.5" sty={{ color: 'rgba(255,255,255,0.85)' }} ph="Job Title" />}
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', marginTop: 4, display: 'flex', gap: 10 }}>
              {forPrint ? <span>{cv.email} · {cv.phone} · {cv.location}</span> : <><E v={cv.email} onChange={v => up('email', v)} k="email" cls="text-[9px]" ph="email" dark /><span>·</span><E v={cv.phone} onChange={v => up('phone', v)} k="phone" cls="text-[9px]" ph="phone" dark /><span>·</span><E v={cv.location} onChange={v => up('location', v)} k="loc" cls="text-[9px]" ph="location" dark /></>}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 185px', minHeight: 680 }}>
            <div style={{ padding: '16px 20px 28px 28px', borderRight: `1px solid ${accent}44`, color: effectiveTextColor }}>
              <SH id="sum">{cv.sectionTitles?.summary || 'Summary'}</SH>{summaryEl}
              <SH id="exp">{cv.sectionTitles?.experience || 'Experience'}</SH>{expBlock}
              <SH id="edu">{cv.sectionTitles?.education || 'Education'}</SH>{eduBlock}
              {customSectionsBlock}
            </div>
            <div style={{ padding: '16px 24px 28px 18px' }}>
              <SH id="skills">{cv.sectionTitles?.skills || 'Tech Stack'}</SH>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {cv.skills.map((s, i) => (
                  <div key={i} style={{ fontSize: 10, color: accent, fontFamily: 'monospace' }} className={forPrint ? '' : 'group/skill relative'}>
                    $ {s}
                    {!forPrint && <button onClick={() => rmSkill(i)} className="absolute -right-1 top-0 opacity-0 group-hover/skill:opacity-100 text-red-400"><X className="w-2.5 h-2.5" /></button>}
                  </div>
                ))}
                {!forPrint && <form onSubmit={e => { e.preventDefault(); if (newSkill.trim()) { setCv(p => ({ ...p, skills: [...p.skills, newSkill.trim()] })); setNewSkill(''); } }}><input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="$ add skill" className="text-[10px] bg-transparent border border-dashed border-gray-400 rounded px-2 py-0.5 outline-none focus:border-blue-400 w-24 font-mono" /></form>}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (tpl.layout === 'ats-classic') {
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: 'Arial,sans-serif', fontSize: 12, padding: 32 }} className="bg-white shadow-2xl">
          <div style={{ borderBottom: `2.5px solid ${accent}`, paddingBottom: 12, marginBottom: 4 }}>
            {forPrint ? <div style={{ fontSize: 28, fontWeight: 900, color: '#111' }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[28px] font-black block text-gray-900" ph="Your Name" />}
            {forPrint ? <div style={{ fontSize: 13, color: accent, fontWeight: 700, marginTop: 2 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[13px] font-bold block mt-1" sty={{ color: accent }} ph="Job Title" />}
            {contactLine}
          </div>
          <SH id="sum">Professional Summary</SH>{summaryEl}
          <SH id="exp">Professional Experience</SH>{expBlock}
          <SH id="edu">Education</SH>{eduBlock}
          <SH id="skills">Core Skills</SH>{skillsBlock}
          {customSectionsBlock}
        </div>
      );
    }

    if (tpl.layout === 'student-first') {
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: effectiveFont, fontSize: 12 }} className="bg-white shadow-2xl">
          <div style={{ background: `${accent}12`, borderBottom: `3px solid ${accent}`, padding: '22px 28px 18px' }}>
            {forPrint ? <div style={{ fontSize: 24, fontWeight: 900, color: '#111' }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[24px] font-black block text-gray-900" ph="Your Name" />}
            {forPrint ? <div style={{ fontSize: 12, color: accent, fontWeight: 700, marginTop: 2 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[12px] font-bold block mt-1" sty={{ color: accent }} ph="Target Role / Degree" />}
            {contactLine}
          </div>
          <div style={{ padding: '18px 28px 28px' }}>
            <SH id="sum">Profile</SH>{summaryEl}
            <SH id="edu">Education</SH>{eduBlock}
            <SH id="exp">Projects & Experience</SH>{expBlock}
            <SH id="skills">Skills</SH>{skillsBlock}
            {customSectionsBlock}
          </div>
        </div>
      );
    }

    if (tpl.layout === 'hybrid-pro') {
      const hybridSkills = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cv.skills.map((s, i) => {
            const level = getSkillLevel(i);
            return (
              <div key={i} className={forPrint ? '' : 'group/skill relative'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#111827', marginBottom: 3, fontWeight: 700, alignItems: 'center' }}>
                  <span>{s}</span>
                  {!forPrint ? (
                    <button type="button" onClick={() => setEditingSkillIndex(editingSkillIndex === i ? null : i)} style={{ color: accent, background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 700, padding: 0 }} title="Click to edit percentage">{level}%</button>
                  ) : (
                    <span style={{ color: accent }}>{level}%</span>
                  )}
                </div>
                <div style={{ height: 4, background: '#E9D5FF', borderRadius: 99 }}>
                  <div style={{ width: `${level}%`, height: '100%', background: accent, borderRadius: 99 }} />
                </div>
                {!forPrint && (
                  editingSkillIndex === i ? (
                    <div className="mt-1 flex items-center gap-2 text-[8px] text-gray-500">
                      <input type="range" min={10} max={100} value={level} onChange={e => setSkillLevels(prev => prev.map((val, idx) => (idx === i ? Number(e.target.value) : val)))} onMouseUp={closeSkillEditor} onTouchEnd={closeSkillEditor} className="flex-1" />
                      <input type="number" min={0} max={100} value={level} onChange={e => { const next = Math.min(100, Math.max(0, Number(e.target.value))); setSkillLevels(prev => prev.map((val, idx) => (idx === i ? next : val))); }} onBlur={closeSkillEditor} className="w-10 bg-gray-50 border border-gray-200 rounded px-1 py-0.5 text-gray-700 text-[8px]" />
                    </div>
                  ) : null
                )}
                {!forPrint && <button onClick={() => rmSkill(i)} className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white opacity-0 group-hover/skill:opacity-100 flex items-center justify-center"><X className="w-2 h-2" /></button>}
              </div>
            );
          })}
          {!forPrint && <form onSubmit={e => { e.preventDefault(); if (newSkill.trim()) { setCv(p => ({ ...p, skills: [...p.skills, newSkill.trim()] })); setNewSkill(''); } }}><input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="+ Add skill" className="text-[10px] bg-transparent border border-dashed border-violet-300 rounded px-2 py-0.5 outline-none w-24" /></form>}
        </div>
      );
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: effectiveFont, fontSize: 12 }} className="bg-white shadow-2xl">
          <div style={{ borderBottom: `3px solid ${accent}`, padding: '20px 28px 14px' }}>
            {forPrint ? <div style={{ fontSize: 24, fontWeight: 900, color: '#111' }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[24px] font-black block text-gray-900" ph="Your Name" />}
            {forPrint ? <div style={{ fontSize: 12, color: accent, fontWeight: 700 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[12px] font-bold block" sty={{ color: accent }} ph="Job Title" />}
            {contactLine}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: 700 }}>
            <div style={{ padding: '16px 18px 28px 28px', borderRight: `1px solid ${accent}22`, background: '#FAF5FF' }}>
              <SH id="skills">Key Skills</SH>{hybridSkills}
            </div>
            <div style={{ padding: '16px 24px 28px 20px' }}>
              <SH id="sum">Summary</SH>{summaryEl}
              <SH id="exp">Experience</SH>{expBlock}
              <SH id="edu">Education</SH>{eduBlock}
              {customSectionsBlock}
            </div>
          </div>
        </div>
      );
    }

    if (tpl.layout === 'executive-brief') {
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: effectiveFont, fontSize: 12, padding: 32 }} className="bg-white shadow-2xl">
          <div style={{ borderBottom: `3px solid ${accent}`, paddingBottom: 12, marginBottom: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div>
                {forPrint ? <div style={{ fontSize: 26, fontWeight: 900, color: '#111' }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[26px] font-black block text-gray-900" ph="Your Name" />}
                {forPrint ? <div style={{ fontSize: 12, color: '#374151', fontWeight: 700, marginTop: 2 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[12px] font-bold block mt-1 text-gray-700" ph="Executive Title" />}
              </div>
              <div style={{ textAlign: 'right' as const, fontSize: 10, color: '#6B7280' }}>
                {forPrint ? <><div>{cv.email}</div><div>{cv.phone}</div><div>{cv.location}</div></> : <><E v={cv.email} onChange={v => up('email', v)} k="email" cls="block text-[10px] text-right" ph="email" /><E v={cv.phone} onChange={v => up('phone', v)} k="phone" cls="block text-[10px] text-right" ph="phone" /><E v={cv.location} onChange={v => up('location', v)} k="loc" cls="block text-[10px] text-right" ph="location" /></>}
              </div>
            </div>
          </div>
          <SH id="sum">Executive Summary</SH>{summaryEl}
          <SH id="skills">Core Competencies</SH>{skillsBlock}
          <SH id="exp">Leadership Experience</SH>{expBlock}
          <SH id="edu">Education</SH>{eduBlock}
          {customSectionsBlock}
        </div>
      );
    }

    if (tpl.layout === 'consulting-clean') {
      const consultingSkills = (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {cv.skills.map((s, i) => (
            <div key={i} style={{ fontSize: 10, color: '#374151' }} className={forPrint ? '' : 'group/skill relative'}>
              • {s}
              {!forPrint && <button onClick={() => rmSkill(i)} className="absolute -right-1 top-0 opacity-0 group-hover/skill:opacity-100 text-red-400"><X className="w-2.5 h-2.5" /></button>}
            </div>
          ))}
        </div>
      );
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: 'Calibri,Arial,sans-serif', fontSize: 12, padding: 32 }} className="bg-white shadow-2xl">
          <div style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 12, marginBottom: 4, textAlign: 'center' as const }}>
            {forPrint ? <div style={{ fontSize: 26, fontWeight: 900, color: '#111' }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[26px] font-black block text-center text-gray-900" ph="Your Name" />}
            {forPrint ? <div style={{ fontSize: 12, color: accent, fontWeight: 700, marginTop: 2 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[12px] font-bold block mt-1 text-center" sty={{ color: accent }} ph="Consulting Title" />}
            {forPrint ? <div style={{ fontSize: 10, color: '#6B7280', marginTop: 6 }}>{cv.email} · {cv.phone} · {cv.location}</div> : <div style={{ fontSize: 10, color: '#6B7280', marginTop: 6, display: 'flex', justifyContent: 'center', gap: 8 }}><E v={cv.email} onChange={v => up('email', v)} k="email" cls="text-[10px]" ph="email" /><span>·</span><E v={cv.phone} onChange={v => up('phone', v)} k="phone" cls="text-[10px]" ph="phone" /><span>·</span><E v={cv.location} onChange={v => up('location', v)} k="loc" cls="text-[10px]" ph="location" /></div>}
          </div>
          <SH id="sum">Profile</SH>{summaryEl}
          <SH id="exp">Selected Experience</SH>{expBlock}
          <SH id="edu">Education</SH>{eduBlock}
          <SH id="skills">Capabilities</SH>{consultingSkills}
          {customSectionsBlock}
        </div>
      );
    }

    // ── PROFESSIONAL SIDEBAR — dark teal sidebar with photo, contact & skills
    if (tpl.layout === 'professional-sidebar') {
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: effectiveFont, fontSize: 12, display: 'flex' }} className="bg-white shadow-2xl">
          <div style={{ width: 190, background: sidebarColor, padding: '28px 16px', display: 'flex', flexDirection: 'column', gap: 14, flexShrink: 0 }}>
            <div className="text-center">
              {forPrint ? <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', textTransform: 'uppercase' as const, letterSpacing: 1 }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[18px] font-black block text-center uppercase tracking-wide" sty={{ color: '#fff' }} ph="Your Name" />}
              {forPrint ? <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 3 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[10px] block mt-1 text-center" sty={{ color: 'rgba(255,255,255,0.75)' }} ph="Job Title" />}
            </div>
            <div onClick={forPrint ? undefined : () => document.getElementById('photo-upload')?.click()} className={forPrint ? '' : 'cursor-pointer group/photo relative'} style={{ width: 90, height: 90, borderRadius: 999, background: 'rgba(255,255,255,0.15)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {cv.photo ? <img src={cv.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 28, color: '#fff', fontWeight: 700 }}>{cv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>}
              {!forPrint && <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center"><Camera className="w-5 h-5 text-white" /></div>}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 12 }}>
              <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.8, marginBottom: 6 }}>Contact</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', lineHeight: 1.9 }}>
                {forPrint ? <><div>◆ {cv.email}</div><div>◆ {cv.phone}</div><div>◆ {cv.location}</div></> : <><span>◆ </span><E v={cv.email} onChange={v => up('email', v)} k="email" cls="block text-[9px]" sty={{ color: 'rgba(255,255,255,0.6)' }} ph="email" /><span>◆ </span><E v={cv.phone} onChange={v => up('phone', v)} k="phone" cls="block text-[9px]" sty={{ color: 'rgba(255,255,255,0.6)' }} ph="phone" /><span>◆ </span><E v={cv.location} onChange={v => up('location', v)} k="loc" cls="block text-[9px]" sty={{ color: 'rgba(255,255,255,0.6)' }} ph="location" /></>}
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 12 }}>
              <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.8, marginBottom: 6 }}>Skills</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cv.skills.map((s, i) => {
                  const level = getSkillLevel(i);
                  return (
                    <div key={i} className={forPrint ? '' : 'group/skill relative'}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>{s}</div>
                      </div>
                      {!forPrint ? (
                        <div onClick={() => setEditingSkillIndex(editingSkillIndex === i ? null : i)} style={{ cursor: 'pointer', height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 99 }} title="Click to edit percentage">
                          <div style={{ width: `${level}%`, height: '100%', background: 'rgba(255,255,255,0.6)', borderRadius: 99 }} />
                        </div>
                      ) : (
                        <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 99 }}>
                          <div style={{ width: `${level}%`, height: '100%', background: 'rgba(255,255,255,0.6)', borderRadius: 99 }} />
                        </div>
                      )}
                      {!forPrint && (
                        editingSkillIndex === i ? (
                          <div className="mt-1 flex items-center gap-2 text-[7px] text-white/60">
                            <input type="range" min={10} max={100} value={level} onChange={e => setSkillLevels(prev => prev.map((val, idx) => (idx === i ? Number(e.target.value) : val)))} onMouseUp={closeSkillEditor} onTouchEnd={closeSkillEditor} className="flex-1" />
                            <input type="number" min={0} max={100} value={level} onChange={e => { const next = Math.min(100, Math.max(0, Number(e.target.value))); setSkillLevels(prev => prev.map((val, idx) => (idx === i ? next : val))); }} onBlur={closeSkillEditor} className="w-8 bg-white/10 border border-white/20 rounded px-1 py-0.5 text-white text-[7px]" />
                          </div>
                        ) : null
                      )}
                      {!forPrint && <button onClick={() => rmSkill(i)} className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white opacity-0 group-hover/skill:opacity-100 flex items-center justify-center"><X className="w-2 h-2" /></button>}
                    </div>
                  );
                })}
                {!forPrint && <form onSubmit={e => { e.preventDefault(); if (newSkill.trim()) { setCv(p => ({ ...p, skills: [...p.skills, newSkill.trim()] })); setNewSkill(''); } }}><input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="+ Add skill" className="text-[9px] bg-transparent border border-dashed border-white/30 rounded px-1.5 py-0.5 outline-none text-white/60 w-20" /></form>}
              </div>
            </div>
          </div>
          <div style={{ flex: 1, padding: '28px 24px' }}>
            <SH id="sum">{cv.sectionTitles?.summary || 'Objective'}</SH>{summaryEl}
            <SH id="edu">{cv.sectionTitles?.education || 'Education'}</SH>{eduBlock}
            <SH id="exp">{cv.sectionTitles?.experience || 'Work Experience'}</SH>{expBlock}
            {customSectionsBlock}
          </div>
        </div>
      );
    }

    // ── CORPORATE BANNER — teal header with photo, two-column body
    if (tpl.layout === 'corporate-banner') {
      return (
        <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: effectiveFont, fontSize: 12 }} className="bg-white shadow-2xl">
          <div style={{ background: accent, padding: '22px 28px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div onClick={forPrint ? undefined : () => document.getElementById('photo-upload')?.click()} className={forPrint ? '' : 'cursor-pointer group/photo relative'} style={{ width: 72, height: 72, borderRadius: 999, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(255,255,255,0.3)' }}>
              {cv.photo ? <img src={cv.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 22, color: '#fff', fontWeight: 700 }}>{cv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>}
              {!forPrint && <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center"><Camera className="w-4 h-4 text-white" /></div>}
            </div>
            <div>
              {forPrint ? <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', textTransform: 'uppercase' as const, letterSpacing: 1 }}>{cv.name}</div> : <E v={cv.name} onChange={v => up('name', v)} k="name" cls="text-[22px] font-black block uppercase tracking-wide" sty={{ color: '#fff' }} ph="Your Name" />}
              {forPrint ? <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{cv.title}</div> : <E v={cv.title} onChange={v => up('title', v)} k="title" cls="text-[11px] block mt-0.5" sty={{ color: 'rgba(255,255,255,0.85)' }} ph="Job Title" />}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '175px 1fr', minHeight: 700 }}>
            <div style={{ padding: '18px 16px', background: '#f8f9fa', borderRight: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase' as const, color: accent, letterSpacing: 0.8, marginBottom: 8 }}>Contact</div>
              <div style={{ fontSize: 9, color: '#6B7280', lineHeight: 1.9, marginBottom: 16 }}>
                {forPrint ? <><div>◆ {cv.email}</div><div>◆ {cv.phone}</div><div>◆ {cv.location}</div></> : <><span>◆ </span><E v={cv.email} onChange={v => up('email', v)} k="email" cls="block text-[9px]" ph="email" /><span>◆ </span><E v={cv.phone} onChange={v => up('phone', v)} k="phone" cls="block text-[9px]" ph="phone" /><span>◆ </span><E v={cv.location} onChange={v => up('location', v)} k="loc" cls="block text-[9px]" ph="location" /></>}
              </div>
              <div style={{ borderTop: `1px solid ${accent}30`, paddingTop: 12, marginBottom: 16 }}>
                <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase' as const, color: accent, letterSpacing: 0.8, marginBottom: 8 }}>Skills</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {cv.skills.map((s, i) => <div key={i} style={{ fontSize: 9, color: '#374151' }} className={forPrint ? '' : 'group/skill relative'}>• {s}{!forPrint && <button onClick={() => rmSkill(i)} className="absolute -right-1 top-0 opacity-0 group-hover/skill:opacity-100 text-red-400"><X className="w-2.5 h-2.5" /></button>}</div>)}
                  {!forPrint && <form onSubmit={e => { e.preventDefault(); if (newSkill.trim()) { setCv(p => ({ ...p, skills: [...p.skills, newSkill.trim()] })); setNewSkill(''); } }}><input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="+ Add skill" className="text-[9px] bg-transparent border border-dashed border-gray-300 rounded px-1.5 py-0.5 outline-none w-20" /></form>}
                </div>
              </div>
            </div>
            <div style={{ padding: '18px 24px' }}>
              <SH id="sum">{cv.sectionTitles?.summary || 'Objective'}</SH>{summaryEl}
              <SH id="edu">{cv.sectionTitles?.education || 'Education'}</SH>{eduBlock}
              <SH id="exp">{cv.sectionTitles?.experience || 'Work Experience'}</SH>{expBlock}
              {customSectionsBlock}
            </div>
          </div>
        </div>
      );
    }

    // Default fallback
    return (
      <div ref={forPrint ? undefined : cvRef} style={{ width: 595, minHeight: 842, fontFamily: tpl.font, fontSize: 12, padding: 28 }} className="bg-white shadow-2xl">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          {tpl.hasPhoto && photoEl}
          <div>
            {nameEl}
            {titleEl}
            {contactLine}
          </div>
        </div>
        <SH id="sum">Summary</SH>
        {summaryEl}
        <SH id="exp">Experience</SH>
        {expBlock}
        <SH id="edu">Education</SH>
        {eduBlock}
        <SH id="skills">Skills</SH>
        {skillsBlock}
        {customSectionsBlock}
      </div>
    );
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#fafafa' }}>
      {/* Top bar */}
      <nav className="cvmaker-topbar" style={{ flexShrink: 0, borderBottom: '1px solid #e5e5e5', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', zIndex: 30 }}>
        <div className="cvmaker-topbar-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setPhase('templates')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#666', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#dd0000'}
              onMouseLeave={e => e.currentTarget.style.color = '#666'}>
              <ArrowLeft className="w-4 h-4" /> Templates
            </button>
            <div style={{ height: 20, width: 1, background: '#e5e5e5' }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{tpl.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* AI Button — full label on desktop, icon-only on mobile */}
            <button onClick={() => { if (!session) { window.location.href = '/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href); return; } setShowAI(true); }} className="cvmaker-topbar-btn cvmaker-topbar-btn-ai"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, background: 'linear-gradient(135deg, #dd0000, #7c3aed)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(221,0,0,0.2)', whiteSpace: 'nowrap' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <Sparkles size={15} />
              <span className="cvmaker-topbar-btn-label">Generate with AI</span>
            </button>
            {/* Download Button */}
            <button onClick={isPremiumTemplate ? () => setPaywallOpen(true) : handleDownload} className="cvmaker-topbar-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, background: isPremiumTemplate ? 'linear-gradient(135deg,#f59e0b,#d97706)' : '#dd0000', color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: isPremiumTemplate ? '0 4px 12px rgba(245,158,11,0.3)' : '0 4px 12px rgba(221,0,0,0.15)', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
              {isPremiumTemplate ? <><Crown size={15} /><span className="cvmaker-topbar-btn-label">Upgrade</span></> : <><Download size={15} /><span className="cvmaker-topbar-btn-label">Download PDF</span></>}
            </button>
          </div>
        </div>
      </nav>

      <div className="cvmaker-editor-body" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Design Panel */}
        <div className={`cvmaker-design-panel ${mobileTab === 'preview' ? 'cvmaker-panel-hidden' : ''}`} style={{ width: 280, flexShrink: 0, borderRight: '1px solid #e5e5e5', background: '#fff', overflowY: 'auto' }}>
          {/* Header with save status */}
          <div style={{ padding: 16, borderBottom: '1px solid #f5f5f5' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                <Palette className="w-4 h-4" style={{ color: '#dd0000' }} /> Design
              </h3>
              {saveMessage && (
                <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 999, background: saveMessage === 'Saved!' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: saveMessage === 'Saved!' ? '#10b981' : '#dc2626', fontWeight: 600 }}>
                  {saveMessage}
                </span>
              )}
            </div>
            {/* Save/Auth Section */}
            {user ? (
              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 16px', borderRadius: 10, background: '#dd0000', color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', opacity: isSaving ? 0.5 : 1 }}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save CV
              </button>
            ) : (
              <Link
                href="/auth/signin"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 16px', borderRadius: 10, background: '#f5f5f5', border: '1px solid #e5e5e5', color: '#666', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}
              >
                <LogIn className="w-4 h-4" /> Sign in to save
              </Link>
            )}
          </div>

          {/* Colors Section */}
          <div style={{ padding: 16, borderBottom: '1px solid #f5f5f5' }}>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Palette className="w-3.5 h-3.5" /> Colors
            </h4>
            {/* Accent Color */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: '#999', marginBottom: 6, display: 'block', fontWeight: 600 }}>Accent</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setAccent(c)}
                    style={{ width: 32, height: 32, borderRadius: 8, border: accent === c ? '3px solid #dd0000' : '2px solid transparent', background: c, cursor: 'pointer', transition: 'all 0.2s', transform: accent === c ? 'scale(1.1)' : 'scale(1)' }}
                    onMouseEnter={e => accent !== c && (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => accent !== c && (e.currentTarget.style.transform = 'scale(1)')}
                  />
                ))}
              </div>
            </div>
            {/* Text Color */}
            <div>
              <label style={{ fontSize: 11, color: '#999', marginBottom: 6, display: 'block', fontWeight: 600 }}>Text</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['#111827','#1F2937','#374151','#1E3A5F'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setTextColor(c)}
                    style={{ width: 32, height: 32, borderRadius: 8, border: textColor === c ? '3px solid #dd0000' : '2px solid transparent', background: c, cursor: 'pointer', transition: 'all 0.2s', transform: textColor === c ? 'scale(1.1)' : 'scale(1)' }}
                    onMouseEnter={e => textColor !== c && (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => textColor !== c && (e.currentTarget.style.transform = 'scale(1)')}
                  />
                ))}
              </div>
            </div>
            {/* Sidebar Color — only for sidebar layouts */}
            {SIDEBAR_LAYOUTS.includes(tpl.layout) && (
              <div style={{ marginTop: 12 }}>
                <label style={{ fontSize: 11, color: '#999', marginBottom: 6, display: 'block', fontWeight: 600 }}>Sidebar</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {SIDEBAR_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSidebarColor(c)}
                      style={{ width: 32, height: 32, borderRadius: 8, border: sidebarColor === c ? '3px solid #dd0000' : '2px solid transparent', background: c, cursor: 'pointer', transition: 'all 0.2s', transform: sidebarColor === c ? 'scale(1.1)' : 'scale(1)' }}
                      onMouseEnter={e => sidebarColor !== c && (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={e => sidebarColor !== c && (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Font Section */}
          <div style={{ padding: 16, borderBottom: '1px solid #f5f5f5' }}>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Type className="w-3.5 h-3.5" /> Font
            </h4>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              style={{ width: '100%', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, color: '#111', fontSize: 13, padding: '8px 12px', outline: 'none', marginBottom: 8, cursor: 'pointer', fontWeight: 600 }}
            >
              <option value="Inter">Inter</option>
              <option value="Georgia">Georgia</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Arial">Arial</option>
              <option value="Calibri">Calibri</option>
            </select>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['small', 'normal', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  style={{ flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 700, transition: 'all 0.2s', background: fontSize === size ? '#dd0000' : '#f5f5f5', color: fontSize === size ? '#fff' : '#999', border: 'none', cursor: 'pointer' }}
                >
                  {size === 'small' ? 'S' : size === 'normal' ? 'M' : 'L'}
                </button>
              ))}
            </div>
          </div>

          {/* Template Section */}
          <div style={{ padding: 16, borderBottom: '1px solid #f5f5f5' }}>
              <h4 style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FolderOpen className="w-3.5 h-3.5" /> Template
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {TEMPLATES.slice(0, 6).map((t, idx) => {
                  const isSidebarPremium = !canAccessCvTemplate(planType, idx);
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTplId(t.id);
                        setAccent(t.accent);
                      }}
                    style={{ textAlign: 'left', padding: 8, borderRadius: 8, border: `1px solid ${isSidebarPremium ? 'rgba(234,179,8,0.4)' : tplId === t.id ? '#dd0000' : '#e5e5e5'}`, background: isSidebarPremium ? '#fefce8' : tplId === t.id ? 'rgba(221,0,0,0.05)' : '#fff', transition: 'all 0.2s', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}
                  >
                    <p style={{ fontSize: 11, fontWeight: 600, color: isSidebarPremium ? '#a16207' : tplId === t.id ? '#dd0000' : '#666', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{t.name}</p>
                    {isSidebarPremium && <Crown size={10} color="#f59e0b" style={{ flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowTemplatesModal(true)}
              style={{ width: '100%', marginTop: 8, padding: '6px 0', fontSize: 11, color: '#dd0000', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#b91c1c'}
              onMouseLeave={e => e.currentTarget.style.color = '#dd0000'}
            >
              View all {TEMPLATES.length} templates →
            </button>
          </div>

          {/* Photo Section */}
          <div style={{ padding: 16 }}>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Camera className="w-3.5 h-3.5" /> Photo
            </h4>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 12px', borderRadius: 8, background: '#f5f5f5', border: '1px solid #e5e5e5', color: '#666', fontSize: 13, cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#dd0000'; e.currentTarget.style.color = '#dd0000'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.color = '#666'; }}>
              <Camera className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              {cv.photo ? 'Change photo' : 'Add photo'}
            </label>
          </div>
        </div>

        {/* CV Preview */}
        <div className={`cvmaker-preview-pane ${mobileTab === 'design' ? 'cvmaker-panel-hidden' : ''}`} style={{ flex: 1, overflowY: 'auto', background: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px' }}>
          {/* Mobile disclaimer */}
          <div className="cvmaker-mobile-disclaimer" style={{ display: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '12px 14px', marginBottom: 16, maxWidth: 340, width: '100%' }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>💻</span>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400e', margin: '0 0 2px' }}>Best viewed on desktop</p>
                <p style={{ fontSize: 11, color: '#a16207', margin: 0, lineHeight: 1.4 }}>For the best editing experience, open this page on a desktop or laptop computer. You can still preview and download on mobile.</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'inline-block' }}>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              {isPremiumTemplate ? (
                <span style={{ fontSize: 12, color: '#d97706', fontWeight: 600 }}>
                  ✦ Premium template — upgrade to download without watermark
                </span>
              ) : (
                <span style={{ fontSize: 12, color: '#999', fontWeight: 500 }}>Click on any text to edit it directly</span>
              )}
            </div>
            <div className="cv-preview-container" style={{ transform: 'scale(0.78)', transformOrigin: 'top center', position: 'relative' }}>
              {renderCV(false)}
              {isPremiumTemplate && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <span style={{ transform: 'rotate(-35deg)', fontSize: 72, fontWeight: 900, color: 'rgba(234,179,8,0.18)', letterSpacing: '0.1em', whiteSpace: 'nowrap', userSelect: 'none', textTransform: 'uppercase' }}>PREMIUM</span>
                </div>
              )}
            </div>
          </div>
          <input id="photo-upload" type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <div className="cvmaker-mobile-tabs">
        <button
          onClick={() => setMobileTab('design')}
          className={`cvmaker-mobile-tab ${mobileTab === 'design' ? 'cvmaker-mobile-tab-active' : ''}`}
        >
          <Palette size={20} />
          <span>Design</span>
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`cvmaker-mobile-tab ${mobileTab === 'preview' ? 'cvmaker-mobile-tab-active' : ''}`}
        >
          <FileText size={20} />
          <span>Preview</span>
        </button>
      </div>

      {/* Print Preview Modal */}
      {showPrintPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div>
              <h2 className="text-white font-semibold text-lg">Download Preview</h2>
              <p className="text-white/40 text-xs mt-0.5">Review your CV before downloading as PDF</p>
            </div>
            <div className="flex items-center gap-3">
              {isPremiumTemplate ? (
                <button onClick={() => { setShowPrintPreview(false); setPaywallOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-sm font-medium hover:from-yellow-600 hover:to-amber-700 transition-all">
                  <Crown className="w-4 h-4" /> Upgrade to Download
                </button>
              ) : (
                <button data-pdf-btn onClick={handlePrint} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              )}
              <button onClick={() => setShowPrintPreview(false)} className="text-white/40 hover:text-white/70 p-2"><X className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="flex-1 overflow-auto flex justify-center py-8 bg-gray-900/50">
            <div className="cv-preview-container" style={{ transform: 'scale(0.85)', transformOrigin: 'top center', background: 'white', width: '595px' }}>
              {renderCV(true)}
            </div>
          </div>
        </div>
      )}

      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        feature="premium CV templates"
      />

      {/* Templates Popup Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setShowTemplatesModal(false)}>
          <div className="bg-[#0f0f23] border border-white/[0.08] rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div>
                <h2 className="text-white font-semibold text-lg">All Templates</h2>
                <p className="text-white/40 text-xs mt-0.5">Click a template to apply it instantly</p>
              </div>
              <button onClick={() => setShowTemplatesModal(false)} className="text-white/40 hover:text-white/70 p-2 rounded-lg hover:bg-white/[0.06]"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {TEMPLATES.map((t, idx) => {
                  const isPremium = !canAccessCvTemplate(planType, idx);
                  const accessLabel = getTemplateAccessLabel(idx);
                  return (
                    <button key={t.id} onClick={() => {
                      setTplId(t.id); setAccent(t.accent); setShowTemplatesModal(false);
                    }}
                      className={`group relative text-left rounded-lg overflow-hidden border-2 transition-all hover:scale-[1.02] hover:shadow-lg ${
                        isPremium ? 'border-yellow-500/40 hover:border-yellow-400/60 hover:shadow-yellow-500/10'
                        : tplId === t.id ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-white/[0.08] hover:border-white/20 hover:shadow-blue-500/10'
                      }`}>
                      <div className="bg-white overflow-hidden flex justify-center relative" style={{ height: 130 }}>
                        <MiniCV tpl={t} />
                        {isPremium && (
                          <>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                              <span style={{ transform: 'rotate(-30deg)', fontSize: 18, fontWeight: 900, color: 'rgba(234,179,8,0.2)', letterSpacing: '0.1em', whiteSpace: 'nowrap', userSelect: 'none', textTransform: 'uppercase' }}>PREMIUM</span>
                            </div>
                            <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex', alignItems: 'center', gap: 3, background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 20, padding: '2px 6px 2px 4px', boxShadow: '0 2px 6px rgba(245,158,11,0.4)' }}>
                              <Crown size={8} color="#fff" />
                              <span style={{ fontSize: 8, fontWeight: 800, color: '#fff' }}>PRO</span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="px-2.5 py-2 bg-[#0f0f23] border-t border-white/[0.06]">
                        <div className="flex items-center gap-1">
                          <p className="text-white font-medium text-[11px] truncate flex-1">{t.name}</p>
                          {isPremium && <Crown className="w-3 h-3 text-yellow-400 flex-shrink-0" />}
                        </div>
                        <p className="text-white/30 text-[9px] mt-0.5 truncate">{isPremium ? `✦ ${accessLabel}` : t.description}</p>
                      </div>
                      {tplId === t.id && !isPremium && <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shadow-lg"><Check className="w-3 h-3 text-white" /></div>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Modal */}
      {showAI && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {aiDone ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-gray-900 font-semibold text-lg mb-1">CV Generated!</h2>
                <p className="text-gray-500 text-sm">Your CV has been filled with AI-generated content. Closing...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/10 flex items-center justify-center">
                    <Wand2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div><h2 className="text-gray-900 font-semibold">AI CV Generator</h2><p className="text-gray-500 text-xs">Tell us about yourself</p></div>
                  <button onClick={() => setShowAI(false)} className="ml-auto text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>

                {/* Program Selection */}
                {status === 'authenticated' && shortlist.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="text-gray-600 text-[11px] uppercase tracking-wider block mb-1 font-semibold">Target Program (Optional)</label>
                        <p className="text-gray-400 text-[10px]">Select to tailor CV to a specific program</p>
                      </div>
                      <div style={{ display: 'flex', borderRadius: 6, border: '1px solid #e5e7eb', overflow: 'hidden', fontSize: 10 }}>
                        <button type="button" onClick={() => setUseManualInput(false)} style={{ padding: '4px 10px', background: !useManualInput ? '#dd0000' : 'transparent', color: !useManualInput ? '#fff' : '#9ca3af', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>Shortlist</button>
                        <button type="button" onClick={() => setUseManualInput(true)} style={{ padding: '4px 10px', background: useManualInput ? '#dd0000' : 'transparent', color: useManualInput ? '#fff' : '#9ca3af', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>Manual</button>
                      </div>
                    </div>

                    {!useManualInput && (
                      <div style={{ position: 'relative' }}>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setShowProgramDropdown(!showProgramDropdown); }}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm px-3 py-2.5 transition-colors flex items-center justify-between hover:border-red-300"
                        >
                          {selectedProgramId && shortlist.find(s => s.programId === selectedProgramId) ? (
                            <div style={{ flex: 1, overflow: 'hidden', textAlign: 'left' }}>
                              <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {shortlist.find(s => s.programId === selectedProgramId)?.programName}
                              </p>
                              <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>
                                {shortlist.find(s => s.programId === selectedProgramId)?.university}
                              </p>
                            </div>
                          ) : (
                            <span style={{ fontSize: 13, color: '#9ca3af' }}>Select a program from your shortlist</span>
                          )}
                          <ChevronDown className="w-4 h-4" style={{ color: '#9ca3af', transform: showProgramDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                        </button>
                        {showProgramDropdown && (
                          <div style={{ position: 'absolute', left: 0, right: 0, marginTop: 6, borderRadius: 12, border: '1px solid #e5e7eb', background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', maxHeight: 200, overflowY: 'auto', zIndex: 9999 }}>
                            {shortlist.map(item => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => { setSelectedProgramId(item.programId); setShowProgramDropdown(false); }}
                                style={{ width: '100%', textAlign: 'left', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, background: item.programId === selectedProgramId ? 'rgba(221,0,0,0.05)' : 'transparent', cursor: 'pointer', border: 'none', borderBottom: '1px solid #f3f4f6' }}
                              >
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                  <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.programName}</p>
                                  <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>{item.university}</p>
                                </div>
                                {item.programId === selectedProgramId && <CheckCircle2 className="w-4 h-4" style={{ color: '#dd0000' }} />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={e => { e.preventDefault(); const fd = new FormData(e.currentTarget); handleAI({ name: fd.get('name'), jobTitle: fd.get('jobTitle'), years: fd.get('years'), skills: fd.get('skills'), background: fd.get('background'), degree: fd.get('degree'), university: fd.get('university'), additionalEducation: fd.get('additionalEducation'), workExperience: fd.get('workExperience'), hobbies: fd.get('hobbies'), language: fd.get('language'), programId: !useManualInput ? selectedProgramId : undefined }); }} className="space-y-3">
                  <div>
                    <label className="text-gray-600 text-[11px] uppercase tracking-wider mb-1.5 block font-semibold">CV Language</label>
                    <select name="language" defaultValue="English" className="w-full bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 px-3 py-2.5 transition-colors">
                      <option value="English">English</option>
                      <option value="German">German (Deutsch)</option>
                      <option value="French">French (Français)</option>
                      <option value="Spanish">Spanish (Español)</option>
                      <option value="Italian">Italian (Italiano)</option>
                      <option value="Portuguese">Portuguese (Português)</option>
                      <option value="Dutch">Dutch (Nederlands)</option>
                      <option value="Polish">Polish (Polski)</option>
                      <option value="Turkish">Turkish (Türkçe)</option>
                      <option value="Arabic">Arabic (العربية)</option>
                      <option value="Russian">Russian (Русский)</option>
                      <option value="Chinese">Chinese (中文)</option>
                      <option value="Hindi">Hindi (हिन्दी)</option>
                      <option value="Urdu">Urdu (اردو)</option>
                    </select>
                    <p className="text-[10px] text-gray-400 mt-1">The AI will write your entire CV in this language</p>
                  </div>
                  {[
                    { name: 'name', label: 'Your Name', ph: 'Maria Schmidt', req: true },
                    { name: 'jobTitle', label: 'Target Role', ph: 'Software Engineer', req: true },
                    { name: 'years', label: 'Years of Experience', ph: '3 years' },
                    { name: 'skills', label: 'Key Skills', ph: 'Python, React, Data Analysis...' },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="text-gray-600 text-[11px] uppercase tracking-wider mb-1.5 block font-semibold">{f.label}</label>
                      <input name={f.name} type="text" required={f.req} placeholder={f.ph} className="w-full bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 px-3 py-2.5 transition-colors" />
                    </div>
                  ))}
                  <div>
                    <label className="text-gray-600 text-[11px] uppercase tracking-wider mb-1.5 block font-semibold">Brief Background</label>
                    <textarea name="background" rows={3} placeholder="Tell us about your experience..." className="w-full bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 px-3 py-2.5 transition-colors resize-none" />
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <label className="text-gray-600 text-[11px] uppercase tracking-wider mb-1.5 block font-semibold">Education</label>
                    <input name="degree" type="text" placeholder="e.g., B.Sc. Computer Science" className="w-full bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 px-3 py-2.5 transition-colors mb-2" />
                    <input name="university" type="text" placeholder="e.g., Technical University of Munich" className="w-full bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 px-3 py-2.5 transition-colors mb-2" />
                    <textarea name="additionalEducation" rows={2} placeholder="Additional education (e.g., M.Sc. Data Science, Online Certifications...)" className="w-full bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 px-3 py-2.5 transition-colors resize-none" />
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <label className="text-gray-600 text-[11px] uppercase tracking-wider mb-1.5 block font-semibold">Work Experience Details (Optional)</label>
                    <textarea name="workExperience" rows={3} placeholder="List your previous roles, companies, and key achievements..." className="w-full bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 px-3 py-2.5 transition-colors resize-none" />
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <label className="text-gray-600 text-[11px] uppercase tracking-wider mb-1.5 block font-semibold">Hobbies & Interests (Optional)</label>
                    <input name="hobbies" type="text" placeholder="e.g., Photography, Hiking, Open Source Contributions..." className="w-full bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 px-3 py-2.5 transition-colors" />
                  </div>
                  {aiError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                      <p className="font-medium mb-0.5">Generation failed</p>
                      <p className="opacity-70">{aiError}</p>
                    </div>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowAI(false)} className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</button>
                    <button type="submit" disabled={aiLoading} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg text-sm font-medium hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30">
                      {aiLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate</>}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        .overflow-y-auto::-webkit-scrollbar, .overflow-auto::-webkit-scrollbar { width: 6px; }
        .overflow-y-auto::-webkit-scrollbar-track, .overflow-auto::-webkit-scrollbar-track { background: transparent; }
        .overflow-y-auto::-webkit-scrollbar-thumb, .overflow-auto::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover, .overflow-auto::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
      `}</style>
    </div>
  );
}

export default function CVMakerPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    }>
      <CVMakerContent />
    </Suspense>
  );
}
