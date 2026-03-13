'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Check, Zap, Star, Crown, ArrowRight, Loader2, Shield,
  FileText, GraduationCap, Bookmark, MessageSquare, ChevronDown, ChevronUp
} from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';

const RED = '#dd0000';
const PURPLE = '#7c3aed';

const FAQS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel anytime from your dashboard — you keep access until the end of your billing period. No questions asked.',
  },
  {
    q: 'What counts as an AI generation?',
    a: 'Each time you click "Generate" in the CV Maker AI assistant, Motivation Letter, or Cover Letter tools it counts as one generation. Editing text manually is always free.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Every account starts on the Free plan so you can try all tools before upgrading. Free users get 5 AI generations per month across all tools.',
  },
  {
    q: 'Can I switch plans?',
    a: 'Yes. You can upgrade, downgrade or cancel at any time from the billing portal accessible from your dashboard.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'All major credit/debit cards (Visa, Mastercard, Amex) via Stripe. Payments are fully encrypted and PCI-compliant.',
  },
  {
    q: 'Is my data secure?',
    a: 'All data is encrypted in transit and at rest. We never share your documents or personal information with third parties.',
  },
];

const FEATURES = [
  {
    icon: FileText,
    label: 'AI Document Generation',
    free: '5/month total',
    student: 'Unlimited',
    pro: 'Unlimited',
    color: RED,
  },
  {
    icon: GraduationCap,
    label: 'CV Templates',
    free: '3 basic templates',
    student: 'All 20+ templates',
    pro: 'All 20+ templates',
    color: PURPLE,
  },
  {
    icon: Bookmark,
    label: 'Program Saves',
    free: 'Up to 20',
    student: 'Unlimited',
    pro: 'Unlimited',
    color: '#059669',
  },
  {
    icon: Zap,
    label: 'AI Quality',
    free: 'Standard',
    student: 'Advanced (GPT-4)',
    pro: 'Advanced (GPT-4)',
    color: '#d97706',
  },
  {
    icon: MessageSquare,
    label: 'AI Chat Consultant',
    free: '—',
    student: '—',
    pro: 'Unlimited',
    color: '#0284c7',
  },
  {
    icon: Shield,
    label: 'Support',
    free: 'Community',
    student: 'Email (24h)',
    pro: 'Priority email (12h)',
    color: '#be185d',
  },
];

