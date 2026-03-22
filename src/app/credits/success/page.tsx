'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import { CheckCircle, Loader2, ArrowRight, Zap } from 'lucide-react';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      router.replace('/credits');
      return;
    }

    const loadBalance = async () => {
      try {
        const res = await fetch('/api/credits/balance');
        if (res.ok) {
          const data = await res.json();
          setBalance(data.credits);
        }
      } catch (err) {
        console.error('Failed to load balance:', err);
      } finally {
        setLoading(false);
      }
    };

    // Wait a bit for webhook to process
    const timer = setTimeout(loadBalance, 2000);
    return () => clearTimeout(timer);
  }, [sessionId, router]);

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '166px 24px', textAlign: 'center' }}>
      {loading ? (
        <>
          <Loader2 className="w-16 h-16 animate-spin" style={{ color: '#dd0000', margin: '0 auto 24px' }} />
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0a0a0a', margin: '0 0 12px' }}>Processing your purchase...</h1>
          <p style={{ fontSize: 16, color: '#737373' }}>Please wait while we add credits to your account.</p>
        </>
      ) : (
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
