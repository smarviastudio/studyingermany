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
    <footer style={{ background: '#0a0a0a', color: '#a1a1aa' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '48px 24px 24px' }}>
        {/* Main footer content */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 40, marginBottom: 32 }}>
          {/* Brand */}
          <div style={{ maxWidth: 280 }}>
            <Image src="/logo_wp.png" alt="GermanPath" width={130} height={40} style={{ objectFit: 'contain', marginBottom: 12 }} />
            <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.6, margin: 0 }}>
              Your AI-powered guide to studying in Germany.
            </p>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: '#e4e4e7', marginBottom: 12 }}>Tools</h4>
              <FooterLinks links={[
                { href: '/cv-maker', label: 'CV Maker' },
                { href: '/cover-letter', label: 'Cover Letter' },
                { href: '/motivation-letter', label: 'Motivation Letter' },
              ]} />
            </div>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: '#e4e4e7', marginBottom: 12 }}>Resources</h4>
              <FooterLinks links={[
                { href: '/#hero', label: 'Course Finder' },
                { href: '/blog', label: 'Blog' },
                { href: '/pricing', label: 'Pricing' },
              ]} />
            </div>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: '#e4e4e7', marginBottom: 12 }}>Legal</h4>
              <FooterLinks links={[
                { href: '/impressum', label: 'Impressum' },
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms' },
              ]} />
              <button
                onClick={handleCookiePreferences}
                style={{ display: 'block', fontSize: 13, color: '#71717a', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 8 }}
              >
                Cookies
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #27272a', paddingTop: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <p style={{ fontSize: 12, color: '#52525b', margin: 0 }}>
            © {new Date().getFullYear()} GermanPath UG (haftungsbeschränkt)
          </p>
          <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#52525b' }}>
            <span>🇪🇺 EU Hosted</span>
            <span>🔒 GDPR Compliant</span>
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
