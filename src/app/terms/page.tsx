import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions governing your use of GermanPath / StudyGermany, including subscriptions, cancellation, and consumer rights.',
  robots: { index: true, follow: true },
};

const LAST_UPDATED = '13 March 2026';

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <SiteNav />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '122px 24px 80px' }}>
        <div style={{ background: '#fff', borderRadius: 24, padding: '48px 48px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' }}>

          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#dd0000', marginBottom: 8 }}>Legal</p>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#111', margin: '0 0 8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Terms of Service</h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 40 }}>Last updated: {LAST_UPDATED}</p>

          <P>
            These Terms of Service ("Terms") govern your access to and use of <strong>germanpath.com</strong> and all related services (the "Service") provided by Smarvia Studio ("we", "us"). By using the Service, you agree to these Terms. If you do not agree, do not use the Service.
          </P>

          <Section title="1. About the Service">
            <P>GermanPath provides AI-powered tools for international students seeking to study in Germany, including program search, CV maker, cover letter and motivation letter generators, application tracking, and related calculators. Some features are available free of charge; others require a paid subscription.</P>
          </Section>

          <Section title="2. Eligibility">
            <P>You must be at least 16 years old to create an account. By registering, you confirm you meet this requirement. You are responsible for maintaining the confidentiality of your account credentials.</P>
          </Section>

          <Section title="3. Subscriptions & Billing">
            <P>We offer monthly and annual subscription plans ("Starter", "Essential", and "Pro"). By subscribing:</P>
            <UL items={[
              'You authorise us to charge your payment method via Stripe on a recurring basis (monthly or annually).',
              'Prices shown include applicable VAT unless stated otherwise.',
              'Subscriptions renew automatically at the end of each billing period unless cancelled beforehand.',
              'You will receive an email reminder before any renewal.',
            ]} />
          </Section>

          <Section title="4. Right of Withdrawal (EU Consumer Right)">
            <P>
              If you are an EU consumer, you have a <strong>14-day right of withdrawal</strong> from the date of purchase under the EU Consumer Rights Directive (Directive 2011/83/EU), provided you have not begun using the digital service. Once you have accessed premium features, the right of withdrawal is waived with your explicit consent at checkout, as permitted by Art. 16(m) of the Directive.
            </P>
            <P>To exercise a withdrawal before using premium features, contact us at <a href="mailto:billing@germanpath.com" style={{ color: '#dd0000' }}>billing@germanpath.com</a> within 14 days of purchase.</P>
          </Section>

          <Section title="5. Cancellation">
            <P>Outside of the statutory 14-day withdrawal right described above, subscriptions are non-cancellable for the active billing period. You may disable auto-renewal from your account settings, in which case the plan expires at the end of the prepaid term. We comply with all mandatory EU consumer rights.</P>
          </Section>

          <Section title="6. Refunds">
            <P>Our plans are non-refundable. We only issue refunds where required by applicable consumer law (for example, if you exercise the 14-day withdrawal right before using premium features or if there is a proven billing error). For statutory claims, contact <a href="mailto:smarviastudio@gmail.com" style={{ color: '#dd0000' }}>smarviastudio@gmail.com</a>.</P>
          </Section>

          <Section title="7. Acceptable Use">
            <P>You agree not to:</P>
            <UL items={[
              'Use the Service for illegal purposes or to infringe third-party rights.',
              'Attempt to reverse-engineer, scrape, or copy the Service or its AI outputs at scale.',
              'Use the Service to generate spam, misleading content, or academic fraud.',
              'Share account credentials or resell access.',
              'Circumvent usage limits or rate limits.',
            ]} />
          </Section>

          <Section title="8. AI-Generated Content">
            <P>Our tools produce AI-generated content (CV text, letters, recommendations). This content is provided as a starting point and may contain errors. You are solely responsible for reviewing, editing, and verifying any AI-generated output before submitting it to universities, employers, or official bodies. We do not guarantee accuracy, completeness, or suitability.</P>
          </Section>

          <Section title="9. Intellectual Property">
            <P>The Service and its underlying technology are owned by GermanPath UG. You retain ownership of content you create using our tools. By using the Service, you grant us a limited, non-exclusive licence to process your content solely to provide the Service.</P>
          </Section>

          <Section title="10. Limitation of Liability">
            <P>To the maximum extent permitted by applicable law, GermanPath shall not be liable for indirect, incidental, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid in the 3 months preceding the claim. Nothing in these Terms limits liability for fraud, death, or personal injury caused by negligence.</P>
          </Section>

          <Section title="11. Dispute Resolution">
            <P>These Terms are governed by German law. In case of disputes, we will first attempt to resolve the matter amicably. The EU Commission's ODR platform is available at <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" style={{ color: '#dd0000' }}>https://ec.europa.eu/consumers/odr</a>. We are not obligated to participate in consumer arbitration but are willing to do so.</P>
          </Section>

          <Section title="12. Changes to Terms">
            <P>We may update these Terms. Material changes will be communicated via email or a notice on the site at least 14 days in advance. Continued use after the effective date constitutes acceptance of the updated Terms.</P>
          </Section>

          <Section title="13. Contact">
            <P>
              Smarvia Studio, Schoeneggstrasse 45, 8953 Dietikon, Switzerland<br />
              <a href="mailto:smarviastudio@gmail.com" style={{ color: '#dd0000' }}>smarviastudio@gmail.com</a>
            </P>
          </Section>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #e5e7eb', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Link href="/impressum" style={{ fontSize: 13, fontWeight: 600, color: '#dd0000', textDecoration: 'none' }}>Impressum →</Link>
            <Link href="/privacy-policy" style={{ fontSize: 13, fontWeight: 600, color: '#dd0000', textDecoration: 'none' }}>Privacy Policy →</Link>
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
