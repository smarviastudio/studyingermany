'use client';

import Link from 'next/link';
import { FileText, Mail, PenTool, Calculator, Briefcase, Search, ArrowRight, Sparkles, GraduationCap } from 'lucide-react';

const TOOLS = [
  {
    href: '/cv-maker',
    title: 'AI CV Maker',
    description: 'Create a professional German-style CV (Lebenslauf) with AI assistance. Optimized for German university applications and job searches.',
    icon: FileText,
    gradient: 'from-blue-500 to-blue-700',
    features: ['German CV format', 'AI-powered suggestions', 'Multiple templates', 'PDF export'],
  },
  {
    href: '/cover-letter',
    title: 'Cover Letter Generator',
    description: 'Generate compelling cover letters (Anschreiben) tailored for German employers and university applications.',
    icon: Mail,
    gradient: 'from-emerald-500 to-emerald-700',
    features: ['German business style', 'Industry-specific', 'AI personalization', 'Instant generation'],
  },
  {
    href: '/motivation-letter',
    title: 'Motivation Letter Writer',
    description: 'Write persuasive motivation letters for German university admissions. Perfect for master\'s and bachelor\'s applications.',
    icon: PenTool,
    gradient: 'from-purple-500 to-purple-700',
    features: ['University-focused', 'Program-specific', 'Scholarship applications', 'AI assistance'],
  },
  {
    href: '/gpa-converter',
    title: 'GPA Converter',
    description: 'Convert your grades to the German grading system. Essential for university applications and transcript evaluation.',
    icon: Calculator,
    gradient: 'from-amber-500 to-amber-700',
    features: ['Multiple systems', 'Instant conversion', 'German scale (1-5)', 'Explanation included'],
  },
  {
    href: '/salary-calculator',
    title: 'Salary Calculator',
    description: 'Calculate your net salary in Germany after taxes and social contributions. Plan your finances before moving.',
    icon: Briefcase,
    gradient: 'from-rose-500 to-rose-700',
    features: ['Tax calculation', 'Social contributions', 'Net vs gross', 'City comparison'],
  },
  {
    href: '/#hero',
    title: 'AI Course Finder',
    description: 'Search 20,000+ English-taught bachelor and master programs at German universities with AI-powered recommendations.',
    icon: Search,
    gradient: 'from-red-500 to-red-700',
    features: ['20,000+ programs', 'AI recommendations', 'Filter by criteria', 'Shortlist feature'],
  },
];

export default function ToolsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)', padding: '80px 24px 60px', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(221,0,0,0.08)', padding: '6px 16px', borderRadius: 99, marginBottom: 20 }}>
            <Sparkles style={{ width: 16, height: 16, color: '#dd0000' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#dd0000' }}>AI-Powered & Free</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#171717', margin: '0 0 16px', lineHeight: 1.2 }}>
            Free AI Tools for German Applications
          </h1>
          <p style={{ fontSize: 18, color: '#737373', maxWidth: 700, margin: '0 auto', lineHeight: 1.7 }}>
            Everything international students need to apply to German universities and jobs — 
            CV maker, cover letters, motivation letters, and more. All free, all AI-powered.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section style={{ padding: '60px 24px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  style={{
                    display: 'block',
                    background: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: 16,
                    padding: 28,
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#dd0000';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e5e5';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 20,
                    }}
                    className={`bg-gradient-to-br ${tool.gradient}`}
                  >
                    <Icon style={{ width: 28, height: 28, color: '#fff' }} />
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#171717', margin: '0 0 10px' }}>
                    {tool.title}
                  </h2>
                  <p style={{ fontSize: 14, color: '#737373', lineHeight: 1.7, margin: '0 0 16px' }}>
                    {tool.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                    {tool.features.map((feature) => (
                      <span
                        key={feature}
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#737373',
                          background: '#f5f5f5',
                          padding: '4px 10px',
                          borderRadius: 99,
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#dd0000', fontSize: 14, fontWeight: 600 }}>
                    <span>Try it free</span>
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #dd0000 0%, #b91c1c 100%)', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <GraduationCap style={{ width: 48, height: 48, color: 'rgba(255,255,255,0.9)', marginBottom: 20 }} />
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>
            Ready to start your Germany journey?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', margin: '0 0 24px' }}>
            Search 20,000+ programs and use our free AI tools to prepare your application.
          </p>
          <Link
            href="/#hero"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#fff',
              color: '#dd0000',
              padding: '14px 28px',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <Search style={{ width: 18, height: 18 }} />
            Search Programs
          </Link>
        </div>
      </section>
    </div>
  );
}
