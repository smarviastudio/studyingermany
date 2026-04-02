import Link from 'next/link';
import { GraduationCap, Euro, FileText, Plane, CheckCircle, Search, ArrowRight, Globe, Briefcase } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Study in Germany from Pakistan - 2026 Complete Guide',
  description: 'Complete guide for Pakistani students to study in Germany. Learn about visa requirements, blocked account, HEC attestation, IELTS scores, tuition-free universities, and step-by-step application process.',
  path: '/study-in-germany-from-pakistan',
  keywords: [
    'study in Germany from Pakistan',
    'Pakistani students Germany',
    'Germany student visa Pakistan',
    'HEC attestation Germany',
    'blocked account Pakistan',
    'DAAD scholarship Pakistan',
    'tuition-free Germany Pakistan',
  ],
});

export default function StudyFromPakistanPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)', padding: '100px 24px 80px', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(221,0,0,0.08)', padding: '8px 16px', borderRadius: 99, marginBottom: 20 }}>
            <span style={{ fontSize: 20 }}>🇵🇰</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#dd0000' }}>Guide for Pakistani Students</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, margin: '0 0 20px', lineHeight: 1.15, color: '#171717' }}>
            Study in Germany from Pakistan<br />
            <span style={{ color: '#737373' }}>2026 Complete Guide</span>
          </h1>
          <p style={{ fontSize: 18, color: '#525252', maxWidth: 700, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Everything Pakistani students need to know — from HEC attestation to blocked accounts, 
            visa interviews, and finding tuition-free programs.
          </p>
          <Link href="/#hero" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#dd0000', color: '#fff', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            <Search style={{ width: 18, height: 18 }} /> Search Programs
          </Link>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ padding: '40px 24px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {[
            { label: 'Pakistani Students in Germany', value: '10,000+' },
            { label: 'Tuition Fees', value: 'Free (Public Unis)' },
            { label: 'Blocked Account', value: '€11,904/year' },
            { label: 'Work Rights', value: '140 days/year' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#dd0000', margin: '0 0 4px' }}>{stat.value}</p>
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '0 0 20px' }}>
            Why Pakistani Students Choose Germany
          </h2>
          <p style={{ fontSize: 16, color: '#525252', lineHeight: 1.8, margin: '0 0 24px' }}>
            Germany has become one of the top destinations for Pakistani students seeking quality education abroad. 
            With <strong>tuition-free public universities</strong>, world-class research facilities, and strong 
            post-graduation job prospects, Germany offers exceptional value compared to the UK, USA, or Australia.
          </p>
          <p style={{ fontSize: 16, color: '#525252', lineHeight: 1.8, margin: '0 0 24px' }}>
            Over 10,000 Pakistani students are currently studying in Germany, with numbers growing each year. 
            The German degree is recognized worldwide, and graduates can stay up to 18 months to find employment.
          </p>

          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>
            Step-by-Step: How to Apply from Pakistan
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { step: 1, title: 'Get HEC Attestation', desc: 'Get your degrees attested by HEC (Higher Education Commission). This is mandatory for German universities. Process takes 2-4 weeks and costs around PKR 3,000-5,000.' },
              { step: 2, title: 'Take Language Tests', desc: 'For English programs: IELTS (6.0-7.0) or TOEFL (80-100). For German programs: TestDaF or DSH. Many Pakistani students choose English-taught programs.' },
              { step: 3, title: 'Search & Apply to Programs', desc: 'Use our AI-powered search to find programs matching your profile. Apply through uni-assist (€75 per application) or directly to universities.' },
              { step: 4, title: 'Open Blocked Account', desc: 'Open a blocked account (Sperrkonto) with €11,904. Banks like Expatrio, Fintiba, or Deutsche Bank offer this service. You can withdraw €992/month in Germany.' },
              { step: 5, title: 'Get Health Insurance', desc: 'Get travel health insurance for visa application, then switch to German public health insurance (~€110/month) after arrival.' },
              { step: 6, title: 'Apply for Student Visa', desc: 'Book appointment at German Embassy Islamabad or Consulate Karachi. Bring admission letter, blocked account proof, insurance, and other documents. Processing: 6-12 weeks.' },
              { step: 7, title: 'Arrive & Register', desc: 'Complete Anmeldung (city registration) within 14 days of arrival. Open a German bank account and enroll at your university.' },
            ].map((item) => (
              <div key={item.step} style={{ display: 'flex', gap: 20, padding: 20, background: '#f9fafb', borderRadius: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 99, background: '#dd0000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                  {item.step}
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#171717', margin: '0 0 6px' }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>
            Documents Required from Pakistan
          </h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              'Matric & Intermediate certificates (HEC attested)',
              'Bachelor degree & transcripts (HEC attested)',
              'IELTS/TOEFL score report',
              'Valid passport (at least 6 months validity)',
              'Blocked account confirmation (€11,904)',
              'Health insurance certificate',
              'University admission letter',
              'Motivation letter',
              'CV/Resume',
              'Passport-size photos (biometric)',
            ].map((doc) => (
              <div key={doc} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle style={{ width: 20, height: 20, color: '#dd0000', flexShrink: 0 }} />
                <span style={{ fontSize: 15, color: '#374151' }}>{doc}</span>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>
            Costs for Pakistani Students
          </h2>
          <div style={{ background: '#f9fafb', borderRadius: 12, padding: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  ['Tuition (Public Universities)', 'Free (€0)'],
                  ['Semester Fee', '€150-350 per semester'],
                  ['Blocked Account', '€11,904 per year'],
                  ['Health Insurance', '~€110 per month'],
                  ['Rent (Shared)', '€300-500 per month'],
                  ['Food & Living', '€200-300 per month'],
                  ['Visa Fee', '€75'],
                  ['uni-assist Fee', '€75 per application'],
                ].map(([item, cost]) => (
                  <tr key={item} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 0', fontSize: 15, color: '#374151' }}>{item}</td>
                    <td style={{ padding: '12px 0', fontSize: 15, fontWeight: 600, color: '#dd0000', textAlign: 'right' }}>{cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>
            Popular Programs for Pakistani Students
          </h2>
          <ul style={{ fontSize: 16, color: '#525252', lineHeight: 2, paddingLeft: 24 }}>
            <li>Computer Science & Software Engineering</li>
            <li>Mechanical & Electrical Engineering</li>
            <li>Business Administration (MBA)</li>
            <li>Data Science & Artificial Intelligence</li>
            <li>Renewable Energy & Environmental Engineering</li>
            <li>Economics & Finance</li>
          </ul>

          <div style={{ marginTop: 48, padding: 24, background: 'linear-gradient(135deg, #dd0000 0%, #b91c1c 100%)', borderRadius: 16, textAlign: 'center' }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>Ready to find your program?</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: '0 0 20px' }}>Search 20,000+ programs and use our free AI tools.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/#hero" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', color: '#dd0000', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                <Search style={{ width: 16, height: 16 }} /> Search Programs
              </Link>
              <Link href="/tools" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', color: '#fff', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', border: '2px solid rgba(255,255,255,0.4)' }}>
                <FileText style={{ width: 16, height: 16 }} /> Free AI Tools
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
