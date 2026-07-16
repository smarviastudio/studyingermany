'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { track } from '@/lib/track';
import { Check, Shield, RefreshCw, Globe, MessageCircle, ChevronDown, Loader2, AlertCircle, Sparkles, Zap } from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';
import { CREDIT_PACKS, CREDIT_PACK_PRICE_IDS } from '@/lib/creditPacks';

const RED = '#dd0000';

// The live Stripe price IDs for the Pro subscription (STRIPE_PRICE_PRO_MONTHLY/
// YEARLY) don't exist on the current live account, so checkout fails. Hide the
// tier until real live prices are created and the Vercel env vars are updated.
const SHOW_PRO_SUBSCRIPTION = false;

// Subscription checkout sends planKey ('pro_monthly' | 'pro_yearly'); the
// create-checkout API resolves the Stripe price ID per environment.
// Credit-pack price IDs live in @/lib/creditPacks (shared with the checkout API
// and the paywall modal) so they can never drift out of sync again.
const PACK_BLURBS: Record<string, string> = {
  credits_20: 'Enough for a full application: CV + motivation letter + cover letter, with retries.',
  credits_100: 'Applying to 5–8 universities? Cover every program with tailored documents.',
  credits_300: 'For power users and late-deadline sprints. The cheapest per document.',
};

