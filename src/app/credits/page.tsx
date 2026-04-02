'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import { Zap, Check, Loader2, ArrowRight, Sparkles, Crown } from 'lucide-react';

type CreditBundle = {
  key: string;
  credits: number;
  price: string;
  priceValue: number;
  popular?: boolean;
};

const bundles: CreditBundle[] = [
  { key: 'credits_50', credits: 50, price: '€5.00', priceValue: 5 },
  { key: 'credits_200', credits: 200, price: '€15.00', priceValue: 15, popular: true },
];

export default function CreditsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [balance, setBalance] = useState<number | null>(null);
  const [hasUnlimited, setHasUnlimited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [accountMissing, setAccountMissing] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin?callbackUrl=/credits');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    const loadBalance = async () => {
      try {
        const res = await fetch('/api/credits/balance');
        if (res.status === 401 || res.status === 404) {
          setAccountMissing(true);
          router.replace('/auth/signin?callbackUrl=/credits');
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setBalance(data.credits);
          setHasUnlimited(data.hasUnlimited);
        }
      } catch (err) {
        console.error('Failed to load balance:', err);
      } finally {
        setLoading(false);
      }
    };
    loadBalance();
  }, [status]);

  const handlePurchase = async (bundleKey: string) => {
    setPurchasing(bundleKey);
    try {
      const res = await fetch('/api/credits/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bundleKey }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to start checkout');
    } finally {
      setPurchasing(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#dd0000' }} />
      </div>
    );
  }

  if (accountMissing) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: 520, width: '100%', background: '#fff', borderRadius: 24, border: '1px solid #e5e7eb', padding: 32, textAlign: 'center', boxShadow: '0 12px 30px rgba(15,23,42,0.06)' }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Zap size={28} color="#dd0000" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0a0a0a', margin: '0 0 10px' }}>Sign in again</h1>
          <p style={{ fontSize: 16, color: '#737373', margin: '0 0 24px' }}>
            Your account record is missing. Sign in again to view your credits and purchases.
          </p>
          <div style={{ display: 'grid', gap: 12 }}>
            <Link href="/auth/signin?callbackUrl=/credits" style={{ display: 'inline-flex', justifyContent: 'center', padding: '14px 18px', borderRadius: 12, background: '#dd0000', color: '#fff', textDecoration: 'none', fontWeight: 700 }}>
              Sign in
            </Link>
            <Link href="/" style={{ display: 'inline-flex', justifyContent: 'center', padding: '14px 18px', borderRadius: 12, border: '1px solid #e5e7eb', color: '#111827', textDecoration: 'none', fontWeight: 700 }}>
              Go home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <SiteNav />
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '126px 24px 100px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #dd0000, #7c3aed)', borderRadius: 999, padding: '6px 16px', marginBottom: 20 }}>
            <Sparkles size={16} color="#fff" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>AI Credits</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#0a0a0a', margin: '0 0 16px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Buy AI Credits
          </h1>
          <p style={{ fontSize: 18, color: '#737373', maxWidth: 600, margin: '0 auto 24px' }}>
            Buy extra AI credits for your CV, motivation letter, and cover letter generations
          </p>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', border: '2px solid #dd0000', borderRadius: 16, padding: '14px 24px', boxShadow: '0 4px 20px rgba(221,0,0,0.1)' }}>
            {hasUnlimited ? <Crown size={20} color="#dd0000" /> : <Zap size={20} color="#dd0000" />}
            <span style={{ fontSize: 15, fontWeight: 700, color: '#0a0a0a' }}>
              Current Balance: <span style={{ color: '#dd0000' }}>{balance ?? 0} credits</span>
            </span>
          </div>
        </div>

        {/* Credit Bundles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 60 }}>
          {bundles.map((bundle) => (
            <div
              key={bundle.key}
              style={{
                background: '#fff',
                border: bundle.popular ? '2px solid #dd0000' : '1px solid #ebebeb',
                borderRadius: 24,
                padding: 32,
                position: 'relative',
                transition: 'all 0.2s',
                boxShadow: bundle.popular ? '0 8px 32px rgba(221,0,0,0.15)' : 'none',
              }}
            >
              {bundle.popular && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #dd0000, #7c3aed)', borderRadius: 999, padding: '6px 16px', boxShadow: '0 4px 12px rgba(221,0,0,0.3)' }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Most Popular</span>
                </div>
              )}
              
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, margin: '0 auto 16px', borderRadius: 20, background: 'linear-gradient(135deg, rgba(221,0,0,0.1), rgba(124,58,237,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={32} color="#dd0000" />
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: '#0a0a0a', margin: '0 0 8px' }}>{bundle.credits} Credits</h3>
                <div style={{ fontSize: 40, fontWeight: 900, color: '#dd0000', margin: '0 0 8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{bundle.price}</div>
                <p style={{ fontSize: 14, color: '#737373', margin: 0 }}>€{(bundle.priceValue / bundle.credits).toFixed(2)} per credit</p>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#404040' }}>
                  <Check size={18} color="#10b981" style={{ flexShrink: 0 }} />
                  <span>{bundle.credits} AI generations</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#404040' }}>
                  <Check size={18} color="#10b981" style={{ flexShrink: 0 }} />
                  <span>Never expires</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#404040' }}>
                  <Check size={18} color="#10b981" style={{ flexShrink: 0 }} />
                  <span>Use anytime</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#404040' }}>
                  <Check size={18} color="#10b981" style={{ flexShrink: 0 }} />
                  <span>All AI tools included</span>
                </li>
              </ul>

              <button
                onClick={() => handlePurchase(bundle.key)}
                disabled={purchasing === bundle.key}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#fff',
                  background: bundle.popular ? 'linear-gradient(135deg, #dd0000, #7c3aed)' : '#dd0000',
                  border: 'none',
                  cursor: purchasing === bundle.key ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 16px rgba(221,0,0,0.2)',
                }}
                onMouseEnter={(e) => {
                  if (purchasing !== bundle.key) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(221,0,0,0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(221,0,0,0.2)';
                }}
              >
                {purchasing === bundle.key ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Buy Now
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Subscription CTA */}
        <div style={{ background: 'linear-gradient(135deg, #1e0a3c, #2d1457)', borderRadius: 24, padding: '40px 32px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
          <Crown size={40} color="#fff" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>Want 20 Monthly AI Credits?</h3>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', margin: '0 0 24px', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            Upgrade to Pro for 20 monthly AI credits, all templates, and premium access to the document tools.
          </p>
          <Link
            href="/pricing"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 28px',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              color: '#1e0a3c',
              background: '#fff',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(255,255,255,0.2)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,255,255,0.2)';
            }}
          >
            View Subscription Plans
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    </div>
  );
}
