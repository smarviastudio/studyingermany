'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Globe } from 'lucide-react';

export function SiteFooter() {
  const handleCookiePreferences = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gp_cookie_consent');
      window.location.reload();
    }
  };

  return (
    <footer style={{ background: 'linear-gradient(to bottom, #0a0a0a, #000)', color: '#a1a1aa', borderTop: '1px solid #1a1a1a' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 24px' }}>
        {/* Main footer content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div style={{ maxWidth: 320 }}>
            <Image src="/logo_wp.png" alt="GermanPath" width={140} height={42} style={{ objectFit: 'contain', marginBottom: 16 }} />
            <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.7, margin: '0 0 20px' }}>
              Your AI-powered guide to studying in Germany. Search 20,000+ programs, build your CV, and get step-by-step guidance.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: '#71717a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={14} />
                <span>smarviastudio@gmail.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={14} />
                <span>Berlin, Germany</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Globe size={14} />
                <span>germanpath.com</span>
              </div>
            </div>
          </div>

          {/* AI Tools */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 16, letterSpacing: '-0.01em' }}>AI Tools</h4>
            <FooterLinks links={[
              { href: '/cv-maker', label: 'CV Maker' },
              { href: '/cover-letter', label: 'Cover Letter Generator' },
              { href: '/motivation-letter', label: 'Motivation Letter' },
              { href: '/#hero', label: 'Course Finder' },
            ]} />
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 16, letterSpacing: '-0.01em' }}>Resources</h4>
            <FooterLinks links={[
              { href: '/blog', label: 'Study Guides' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/dashboard', label: 'Dashboard' },
              { href: '/my-shortlist', label: 'My Shortlist' },
            ]} />
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 16, letterSpacing: '-0.01em' }}>Company</h4>
            <FooterLinks links={[
              { href: '/impressum', label: 'Impressum' },
              { href: '/privacy-policy', label: 'Privacy Policy' },
              { href: '/terms', label: 'Terms of Service' },
            ]} />
            <button
              onClick={handleCookiePreferences}
              style={{ display: 'block', fontSize: 13, color: '#71717a', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}
            >
              Cookie Preferences
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 24, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <p style={{ fontSize: 13, color: '#52525b', margin: 0 }}>
            © {new Date().getFullYear()} GermanPath UG (haftungsbeschränkt). All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#52525b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>🇪🇺</span>
              <span>EU Hosted</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>🔒</span>
              <span>GDPR Compliant</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>⚡</span>
              <span>AI Powered</span>
            </div>
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
