import Link from 'next/link';
import { GraduationCap, Search, ArrowRight } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Master\'s Programs in Germany - Guide for International Students',
  description: 'Find English-taught master\'s programs in Germany. Learn about admission requirements, tuition fees, application deadlines, and how to apply as an international student.',
  path: '/masters-in-germany',
  keywords: [
    'masters in Germany',
    'master programs Germany',
    'English-taught masters Germany',
    'postgraduate studies Germany',
    'MS in Germany',
    'MBA Germany',
  ],
});

export default function MastersInGermanyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <section style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)', padding: '100px 24px 80px', color: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <GraduationCap style={{ width: 48, height: 48, marginBottom: 20, opacity: 0.9 }} />
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.2 }}>
            Master&apos;s Programs in Germany
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', maxWidth: 700, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Find your perfect master&apos;s program among 10,000+ options at German universities. 
            Many are tuition-free and taught in English.
          </p>
          <Link href="/#hero" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#7c3aed', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            <Search style={{ width: 18, height: 18 }} /> Search Master&apos;s Programs
          </Link>
        </div>
      </section>

      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '0 0 20px' }}>Why Do a Master&apos;s in Germany?</h2>
          <p style={{ fontSize: 16, color: '#525252', lineHeight: 1.8, margin: '0 0 24px' }}>
            Germany offers some of the best postgraduate education in the world. With tuition-free public universities, 
            world-renowned research facilities, and strong industry connections, a German master&apos;s degree opens doors globally.
          </p>
          
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>Admission Requirements</h2>
          <ul style={{ fontSize: 16, color: '#525252', lineHeight: 2, margin: '0 0 24px', paddingLeft: 24 }}>
            <li>Bachelor&apos;s degree in a related field (usually 180 ECTS)</li>
            <li>English proficiency: IELTS 6.5+ or TOEFL 90+</li>
            <li>For German-taught programs: TestDaF or DSH certificate</li>
            <li>Motivation letter and CV</li>
            <li>Some programs require GRE/GMAT scores</li>
          </ul>

          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>Application Deadlines</h2>
          <p style={{ fontSize: 16, color: '#525252', lineHeight: 1.8, margin: '0 0 24px' }}>
            Most German universities have two intake periods:
          </p>
          <ul style={{ fontSize: 16, color: '#525252', lineHeight: 2, margin: '0 0 24px', paddingLeft: 24 }}>
            <li><strong>Winter semester (October):</strong> Apply by July 15</li>
            <li><strong>Summer semester (April):</strong> Apply by January 15</li>
          </ul>

          <div style={{ marginTop: 48, padding: 24, background: '#fafafa', borderRadius: 12, textAlign: 'center' }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#171717', margin: '0 0 12px' }}>Ready to find your program?</h3>
            <p style={{ fontSize: 14, color: '#737373', margin: '0 0 16px' }}>Search 10,000+ master&apos;s programs at German universities.</p>
            <Link href="/#hero" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#dd0000', fontWeight: 600, textDecoration: 'none' }}>
              Search Programs <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
