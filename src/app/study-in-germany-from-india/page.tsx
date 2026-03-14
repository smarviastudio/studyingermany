import { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, Euro, FileText, Plane, CheckCircle, Search, ArrowRight, Globe, Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Study in Germany from India - 2026 Complete Guide | German Path',
  description: 'Complete guide for Indian students to study in Germany. Learn about APS certificate, blocked account, IELTS requirements, tuition-free universities, and step-by-step visa process.',
  keywords: [
    'study in Germany from India',
    'Indian students Germany',
    'Germany student visa India',
    'APS certificate India',
    'blocked account India',
    'DAAD scholarship India',
    'tuition-free Germany India',
  ],
  alternates: {
    canonical: 'https://germanpath.com/study-in-germany-from-india',
  },
};

export default function StudyFromIndiaPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)', padding: '100px 24px 80px', color: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: 99, marginBottom: 20 }}>
            <span style={{ fontSize: 20 }}>🇮🇳</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Guide for Indian Students</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, margin: '0 0 20px', lineHeight: 1.15 }}>
            Study in Germany from India<br />
            <span style={{ opacity: 0.95 }}>2026 Complete Guide</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', maxWidth: 700, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Everything Indian students need to know — from APS certificate to blocked accounts, 
            visa process, and finding tuition-free programs.
          </p>
          <Link href="/#hero" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#138808', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            <Search style={{ width: 18, height: 18 }} /> Search Programs
          </Link>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ padding: '40px 24px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {[
            { label: 'Indian Students in Germany', value: '35,000+' },
            { label: 'Tuition Fees', value: 'Free (Public Unis)' },
            { label: 'Blocked Account', value: '€11,904/year' },
            { label: 'Work Rights', value: '140 days/year' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#138808', margin: '0 0 4px' }}>{stat.value}</p>
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '0 0 20px' }}>
            Why Indian Students Choose Germany
          </h2>
          <p style={{ fontSize: 16, color: '#525252', lineHeight: 1.8, margin: '0 0 24px' }}>
            Germany is the #1 non-English speaking destination for Indian students. With <strong>tuition-free 
            public universities</strong>, excellent engineering and IT programs, and strong industry connections, 
            Germany offers world-class education at a fraction of US/UK costs.
          </p>
          <p style={{ fontSize: 16, color: '#525252', lineHeight: 1.8, margin: '0 0 24px' }}>
            Over 35,000 Indian students are currently studying in Germany — the largest non-EU student group. 
            Many top German companies actively recruit Indian graduates, and the 18-month job-seeker visa 
            makes it easy to start your career in Europe.
          </p>

          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>
            Step-by-Step: How to Apply from India
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { step: 1, title: 'Get APS Certificate', desc: 'Apply for APS (Akademische Prüfstelle) certificate from the German Embassy. This verifies your academic credentials. Processing: 4-8 weeks, Cost: ₹18,000.' },
              { step: 2, title: 'Take Language Tests', desc: 'For English programs: IELTS (6.0-7.0) or TOEFL (80-100). For German programs: TestDaF or DSH. Most Indian students opt for English-taught master\'s programs.' },
              { step: 3, title: 'Search & Apply to Programs', desc: 'Use our AI-powered search to find programs. Apply through uni-assist (€75) or directly. Popular intake: Winter semester (October), apply by July 15.' },
              { step: 4, title: 'Open Blocked Account', desc: 'Open a blocked account (Sperrkonto) with €11,904 (~₹10.5 lakhs). Use Expatrio, Fintiba, or Deutsche Bank. You can withdraw €992/month in Germany.' },
              { step: 5, title: 'Get Health Insurance', desc: 'Get travel health insurance for visa, then switch to German public insurance (~€110/month) after arrival. TK, AOK, and Barmer are popular options.' },
              { step: 6, title: 'Apply for Student Visa', desc: 'Book VFS appointment in Delhi, Mumbai, Bangalore, Chennai, Kolkata, or Hyderabad. Bring all documents. Processing: 4-8 weeks. Visa fee: €75.' },
              { step: 7, title: 'Arrive & Register', desc: 'Complete Anmeldung (city registration) within 14 days. Open German bank account (N26, DKB), get SIM card, and enroll at university.' },
            ].map((item) => (
              <div key={item.step} style={{ display: 'flex', gap: 20, padding: 20, background: '#f9fafb', borderRadius: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 99, background: 'linear-gradient(135deg, #FF9933, #138808)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
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
            Documents Required from India
          </h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              '10th & 12th marksheets (original + copies)',
              'Bachelor degree & transcripts',
              'APS certificate',
              'IELTS/TOEFL/GRE score reports',
              'Valid passport (at least 12 months validity)',
              'Blocked account confirmation (€11,904)',
              'Health insurance certificate',
              'University admission letter',
              'Motivation letter / Statement of Purpose',
              'CV/Resume',
              'Passport-size photos (German specifications)',
              'Proof of English proficiency',
            ].map((doc) => (
              <div key={doc} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle style={{ width: 20, height: 20, color: '#138808', flexShrink: 0 }} />
                <span style={{ fontSize: 15, color: '#374151' }}>{doc}</span>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>
            Costs for Indian Students (in INR)
          </h2>
          <div style={{ background: '#f9fafb', borderRadius: 12, padding: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  ['Tuition (Public Universities)', 'Free (₹0)'],
                  ['Semester Fee', '₹13,000-30,000 per semester'],
                  ['Blocked Account', '₹10.5 lakhs per year'],
                  ['Health Insurance', '~₹9,500 per month'],
                  ['Rent (Shared)', '₹26,000-43,000 per month'],
                  ['Food & Living', '₹17,000-26,000 per month'],
                  ['APS Fee', '₹18,000'],
                  ['Visa Fee', '₹6,500'],
                  ['uni-assist Fee', '₹6,500 per application'],
                ].map(([item, cost]) => (
                  <tr key={item} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 0', fontSize: 15, color: '#374151' }}>{item}</td>
                    <td style={{ padding: '12px 0', fontSize: 15, fontWeight: 600, color: '#138808', textAlign: 'right' }}>{cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>
            Popular Programs for Indian Students
          </h2>
          <ul style={{ fontSize: 16, color: '#525252', lineHeight: 2, paddingLeft: 24 }}>
            <li>Computer Science & Information Technology</li>
            <li>Data Science & Machine Learning</li>
            <li>Mechanical & Automotive Engineering</li>
            <li>Electrical & Electronics Engineering</li>
            <li>Business Analytics & Management</li>
            <li>Renewable Energy & Sustainability</li>
            <li>Biotechnology & Life Sciences</li>
          </ul>

          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>
            Top Universities for Indian Students
          </h2>
          <ul style={{ fontSize: 16, color: '#525252', lineHeight: 2, paddingLeft: 24 }}>
            <li><strong>TU Munich</strong> — #1 in Germany, strong in engineering & CS</li>
            <li><strong>RWTH Aachen</strong> — Top engineering school</li>
            <li><strong>TU Berlin</strong> — Great for tech in the capital</li>
            <li><strong>LMU Munich</strong> — Excellent for sciences & business</li>
            <li><strong>University of Stuttgart</strong> — Automotive engineering hub</li>
            <li><strong>KIT Karlsruhe</strong> — Strong research focus</li>
          </ul>

          <div style={{ marginTop: 48, padding: 24, background: 'linear-gradient(135deg, #FF9933, #138808)', borderRadius: 16, textAlign: 'center' }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>Ready to find your program?</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: '0 0 20px' }}>Search 20,000+ programs and use our free AI tools.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/#hero" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', color: '#138808', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
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
