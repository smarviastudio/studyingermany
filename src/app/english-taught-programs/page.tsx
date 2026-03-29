import Link from 'next/link';
import { Globe, Search, ArrowRight } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'English-Taught Programs in Germany - Study Without German',
  description: 'Find 2,000+ English-taught bachelor\'s and master\'s programs in Germany. Study at German universities without speaking German.',
  path: '/english-taught-programs',
  keywords: [
    'English-taught programs Germany',
    'study in Germany in English',
    'English master Germany',
    'English bachelor Germany',
    'no German required',
  ],
});

export default function EnglishTaughtProgramsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <section style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '100px 24px 80px', color: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <Globe style={{ width: 48, height: 48, marginBottom: 20, opacity: 0.9 }} />
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.2 }}>
            English-Taught Programs in Germany
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', maxWidth: 700, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Study at German universities without speaking German. Find 2,000+ programs 
            taught entirely in English.
          </p>
          <Link href="/#hero" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#10b981', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            <Search style={{ width: 18, height: 18 }} /> Search English Programs
          </Link>
        </div>
      </section>

      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '0 0 20px' }}>Study in Germany Without German</h2>
          <p style={{ fontSize: 16, color: '#525252', lineHeight: 1.8, margin: '0 0 24px' }}>
            Germany offers over 2,000 degree programs taught entirely in English. These programs are designed 
            for international students and don&apos;t require any German language skills for admission.
          </p>
          
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>Popular English-Taught Fields</h2>
          <ul style={{ fontSize: 16, color: '#525252', lineHeight: 2, margin: '0 0 24px', paddingLeft: 24 }}>
            <li>Engineering & Technology</li>
            <li>Computer Science & IT</li>
            <li>Business & Management (MBA)</li>
            <li>Natural Sciences</li>
            <li>Economics & Finance</li>
            <li>Social Sciences</li>
          </ul>

          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>English Requirements</h2>
          <p style={{ fontSize: 16, color: '#525252', lineHeight: 1.8, margin: '0 0 16px' }}>
            Most English-taught programs require:
          </p>
          <ul style={{ fontSize: 16, color: '#525252', lineHeight: 2, margin: '0 0 24px', paddingLeft: 24 }}>
            <li><strong>IELTS:</strong> 6.0-7.0 (academic)</li>
            <li><strong>TOEFL:</strong> 80-100 (iBT)</li>
            <li><strong>Cambridge:</strong> B2 First or C1 Advanced</li>
          </ul>

          <div style={{ marginTop: 48, padding: 24, background: '#fafafa', borderRadius: 12, textAlign: 'center' }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#171717', margin: '0 0 12px' }}>Find English-taught programs</h3>
            <p style={{ fontSize: 14, color: '#737373', margin: '0 0 16px' }}>Search 2,000+ programs taught in English.</p>
            <Link href="/#hero" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#dd0000', fontWeight: 600, textDecoration: 'none' }}>
              Search Programs <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
