import Link from 'next/link';
import { CheckCircle, FileText, Search } from 'lucide-react';
import { HubBreadcrumbs } from '@/components/HubBreadcrumbs';
import type { CountryGuide } from '@/lib/country-guides';

type CountryGuidePageProps = {
  guide: CountryGuide;
};

export function CountryGuidePage({ guide }: CountryGuidePageProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <HubBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Study in Germany', path: '/study-in-germany' },
          { name: `From ${guide.country}` },
        ]}
      />

      <section style={{ background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)', padding: '24px 24px 80px', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(221,0,0,0.08)', padding: '8px 16px', borderRadius: 99, marginBottom: 20 }}>
            <span style={{ fontSize: 20 }}>{guide.flag}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#dd0000' }}>Guide for {guide.demonym} Students</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, margin: '0 0 20px', lineHeight: 1.15, color: '#171717' }}>
            Study in Germany from {guide.country}
            <br />
            <span style={{ color: '#737373' }}>2026 Complete Guide</span>
          </h1>
          <p style={{ fontSize: 18, color: '#525252', maxWidth: 700, margin: '0 auto 32px', lineHeight: 1.7 }}>
            {guide.heroSubtitle}
          </p>
          <Link href="/#hero" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#dd0000', color: '#fff', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            <Search style={{ width: 18, height: 18 }} /> Search Programs
          </Link>
        </div>
      </section>

      <section style={{ padding: '40px 24px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {[
            { label: `${guide.demonym} Students in Germany`, value: guide.studentCount },
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

      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '0 0 20px' }}>
            Why {guide.demonym} Students Choose Germany
          </h2>
          {guide.intro.map((paragraph) => (
            <p key={paragraph} style={{ fontSize: 16, color: '#525252', lineHeight: 1.8, margin: '0 0 24px' }}>
              {paragraph}
            </p>
          ))}

          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>
            Step-by-Step: How to Apply from {guide.country}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {guide.steps.map((item) => (
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
            Documents Required from {guide.country}
          </h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {guide.documents.map((doc) => (
              <div key={doc} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle style={{ width: 20, height: 20, color: '#dd0000', flexShrink: 0 }} />
                <span style={{ fontSize: 15, color: '#374151' }}>{doc}</span>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>
            Costs for {guide.demonym} Students
          </h2>
          <div style={{ background: '#f9fafb', borderRadius: 12, padding: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {guide.costs.map(([item, cost]) => (
                  <tr key={item} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 0', fontSize: 15, color: '#374151' }}>{item}</td>
                    <td style={{ padding: '12px 0', fontSize: 15, fontWeight: 600, color: '#dd0000', textAlign: 'right' }}>{cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>
            Popular Programs for {guide.demonym} Students
          </h2>
          <ul style={{ fontSize: 16, color: '#525252', lineHeight: 2, paddingLeft: 24 }}>
            {guide.programs.map((program) => (
              <li key={program}>{program}</li>
            ))}
          </ul>

          {guide.universities && guide.universities.length > 0 ? (
            <>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: '#171717', margin: '48px 0 20px' }}>
                Top Universities for {guide.demonym} Students
              </h2>
              <ul style={{ fontSize: 16, color: '#525252', lineHeight: 2, paddingLeft: 24 }}>
                {guide.universities.map((university) => (
                  <li key={university}>{university}</li>
                ))}
              </ul>
            </>
          ) : null}

          <div style={{ marginTop: 48, padding: 24, background: 'linear-gradient(135deg, #dd0000 0%, #b91c1c 100%)', borderRadius: 16, textAlign: 'center' }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>Ready to find your program?</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: '0 0 20px' }}>Search 20,000+ programs and use our AI application tools.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/#hero" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', color: '#dd0000', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                <Search style={{ width: 16, height: 16 }} /> Search Programs
              </Link>
              <Link href="/tools" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', color: '#fff', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', border: '2px solid rgba(255,255,255,0.4)' }}>
                <FileText style={{ width: 16, height: 16 }} /> AI Tools
              </Link>
              <Link href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', color: '#fff', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', border: '2px solid rgba(255,255,255,0.4)' }}>
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
