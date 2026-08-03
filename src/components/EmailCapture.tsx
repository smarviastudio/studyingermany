'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { CalendarDays, Loader2, Check } from 'lucide-react';
import { track } from '@/lib/track';

const RED = '#dd0000';

interface EmailCaptureProps {
  source?: string;
  heading?: string;
  blurb?: string;
}

export function EmailCapture({
  source = 'deadline_calendar',
  heading = 'Never miss a German application deadline',
  blurb = 'Get the intake calendar for winter and summer semesters — every major deadline, in one email. Free, no account needed.',
}: EmailCaptureProps) {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;

    setStatus('loading');
    setError(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, page: pathname }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setStatus('idle');
        return;
      }

      track('lead_captured', { source, page: pathname ?? '' });
      setStatus('done');
    } catch {
      setError('Something went wrong. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <section
      style={{
        maxWidth: 640,
        margin: '48px auto',
        padding: '28px 24px',
        borderRadius: 18,
        background: '#fff',
        border: '1px solid #ececf1',
        boxShadow: '0 10px 34px rgba(17,17,26,0.06)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          margin: '0 auto 14px',
          display: 'grid',
          placeItems: 'center',
          background: 'rgba(221,0,0,0.08)',
        }}
      >
        <CalendarDays size={22} color={RED} />
      </div>

      <h2 style={{ fontSize: 21, fontWeight: 800, color: '#111', margin: '0 0 8px' }}>{heading}</h2>

      {status === 'done' ? (
        <p
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 15,
            fontWeight: 600,
            color: '#047857',
            margin: 0,
          }}
        >
          <Check size={18} />
          You&apos;re on the list — check your inbox soon.
        </p>
      ) : (
        <>
          <p style={{ fontSize: 14.5, color: '#6b6b76', margin: '0 auto 18px', maxWidth: 440, lineHeight: 1.6 }}>
            {blurb}
          </p>

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <label htmlFor="email-capture" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
              Email address
            </label>
            <input
              id="email-capture"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                flex: '1 1 240px',
                minWidth: 0,
                padding: '12px 16px',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                fontSize: 14.5,
                color: '#1e293b',
                background: '#f8fafc',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 22px',
                borderRadius: 12,
                border: 'none',
                fontSize: 14.5,
                fontWeight: 700,
                color: '#fff',
                background: RED,
                cursor: status === 'loading' ? 'default' : 'pointer',
                opacity: status === 'loading' ? 0.75 : 1,
                fontFamily: 'inherit',
              }}
            >
              {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
              Send it to me
            </button>
          </form>

          {error && (
            <p style={{ fontSize: 13.5, color: RED, margin: '12px 0 0' }} role="alert">
              {error}
            </p>
          )}

          <p style={{ fontSize: 12.5, color: '#9b9ba6', margin: '14px 0 0' }}>
            No spam. Unsubscribe any time.
          </p>
        </>
      )}
    </section>
  );
}