export default function PricingClient() {
  const { status } = useSession();
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
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
  const creditPackPriceIds = isTestMode ? CREDIT_PACK_PRICE_IDS.test : CREDIT_PACK_PRICE_IDS.live;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleCheckout = async (planKeyOrPriceId: string, mode: 'subscription' | 'payment') => {
    track('checkout_click', { plan: planKeyOrPriceId, mode, authed: status === 'authenticated' });
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

    setLoading(planKeyOrPriceId);
    try {
      const payload =
        mode === 'subscription'
          ? { planKey: planKeyOrPriceId, mode }
          : { priceId: planKeyOrPriceId, mode };

      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

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
      q: 'Do I have to subscribe?',
      a: 'No. Credit packs are one-time purchases — pay once, use your credits whenever you want, they never expire. The Pro subscription is optional for people who apply continuously and want monthly credits plus all premium templates.',
    },
    {
      q: 'What can I do for free, without paying at all?',
      a: 'Search all 20,000+ programs, convert your GPA, calculate your salary, read every guide, and preview 2 AI-generated documents — no account needed. A free account adds 3 more AI credits and lets you save and download.',
    },
    {
      q: 'What does 1 credit get me?',
      a: 'One credit = one AI generation: a CV draft, a motivation letter, or a cover letter. Most students use 3–6 credits per university application including revisions.',
    },
    {
      q: 'What payment methods are accepted?',
      a: 'Visa, Mastercard, PayPal, iDEAL, and more via Stripe. Payments are processed securely by Stripe — we never see your card details.',
    },
    {
      q: 'Do you offer refunds?',
      a: 'Yes, we offer a 7-day money-back guarantee if you\'re not satisfied.',
    },
  ];

  return (
    <div className="gp-root" style={{ minHeight: '100vh', background: '#fdfcfd' }}>
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

      <main>
        {/* HEADER */}
        <section className="gp-hero" style={{ padding: '72px 24px 36px' }}>
          <div className="gp-hero-bg">
            <div className="gp-hero-grid" />
            <div className="gp-orb gp-orb-1" />
          </div>
          <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
            <div className="gp-badge">
              <span className="gp-badge-flag"><i /><i /><i /></span>
              <span>Student-friendly pricing</span>
            </div>
            <h1 className="gp-h1" style={{ fontSize: 'clamp(34px, 4.5vw, 54px)' }}>
              Pay once.{' '}
              <span className="gp-h1-accent">Never subscribe.</span>
            </h1>
            <p className="gp-sub" style={{ margin: '0 auto 8px', maxWidth: 560 }}>
              A consultant charges <strong>€500–€3,000</strong> for what our AI does in 60 seconds.
              Buy credits once, use them whenever — they <strong>never expire</strong>.
            </p>
          </div>
        </section>

        {/* CREDIT PACKS — the main offer */}
        <section style={{ maxWidth: 1060, margin: '0 auto', padding: '24px 24px 40px' }}>
          <div className="gp-tools-grid" style={{ alignItems: 'stretch' }}>
            {CREDIT_PACKS.map((pack) => ({ ...pack, priceId: creditPackPriceIds[pack.key] })).map((pack) => (
              <div
                key={pack.credits}
                className="gp-tool"
                style={{
                  cursor: 'default',
                  ...(pack.popular ? { borderColor: 'rgba(221,0,0,0.45)', boxShadow: '0 18px 50px rgba(221,0,0,0.14)' } : {}),
                }}
              >
                {pack.popular && (
                  <span className="gp-tool-badge gp-tool-badge-ai"><Sparkles className="w-3 h-3" /> MOST POPULAR</span>
                )}
                {pack.badge && !pack.popular && (
                  <span className="gp-tool-badge gp-tool-badge-free">BEST VALUE</span>
                )}
                <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8d8a96', margin: '0 0 10px' }}>
                  {pack.credits} credits
                </p>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 42, fontWeight: 800, color: '#0e0c15', margin: '0 0 2px', letterSpacing: '-0.02em' }}>
                  €{pack.price.toFixed(2)}
                </p>
                <p style={{ fontSize: 13, color: '#8d8a96', margin: '0 0 16px', fontWeight: 600 }}>
                  €{pack.perCredit.toFixed(2)} per document · one-time
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: '#6b6b76', margin: '0 0 22px', flex: 1 }}>
                  {PACK_BLURBS[pack.key]}
                </p>
                <button
                  onClick={() => handleCheckout(pack.priceId || '', 'payment')}
                  disabled={loading !== null}
                  className={pack.popular ? 'gp-btn-primary' : 'gp-btn-dark'}
                  style={{ width: '100%', border: 'none', opacity: loading && loading !== pack.priceId ? 0.6 : 1 }}
                >
                  {loading === pack.priceId ? <Loader2 size={18} className="animate-spin" /> : <Zap size={16} />}
                  Buy {pack.credits} credits
                </button>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 13.5, color: '#8d8a96', margin: '22px 0 0', fontWeight: 600 }}>
            Credits never expire · No auto-renewal · 7-day money-back guarantee
          </p>
        </section>

        {/* FREE + PRO — secondary */}
        <section style={{ maxWidth: 1060, margin: '0 auto', padding: '48px 24px 72px' }}>
          <div className="gp-head" style={{ marginBottom: 36 }}>
            <span className="gp-eyebrow">Other options</span>
            <h2 className="gp-h2" style={{ fontSize: 'clamp(24px, 3vw, 34px)' }}>
              {SHOW_PRO_SUBSCRIPTION ? 'Start free — or go Pro if you apply a lot' : 'Not ready to buy? Start free'}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 22, maxWidth: 860, margin: '0 auto' }}>
            {/* FREE */}
            <div className="gp-tool" style={{ cursor: 'default' }}>
              <p style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8d8a96', margin: '0 0 8px' }}>Free</p>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 40, fontWeight: 800, color: '#0e0c15', margin: '0 0 16px' }}>€0</p>
              <div style={{ flex: 1, marginBottom: 22 }}>
                {[
                  '2 AI document previews — no account',
                  '3 AI credits with a free account',
                  'Unlimited program search',
                  'GPA converter & salary calculator',
                  'Application tracker & shortlist',
                ].map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 11 }}>
                    <Check size={17} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: '#55525e', lineHeight: 1.5 }}>{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/auth/signup" className="gp-btn-dark" style={{ width: '100%', background: '#f5f4f7', color: '#0e0c15' }}>
                Create free account
              </Link>
            </div>

            {/* PRO — hidden while live subscription prices are missing */}
            {SHOW_PRO_SUBSCRIPTION && (
            <div className="gp-tool gp-tool-ai" style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <p style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: RED, margin: 0 }}>Pro</p>
                <div style={{ display: 'inline-flex', background: '#f5f4f7', borderRadius: 999, padding: 3, gap: 2 }}>
                  <button
                    onClick={() => setBillingPeriod('monthly')}
                    style={{ padding: '5px 12px', borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, background: billingPeriod === 'monthly' ? '#fff' : 'transparent', color: billingPeriod === 'monthly' ? '#0e0c15' : '#8d8a96', boxShadow: billingPeriod === 'monthly' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none' }}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingPeriod('yearly')}
                    style={{ padding: '5px 12px', borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, background: billingPeriod === 'yearly' ? '#fff' : 'transparent', color: billingPeriod === 'yearly' ? '#0e0c15' : '#8d8a96', boxShadow: billingPeriod === 'yearly' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none' }}
                  >
                    Yearly −33%
                  </button>
                </div>
              </div>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 40, fontWeight: 800, color: '#0e0c15', margin: '0 0 2px' }}>
                {billingPeriod === 'monthly' ? '€9.99' : '€6.67'}
                <span style={{ fontSize: 15, fontWeight: 600, color: '#8d8a96' }}>/month</span>
              </p>
              <p style={{ fontSize: 12.5, color: '#8d8a96', margin: '0 0 16px', fontWeight: 600 }}>
                {billingPeriod === 'monthly' ? 'Billed monthly, cancel anytime' : '€79.99 billed yearly · cancel anytime'}
              </p>
              <div style={{ flex: 1, marginBottom: 22 }}>
                {[
                  '20 AI credits every month',
                  'All 20+ premium CV templates',
                  'Priority support',
                  'Everything in Free',
                ].map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 11 }}>
                    <Check size={17} color={RED} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: '#3c3945', lineHeight: 1.5 }}>{feature}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleCheckout(billingPeriod === 'monthly' ? 'pro_monthly' : 'pro_yearly', 'subscription')}
                disabled={loading !== null}
                className="gp-btn-primary"
                style={{ width: '100%', border: 'none' }}
              >
                {loading === 'pro_monthly' || loading === 'pro_yearly' ? <Loader2 size={18} className="animate-spin" /> : null}
                Get Pro
              </button>
            </div>
            )}
          </div>
        </section>

        {/* TRUST BADGES */}
        <section style={{ maxWidth: 1000, margin: '0 auto 72px', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 24 }}>
            {[
              { icon: Shield, label: 'Secure Stripe payments', color: '#22c55e' },
              { icon: RefreshCw, label: '7-day money-back guarantee', color: '#3b82f6' },
              { icon: Globe, label: 'Available worldwide', color: '#f59e0b' },
              { icon: MessageCircle, label: 'Student support', color: RED },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${item.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color={item.color} />
                  </div>
                  <span style={{ fontSize: 14.5, fontWeight: 600, color: '#3c3945' }}>{item.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section className="gp-section" style={{ paddingTop: 0 }}>
          <div className="gp-container" style={{ maxWidth: 820 }}>
            <div className="gp-head" style={{ marginBottom: 36 }}>
              <span className="gp-eyebrow">FAQ</span>
              <h2 className="gp-h2" style={{ fontSize: 'clamp(24px, 3vw, 34px)' }}>Pricing questions, answered</h2>
            </div>
            <div className="gp-faq">
              {FAQS.map((faq, i) => (
                <div key={i} className={`gp-faq-item ${openFaq === i ? 'open' : ''}`}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="gp-faq-q" aria-expanded={openFaq === i}>
                    <span>{faq.q}</span>
                    <span className="gp-faq-icon"><ChevronDown className="w-5 h-5" /></span>
                  </button>
                  <div className="gp-faq-a" style={{ maxHeight: openFaq === i ? 240 : 0 }}>
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
