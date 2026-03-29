import Link from 'next/link';
import { GraduationCap, Search, ArrowRight } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo';

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
    </div>
  );
}
