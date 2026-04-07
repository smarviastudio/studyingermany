'use client';

import Link from 'next/link';
import { 
  FileText, Mail, PenTool, Calculator, Briefcase, Search, ArrowRight, 
  Sparkles, GraduationCap, ChevronDown, Check, Zap, Wand2 
} from 'lucide-react';
import { useState } from 'react';
import { SiteNav } from '@/components/SiteNav';

const TOOLS = [
  {
    href: '/cv-maker',
    title: 'AI CV Maker',
    subtitle: 'German Lebenslauf',
    description: 'Create a professional German-format CV in minutes. AI-powered suggestions tailored for university applications and jobs.',
    icon: FileText,
    color: '#3b82f6',
    bgColor: '#eff6ff',
    features: ['German CV format', 'AI suggestions', 'PDF export'],
    popular: true,
  },
  {
    href: '/motivation-letter',
    title: 'Motivation Letter',
    subtitle: 'German Standards',
    description: 'Write compelling motivation letters for German university admissions. Perfect for master\'s and bachelor\'s applications.',
    icon: PenTool,
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
    features: ['University-focused', 'Program-specific', 'AI assistance'],
    popular: true,
  },
  {
    href: '/cover-letter',
    title: 'Cover Letter',
    subtitle: 'Job Applications',
    description: 'Generate professional cover letters (Anschreiben) tailored for German employers and university applications.',
    icon: Mail,
    color: '#10b981',
    bgColor: '#ecfdf5',
    features: ['Business style', 'Industry-specific', 'Instant generation'],
    popular: false,
  },
  {
    href: '/gpa-converter',
    title: 'GPA Converter',
    subtitle: 'German Grading',
    description: 'Convert your grades to the German grading system. Essential for university applications and transcript evaluation.',
    icon: Calculator,
    color: '#f59e0b',
    bgColor: '#fffbeb',
    features: ['Multiple systems', 'German scale (1-5)', 'Explanations'],
    popular: false,
  },
  {
    href: '/netto-brutto-calculator',
    title: 'Salary Calculator',
    subtitle: 'Net vs Gross',
    description: 'Calculate your net salary in Germany after taxes and social contributions. Plan your finances before moving.',
    icon: Briefcase,
    color: '#ec4899',
    bgColor: '#fdf2f8',
    features: ['Tax calculation', 'Social contributions', '2026 rates'],
    popular: false,
  },
  {
    href: '/',
    title: 'AI Course Finder',
    subtitle: '20,000+ Programs',
    description: 'Search English-taught bachelor and master programs at German universities with AI-powered recommendations.',
    icon: Search,
    color: '#dc2626',
    bgColor: '#fef2f2',
    features: ['20,000+ programs', 'AI search', 'Save favorites'],
    popular: true,
  },
];

const FAQS = [
  {
    q: 'Are these tools really free?',
    a: 'Yes! All tools are free to use. Create a free account to save your work and unlock additional features like more AI credits.',
  },
  {
    q: 'Are the CVs optimized for German standards?',
    a: 'Absolutely. Our CV maker uses the German Lebenslauf format, which is required for university and job applications in Germany.',
  },
  {
    q: 'Can I use these for job applications too?',
    a: 'Yes! While optimized for university admissions, our CV and cover letter tools work perfectly for German job applications.',
  },
  {
    q: 'How accurate is the GPA converter?',
    a: 'We use the modified Bavarian formula, the standard method German universities use. Results are accurate for application purposes.',
  },
  {
    q: 'Can I edit the AI-generated content?',
    a: 'Yes! All content is fully editable. We recommend reviewing and personalizing it to match your specific situation.',
  },
];

