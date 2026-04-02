'use client';

import Link from 'next/link';
import Image from 'next/image';

export function SiteFooter() {
  const handleCookiePreferences = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gp_cookie_consent');
      window.location.reload();
    }
  };

  return (
    <footer style={{ background: '#0a0a0a', borderTop: '1px solid #1f1f1f' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 24px' }}>
        {/* Main content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, marginBottom: 32 }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <Image src="/logo_wp.png" alt="GermanPath" width={120} height={36} style={{ objectFit: 'contain', marginBottom: 12 }} />
            <p style={{ fontSize: 13, color: '#737373', lineHeight: 1.6, margin: 0, maxWidth: 280 }}>
              AI-powered guide to studying in Germany. Search 20,000+ programs, build your CV, and get step-by-step guidance.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tools</h4>
            <FooterLinks links={[
              { href: '/cv-maker/landing', label: 'CV Maker' },
              { href: '/cover-letter/landing', label: 'Cover Letter' },
              { href: '/motivation-letter/landing', label: 'Motivation Letter' },
              { href: '/gpa-converter/landing', label: 'GPA Converter' },
              { href: '/netto-brutto-calculator/landing', label: 'Salary Calculator' },
            ]} />
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resources</h4>
            <FooterLinks links={[
              { href: '/', label: 'Home' },
              { href: '/blog', label: 'Guides' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/dashboard/landing', label: 'Dashboard' },
            ]} />
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legal</h4>
            <FooterLinks links={[
              { href: '/impressum', label: 'Impressum' },
              { href: '/privacy-policy', label: 'Privacy' },
              { href: '/terms', label: 'Terms' },
            ]} />
            <button
              onClick={handleCookiePreferences}
              style={{ display: 'block', fontSize: 13, color: '#737373', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 8, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#737373')}
            >
              Cookies
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid #1f1f1f', paddingTop: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <p style={{ fontSize: 12, color: '#525252', margin: 0 }}>
            © {new Date().getFullYear()} GermanPath UG. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#525252' }}>
            <span>🇪🇺 EU Hosted</span>
            <span>🔒 GDPR</span>
            <span>⚡ AI Powered</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          style={{ fontSize: 13, color: '#71717a', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
