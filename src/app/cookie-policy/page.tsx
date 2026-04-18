import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Detailed information about the cookies and similar technologies used on germanpath.com under GDPR and the German TTDSG.',
  robots: { index: true, follow: true },
};

const LAST_UPDATED = '19 April 2026';

type CookieRow = {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
  category: 'Strictly necessary' | 'Preferences' | 'Analytics';
};

const COOKIES: CookieRow[] = [
  { name: 'next-auth.session-token', provider: 'germanpath.com', purpose: 'Keeps you signed in to your account.', duration: '30 days', category: 'Strictly necessary' },
  { name: 'next-auth.csrf-token', provider: 'germanpath.com', purpose: 'Protects against cross-site request forgery (CSRF) on authentication forms.', duration: 'Session', category: 'Strictly necessary' },
  { name: 'next-auth.callback-url', provider: 'germanpath.com', purpose: 'Remembers where to redirect you after sign-in.', duration: 'Session', category: 'Strictly necessary' },
  { name: 'gp_cookie_consent', provider: 'germanpath.com', purpose: 'Stores your cookie preferences (essential / analytics / preferences).', duration: '12 months', category: 'Strictly necessary' },
  { name: 'theme', provider: 'germanpath.com', purpose: 'Remembers your selected UI preferences (e.g. language).', duration: '12 months', category: 'Preferences' },
  { name: '_ga, _ga_*', provider: 'Google LLC', purpose: 'Google Analytics — measures aggregated usage of the Service. IP addresses are anonymised.', duration: '14 months', category: 'Analytics' },
  { name: '_vercel_*', provider: 'Vercel Inc.', purpose: 'Vercel Analytics — basic, privacy-friendly page-view counts. No cross-site tracking.', duration: 'Up to 24h', category: 'Analytics' },
];