export default function ToolsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <SiteNav />
      
      {/* Hero */}
      <section style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '100px 24px 80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />
        
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 8, 
            background: 'rgba(255,255,255,0.2)', 
            backdropFilter: 'blur(10px)',
            padding: '8px 20px', 
            borderRadius: 50, 
            marginBottom: 24 
          }}>
            <Sparkles style={{ width: 18, height: 18, color: '#fff' }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>AI-Powered & Completely Free</span>
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(36px, 5vw, 56px)', 
            fontWeight: 800, 
            color: '#fff', 
            margin: '0 0 20px', 
            lineHeight: 1.1 
          }}>
            Free AI Tools for Your<br />German Journey
          </h1>
          
          <p style={{ 
            fontSize: 18, 
            color: 'rgba(255,255,255,0.9)', 
            maxWidth: 600, 
            margin: '0 auto', 
            lineHeight: 1.7 
          }}>
            Everything you need to apply to German universities — CV maker, motivation letters, 
            GPA converter, and salary calculator. All free, no credit card required.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section style={{ padding: '60px 24px', marginTop: -40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
            gap: 24 
          }}>
            {TOOLS.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  style={{
                    display: 'block',
                    background: '#fff',
                    borderRadius: 20,
                    padding: 32,
                    textDecoration: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px -12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                  }}
                >
                  {/* Popular Badge */}
                  {tool.popular && (
                    <div style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      background: '#dc2626',
                      color: '#fff',
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 700,
                    }}>
                      <Zap style={{ width: 12, height: 12 }} />
                      POPULAR
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 16,
                        background: tool.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon style={{ width: 32, height: 32, color: tool.color }} />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <p style={{ 
                        fontSize: 12, 
                        fontWeight: 700, 
                        color: tool.color, 
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        margin: '0 0 4px'
                      }}>
                        {tool.subtitle}
                      </p>
                      <h2 style={{ 
                        fontSize: 22, 
                        fontWeight: 800, 
                        color: '#111827', 
                        margin: '0 0 10px' 
                      }}>
                        {tool.title}
                      </h2>
                      <p style={{ 
                        fontSize: 14, 
                        color: '#6b7280', 
                        lineHeight: 1.6, 
                        margin: '0 0 16px' 
                      }}>
                        {tool.description}
                      </p>
                      
                      {/* Features */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                        {tool.features.map((feature) => (
                          <span
                            key={feature}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              fontSize: 12,
                              fontWeight: 600,
                              color: '#374151',
                              background: '#f3f4f6',
                              padding: '6px 12px',
                              borderRadius: 20,
                            }}
                          >
                            <Check style={{ width: 12, height: 12, color: '#10b981' }} />
                            {feature}
                          </span>
                        ))}
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 6, 
                        color: tool.color, 
                        fontSize: 14, 
                        fontWeight: 700 
                      }}>
                        <span>Try it free</span>
                        <ArrowRight style={{ width: 18, height: 18 }} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '60px 24px 80px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 8, 
              marginBottom: 16 
            }}>
              <Wand2 style={{ width: 24, height: 24, color: '#dc2626' }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>
                Got Questions?
              </span>
            </div>
            <h2 style={{ 
              fontSize: 36, 
              fontWeight: 800, 
              color: '#111827', 
              margin: '0 0 12px' 
            }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: 16, color: '#6b7280' }}>
              Common questions about our AI tools
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: openFaq === i ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ 
                    fontSize: 16, 
                    fontWeight: 700, 
                    color: '#111827',
                    paddingRight: 16 
                  }}>
                    {faq.q}
                  </span>
                  <ChevronDown 
                    style={{ 
                      width: 20, 
                      height: 20, 
                      color: '#9ca3af',
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s',
                      flexShrink: 0,
                    }} 
                  />
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 24px 20px' }}>
                    <p style={{ 
                      fontSize: 15, 
                      color: '#6b7280', 
                      lineHeight: 1.7, 
                      margin: 0 
                    }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(220,38,38,0.2) 0%, transparent 70%)',
        }} />
        
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(220,38,38,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <GraduationCap style={{ width: 40, height: 40, color: '#fff' }} />
          </div>
          
          <h2 style={{ 
            fontSize: 32, 
            fontWeight: 800, 
            color: '#fff', 
            margin: '0 0 16px' 
          }}>
            Ready to Study in Germany?
          </h2>
          
          <p style={{ 
            fontSize: 17, 
            color: 'rgba(255,255,255,0.7)', 
            margin: '0 0 32px',
            lineHeight: 1.6 
          }}>
            Join 2,500+ students who used our free tools to get into German universities. 
            Start with program search or create your CV today.
          </p>
          
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: '#dc2626',
                color: '#fff',
                padding: '16px 32px',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(220,38,38,0.4)',
              }}
            >
              <Search style={{ width: 20, height: 20 }} />
              Find Programs
            </Link>
            <Link
              href="/cv-maker"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '16px 32px',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <FileText style={{ width: 20, height: 20 }} />
              Create CV
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
