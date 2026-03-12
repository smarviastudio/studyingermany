import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How GermanPath / StudyGermany collects, uses and protects your personal data under GDPR.',
  robots: { index: true, follow: true },
};

const LAST_UPDATED = '12 March 2025';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <SiteNav />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 80px' }}>
        <div style={{ background: '#fff', borderRadius: 24, padding: '48px 48px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' }}>

          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#dd0000', marginBottom: 8 }}>Legal</p>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#111', margin: '0 0 8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Privacy Policy</h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 40 }}>Last updated: {LAST_UPDATED}</p>

          <P>
            GermanPath UG ("we", "us", "our") operates the website <strong>germanpath.com</strong> (the "Service"). This Privacy Policy explains how we collect, use, store, and protect your personal data in accordance with the EU General Data Protection Regulation (GDPR – Regulation (EU) 2016/679) and the German Federal Data Protection Act (BDSG).
          </P>

          <Section title="1. Data Controller">
            <P>GermanPath UG (haftungsbeschränkt), [Address], Germany — <a href="mailto:privacy@germanpath.com" style={{ color: '#dd0000' }}>privacy@germanpath.com</a></P>
          </Section>

          <Section title="2. Data We Collect">
            <P>We collect the following categories of personal data:</P>
            <UL items={[
              'Account data: email address, name, and password (hashed) when you register.',
              'Profile data: optional fields you fill in (nationality, degree goals, academic background, career goals, skills, phone, date of birth, address).',
              'Usage data: pages visited, tools used, timestamps — collected via server logs and analytics.',
              'Payment data: processed by Stripe. We do not store full card details.',
              'CV / document data: content you enter into our CV maker, cover letter, and motivation letter tools.',
              'Cookie data: session, preference, and analytics cookies (see Section 7).',
            ]} />
          </Section>

          <Section title="3. Legal Basis for Processing">
            <UL items={[
              'Contract (Art. 6(1)(b) GDPR): to provide the Service you requested (account, tools, subscriptions).',
              'Legitimate interests (Art. 6(1)(f) GDPR): security, fraud prevention, product improvement.',
              'Consent (Art. 6(1)(a) GDPR): analytics cookies, marketing communications.',
              'Legal obligation (Art. 6(1)(c) GDPR): tax records, compliance requirements.',
            ]} />
          </Section>

          <Section title="4. How We Use Your Data">
            <UL items={[
              'Create and manage your account and subscription.',
              'Pre-fill AI tools (CV maker, cover letter, motivation letter) with your saved profile.',
              'Process payments through Stripe.',
              'Send transactional emails (account confirmation, receipts, password reset).',
              'Send marketing newsletters only if you opt in.',
              'Analyse usage to improve the Service (aggregated, anonymised where possible).',
              'Provide AI-generated program recommendations based on your profile preferences.',
            ]} />
          </Section>

          <Section title="5. Data Sharing & Processors">
            <P>We only share data with trusted processors under GDPR-compliant data processing agreements:</P>
            <UL items={[
              'Stripe (payments) — stripe.com/privacy',
              'OpenRouter / AI API provider (AI generation) — data sent per request, not stored by provider',
              'Vercel (hosting & infrastructure) — vercel.com/legal/privacy-policy',
              'Google Analytics (optional, consent-based) — policies.google.com/privacy',
              'Prisma / PostgreSQL (database) — self-hosted or managed, EU region',
            ]} />
            <P>We do not sell your personal data.</P>
          </Section>

          <Section title="6. Data Retention">
            <UL items={[
              'Account data: retained while your account is active; deleted within 30 days of account deletion request.',
              'Payment records: retained for 10 years as required by German tax law.',
              'Analytics data: anonymised after 26 months.',
              'CV/document content: deleted on account deletion.',
            ]} />
          </Section>

          <Section title="7. Cookies">
            <P>We use the following cookie categories:</P>
            <UL items={[
              'Essential cookies: required for login, session management, security. No consent needed.',
              'Analytics cookies (e.g. Google Analytics): track page views and usage. Require your consent.',
              'Preference cookies: remember your settings (e.g. cookie choices). Consent-based.',
            ]} />
            <P>You can manage cookie preferences at any time via the cookie banner on our site.</P>
          </Section>

          <Section title="8. Your Rights (GDPR)">
            <P>Under GDPR you have the right to:</P>
            <UL items={[
              'Access — request a copy of your personal data.',
              'Rectification — correct inaccurate data.',
              'Erasure ("right to be forgotten") — delete your account and data.',
              'Restriction — limit how we process your data.',
              'Data portability — receive your data in a machine-readable format.',
              'Object — opt out of processing based on legitimate interests.',
              'Withdraw consent — at any time, without affecting prior processing.',
              'Lodge a complaint — with your national supervisory authority (Germany: BfDI — www.bfdi.bund.de).',
            ]} />
            <P>To exercise your rights, email us at <a href="mailto:privacy@germanpath.com" style={{ color: '#dd0000' }}>privacy@germanpath.com</a>. We respond within 30 days.</P>
          </Section>

          <Section title="9. Account & Data Deletion">
            <P>You can delete your account at any time from your Profile settings page. All personal data will be permanently removed within 30 days, except data we are required to retain by law (e.g. billing records).</P>
          </Section>

          <Section title="10. International Transfers">
            <P>Some of our processors (e.g. Stripe, Vercel) may process data outside the EU/EEA. We ensure appropriate safeguards are in place (Standard Contractual Clauses or adequacy decisions).</P>
          </Section>

          <Section title="11. Children">
            <P>Our Service is not directed to children under 16. We do not knowingly collect personal data from minors. If you believe a child has provided data, contact us and we will delete it.</P>
          </Section>

          <Section title="12. Changes to This Policy">
            <P>We may update this Privacy Policy. Material changes will be notified via email or a prominent notice on the site. Continued use after the effective date constitutes acceptance.</P>
          </Section>

          <Section title="13. Contact">
            <P>
              Data Protection inquiries: <a href="mailto:privacy@germanpath.com" style={{ color: '#dd0000' }}>privacy@germanpath.com</a><br />
              GermanPath UG, [Address], Germany
            </P>
          </Section>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #e5e7eb', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Link href="/impressum" style={{ fontSize: 13, fontWeight: 600, color: '#dd0000', textDecoration: 'none' }}>Impressum →</Link>
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
      <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111', margin: '0 0 10px' }}>{title}</h2>
      {children}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75, margin: '0 0 10px' }}>{children}</p>;
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
