'use client';

/**
 * A soft upsell shown at a *value moment* — the instant a free tool has just
 * produced the answer the visitor came for.
 *
 * This is deliberately not the same thing as `PaywallModal`. That one is a hard
 * gate: it only appears once a signed-in user has burned their credits, which
 * almost nobody on the free tools ever reaches. This one fires earlier, on the
 * pages that actually carry traffic (GPA converter, salary calculator), and it
 * never blocks anything — the result stays visible behind it and dismissing is
 * always the easiest action on screen.
 *
 * Frequency cap: once per `cooldownDays` per storage key, per browser. A repeat
 * visitor who already said no is not asked again on their next conversion.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { X, ArrowRight, Check } from 'lucide-react';
import { track } from '@/lib/track';

const STORAGE_PREFIX = 'gp_upsell_';

/** localStorage throws in some privacy modes — never let that break the page. */
function readDismissedAt(key: string): number | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? Number(raw) || null : null;
  } catch {
    return null;
  }
}

function writeDismissedAt(key: string) {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export interface ValueMomentUpsellProps {
  /** Flip to true the moment the free tool has produced its result. */
  trigger: boolean;
  /** Unique per placement — also the analytics label and the cooldown key. */
  storageKey: string;
  eyebrow: string;
  headline: string;
  /** One sentence connecting what they just got to what is being offered. */
  body: string;
  bullets: string[];
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  /** Small print under the buttons — price, "no account needed", etc. */
  footnote?: string;
  /** Delay before showing, so the result has a moment to land. Default 1600ms. */
  delayMs?: number;
  /** Days before this placement may ask again. Default 14. */
  cooldownDays?: number;
}

export function ValueMomentUpsell({
  trigger,
  storageKey,
  eyebrow,
  headline,
  body,
  bullets,
  primary,
  secondary,
  footnote,
  delayMs = 1600,
  cooldownDays = 14,
}: ValueMomentUpsellProps) {
  const [open, setOpen] = useState(false);
  const shownRef = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(
    (reason: 'dismiss' | 'primary' | 'secondary' | 'escape' | 'backdrop') => {
      setOpen(false);
      writeDismissedAt(storageKey);
      track('upsell_closed', { placement: storageKey, reason });
    },
    [storageKey],
  );

  useEffect(() => {
    if (!trigger || shownRef.current) return;

    const dismissedAt = readDismissedAt(storageKey);
    if (dismissedAt && Date.now() - dismissedAt < cooldownDays * 86_400_000) return;

    const timer = window.setTimeout(() => {
      shownRef.current = true;
      setOpen(true);
      track('upsell_shown', { placement: storageKey });
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [trigger, storageKey, delayMs, cooldownDays]);

  // Escape to close, and park focus on the close button so keyboard users are
  // never trapped behind the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close('escape');
    };
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) close('backdrop');
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 16,
        background: 'rgba(4, 12, 9, 0.6)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="gp-upsell-title"
        style={{
          width: '100%',
          maxWidth: 460,
          margin: 'auto',
          position: 'relative',
          borderRadius: 20,
          padding: '26px 24px 22px',
          background: 'linear-gradient(150deg, #064e3b, #065f46 60%, #047857)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
          color: '#fff',
        }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={() => close('dismiss')}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 32,
            height: 32,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(255,255,255,0.08)',
            color: '#d1fae5',
            cursor: 'pointer',
          }}
        >
          <X size={16} />
        </button>

        <p style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: '#6ee7b7', margin: '0 0 8px', fontWeight: 700 }}>
          {eyebrow}
        </p>
        <h2 id="gp-upsell-title" style={{ fontSize: 21, lineHeight: 1.25, fontWeight: 800, margin: '0 0 8px' }}>
          {headline}
        </h2>
        <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#a7f3d0', margin: '0 0 16px' }}>{body}</p>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'grid', gap: 8 }}>
          {bullets.map((bullet) => (
            <li key={bullet} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 13, color: '#ecfdf5' }}>
              <Check size={15} style={{ flexShrink: 0, marginTop: 2, color: '#6ee7b7' }} />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <Link
          href={primary.href}
          onClick={() => {
            track('upsell_primary_click', { placement: storageKey, href: primary.href });
            close('primary');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
            padding: '13px 18px',
            borderRadius: 12,
            background: '#fff',
            color: '#065f46',
            fontSize: 14.5,
            fontWeight: 800,
            textDecoration: 'none',
          }}
        >
          {primary.label} <ArrowRight size={16} />
        </Link>

        {secondary && (
          <Link
            href={secondary.href}
            onClick={() => {
              track('upsell_secondary_click', { placement: storageKey, href: secondary.href });
              close('secondary');
            }}
            style={{
              display: 'block',
              marginTop: 10,
              textAlign: 'center',
              padding: '11px 18px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.22)',
              background: 'rgba(255,255,255,0.07)',
              color: '#ecfdf5',
              fontSize: 13.5,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            {secondary.label}
          </Link>
        )}

        <button
          type="button"
          onClick={() => close('dismiss')}
          style={{
            display: 'block',
            width: '100%',
            marginTop: 12,
            padding: 4,
            border: 'none',
            background: 'none',
            color: '#6ee7b7',
            fontSize: 12.5,
            cursor: 'pointer',
          }}
        >
          No thanks — keep looking around
        </button>

        {footnote && (
          <p style={{ fontSize: 11.5, color: '#6ee7b7', textAlign: 'center', margin: '10px 0 0' }}>{footnote}</p>
        )}
      </div>
    </div>
  );
}