export default function PricingPage() {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [billing, setBilling] = useState<'month' | 'year'>('month');
  const [loading, setLoading] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleUpgrade = async (planKey: string) => {
    if (!isAuthenticated) {
      window.location.href = '/auth/signin?callbackUrl=/pricing';
      return;
    }
    setLoading(planKey);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoading(null);
    }
  };

  const studentKey = billing === 'month' ? 'student_monthly' : 'student_yearly';
  const proKey = billing === 'month' ? 'pro_monthly' : 'pro_yearly';

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <SiteNav />

      <main>
        {/* ── HERO ── */}
        <section className="pricing-hero" style={{ textAlign: 'center', padding: '72px 24px 56px', position: 'relative', overflow: 'hidden' }}>
          {/* Background blobs */}
          <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-60%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(221,0,0,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 40, right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, rgba(221,0,0,0.08), rgba(124,58,237,0.08))', border: '1px solid rgba(221,0,0,0.15)', borderRadius: 50, padding: '6px 18px', marginBottom: 24 }}>
              <Crown size={14} color={RED} />
              <span style={{ fontSize: 13, fontWeight: 600, color: RED }}>Simple, transparent pricing</span>
            </div>

            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: '#0a0a0a', margin: '0 0 20px', lineHeight: 1.1 }}>
              Invest in your future<br />
              <span style={{ background: 'linear-gradient(135deg, #dd0000, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                in Germany
              </span>
            </h1>
            <p style={{ fontSize: 18, color: '#555', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.6 }}>
              Free tools to get started. Premium AI power when you're ready to apply.
            </p>

            {/* Billing Toggle */}
            <div style={{ display: 'inline-flex', background: '#efefef', borderRadius: 50, padding: 4, gap: 2 }}>
              <button
                onClick={() => setBilling('month')}
                style={{
                  padding: '10px 28px', borderRadius: 50, border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: 700,
                  background: billing === 'month' ? '#fff' : 'transparent',
                  color: billing === 'month' ? '#111' : '#666',
                  boxShadow: billing === 'month' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('year')}
                style={{
                  padding: '10px 28px', borderRadius: 50, border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: 700,
                  background: billing === 'year' ? '#fff' : 'transparent',
                  color: billing === 'year' ? '#111' : '#666',
                  boxShadow: billing === 'year' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                Yearly
                <span style={{ fontSize: 11, fontWeight: 800, background: '#22c55e', color: '#fff', borderRadius: 50, padding: '2px 8px' }}>
                  −33%
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ── PRICING CARDS ── */}
        <section className="pricing-cards-grid" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'start' }}>

          {/* Free */}
          <div className="pricing-card" style={{ background: '#fff', border: '1.5px solid #e5e5e5', borderRadius: 24, overflow: 'hidden' }}>
            <div style={{ padding: '32px 28px 24px', borderBottom: '1px solid #f0f0f0' }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', margin: '0 0 12px' }}>Free</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                <span style={{ fontSize: 42, fontWeight: 900, color: '#111' }}>€0</span>
                <span style={{ fontSize: 15, color: '#888' }}>/month</span>
              </div>
              <p style={{ fontSize: 14, color: '#666', margin: '0 0 24px', lineHeight: 1.5 }}>Everything you need to get started exploring Germany.</p>
              <Link
                href={isAuthenticated ? '/dashboard' : '/auth/signin'}
                style={{
                  display: 'block', textAlign: 'center', padding: '13px',
                  borderRadius: 12, border: '1.5px solid #e5e5e5',
                  fontSize: 14, fontWeight: 700, color: '#333',
                  textDecoration: 'none', transition: 'all 0.2s',
                  background: '#fafafa',
                }}
              >
                {isAuthenticated ? 'Current Plan' : 'Get Started Free'}
              </Link>
            </div>
            <div style={{ padding: '24px 28px 32px' }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', margin: '0 0 16px' }}>Includes</p>
              {[
                '5 AI generations per month total',
                '3 basic CV templates',
                'Save up to 20 programs',
                'Track up to 5 applications',
                'GPA & Salary calculators',
                'Community support',
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Check size={11} color="#888" strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: 14, color: '#555', lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Student — highlighted */}
          <div style={{
            background: '#fff',
            border: `2px solid ${RED}`,
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(221,0,0,0.12)',
            transform: 'translateY(-8px)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              background: 'linear-gradient(90deg, #dd0000, #ef4444)',
              padding: '8px', textAlign: 'center',
            }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                ⚡ Most Popular
              </span>
            </div>

            <div style={{ padding: '52px 28px 24px', borderBottom: '1px solid #fce8e8' }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: RED, margin: '0 0 12px' }}>Student</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 42, fontWeight: 900, color: RED }}>
                  {billing === 'month' ? '€9.99' : '€6.58'}
                </span>
                <span style={{ fontSize: 15, color: '#888' }}>/month</span>
              </div>
              {billing === 'year' && (
                <p style={{ fontSize: 13, color: '#22c55e', fontWeight: 700, margin: '0 0 8px' }}>
                  Billed €79.99/year · save €39.89
                </p>
              )}
              <p style={{ fontSize: 14, color: '#666', margin: '0 0 24px', lineHeight: 1.5 }}>Unlimited AI power for your entire application journey.</p>
              <button
                onClick={() => handleUpgrade(studentKey)}
                disabled={loading !== null}
                style={{
                  width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                  background: loading === studentKey ? '#ccc' : `linear-gradient(135deg, ${RED}, #b91c1c)`,
                  color: '#fff', fontSize: 15, fontWeight: 800, cursor: loading !== null ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 6px 20px rgba(221,0,0,0.3)', transition: 'all 0.2s',
                }}
              >
                {loading === studentKey ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                {loading === studentKey ? 'Redirecting...' : 'Get Student Plan'}
              </button>
            </div>

            <div style={{ padding: '24px 28px 32px' }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', margin: '0 0 16px' }}>Everything in Free, plus</p>
              {[
                'Unlimited AI generations',
                'All 20+ CV templates',
                'Unlimited program saves',
                'Unlimited application tracking',
                'Email support (24h response)',
                'Priority program recommendations',
                'AI Chat Consultant (limited)',
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(221,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Check size={11} color={RED} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: 14, color: '#444', lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro */}
          <div style={{
            background: 'linear-gradient(160deg, #1e0a3c 0%, #2d1457 100%)',
            border: `2px solid ${PURPLE}`,
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(124,58,237,0.18)',
          }}>
            <div style={{ padding: '32px 28px 24px', borderBottom: '1px solid rgba(124,58,237,0.3)' }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a78bfa', margin: '0 0 12px' }}>Pro</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 42, fontWeight: 900, color: '#fff' }}>
                  {billing === 'month' ? '€24.99' : '€16.58'}
                </span>
                <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)' }}>/month</span>
              </div>
              {billing === 'year' && (
                <p style={{ fontSize: 13, color: '#4ade80', fontWeight: 700, margin: '0 0 8px' }}>
                  Billed €199.99/year · save €99.89
                </p>
              )}
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', margin: '0 0 24px', lineHeight: 1.5 }}>The full suite for serious applicants who want an edge.</p>
              <button
                onClick={() => handleUpgrade(proKey)}
                disabled={loading !== null}
                style={{
                  width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                  background: loading === proKey ? '#555' : `linear-gradient(135deg, ${PURPLE}, #5b21b6)`,
                  color: '#fff', fontSize: 15, fontWeight: 800, cursor: loading !== null ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 6px 20px rgba(124,58,237,0.35)', transition: 'all 0.2s',
                }}
              >
                {loading === proKey ? <Loader2 size={16} className="animate-spin" /> : <Star size={16} />}
                {loading === proKey ? 'Redirecting...' : 'Get Pro Plan'}
              </button>
            </div>

            <div style={{ padding: '24px 28px 32px' }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', margin: '0 0 16px' }}>Everything in Student, plus</p>
              {[
                'AI Chat Consultant (unlimited)',
                'Priority email support (12h)',
                'All Student plan features',
                'Early access to new features',
                'Dedicated application guidance',
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(167,139,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Check size={11} color="#a78bfa" strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMPARISON TABLE ── */}
        <section className="pricing-features-table" style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, color: '#111', margin: '0 0 40px' }}>Full Feature Comparison</h2>

          <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 20, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: '#fafafa', borderBottom: '1px solid #e5e5e5', padding: '16px 24px' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Feature</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Free</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: RED, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Student</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: PURPLE, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Pro</span>
            </div>

            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  padding: '18px 24px',
                  borderBottom: i < FEATURES.length - 1 ? '1px solid #f5f5f5' : 'none',
                  alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${f.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color={f.color} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#222' }}>{f.label}</span>
                  </div>
                  <span style={{ fontSize: 13, color: '#666', textAlign: 'center' }}>{f.free}</span>
                  <span style={{ fontSize: 13, color: RED, fontWeight: 600, textAlign: 'center' }}>{f.student}</span>
                  <span style={{ fontSize: 13, color: PURPLE, fontWeight: 600, textAlign: 'center' }}>{f.pro}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── AI CREDITS ── */}
        <section style={{ maxWidth: 1000, margin: '0 auto 80px', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(221,0,0,0.08))', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 50, padding: '6px 18px', marginBottom: 20 }}>
              <Zap size={14} color={PURPLE} />
              <span style={{ fontSize: 13, fontWeight: 600, color: PURPLE }}>Pay as you go</span>
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: '#0a0a0a', margin: '0 0 16px' }}>
              Or Buy AI Credits
            </h2>
            <p style={{ fontSize: 17, color: '#555', maxWidth: 600, margin: '0 auto' }}>
              Not ready for a subscription? Purchase AI credits and use them whenever you need. Credits never expire.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 700, margin: '0 auto' }}>
            {[
              { credits: 50, price: '€5.00', priceValue: 5 },
              { credits: 200, price: '€15.00', priceValue: 15, popular: true },
            ].map((bundle) => (
              <div
                key={bundle.credits}
                style={{
                  background: '#fff',
                  border: bundle.popular ? '2px solid #7c3aed' : '1px solid #e5e5e5',
                  borderRadius: 20,
                  padding: 28,
                  position: 'relative',
                  boxShadow: bundle.popular ? '0 8px 32px rgba(124,58,237,0.15)' : 'none',
                }}
              >
                {bundle.popular && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #7c3aed, #dd0000)', borderRadius: 999, padding: '5px 14px', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Best Value</span>
                  </div>
                )}
                
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ width: 56, height: 56, margin: '0 auto 14px', borderRadius: 16, background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(221,0,0,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={28} color="#7c3aed" />
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0a0a0a', margin: '0 0 6px' }}>{bundle.credits} Credits</h3>
                  <div style={{ fontSize: 36, fontWeight: 900, color: '#7c3aed', margin: '0 0 6px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{bundle.price}</div>
                  <p style={{ fontSize: 13, color: '#737373', margin: 0 }}>€{(bundle.priceValue / bundle.credits).toFixed(2)} per credit</p>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#404040' }}>
                    <Check size={16} color="#10b981" style={{ flexShrink: 0 }} />
                    <span>{bundle.credits} AI generations</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#404040' }}>
                    <Check size={16} color="#10b981" style={{ flexShrink: 0 }} />
                    <span>Never expires</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#404040' }}>
                    <Check size={16} color="#10b981" style={{ flexShrink: 0 }} />
                    <span>All AI tools included</span>
                  </li>
                </ul>

                <Link
                  href="/credits"
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#fff',
                    background: bundle.popular ? 'linear-gradient(135deg, #7c3aed, #dd0000)' : '#7c3aed',
                    border: 'none',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 16px rgba(124,58,237,0.2)',
                  }}
                >
                  Buy Credits
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── TRUST BADGES ── */}
        <section style={{ maxWidth: 800, margin: '0 auto 80px', padding: '0 24px', display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {[
            { icon: Shield, label: 'Secure payments', sub: 'via Stripe' },
            { icon: ArrowRight, label: 'Cancel anytime', sub: 'No lock-in' },
            { icon: Check, label: 'No hidden fees', sub: 'Transparent pricing' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color="#22c55e" />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: 0 }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{item.sub}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* ── FAQ ── */}
        <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 100px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, color: '#111', margin: '0 0 40px' }}>Frequently Asked Questions</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                background: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: 16,
                overflow: 'hidden',
                transition: 'border-color 0.2s',
                borderColor: openFaq === i ? RED : '#e5e5e5',
              }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', padding: '20px 24px', background: 'none',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp size={18} color={RED} />
                    : <ChevronDown size={18} color="#999" />}
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 24px 20px' }}>
                    <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section style={{
          background: 'linear-gradient(135deg, #dd0000, #7c3aed)',
          padding: '72px 24px',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, color: '#fff', margin: '0 0 16px' }}>
            Ready to ace your application?
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', margin: '0 auto 36px', maxWidth: 480 }}>
            Join thousands of students using AI to build perfect CVs, letters, and applications for German universities.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleUpgrade(studentKey)}
              disabled={loading !== null}
              style={{
                padding: '16px 36px', borderRadius: 14, border: 'none',
                background: '#fff', color: RED, fontSize: 16, fontWeight: 800,
                cursor: loading !== null ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)', transition: 'all 0.2s',
              }}
            >
              {loading === studentKey ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} color={RED} />}
              Start with Student Plan
            </button>
            <Link
              href={isAuthenticated ? '/dashboard' : '/auth/signin'}
              style={{
                padding: '16px 36px', borderRadius: 14,
                border: '2px solid rgba(255,255,255,0.4)',
                color: '#fff', fontSize: 16, fontWeight: 700,
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.1)', transition: 'all 0.2s',
              }}
            >
              Try for Free
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
