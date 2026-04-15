import Link from 'next/link';
import { GraduationCap, Search, ArrowRight } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo';

const FAQS = [
  { q: 'Can international students do a bachelor\'s degree in Germany for free?', a: 'Yes — public universities in Germany charge no tuition fees for bachelor\'s programs, including for international students. You only pay a semester contribution of €150–350 per semester, which usually includes a public transport pass.' },
  { q: 'What is Studienkolleg and do I need it?', a: 'Studienkolleg is a one-year preparatory course for international students whose school-leaving certificate is not directly recognized in Germany. After completing it, you take the Feststellungsprüfung exam. Students from most non-EU countries (including Pakistan, India, Nigeria) typically need it for bachelor\'s admission.' },
  { q: 'What language do I need for a bachelor\'s in Germany?', a: 'Most bachelor\'s programs are taught in German, requiring at least B2/C1 level (TestDaF or DSH certificate). However, there are 300+ bachelor\'s programs taught in English. Even for English programs, learning basic German (A2/B1) helps with daily life and internships.' },
  { q: 'How do I apply for a bachelor\'s program in Germany?', a: 'Applications go either directly to the university or through uni-assist (a centralized portal for international applicants). You\'ll need your school-leaving certificate, language certificate, passport, and a motivation letter. Some programs also require a portfolio or entrance exam.' },
  { q: 'What are the admission deadlines for bachelor\'s programs in Germany?', a: 'For the winter semester (October start): apply by July 15. For the summer semester (April start): apply by January 15. Some universities have earlier deadlines for international applicants — always check the university\'s international office website.' },
  { q: 'How long is a bachelor\'s degree in Germany?', a: 'Bachelor\'s degrees in Germany are typically 3 years (6 semesters, 180 ECTS) for most subjects, or 3.5–4 years for engineering and some science programs. The final semester includes a bachelor\'s thesis.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(faq => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
};

export const metadata = buildPageMetadata({
  title: 'Bachelor\'s Programs in Germany - Guide for International Students',
  description: 'Find English-taught bachelor\'s programs in Germany. Learn about admission requirements, Studienkolleg, tuition fees, and how to apply as an international student.',
  path: '/bachelor-in-germany',
  keywords: [
    'bachelor in Germany',
    'undergraduate studies Germany',
    'English-taught bachelor Germany',
    'Studienkolleg',
    'BSc Germany',
    'BA Germany',
  ],
});

export default function BachelorInGermanyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', padding: '100px 24px 80px', color: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <GraduationCap style={{ width: 48, height: 48, marginBottom: 20, opacity: 0.9 }} />
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.2 }}>
            Bachelor&apos;s Programs in Germany
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', maxWidth: 700, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Start your academic journey at a German university. Find tuition-free bachelor&apos;s programs 
            taught in English or German.
          </p>
          <Link href="/#hero" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#3b82f6', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            <Search style={{ width: 18, height: 18 }} /> Search Bachelor&apos;s Programs
          </Link>
        </div>
      </section>

      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '0 0 20px' }}>Why Study Bachelor&apos;s in Germany?</h2>
          <p style={{ fontSize: 16, color: '#525252', lineHeight: 1.8, margin: '0 0 24px' }}>
            Germany offers excellent undergraduate education with no tuition fees at public universities. 
            A German bachelor&apos;s degree is recognized worldwide and provides a strong foundation for your career.
          </p>
          
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>Admission Requirements</h2>
          <ul style={{ fontSize: 16, color: '#525252', lineHeight: 2, margin: '0 0 24px', paddingLeft: 24 }}>
            <li>School-leaving certificate equivalent to German Abitur</li>
            <li>Some countries require Studienkolleg (foundation year)</li>
            <li>Language proficiency (German B2/C1 or English depending on program)</li>
            <li>Some programs have NC (numerus clausus) restrictions</li>
          </ul>

          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>What is Studienkolleg?</h2>
          <p style={{ fontSize: 16, color: '#525252', lineHeight: 1.8, margin: '0 0 24px' }}>
            If your school-leaving certificate isn&apos;t directly recognized in Germany, you may need to complete 
            a one-year Studienkolleg (foundation course) before starting your bachelor&apos;s degree. This prepares 
            you for university studies and ends with the Feststellungsprüfung exam.
          </p>

          <div style={{ marginTop: 48, padding: 24, background: '#fafafa', borderRadius: 12, textAlign: 'center' }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#171717', margin: '0 0 12px' }}>Ready to find your program?</h3>
            <p style={{ fontSize: 14, color: '#737373', margin: '0 0 16px' }}>Search bachelor&apos;s programs at German universities.</p>
            <Link href="/#hero" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#dd0000', fontWeight: 600, textDecoration: 'none' }}>
              Search Programs <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid #e5e5e5' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '0 0 32px', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FAQS.map((faq) => (
              <div key={faq.q} style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: '20px 24px' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#171717', margin: '0 0 8px' }}>{faq.q}</h3>
                <p style={{ fontSize: 15, color: '#525252', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
