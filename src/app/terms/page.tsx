import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions governing your use of GermanPath / StudyGermany, including subscriptions, cancellation, and consumer rights.',
  robots: { index: true, follow: true },
};

const LAST_UPDATED = '19 April 2026';

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
              If you are an EU consumer (“Verbraucher” in the sense of § 13 BGB), you have a <strong>14-day right of withdrawal</strong> from the date of purchase under the EU Consumer Rights Directive (Directive 2011/83/EU) and §§ 312g, 355 BGB, without giving any reason.
            </P>
            <P>
              <strong>Important note for digital content / digital services:</strong> Under Art. 16(m) of Directive 2011/83/EU and § 356 (5) BGB, the right of withdrawal expires before the end of the 14-day period if (a) you expressly consent to immediate performance of the contract, (b) you acknowledge that you lose your right of withdrawal once performance has begun, and (c) we provide you with confirmation of the contract on a durable medium. We obtain this consent at checkout. If you have not yet used any premium feature, you can still exercise your right of withdrawal within 14 days.
            </P>
            <P>
              To exercise your right of withdrawal you can use our <Link href="/withdrawal-form" style={{ color: '#dd0000' }}>standard withdrawal form</Link> (not mandatory) or send a clear declaration (e.g. by email) to <a href="mailto:billing@germanpath.com" style={{ color: '#dd0000' }}>billing@germanpath.com</a> stating that you wish to withdraw from the contract. The withdrawal period is met if you send your declaration before the 14-day period expires. If you withdraw, we will refund any payments received from you without undue delay and at the latest within 14 days, using the same means of payment you used for the original transaction.
            </P>
          </Section>

          <Section title="5. Cancellation">
            <P>You may cancel your subscription at any time from your account settings (“Subscription” / “Billing” page) or by emailing <a href="mailto:billing@germanpath.com" style={{ color: '#dd0000' }}>billing@germanpath.com</a>. Cancellation disables auto-renewal; your plan remains active until the end of the prepaid billing period, after which it expires automatically without further charges. Where mandatory consumer protection law (e.g. § 312k BGB “Kündigungsbutton”) requires an easier cancellation method, we comply with that requirement.</P>
          </Section>

          <Section title="6. Refunds">
            <P>Outside of the statutory withdrawal right (Section 4) and outside of cases where applicable consumer law requires a refund (e.g. material defect, billing error, or non-conformity under Directive (EU) 2019/770), payments for current and past billing periods are non-refundable. Statutory warranty rights remain unaffected. To submit a refund request, contact <a href="mailto:billing@germanpath.com" style={{ color: '#dd0000' }}>billing@germanpath.com</a>.</P>
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

          <Section title="9. Statutory Warranty (Conformity)">
            <P>The Service is provided as a digital service under Directive (EU) 2019/770 and §§ 327 ff. BGB. We warrant that the Service conforms to the agreed description and is updated as necessary to maintain conformity for the duration of your subscription. Statutory warranty rights for lack of conformity remain unaffected. Please report any non-conformity to <a href="mailto:support@germanpath.com" style={{ color: '#dd0000' }}>support@germanpath.com</a> so we can remedy it within a reasonable period.</P>
          </Section>

          <Section title="10. Intellectual Property">
            <P>The Service and its underlying technology, design, software code, trademarks, logos, and content (excluding user content) are owned by Smarvia Studio or its licensors and are protected by copyright, trademark, and other intellectual-property laws. You retain ownership of content you create using our tools. By using the Service, you grant us a limited, worldwide, non-exclusive, royalty-free licence to process, store, and display your content solely as required to operate and provide the Service to you.</P>
          </Section>

          <Section title="11. Data Protection">
            <P>We process your personal data in accordance with our <Link href="/privacy-policy" style={{ color: '#dd0000' }}>Privacy Policy</Link>, which forms an integral part of these Terms. Where we act as a data processor on your behalf (e.g. content you upload), we do so based on these Terms which constitute the data-processing agreement under Art. 28 GDPR; further details are available on request.</P>
          </Section>

          <Section title="12. Limitation of Liability">
            <P>To the maximum extent permitted by applicable law, Smarvia Studio shall not be liable for indirect, incidental, special, or consequential damages, loss of profits, loss of data, or loss of business opportunities arising from your use of the Service. For ordinary negligence, our liability is limited to the foreseeable damages typical for this type of contract; our aggregate liability shall not exceed the amount you paid in the 12 months preceding the claim.</P>
            <P>Nothing in these Terms limits or excludes our liability for: (a) death or personal injury caused by our negligence; (b) fraud or fraudulent misrepresentation; (c) intent or gross negligence; (d) breaches of essential contractual obligations (“Kardinalpflichten”); (e) liability under the German Product Liability Act (Produkthaftungsgesetz); or (f) any other liability that cannot be excluded under mandatory law.</P>
          </Section>

          <Section title="13. Force Majeure">
            <P>Neither party shall be liable for any failure or delay in performance to the extent caused by events beyond its reasonable control, including natural disasters, war, terrorism, government action, labour disputes, internet or electricity outages, or third-party service provider failures. The affected party will notify the other promptly and resume performance as soon as reasonably possible.</P>
          </Section>

          <Section title="14. Account Suspension & Termination">
            <P>We may suspend or terminate your account at any time with reasonable notice if you materially breach these Terms (e.g. fraud, abuse, prohibited use). Where required by mandatory law, we will give you an opportunity to cure the breach. On termination, your access ends and your data is deleted in accordance with the Privacy Policy. You may close your account at any time from the profile settings page or by emailing us.</P>
          </Section>

          <Section title="15. Dispute Resolution">
            <P>These Terms are governed by the substantive laws of the Federal Republic of Germany, excluding the UN Convention on Contracts for the International Sale of Goods (CISG). If you are a consumer with habitual residence in another EU/EEA country, you also benefit from the mandatory consumer-protection provisions of the law of your country of residence.</P>
            <P>The EU Commission’s Online Dispute Resolution (ODR) platform is available at <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" style={{ color: '#dd0000' }}>https://ec.europa.eu/consumers/odr</a>. Our email for ODR matters is <a href="mailto:smarviastudio@gmail.com" style={{ color: '#dd0000' }}>smarviastudio@gmail.com</a>. We are not obligated and not generally willing to participate in dispute resolution proceedings before a consumer arbitration board (“Verbraucherschlichtungsstelle”), unless required by law in a specific case.</P>
          </Section>

          <Section title="16. Severability">
            <P>If any provision of these Terms is held invalid or unenforceable, the remaining provisions remain in full force and effect. The invalid provision shall be replaced by a valid one that comes closest to the original economic intent.</P>
          </Section>

          <Section title="17. Assignment">
            <P>You may not assign or transfer these Terms or your account without our prior written consent. We may assign these Terms in connection with a merger, acquisition, or sale of all or substantially all of our assets, on the condition that the assignee assumes our obligations.</P>
          </Section>

          <Section title="18. Entire Agreement">
            <P>These Terms (together with the Privacy Policy, Cookie Policy, and any plan-specific terms presented at checkout) constitute the entire agreement between you and Smarvia Studio regarding the Service and supersede any prior agreements on the same subject.</P>
          </Section>

          <Section title="19. Changes to Terms">
            <P>We may update these Terms. Material changes will be communicated via email or a notice on the site at least 14 days in advance. If you do not agree to the changes, you may cancel your subscription before they take effect. Continued use after the effective date constitutes acceptance of the updated Terms.</P>
          </Section>

          <Section title="20. Contact">
            <P>
              Smarvia Studio<br />
              Schoeneggstrasse 45, 8953 Dietikon, Switzerland<br />
              General: <a href="mailto:smarviastudio@gmail.com" style={{ color: '#dd0000' }}>smarviastudio@gmail.com</a><br />
              Billing: <a href="mailto:billing@germanpath.com" style={{ color: '#dd0000' }}>billing@germanpath.com</a><br />
              Support: <a href="mailto:support@germanpath.com" style={{ color: '#dd0000' }}>support@germanpath.com</a>
            </P>
          </Section>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #e5e7eb', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Link href="/impressum" style={{ fontSize: 13, fontWeight: 600, color: '#dd0000', textDecoration: 'none' }}>Impressum →</Link>
            <Link href="/privacy-policy" style={{ fontSize: 13, fontWeight: 600, color: '#dd0000', textDecoration: 'none' }}>Privacy Policy →</Link>
            <Link href="/cookie-policy" style={{ fontSize: 13, fontWeight: 600, color: '#dd0000', textDecoration: 'none' }}>Cookie Policy →</Link>
            <Link href="/withdrawal-form" style={{ fontSize: 13, fontWeight: 600, color: '#dd0000', textDecoration: 'none' }}>Withdrawal Form →</Link>
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
