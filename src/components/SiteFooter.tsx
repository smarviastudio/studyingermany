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

          {/* Social */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Follow Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <a
                href="https://www.facebook.com/studyingermay1"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 13, color: '#71717a', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
            </div>
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
