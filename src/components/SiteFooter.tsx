'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Shield, Mail, ExternalLink } from 'lucide-react';
import { CookieConsentBanner } from './CookieConsentBanner';

export function SiteFooter() {
  const [cookiePanelOpen, setCookiePanelOpen] = useState(false);

  const handleCookiePreferences = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gp_cookie_consent');
      setCookiePanelOpen(false);
      window.location.reload();
    }
  };

  return (
    <footer style={{ background: '#111', color: '#d1d5db', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '56px 24px 32px' }}>

        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px 32px', marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <Image src="/logo_wp.png" alt="StudyGermany" width={130} height={40} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: 14 }} />
            <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.7, margin: '0 0 16px' }}>
              AI-powered tools for international students planning to study in Germany.
            </p>
            <a href="mailto:hello@germanpath.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#dd0000', textDecoration: 'none', fontWeight: 600 }}>
              <Mail size={13} /> hello@germanpath.com
            </a>
          </div>

          {/* Tools */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 14 }}>Tools</h4>
            <FooterLinks links={[
              { href: '/cv-maker', label: 'CV Maker' },
              { href: '/cover-letter', label: 'Cover Letter' },
              { href: '/motivation-letter', label: 'Motivation Letter' },
              { href: '/netto-brutto-calculator', label: 'Netto–Brutto Calculator' },
              { href: '/gpa-converter', label: 'GPA Converter' },
            ]} />
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 14 }}>Resources</h4>
            <FooterLinks links={[
              { href: '/#hero', label: 'Course Finder' },
              { href: '/#guides', label: 'Study Guides' },
              { href: '/blog', label: 'Blog' },
              { href: '/pricing', label: 'Pricing' },
            ]} />
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 14 }}>Legal</h4>
            <FooterLinks links={[
              { href: '/impressum', label: 'Impressum' },
              { href: '/privacy-policy', label: 'Privacy Policy' },
              { href: '/terms', label: 'Terms of Service' },
            ]} />
            <button
              onClick={handleCookiePreferences}
              style={{ display: 'block', fontSize: 13, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 6, fontWeight: 500, textAlign: 'left' }}
            >
              Cookie Preferences
            </button>
          </div>
        </div>

        {/* GDPR trust bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 24, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            <TrustBadge text="GDPR Compliant" />
            <TrustBadge text="No data selling" />
            <TrustBadge text="EU hosted" />
            <TrustBadge text="Secure via Stripe" />
          </div>
          <p style={{ fontSize: 12, color: '#4b5563', margin: 0 }}>
            © {new Date().getFullYear()} GermanPath UG (haftungsbeschränkt). All rights reserved.
          </p>
        </div>

        {/* ODR notice */}
        <p style={{ fontSize: 11, color: '#374151', marginTop: 16, lineHeight: 1.6 }}>
          EU Online Dispute Resolution:{' '}
          <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" style={{ color: '#4b5563', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            ec.europa.eu/consumers/odr <ExternalLink size={10} />
          </a>
          {' '}— We are not obligated to participate in consumer arbitration but are willing to do so.
        </p>
      </div>
    </footer>
  );
}

function FooterLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 500 }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}

function TrustBadge({ text }: { text: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6b7280', fontWeight: 500 }}>
      <Shield size={12} color="#4b5563" /> {text}
    </span>
  );
}
