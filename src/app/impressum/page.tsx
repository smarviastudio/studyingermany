import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum (Legal Notice)',
  description: 'Legal notice and imprint for GermanPath / StudyGermany as required by German law (§5 DDG).',
  robots: { index: false, follow: false },
};

export default function ImpressumPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <SiteNav />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 80px' }}>
        <div style={{ background: '#fff', borderRadius: 24, padding: '48px 48px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' }}>

          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#dd0000', marginBottom: 8 }}>Legal Notice</p>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#111', margin: '0 0 8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Impressum</h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 40 }}>Pflichtangaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)</p>

          <Section title="Service Provider / Dienstanbieter">
            <Row label="Company name" value="Smarvia Studio" />
            <Row label="Address" value="Schoeneggstrasse 45, 8953 Dietikon" />
            <Row label="Country" value="Switzerland" />
          </Section>

          <Section title="Contact / Kontakt">
            <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: 0 }}>
              Email:&nbsp;
              <a href="mailto:smarviastudio@gmail.com" style={{ color: '#dd0000' }}>smarviastudio@gmail.com</a>
              <br />
              Phone available on request via email.
            </p>
          </Section>

          <Section title="Responsible for content / Inhaltlich Verantwortlicher">
            <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: 0 }}>
              Salman Shahid<br />
              Schoeneggstrasse 45, 8953 Dietikon, Switzerland
            </p>
          </Section>

          <Section title="Platform for Online Dispute Resolution">
            <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7 }}>
              The European Commission provides a platform for online dispute resolution (ODR):&nbsp;
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" style={{ color: '#dd0000' }}>
                https://ec.europa.eu/consumers/odr
              </a>
              <br />
              We are not obligated to participate in consumer arbitration but are willing to do so.
            </p>
          </Section>

          <Section title="Disclaimer / Haftungsausschluss">
            <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7 }}>
              The information provided on this website is for general informational purposes only. While we
              strive to keep content up to date, we make no representations as to the completeness, accuracy,
              or suitability of any information. We accept no liability for errors, omissions, or any losses
              arising from use of this site.
            </p>
            <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, marginTop: 12 }}>
              External links are provided for convenience; we have no control over linked websites and accept
              no responsibility for their content or availability.
            </p>
          </Section>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #e5e7eb', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Link href="/privacy-policy" style={{ fontSize: 13, fontWeight: 600, color: '#dd0000', textDecoration: 'none' }}>Privacy Policy →</Link>
            <Link href="/terms" style={{ fontSize: 13, fontWeight: 600, color: '#dd0000', textDecoration: 'none' }}>Terms of Service →</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 12px', paddingBottom: 8, borderBottom: '1px solid #e5e7eb' }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 8, fontSize: 14 }}>
      <span style={{ color: '#6b7280', fontWeight: 500 }}>{label}</span>
      <span style={{ color: '#111' }}>{value}</span>
    </div>
  );
}
