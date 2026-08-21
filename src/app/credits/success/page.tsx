'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import { CheckCircle, Loader2, ArrowRight, Zap } from 'lucide-react';
import { trackPurchase } from '@/lib/track';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [balance, setBalance] = useState<number | null>(null);
  const [granted, setGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      router.replace('/credits');
      return;
    }

    // Look up what was actually paid so the GA4 purchase event carries revenue.
    // GA4 dedupes on transaction_id, so a refresh cannot double-count.
    const reportPurchase = async () => {
      try {
        const res = await fetch(
          `/api/stripe/session-summary?session_id=${encodeURIComponent(sessionId)}`
        );
        const data = res.ok ? await res.json() : null;
        trackPurchase(sessionId, data?.paid ? data.value : undefined);
      } catch {
        trackPurchase(sessionId);
      }
    };
    reportPurchase();

    let cancelled = false;
    const confirmPurchase = async () => {
      for (let attempt = 0; attempt < 10 && !cancelled; attempt += 1) {
        try {
          const statusRes = await fetch(
            `/api/credits/checkout-status?session_id=${encodeURIComponent(sessionId)}`
          );
          const status = statusRes.ok ? await statusRes.json() : null;
          if (status?.granted) {
            const balanceRes = await fetch('/api/credits/balance');
            if (!cancelled && balanceRes.ok) {
              const data = await balanceRes.json();
              setBalance(data.credits);
              setGranted(true);
            }
            break;
          }
        } catch (err) {
          console.error('Failed to confirm purchase:', err);
        }
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      if (!cancelled) setLoading(false);
    };

    confirmPurchase();
    return () => { cancelled = true; };
  }, [sessionId, router]);

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '166px 24px', textAlign: 'center' }}>
      {loading ? (
        <>
          <Loader2 className="w-16 h-16 animate-spin" style={{ color: '#dd0000', margin: '0 auto 24px' }} />
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0a0a0a', margin: '0 0 12px' }}>Processing your purchase...</h1>
          <p style={{ fontSize: 16, color: '#737373' }}>Please wait while we add credits to your account.</p>
        </>
      ) : granted ? (
        <>
          <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 24px' }} />
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0a0a0a', margin: '0 0 16px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Purchase Successful!
          </h1>
          <p style={{ fontSize: 18, color: '#737373', margin: '0 0 32px' }}>
            Your AI credits have been added to your account.
          </p>

          {balance !== null && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', border: '2px solid #dd0000', borderRadius: 16, padding: '16px 28px', marginBottom: 40, boxShadow: '0 4px 20px rgba(221,0,0,0.1)' }}>
              <Zap size={24} color="#dd0000" />
              <span style={{ fontSize: 18, fontWeight: 700, color: '#0a0a0a' }}>
                New Balance: <span style={{ color: '#dd0000' }}>{balance} credits</span>
              </span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <Link
              href="/cv-maker"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                color: '#fff',
                background: 'linear-gradient(135deg, #dd0000, #7c3aed)',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(221,0,0,0.2)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(221,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(221,0,0,0.2)';
              }}
            >
              Start Creating
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/dashboard"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#737373',
                textDecoration: 'none',
              }}
            >
              Go to Dashboard
            </Link>
          </div>
        </>
      ) : (
        <>
          <Loader2 className="w-16 h-16 animate-spin" style={{ color: '#dd0000', margin: '0 auto 24px' }} />
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0a0a0a', margin: '0 0 12px' }}>Confirming your purchase...</h1>
          <p style={{ fontSize: 16, color: '#737373' }}>Your payment was received. Credits will appear shortly.</p>
        </>
      )}
    </main>
  );
}

export default function CreditsSuccessPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <SiteNav />
      <Suspense fallback={
        <main style={{ maxWidth: 600, margin: '0 auto', padding: '166px 24px', textAlign: 'center' }}>
          <Loader2 className="w-16 h-16 animate-spin" style={{ color: '#dd0000', margin: '0 auto 24px' }} />
        </main>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
