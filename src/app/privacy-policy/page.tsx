import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How GermanPath / StudyGermany collects, uses and protects your personal data under GDPR.',
  robots: { index: true, follow: true },
};

const LAST_UPDATED = '19 April 2026';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <SiteNav />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '122px 24px 80px' }}>
        <div style={{ background: '#fff', borderRadius: 24, padding: '48px 48px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' }}>

          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#dd0000', marginBottom: 8 }}>Legal</p>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#111', margin: '0 0 8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Privacy Policy</h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 40 }}>Last updated: {LAST_UPDATED}</p>

          <P>
            Smarvia Studio ("we", "us", "our") operates the website <strong>germanpath.com</strong> (the "Service"). This Privacy Policy explains how we collect, use, store, and protect your personal data in accordance with the EU General Data Protection Regulation (GDPR – Regulation (EU) 2016/679) and the German Federal Data Protection Act (BDSG).
          </P>

          <Section title="1. Data Controller">
            <P>
              <strong>Smarvia Studio</strong><br />
              Schoeneggstrasse 45, 8953 Dietikon, Switzerland<br />
              Email: <a href="mailto:smarviastudio@gmail.com" style={{ color: '#dd0000' }}>smarviastudio@gmail.com</a><br />
              Privacy contact: <a href="mailto:privacy@germanpath.com" style={{ color: '#dd0000' }}>privacy@germanpath.com</a>
            </P>
            <P>
              Switzerland is recognised by the European Commission as providing an adequate level of data protection (Adequacy Decision, 2000/518/EC, currently under review). Personal data may therefore be transferred to Switzerland without additional safeguards.
            </P>
          </Section>

          <Section title="2. EU Representative (Art. 27 GDPR)">
            <P>
              As we are established outside the EU/EEA but offer services to data subjects in the EU, we have appointed an EU representative under Art. 27 GDPR. Until our designated representative is published, you may direct any GDPR-related enquiries to our privacy email above; we will respond within statutory deadlines and forward to our EU representative once appointed.
            </P>
          </Section>

          <Section title="3. Data Protection Officer">
            <P>
              We have not appointed a Data Protection Officer (DPO) because our processing activities do not meet the mandatory thresholds in Art. 37(1) GDPR. For all data protection matters, please contact <a href="mailto:privacy@germanpath.com" style={{ color: '#dd0000' }}>privacy@germanpath.com</a>.
            </P>
          </Section>

          <Section title="4. Data We Collect">
            <P>We collect the following categories of personal data:</P>
            <UL items={[
              'Account data: email address, name, and password (hashed with bcrypt) when you register. If you sign in via Google OAuth, we also receive your Google account email and basic profile (name, profile picture).',
              'Profile data: optional fields you fill in (nationality, degree goals, academic background, career goals, skills, phone, date of birth, address).',
              'Usage data: pages visited, tools used, timestamps, session duration — collected via server logs and analytics.',
              'Technical data: IP address, browser type and version, operating system, device identifiers, referral URL — collected automatically via server logs (retained for 14 days for security/abuse-prevention purposes, then deleted or anonymised).',
              'Payment data: name, billing address, payment method tokens. Card details are processed directly by Stripe; we never see or store full card numbers.',
              'Content data: text you enter into our CV maker, cover letter, motivation letter, chatbot, and other AI tools.',
              'Communication data: emails you send to us (support, billing, contact form submissions).',
              'Cookie data: session, preference, and analytics cookies (see Section 9).',
            ]} />
          </Section>

          <Section title="5. Legal Basis for Processing (Art. 6 GDPR)">
            <UL items={[
              'Contract (Art. 6(1)(b) GDPR): to provide the Service you requested (account, AI tools, subscriptions, processing payments).',
              'Legitimate interests (Art. 6(1)(f) GDPR): security, fraud prevention, abuse detection, product improvement, defending legal claims. Our legitimate interests are balanced against your fundamental rights.',
              'Consent (Art. 6(1)(a) GDPR): analytics cookies, preference cookies, marketing communications, optional newsletter.',
              'Legal obligation (Art. 6(1)(c) GDPR): retaining invoices and tax records, responding to lawful requests from authorities.',
            ]} />
          </Section>

          <Section title="6. How We Use Your Data">
            <UL items={[
              'Create, authenticate, and manage your account and subscription.',
              'Pre-fill AI tools (CV maker, cover letter, motivation letter) with your saved profile to save you time.',
              'Process payments and issue invoices through Stripe.',
              'Send transactional emails (account confirmation, receipts, password reset, billing notifications).',
              'Send marketing newsletters only if you opt in (you can unsubscribe at any time).',
              'Analyse usage to improve the Service (aggregated and anonymised where possible).',
              'Provide AI-generated program recommendations based on your profile preferences.',
              'Detect, prevent, and respond to fraud, abuse, security incidents, and violations of our Terms.',
              'Comply with legal obligations and respond to lawful requests.',
            ]} />
          </Section>

          <Section title="7. Automated Decision-Making & AI Profiling (Art. 22 GDPR)">
            <P>
              We use AI models (via OpenRouter, Google Gemini, OpenAI and similar providers) to generate personalised content such as program recommendations, CV text, cover letters, and motivation letters. These outputs are <strong>suggestions only</strong> and have no legal or similarly significant effect on you within the meaning of Art. 22(1) GDPR — you remain in full control of whether and how to use the output.
            </P>
            <P>
              Your prompt data is sent to the AI provider in real time to generate a response. Our providers do not retain your prompt data for training their models under our API agreements. You have the right to request human review of any AI-generated output that affects you and to object to such processing.
            </P>
          </Section>

          <Section title="8. Data Sharing & Processors">
            <P>We only share data with trusted processors under GDPR-compliant Data Processing Agreements (DPAs). Each processor receives only the minimum data required to perform its task.</P>
            <UL items={[
              'Stripe Payments Europe Ltd (Ireland) — payment processing, invoicing. Privacy: stripe.com/privacy',
              'Vercel Inc. (USA) — hosting, edge infrastructure, analytics. SCCs in place. Privacy: vercel.com/legal/privacy-policy',
              'Neon / PostgreSQL provider (EU region) — database storage.',
              'OpenRouter Inc. (USA) — AI gateway routing prompts to selected models. SCCs in place. Privacy: openrouter.ai/privacy',
              'Google LLC (Ireland/USA) — OAuth sign-in (if you choose it), Google Analytics (consent-based), Gemini AI models. SCCs in place. Privacy: policies.google.com/privacy',
              'Resend / email delivery provider — transactional emails (account, billing, password reset).',
              'Unsplash Inc. (USA) — stock photo CDN for blog images (no personal data shared).',
              'WordPress (cms.germanpath.com, EU-hosted) — blog/news content management.',
            ]} />
            <P><strong>We do not sell your personal data and we do not share it for cross-context behavioural advertising.</strong></P>
          </Section>

          <Section title="9. International Transfers (Chapter V GDPR)">
            <P>
              Some of our processors are located outside the EU/EEA (mainly the United States and Switzerland). Where this happens, we rely on:
            </P>
            <UL items={[
              'Adequacy decisions of the European Commission (e.g. EU–US Data Privacy Framework for certified US recipients, Switzerland adequacy).',
              'EU Standard Contractual Clauses (SCCs, 2021/914) supplemented by transfer impact assessments where necessary, in line with the Schrems II ruling.',
              'Additional technical and organisational safeguards such as encryption in transit (TLS 1.2+) and at rest, access control, and pseudonymisation where feasible.',
            ]} />
            <P>You may request a copy of the relevant safeguards by emailing privacy@germanpath.com.</P>
          </Section>

          <Section title="10. Data Retention">
            <UL items={[
              'Account data: retained while your account is active; deleted within 30 days of account deletion request.',
              'Profile and content data (CVs, letters, chat history): deleted on account deletion or earlier on request.',
              'Payment and invoice records: retained for 10 years as required by Swiss/EU/German tax and accounting law (e.g. § 257 HGB, § 147 AO).',
              'Server access logs (IP, user agent): 14 days for security; longer only if needed to investigate a specific incident.',
              'Analytics data: anonymised or deleted after 14 months.',
              'Newsletter subscribers: until you unsubscribe or request deletion.',
              'Backup data: rotated and overwritten within 30 days of original deletion.',
            ]} />
          </Section>

          <Section title="11. Cookies & Tracking">
            <P>We use the following cookie categories. You can review and change your choices at any time via the cookie banner (“Cookie preferences” link in the footer):</P>
            <UL items={[
              'Strictly necessary cookies: required for login, session management, CSRF protection, and to remember your cookie choices. No consent needed (Art. 6(1)(f) GDPR / § 25(2) TTDSG).',
              'Preference cookies: remember UI settings such as language. Consent-based.',
              'Analytics cookies (e.g. Vercel Analytics, Google Analytics with IP anonymisation): help us understand usage. Consent-based and only loaded after you accept them.',
            ]} />
            <P>For a detailed list of cookies, lifetimes, and providers, see our <Link href="/cookie-policy" style={{ color: '#dd0000' }}>Cookie Policy</Link>.</P>
          </Section>

          <Section title="12. Security Measures (Art. 32 GDPR)">
            <P>We implement appropriate technical and organisational measures to protect your personal data against accidental or unlawful destruction, loss, alteration, unauthorised disclosure or access. These include:</P>
            <UL items={[
              'Encryption in transit (HTTPS/TLS 1.2+) and encryption at rest for our database.',
              'Passwords stored using strong, salted hashing (bcrypt).',
              'Role-based access control and the principle of least privilege for staff and contractors.',
              'Regular security updates of dependencies and infrastructure.',
              'Secure secret management (no credentials in source code).',
              'Audit logging for sensitive administrative actions.',
              'Vendor due diligence and DPAs with all processors.',
            ]} />
          </Section>

          <Section title="13. Data Breach Notification (Art. 33–34 GDPR)">
            <P>
              In the event of a personal data breach that is likely to result in a risk to your rights and freedoms, we will notify the competent supervisory authority within 72 hours of becoming aware of it. If the breach is likely to result in a high risk, we will also inform affected users without undue delay, by email or a prominent notice on the Service.
            </P>
          </Section>

          <Section title="14. Your Rights (GDPR)">
            <P>Under GDPR (Articles 15–22) and the Swiss FADP, you have the right to:</P>
            <UL items={[
              'Access — request confirmation of whether we process your data and a copy of it (Art. 15).',
              'Rectification — correct inaccurate or incomplete data (Art. 16).',
              'Erasure (“right to be forgotten”) — delete your account and personal data (Art. 17).',
              'Restriction — limit how we process your data (Art. 18).',
              'Data portability — receive your data in a structured, commonly used, machine-readable format (Art. 20).',
              'Object — opt out of processing based on legitimate interests, including profiling (Art. 21).',
              'Withdraw consent — at any time, without affecting the lawfulness of prior processing (Art. 7(3)).',
              'Not to be subject to automated decisions producing legal or similarly significant effects (Art. 22).',
              'Lodge a complaint with a supervisory authority — either where you live, where you work, or where the alleged infringement occurred.',
            ]} />
            <P>
              To exercise your rights, email <a href="mailto:privacy@germanpath.com" style={{ color: '#dd0000' }}>privacy@germanpath.com</a>. We respond within 30 days (extendable by 60 further days for complex requests). We may need to verify your identity before responding.
            </P>
          </Section>

          <Section title="15. Supervisory Authorities">
            <P>You can contact your national or regional supervisory authority. Examples:</P>
            <UL items={[
              'Germany (Federal): Bundesbeauftragte für den Datenschutz und die Informationsfreiheit (BfDI) — www.bfdi.bund.de',
              'Germany (state): your state Landesbeauftragte—see www.bfdi.bund.de/links',
              'Austria: Datenschutzbehörde — www.dsb.gv.at',
              'Ireland: Data Protection Commission — www.dataprotection.ie',
              'Switzerland: Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter (EDSÖB / FDPIC) — www.edoeb.admin.ch',
            ]} />
          </Section>

          <Section title="16. Account & Data Deletion">
            <P>You can delete your account at any time from your Profile settings page. All personal data will be permanently removed within 30 days, except data we are required to retain by law (e.g. billing records, see Section 10).</P>
          </Section>

          <Section title="17. Children">
            <P>Our Service is not directed to children under 16. We do not knowingly collect personal data from minors. If you believe a child has provided us data, please contact us and we will delete it without undue delay.</P>
          </Section>

          <Section title="18. Changes to This Policy">
            <P>We may update this Privacy Policy. Material changes will be notified via email and/or a prominent notice on the site at least 14 days before they take effect. The “Last updated” date at the top reflects the latest revision. Continued use after the effective date constitutes acceptance.</P>
          </Section>

          <Section title="19. Contact">
            <P>
              <strong>Smarvia Studio</strong><br />
              Schoeneggstrasse 45, 8953 Dietikon, Switzerland<br />
              Privacy: <a href="mailto:privacy@germanpath.com" style={{ color: '#dd0000' }}>privacy@germanpath.com</a><br />
              General: <a href="mailto:smarviastudio@gmail.com" style={{ color: '#dd0000' }}>smarviastudio@gmail.com</a>
            </P>
          </Section>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #e5e7eb', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Link href="/impressum" style={{ fontSize: 13, fontWeight: 600, color: '#dd0000', textDecoration: 'none' }}>Impressum →</Link>
            <Link href="/terms" style={{ fontSize: 13, fontWeight: 600, color: '#dd0000', textDecoration: 'none' }}>Terms of Service →</Link>
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