export default function CookiePolicyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <SiteNav />
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '122px 24px 80px' }}>
        <div style={{ background: '#fff', borderRadius: 24, padding: '48px 48px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' }}>

          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#dd0000', marginBottom: 8 }}>Legal</p>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#111', margin: '0 0 8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Cookie Policy</h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 40 }}>Last updated: {LAST_UPDATED}</p>

          <P>
            This Cookie Policy explains how Smarvia Studio (&ldquo;we&rdquo;) uses cookies and similar technologies on <strong>germanpath.com</strong> (the &ldquo;Service&rdquo;) in accordance with the EU GDPR (Regulation (EU) 2016/679), the EU ePrivacy Directive 2002/58/EC, and the German Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz (TDDDG, formerly TTDSG).
          </P>

          <Section title="1. What are cookies?">
            <P>
              Cookies are small text files placed on your device when you visit a website. We also use similar technologies such as local storage and session storage. In this policy, &ldquo;cookies&rdquo; refers to all such technologies.
            </P>
          </Section>

          <Section title="2. Legal basis">
            <UL items={[
              'Strictly necessary cookies are stored on the basis of § 25 (2) Nr. 2 TDDDG (technically necessary). No consent is required.',
              'All other cookies (preferences, analytics, marketing) are stored only after you give consent via our cookie banner (§ 25 (1) TDDDG, Art. 6(1)(a) GDPR). You can withdraw consent at any time with effect for the future.',
            ]} />
          </Section>

          <Section title="3. Cookie categories">
            <P><strong>Strictly necessary</strong> — required for core features such as login, security, and remembering your cookie choices.</P>
            <P><strong>Preferences</strong> — remember UI choices like language or theme.</P>
            <P><strong>Analytics</strong> — help us understand how the Service is used so we can improve it. Loaded only with your consent.</P>
          </Section>

          <Section title="4. Cookies we use">
            <div style={{ overflowX: 'auto', marginTop: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
                    <Th>Name</Th>
                    <Th>Provider</Th>
                    <Th>Purpose</Th>
                    <Th>Duration</Th>
                    <Th>Category</Th>
                  </tr>
                </thead>
                <tbody>
                  {COOKIES.map((c) => (
                    <tr key={c.name} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <Td><code style={{ fontSize: 12 }}>{c.name}</code></Td>
                      <Td>{c.provider}</Td>
                      <Td>{c.purpose}</Td>
                      <Td>{c.duration}</Td>
                      <Td><Badge category={c.category} /></Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <P style={{ marginTop: 16 }}>
              The list above reflects our current implementation and is updated as our infrastructure evolves. Some cookies (e.g. those set by third-party providers) may change names without notice.
            </P>
          </Section>

          <Section title="5. Third-party providers and international transfers">
            <P>Some analytics providers are based outside the EU/EEA (mainly the United States). We rely on:</P>
            <UL items={[
              'EU\u2013US Data Privacy Framework certifications (where available).',
              'EU Standard Contractual Clauses (Decision 2021/914) and supplementary technical safeguards.',
            ]} />
            <P>See our <Link href="/privacy-policy" style={{ color: '#dd0000' }}>Privacy Policy</Link> &sect; 9 for details.</P>
          </Section>

          <Section title="6. How to manage your cookie choices">
            <UL items={[
              'On the Service: click the \u201cCookie preferences\u201d link in the footer or clear your browser storage to reopen the consent banner.',
              'In your browser: most browsers let you block or delete cookies (Chrome, Safari, Firefox, Edge all provide cookie controls in their settings).',
              'For Google Analytics: install the Google Analytics opt-out browser add-on (tools.google.com/dlpage/gaoptout).',
            ]} />
            <P>Blocking strictly necessary cookies may break login or other core features.</P>
          </Section>

          <Section title="7. Do Not Track">
            <P>We do not currently respond to browser &ldquo;Do Not Track&rdquo; signals because no common standard for them has been finalised. We instead rely on the cookie banner choices.</P>
          </Section>

          <Section title="8. Changes to this Cookie Policy">
            <P>We may update this Cookie Policy as our use of cookies changes. The &ldquo;Last updated&rdquo; date at the top reflects the most recent revision. Material changes are also notified via the cookie banner so you can review and adjust your consent.</P>
          </Section>

          <Section title="9. Contact">
            <P>
              Questions about cookies and tracking: <a href="mailto:privacy@germanpath.com" style={{ color: '#dd0000' }}>privacy@germanpath.com</a><br />
              Smarvia Studio, Schoeneggstrasse 45, 8953 Dietikon, Switzerland
            </P>
          </Section>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #e5e7eb', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Link href="/privacy-policy" style={{ fontSize: 13, fontWeight: 600, color: '#dd0000', textDecoration: 'none' }}>Privacy Policy &rarr;</Link>
            <Link href="/terms" style={{ fontSize: 13, fontWeight: 600, color: '#dd0000', textDecoration: 'none' }}>Terms of Service &rarr;</Link>
            <Link href="/impressum" style={{ fontSize: 13, fontWeight: 600, color: '#dd0000', textDecoration: 'none' }}>Impressum &rarr;</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111', margin: '0 0 10px' }}>{title}</h2>
      {children}
    </div>
  );
}

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75, margin: '0 0 10px', ...style }}>{children}</p>;
}

function UL({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: '0 0 10px', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 14, color: '#374151', lineHeight: 1.7 }}>{item}</li>
      ))}
    </ul>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ padding: '10px 12px', fontSize: 12, fontWeight: 700, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: '10px 12px', fontSize: 13, color: '#374151', verticalAlign: 'top' }}>{children}</td>;
}

function Badge({ category }: { category: CookieRow['category'] }) {
  const colors: Record<CookieRow['category'], { bg: string; fg: string }> = {
    'Strictly necessary': { bg: 'rgba(16,185,129,0.1)', fg: '#047857' },
    'Preferences': { bg: 'rgba(59,130,246,0.1)', fg: '#1d4ed8' },
    'Analytics': { bg: 'rgba(245,158,11,0.12)', fg: '#b45309' },
  };
  const c = colors[category];
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 999, background: c.bg, color: c.fg, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{category}</span>
  );
}
