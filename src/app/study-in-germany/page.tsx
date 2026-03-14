import { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, Euro, Globe, FileText, Plane, Briefcase, ArrowRight, CheckCircle, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Study in Germany - Complete Guide for International Students | German Path',
  description: 'Complete guide to studying in Germany for international students. Learn about tuition-free universities, English-taught programs, student visa requirements, blocked accounts, and more.',
  keywords: [
    'study in Germany',
    'study in Germany for international students',
    'tuition-free universities Germany',
    'English-taught programs Germany',
    'German student visa',
    'blocked account Germany',
    'study abroad Germany',
  ],
  alternates: {
    canonical: 'https://germanpath.com/study-in-germany',
  },
};

const QUICK_FACTS = [
  { label: 'Tuition Fees', value: 'Free at public universities', icon: Euro },
  { label: 'Programs', value: '20,000+ available', icon: GraduationCap },
  { label: 'English Programs', value: '2,000+ courses', icon: Globe },
  { label: 'Work Rights', value: '140 days/year', icon: Briefcase },
];

const STEPS = [
  {
    title: 'Research Programs',
    description: 'Use our AI-powered search to find bachelor or master programs that match your interests, budget, and qualifications.',
    link: '/#hero',
    linkText: 'Search Programs',
  },
  {
    title: 'Check Requirements',
    description: 'Review admission requirements including language proficiency, academic qualifications, and application deadlines.',
    link: '/blog',
    linkText: 'Read Guides',
  },
  {
    title: 'Prepare Documents',
    description: 'Gather required documents: transcripts, CV, motivation letter, language certificates, and passport.',
    link: '/tools',
    linkText: 'Use AI Tools',
  },
  {
    title: 'Apply to Universities',
    description: 'Submit applications through uni-assist or directly to universities. Track deadlines carefully.',
    link: '/blog',
    linkText: 'Application Guide',
  },
  {
    title: 'Get Student Visa',
    description: 'Open a blocked account (€11,904/year), get health insurance, and apply for your student visa.',
    link: '/blog',
    linkText: 'Visa Guide',
  },
  {
    title: 'Arrive in Germany',
    description: 'Complete Anmeldung (city registration), enroll at university, and start your studies.',
    link: '/blog',
    linkText: 'Arrival Guide',
  },
];

const RELATED_PAGES = [
  { href: '/masters-in-germany', title: 'Master\'s Programs in Germany', desc: 'Guide to master\'s degrees' },
  { href: '/bachelor-in-germany', title: 'Bachelor\'s Programs in Germany', desc: 'Guide to undergraduate studies' },
  { href: '/english-taught-programs', title: 'English-Taught Programs', desc: 'Study without German' },
  { href: '/tools', title: 'Free AI Tools', desc: 'CV maker, cover letters & more' },
];

export default function StudyInGermanyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)', padding: '100px 24px 80px', color: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 800, margin: '0 0 20px', lineHeight: 1.15 }}>
            Study in Germany:<br />
            <span style={{ color: '#dd0000' }}>Complete Guide for International Students</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', maxWidth: 700, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Everything you need to know about studying in Germany — from tuition-free universities 
            to student visas, blocked accounts, and job opportunities after graduation.
          </p>
          <Link
            href="/#hero"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#dd0000',
              color: '#fff',
              padding: '14px 28px',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <Search style={{ width: 18, height: 18 }} />
            Search 20,000+ Programs
          </Link>
        </div>
      </section>

      {/* Quick Facts */}
      <section style={{ padding: '60px 24px', background: '#fafafa', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {QUICK_FACTS.map((fact) => {
              const Icon = fact.icon;
              return (
                <div key={fact.label} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                  <Icon style={{ width: 32, height: 32, color: '#dd0000', marginBottom: 12 }} />
                  <p style={{ fontSize: 13, color: '#737373', margin: '0 0 4px' }}>{fact.label}</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#171717', margin: 0 }}>{fact.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '0 0 20px' }}>
            Why Study in Germany?
          </h2>
          <p style={{ fontSize: 16, color: '#525252', lineHeight: 1.8, margin: '0 0 24px' }}>
            Germany is one of the most popular destinations for international students, and for good reason. 
            Most public universities charge <strong>no tuition fees</strong> — even for international students. 
            With over 20,000 degree programs, including 2,000+ taught entirely in English, Germany offers 
            world-class education at an affordable cost.
          </p>
          <p style={{ fontSize: 16, color: '#525252', lineHeight: 1.8, margin: '0 0 24px' }}>
            German degrees are recognized worldwide, and the country&apos;s strong economy means excellent 
            job opportunities after graduation. International students can work up to 140 full days per year 
            while studying, and graduates receive an 18-month job-seeker visa to find employment.
          </p>

          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>
            How Much Does It Cost?
          </h2>
          <p style={{ fontSize: 16, color: '#525252', lineHeight: 1.8, margin: '0 0 16px' }}>
            While tuition is free at most public universities, you&apos;ll need to budget for:
          </p>
          <ul style={{ fontSize: 16, color: '#525252', lineHeight: 2, margin: '0 0 24px', paddingLeft: 24 }}>
            <li><strong>Semester fee:</strong> €150-350 per semester (includes public transport)</li>
            <li><strong>Living costs:</strong> €850-1,200 per month depending on city</li>
            <li><strong>Health insurance:</strong> ~€110 per month for students</li>
            <li><strong>Blocked account:</strong> €11,904 per year (required for visa)</li>
          </ul>

          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>
            Step-by-Step: How to Study in Germany
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {STEPS.map((step, idx) => (
              <div key={step.title} style={{ display: 'flex', gap: 20, padding: 20, background: '#fafafa', borderRadius: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 99, background: '#dd0000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#171717', margin: '0 0 6px' }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: '#737373', lineHeight: 1.6, margin: '0 0 10px' }}>{step.description}</p>
                  <Link href={step.link} style={{ fontSize: 13, fontWeight: 600, color: '#dd0000', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {step.linkText} <ArrowRight style={{ width: 14, height: 14 }} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>
            Requirements for International Students
          </h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              'Recognized school-leaving certificate (Abitur equivalent)',
              'Language proficiency (English: IELTS 6.0-7.0 or TOEFL 80-100)',
              'For German-taught programs: TestDaF or DSH certificate',
              'Valid passport',
              'Proof of financial resources (blocked account)',
              'Health insurance coverage',
              'Student visa (for non-EU students)',
            ].map((req) => (
              <div key={req} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <CheckCircle style={{ width: 20, height: 20, color: '#16a34a', flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 15, color: '#525252' }}>{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <section style={{ padding: '60px 24px', background: '#fafafa', borderTop: '1px solid #e5e5e5' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#171717', margin: '0 0 24px', textAlign: 'center' }}>
            Explore More Guides
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {RELATED_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                style={{
                  display: 'block',
                  background: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: 12,
                  padding: 20,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#171717', margin: '0 0 4px' }}>{page.title}</h3>
                <p style={{ fontSize: 13, color: '#737373', margin: 0 }}>{page.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #dd0000 0%, #b91c1c 100%)', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>
            Start Your Germany Journey Today
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', margin: '0 0 24px' }}>
            Search 20,000+ programs and use our free AI tools to prepare your application.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
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
            <Link
              href="/tools"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                color: '#fff',
                padding: '14px 28px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
                border: '2px solid rgba(255,255,255,0.3)',
              }}
            >
              <FileText style={{ width: 18, height: 18 }} />
              Free AI Tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
