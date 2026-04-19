'use client';

import { useEffect, useState } from 'react';
import { X, Sparkles, Gift } from 'lucide-react';

interface PromoPopupProps {
  /** Unique key for localStorage so each page variant can show once */
  storageKey?: string;
  /** Delay before showing (ms) */
  delayMs?: number;
  /** CTA href */
  ctaHref?: string;
}

const FEATURES = [
  'All 20+ premium CV templates unlocked',
  'AI cover & motivation letter generators',
  'Free during launch — no credit card, cancel never',
];

export function PromoPopup({
  storageKey = 'gp_promo_seen_v1',
  delayMs = 900,
  ctaHref = '/auth/signup',
}: PromoPopupProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let seen = false;
    try {
      seen = !!localStorage.getItem(storageKey);
    } catch {
      // localStorage may be unavailable (private mode); just skip
      return;
    }
    if (seen) return;
    const timer = window.setTimeout(() => setOpen(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [storageKey, delayMs]);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(storageKey, '1');
    } catch {
      /* ignore */
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Limited-time launch offer"
      onClick={close}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 10, 20, 0.62)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'promoFade 0.3s ease',
      }}
    >
      <style>{`
        @keyframes promoFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes promoSlide { from { opacity: 0; transform: translateY(24px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes promoShine { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 460,
          padding: '40px 32px 28px',
          background:
            'linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, #dd0000, #8b5cf6 55%, #10b981) border-box',
          border: '1.5px solid transparent',
          borderRadius: 24,
          boxShadow:
            '0 25px 80px rgba(139,92,246,0.35), 0 8px 24px rgba(221,0,0,0.15)',
          animation: 'promoSlide 0.4s cubic-bezier(0.22,1,0.36,1)',
          overflow: 'hidden',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {/* Close */}
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 32,
            height: 32,
            borderRadius: 999,
            border: '1px solid #eeeeee',
            background: '#ffffff',
            color: '#6b7280',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f3f4f6';
            e.currentTarget.style.color = '#111';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.color = '#6b7280';
          }}
        >
          <X size={16} />
        </button>

        {/* Soft gradient glow background */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: -60,
            left: -60,
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(221,0,0,0.12), transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: -80,
            right: -60,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.14), transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        {/* Icon */}
        <div
          style={{
            position: 'relative',
            width: 72,
            height: 72,
            borderRadius: 20,
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #dd0000 0%, #8b5cf6 100%)',
            boxShadow:
              '0 14px 32px rgba(139,92,246,0.40), inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
        >
          <Gift size={34} color="#ffffff" />
        </div>

        {/* Pill */}
        <div style={{ position: 'relative', textAlign: 'center', marginBottom: 14 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#ffffff',
              background:
                'linear-gradient(90deg, #dd0000, #8b5cf6, #10b981, #dd0000)',
              backgroundSize: '300% 100%',
              animation: 'promoShine 6s ease-in-out infinite',
            }}
          >
            <Sparkles size={12} /> Limited-time launch offer
          </span>
        </div>

        {/* Title */}
        <h2
          style={{
            position: 'relative',
            margin: '0 0 12px',
            fontSize: 26,
            fontWeight: 800,
            color: '#0a0a0a',
            textAlign: 'center',
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
            lineHeight: 1.2,
          }}
        >
          All Premium AI tools are{' '}
          <span
            style={{
              backgroundImage: 'linear-gradient(135deg, #dd0000, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            free
          </span>{' '}
          right now
        </h2>

        <p
          style={{
            position: 'relative',
            margin: '0 0 22px',
            fontSize: 14,
            lineHeight: 1.65,
            color: '#525252',
            textAlign: 'center',
          }}
        >
          CV Maker, Cover Letter, and Motivation Letter — including all premium
          templates — are unlocked for everyone who signs in. No credit card,
          no trial limit.
        </p>

        {/* Features */}
        <ul
          style={{
            position: 'relative',
            listStyle: 'none',
            padding: 0,
            margin: '0 0 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {FEATURES.map((item) => (
            <li
              key={item}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                fontSize: 14,
                color: '#111111',
              }}
            >
              <span
                aria-hidden
                style={{
                  display: 'inline-flex',
                  flexShrink: 0,
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  background: 'rgba(16,185,129,0.15)',
                  color: '#047857',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 1,
                  fontSize: 12,
                  fontWeight: 900,
                }}
              >
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <a
            href={ctaHref}
            onClick={close}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '14px 20px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #dd0000, #8b5cf6)',
              color: '#ffffff',
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 10px 24px rgba(139,92,246,0.35)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Sparkles size={16} /> Claim my free access
          </a>
          <button
            type="button"
            onClick={close}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#737373',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              padding: 8,
            }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
