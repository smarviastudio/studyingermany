import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Withdrawal Form (Widerrufsformular)',
  description: 'EU consumer model withdrawal form for digital services purchased on germanpath.com (Annex I(B) of Directive 2011/83/EU).',
  robots: { index: true, follow: true },
};

export default function WithdrawalFormPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <SiteNav />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '122px 24px 80px' }}>
        <div style={{ background: '#fff', borderRadius: 24, padding: '48px 48px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' }}>

          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#dd0000', marginBottom: 8 }}>Legal</p>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#111', margin: '0 0 8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Withdrawal Form</h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 32 }}>Model withdrawal form &mdash; Annex I(B) of Directive 2011/83/EU / Anlage 2 zu Art. 246a &sect; 1 EGBGB</p>

          <Section title="Right of withdrawal">
            <P>
              You have the right to withdraw from your contract with Smarvia Studio within 14 days without giving any reason. The withdrawal period expires 14 days after the day of conclusion of the contract.
            </P>
            <P>
              <strong>Important note for digital services:</strong> Where you have expressly consented at checkout to the immediate performance of the contract and acknowledged that you thereby lose your right of withdrawal, the right of withdrawal expires once we have begun providing the service to you (Art. 16(m) Directive 2011/83/EU; &sect; 356 (5) BGB). If you have not yet used any premium feature, you may still withdraw within 14 days.
            </P>
            <P>
              To exercise the right of withdrawal you must inform us (Smarvia Studio, Schoeneggstrasse 45, 8953 Dietikon, Switzerland; email: <a href="mailto:billing@germanpath.com" style={{ color: '#dd0000' }}>billing@germanpath.com</a>) of your decision to withdraw from the contract by an unequivocal statement (e.g. a letter sent by post or email). You may use the model withdrawal form below, but it is not obligatory.
            </P>
            <P>
              To meet the withdrawal deadline, it is sufficient for you to send your communication concerning the exercise of the right of withdrawal before the withdrawal period has expired.
            </P>
          </Section>

          <Section title="Effects of withdrawal">
            <P>
              If you withdraw from this contract, we shall reimburse all payments received from you, without undue delay and in any event no later than 14 days from the day on which we are informed about your decision to withdraw. We will use the same means of payment you used for the original transaction, unless you have expressly agreed otherwise; in any event, you will not incur any fees as a result of such reimbursement.
            </P>
          </Section>

          <Section title="Model withdrawal form">
            <P>(Complete and return this form only if you wish to withdraw from the contract.)</P>
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, fontSize: 14, color: '#374151', lineHeight: 1.8 }}>
              <p style={{ margin: '0 0 12px' }}>To:<br />
                Smarvia Studio<br />
                Schoeneggstrasse 45<br />
                8953 Dietikon<br />
                Switzerland<br />
                Email: <a href="mailto:billing@germanpath.com" style={{ color: '#dd0000' }}>billing@germanpath.com</a>
              </p>

              <p style={{ margin: '0 0 12px' }}>I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract for the provision of the following service:</p>
              <p style={{ margin: '0 0 12px' }}>____________________________________________</p>

              <p style={{ margin: '0 0 12px' }}>Ordered on (*) / received on (*): ________________</p>

              <p style={{ margin: '0 0 12px' }}>Name of consumer(s): ________________</p>

              <p style={{ margin: '0 0 12px' }}>Address of consumer(s): ________________</p>

              <p style={{ margin: '0 0 12px' }}>Signature of consumer(s) (only if this form is notified on paper): ________________</p>

              <p style={{ margin: '0 0 12px' }}>Date: ________________</p>

              <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>(*) Delete as appropriate.</p>
            </div>
          </Section>

          <Section title="Quick way to withdraw by email">
            <P>You can simply copy the text below into an email and send it to <a href="mailto:billing@germanpath.com" style={{ color: '#dd0000' }}>billing@germanpath.com</a>:</P>
            <pre style={{ background: '#0f172a', color: '#e2e8f0', borderRadius: 12, padding: 20, fontSize: 13, lineHeight: 1.7, overflowX: 'auto' }}>
{`Subject: Withdrawal from contract

To Smarvia Studio,

I hereby give notice that I withdraw from my contract for the
following service: GermanPath subscription (plan: ____, ordered on: ____).

Account email: ________________
Name: ________________
Date: ________________`}
            </pre>
          </Section>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #e5e7eb', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Link href="/terms" style={{ fontSize: 13, fontWeight: 600, color: '#dd0000', textDecoration: 'none' }}>Terms of Service &rarr;</Link>
            <Link href="/privacy-policy" style={{ fontSize: 13, fontWeight: 600, color: '#dd0000', textDecoration: 'none' }}>Privacy Policy &rarr;</Link>
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

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75, margin: '0 0 10px' }}>{children}</p>;
}
