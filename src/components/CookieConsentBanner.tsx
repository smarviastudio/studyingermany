'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X, ChevronDown, ChevronUp, Check, Shield } from 'lucide-react';

type ConsentState = {
  essential: true;
  analytics: boolean;
  preferences: boolean;
};

const CONSENT_KEY = 'gp_cookie_consent';

function loadConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveConsent(state: ConsentState) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [preferences, setPreferences] = useState(false);

  useEffect(() => {
    const existing = loadConsent();
    if (!existing) {
      setVisible(true);
    }
  }, []);

  const acceptAll = () => {
    const state: ConsentState = { essential: true, analytics: true, preferences: true };
    saveConsent(state);
    setVisible(false);
    window.dispatchEvent(new CustomEvent('cookieConsent', { detail: state }));
  };

  const acceptSelected = () => {
    const state: ConsentState = { essential: true, analytics, preferences };
    saveConsent(state);
    setVisible(false);
    window.dispatchEvent(new CustomEvent('cookieConsent', { detail: state }));
  };

  const rejectAll = () => {
    const state: ConsentState = { essential: true, analytics: false, preferences: false };
    saveConsent(state);
    setVisible(false);
    window.dispatchEvent(new CustomEvent('cookieConsent', { detail: state }));
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      padding: '0 16px 16px',
      animation: 'slideUpCookie 0.35s ease',
    }}>
      <style>{`
        @keyframes slideUpCookie {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        border: '1px solid #e5e7eb',
        maxWidth: 620,
        margin: '0 auto',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#dd0000,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Cookie size={20} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>We use cookies</h3>
            <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
              We use essential cookies to make our site work, and optional analytics cookies to improve your experience.
              See our{' '}
              <Link href="/privacy-policy" style={{ color: '#dd0000', fontWeight: 600 }}>Privacy Policy</Link>.
            </p>
          </div>
          <button
            onClick={rejectAll}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, flexShrink: 0 }}
            aria-label="Reject all and close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Expandable settings */}
        {expanded && (
          <div style={{ padding: '16px 24px 0' }}>
            <CategoryRow
              label="Essential cookies"
              description="Required for login, session management and security. Cannot be disabled."
              checked={true}
              disabled={true}
              onChange={() => {}}
            />
            <CategoryRow
              label="Analytics cookies"
              description="Help us understand how visitors use the site (e.g. Google Analytics). Data is anonymised."
              checked={analytics}
              disabled={false}
              onChange={setAnalytics}
            />
            <CategoryRow
              label="Preference cookies"
              description="Remember your settings and choices across visits."
              checked={preferences}
              disabled={false}
              onChange={setPreferences}
            />
          </div>
        )}

        {/* Actions */}
        <div style={{ padding: '16px 24px 20px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={acceptAll}
            style={{ flex: '1 1 auto', padding: '10px 16px', borderRadius: 10, background: 'linear-gradient(135deg,#dd0000,#7c3aed)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
          >
            Accept all
          </button>
          {expanded ? (
            <button
              onClick={acceptSelected}
              style={{ flex: '1 1 auto', padding: '10px 16px', borderRadius: 10, background: '#f3f4f6', color: '#111', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
            >
              Save choices
            </button>
          ) : (
            <button
              onClick={rejectAll}
              style={{ flex: '1 1 auto', padding: '10px 16px', borderRadius: 10, background: '#f3f4f6', color: '#111', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
            >
              Reject optional
            </button>
          )}
          <button
            onClick={() => setExpanded(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#6b7280', cursor: 'pointer' }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Less' : 'Manage'}
          </button>
        </div>

        <div style={{ padding: '0 24px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Shield size={11} color="#9ca3af" />
          <span style={{ fontSize: 11, color: '#9ca3af' }}>We never sell your data · GDPR compliant</span>
        </div>
      </div>
    </div>
  );
}

function CategoryRow({
  label, description, checked, disabled, onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        style={{
          width: 36,
          height: 20,
          borderRadius: 999,
          background: checked ? '#dd0000' : '#e5e7eb',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          position: 'relative',
          transition: 'background 0.2s',
          flexShrink: 0,
          marginTop: 2,
        }}
        aria-label={`Toggle ${label}`}
      >
        <span style={{
          display: 'block',
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: '#fff',
          position: 'absolute',
          top: 3,
          left: checked ? 19 : 3,
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: '0 0 2px', display: 'flex', alignItems: 'center', gap: 6 }}>
          {label}
          {disabled && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#f3f4f6', color: '#6b7280' }}>Always on</span>}
        </p>
        <p style={{ fontSize: 12, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>{description}</p>
      </div>
      {checked && !disabled && <Check size={14} color="#22c55e" style={{ marginTop: 3, flexShrink: 0 }} />}
    </div>
  );
}
