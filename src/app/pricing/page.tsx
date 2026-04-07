'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, Shield, RefreshCw, Globe, MessageCircle, ChevronDown, ChevronUp, Loader2, AlertCircle } from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';

const RED = '#dd0000';

// Price IDs configuration - automatically switches based on environment
const PRICE_IDS = {
  live: {
    pro_monthly: 'price_1T9WRxBhlRngoSRXX9UJTQPY',
    pro_yearly: 'price_1T9WSyBhlRngoSRXQPTRKZib',
    credits_20: 'price_1THMl6BhIRngoSRXMBbRuS2m',
    credits_100: 'price_1THMl6BhIRngoSRXEH2UHrYP',
    credits_300: 'price_1THMl6BhIRngoSRXrR48BBwX',
  },
  test: {
    pro_monthly: 'price_1THN89BhIRngoSRXlgKJkghi', // User created test price
    pro_yearly: 'price_1THN89BhIRngoSRXlgKJkghi', // Using monthly for now - create yearly in Stripe
    credits_20: 'price_1THNNCBhIRngoSRXEd8VpVkv',
    credits_100: 'price_1THNNCBhIRngoSRXR97jnrrf',
    credits_300: 'price_1THNNCBhIRngoSRXROohsxsl',
  },
};

export default function PricingPage() {
  const { status } = useSession();
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);

  // Check if we're in test mode
  useEffect(() => {
    fetch('/api/stripe/mode')
      .then(res => res.json())
      .then(data => setIsTestMode(data.testMode))
      .catch(() => setIsTestMode(false));
  }, []);

  // Get the correct price IDs based on mode
  const priceIds = isTestMode ? PRICE_IDS.test : PRICE_IDS.live;

  // Handle pending checkout after login
  useEffect(() => {
    if (status === 'authenticated') {
      const pending = sessionStorage.getItem('pendingCheckout');
      if (pending) {
        sessionStorage.removeItem('pendingCheckout');
        const { planKey, priceId, mode } = JSON.parse(pending);
        handleCheckout(planKey || priceId, mode);
      }
    }
  }, [status]);

  const handleCheckout = async (planKeyOrPriceId: string, mode: 'subscription' | 'payment') => {
    // Check if user is logged in
    if (status === 'unauthenticated') {
      // Store the intended purchase in sessionStorage
      sessionStorage.setItem(
        'pendingCheckout',
        JSON.stringify(
          mode === 'subscription'
            ? { planKey: planKeyOrPriceId, mode }
            : { priceId: planKeyOrPriceId, mode }
        )
      );
      // Redirect to login with callback to pricing page
      router.push('/auth/signin?callbackUrl=/pricing');
      return;
    }

    if (status === 'loading') {
      return; // Wait for session to load
    }

    console.log('handleCheckout called with:', { planKeyOrPriceId, mode });
    setLoading(planKeyOrPriceId);
    try {
      const payload =
        mode === 'subscription'
          ? { planKey: planKeyOrPriceId, mode }
          : { priceId: planKeyOrPriceId, mode };
      const body = JSON.stringify(payload);
      console.log('Sending body:', body);
      
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const data = await res.json();
      console.log('Response:', data);
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const FAQS = [
    {
      q: 'Can I switch plans anytime?',
      a: 'Yes, upgrade or downgrade at any time. Changes take effect immediately.',
    },
    {
      q: 'What payment methods are accepted?',
      a: 'Visa, Mastercard, PayPal, iDEAL, and more via Stripe.',
    },
    {
      q: 'What do I get on the free plan?',
      a: 'After signing in, Free users get 3 AI credits, can save programs to their shortlist, and can use the free templates and calculators.',
    },
    {
      q: 'What happens when I run out of AI credits?',
      a: 'You can buy credit packs anytime or upgrade to Pro for 20 monthly AI credits and all premium templates.',
    },
    {
      q: 'Do you offer refunds?',
      a: 'Yes, we offer a 7-day money-back guarantee if you\'re not satisfied.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <SiteNav />
      
      {/* Test Mode Indicator */}
      {isTestMode && (
        <div style={{ background: '#fbbf24', padding: '12px 24px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <AlertCircle size={18} color="#78350f" />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#78350f' }}>
            TEST MODE - Using Stripe test environment. Use test card: 4242 4242 4242 4242
          </span>
        </div>
      )}

      <main style={{ paddingTop: 80 }}>
        {/* HEADER */}
        <section style={{ textAlign: 'center', padding: '60px 24px 40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(221,0,0,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          
          <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: '#111', margin: '0 0 16px', lineHeight: 1.1 }}>
              Simple, Student-Friendly Pricing
            </h1>
            <p style={{ fontSize: 18, color: '#666', margin: '0 0 40px', lineHeight: 1.6 }}>
              Cancel anytime. No hidden fees. Built for international students.
            </p>

            {/* Toggle */}
            <div style={{ display: 'inline-flex', background: '#fff', border: '2px solid #e5e5e5', borderRadius: 50, padding: 4, gap: 4 }}>
              <button
                onClick={() => setBillingPeriod('monthly')}
                style={{
                  padding: '12px 32px',
                  borderRadius: 50,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 15,
                  fontWeight: 700,
                  background: billingPeriod === 'monthly' ? RED : 'transparent',
                  color: billingPeriod === 'monthly' ? '#fff' : '#666',
                  transition: 'all 0.2s',
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                style={{
                  padding: '12px 32px',
                  borderRadius: 50,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 15,
                  fontWeight: 700,
                  background: billingPeriod === 'yearly' ? RED : 'transparent',
                  color: billingPeriod === 'yearly' ? '#fff' : '#666',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                Yearly
                <span style={{ fontSize: 11, fontWeight: 800, background: '#22c55e', color: '#fff', borderRadius: 50, padding: '3px 8px' }}>
                  Save 33%
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* PRICING CARDS */}
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }}>
            
            {/* FREE */}
            <div style={{ background: '#fff', border: '1.5px solid #e5e5e5', borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', margin: '0 0 8px' }}>Free</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: 48, fontWeight: 900, color: '#111' }}>€0</span>
                </div>
                <p style={{ fontSize: 14, color: '#666', margin: 0 }}>Forever free</p>
              </div>

              <div style={{ flex: 1, marginBottom: 24 }}>
                {[
                  'Sign in to get 3 AI credits',
                  '2 CV templates',
                  'Save programs to your shortlist',
                  'GPA converter (free forever)',
                  'Salary calculator (free forever)',
                ].map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                    <Check size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: '#555', lineHeight: 1.5 }}>{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/auth/signin"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '14px',
                  borderRadius: 12,
                  border: '2px solid #e5e5e5',
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#333',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                Start Free
              </Link>
            </div>

            {/* PRO */}
            <div style={{ 
              background: '#fff', 
              border: `3px solid ${RED}`, 
              borderRadius: 20, 
              padding: 32, 
              display: 'flex', 
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(221,0,0,0.15)',
              transform: 'scale(1.05)',
            }}>
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: RED, borderRadius: 50, padding: '6px 20px' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Best Value</span>
              </div>

              <div style={{ marginBottom: 24, marginTop: 8 }}>
                <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: RED, margin: '0 0 8px' }}>Pro</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                { billingPeriod === 'monthly' && (
                  <>
                    <span style={{ fontSize: 48, fontWeight: 900, color: RED }}>
                      €9.99
                    </span>
                    <span style={{ fontSize: 16, color: '#888' }}>/month</span>
                  </>
                )}
                { billingPeriod === 'yearly' && (
                  <>
                    <span style={{ fontSize: 48, fontWeight: 900, color: RED }}>
                      €79.99
                    </span>
                    <span style={{ fontSize: 16, color: '#888' }}>/year</span>
                  </>
                )}
                </div>
                {billingPeriod === 'yearly' && (
                  <p style={{ fontSize: 13, color: '#22c55e', fontWeight: 600, margin: 0 }}>
                    Billed €79.99/year (same price as monthly - create yearly in Stripe)
                  </p>
                )}
              </div>

              <div style={{ flex: 1, marginBottom: 24 }}>
                {[
                  '20 AI credits every month',
                  'All 20+ CV templates',
                  'Premium access to CV, motivation letter, and cover letter tools',
                  'Save programs to your shortlist',
                  'Priority support',
                  'All free features included',
                ].map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                    <Check size={18} color={RED} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: '#333', lineHeight: 1.5 }}>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleCheckout(
                  billingPeriod === 'monthly' ? 'pro_monthly' : 'pro_yearly',
                  'subscription'
                )}
                disabled={loading !== null}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 12,
                  border: 'none',
                  background: loading ? '#ccc' : `linear-gradient(135deg, ${RED}, #b91c1c)`,
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.2s',
                }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                Get Pro
              </button>
            </div>
          </div>
        </section>

        {/* CREDIT PACKS */}
        <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#111', margin: '0 0 12px' }}>
              Need more AI credits? Top up anytime.
            </h2>
          <p style={{ fontSize: 16, color: '#666', margin: 0 }}>
              One-time purchases. Credits stack on top of your free or Pro monthly credits.
          </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }}>
            {[
              { credits: 20, price: 2.99, priceId: priceIds.credits_20, perCredit: 0.15, label: 'Best for trying' },
              { credits: 100, price: 9.99, priceId: priceIds.credits_100, perCredit: 0.10, label: 'Most popular', popular: true },
              { credits: 300, price: 24.99, priceId: priceIds.credits_300, perCredit: 0.08, label: 'Best value 🔥', badge: true },
            ].map((pack) => (
              <div
                key={pack.credits}
                style={{
                  background: '#fff',
                  border: pack.popular ? `2px solid ${RED}` : '1.5px solid #e5e5e5',
                  borderRadius: 20,
                  padding: 32,
                  position: 'relative',
                  boxShadow: pack.popular ? '0 12px 40px rgba(221,0,0,0.12)' : 'none',
                }}
              >
                {pack.badge && (
                  <div style={{ position: 'absolute', top: -12, right: 20, background: '#22c55e', borderRadius: 50, padding: '5px 14px' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{pack.label}</span>
                  </div>
                )}

                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <div style={{ fontSize: 40, fontWeight: 900, color: '#111', marginBottom: 8 }}>
                    {pack.credits} Credits
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: RED, marginBottom: 4 }}>
                    €{pack.price.toFixed(2)}
                  </div>
                  <p style={{ fontSize: 13, color: '#888', margin: 0 }}>
                    €{pack.perCredit.toFixed(2)}/credit
                  </p>
                  {!pack.badge && pack.label && (
                    <p style={{ fontSize: 12, color: '#666', margin: '8px 0 0', fontWeight: 600 }}>{pack.label}</p>
                  )}
                </div>

                <button
                  onClick={() => handleCheckout(pack.priceId || '', 'payment')}
                  disabled={loading !== null}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 12,
                    border: 'none',
                    background: loading ? '#ccc' : pack.popular ? RED : '#111',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {loading ? 'Processing...' : 'Buy Credits'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* TRUST BADGES */}
        <section style={{ maxWidth: 1000, margin: '0 auto 80px', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {[
              { icon: Shield, label: 'Secure Stripe Payments', color: '#22c55e' },
              { icon: RefreshCw, label: 'Cancel Anytime', color: '#3b82f6' },
              { icon: Globe, label: 'Available Worldwide', color: '#f59e0b' },
              { icon: MessageCircle, label: 'Student Support', color: RED },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={22} color={item.color} />
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#333' }}>{item.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 100px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 900, color: '#111', margin: '0 0 48px' }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: '#fff',
                  border: '1.5px solid #e5e5e5',
                  borderRadius: 16,
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp size={20} color={RED} style={{ flexShrink: 0 }} />
                  ) : (
                    <ChevronDown size={20} color="#999" style={{ flexShrink: 0 }} />
                  )}
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 24px 20px' }}>
                    <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
