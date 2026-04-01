'use client';

import { useState } from 'react';
import { X, Zap, Check, Loader2, Crown, Sparkles, ShieldCheck } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  currentUsage?: number;
  limit?: number;
}

const PRO_BENEFITS = [
  '20 AI credits every month',
  'All 20+ professional CV templates',
  'Premium access to CV, motivation letter, and cover letter tools',
  'Save programs to your shortlist',
  'Priority support',
  'All free features included',
];

const HERO_BADGES = [
  { icon: <ShieldCheck size={14} />, label: 'Secure Stripe billing' },
  { icon: <Sparkles size={14} />, label: '20 monthly AI credits' },
  { icon: <Zap size={14} />, label: 'Cancel anytime' },
];

export function PaywallModal({ isOpen, onClose, feature, currentUsage, limit }: PaywallModalProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  if (!isOpen) return null;

  const handleUpgrade = async (planKey: string) => {
    setLoading(planKey);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoading(null);
    }
  };

  const proKey = billingInterval === 'month' ? 'pro_monthly' : 'pro_yearly';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{
        background: '#fff',
        borderRadius: 32,
        maxWidth: 520,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 40px 120px rgba(0,0,0,0.35)',
        animation: 'slideUp 0.3s ease',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid #e5e5e5',
            background: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <X size={16} color="#666" />
        </button>

        <div style={{
          background: 'linear-gradient(135deg, #dd0000 0%, #7c3aed 100%)',
          borderRadius: '32px 32px 0 0',
          padding: '44px clamp(28px,4vw,48px) 32px',
          textAlign: 'center',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15), transparent 55%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: 'rgba(255,255,255,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
            position: 'relative',
            zIndex: 1,
          }}>
            <Crown size={30} color="#fff" />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 10px', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', zIndex: 1 }}>
            {limit !== undefined && currentUsage !== undefined
              ? `You've used ${currentUsage}/${limit} free ${feature || 'generations'} this month`
              : 'Unlock Pro'}
          </h2>
          <p style={{ fontSize: 15, opacity: 0.9, margin: '0 auto', maxWidth: 420, position: 'relative', zIndex: 1 }}>
            Upgrade for premium templates and 20 monthly AI credits across your core document tools.
          </p>
          <div style={{
            marginTop: 18,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 10,
            position: 'relative',
            zIndex: 1,
          }}>
            {HERO_BADGES.map((badge) => (
              <span key={badge.label} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.18)',
              }}>
                {badge.icon}
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        <div style={{ padding: '28px clamp(20px,4vw,40px) 0', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            display: 'flex',
            background: '#f5f5f5',
            borderRadius: 50,
            padding: 4,
            gap: 2,
          }}>
            <button
              onClick={() => setBillingInterval('month')}
              style={{
                padding: '8px 24px',
                borderRadius: 50,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                background: billingInterval === 'month' ? '#fff' : 'transparent',
                color: billingInterval === 'month' ? '#111' : '#737373',
                boxShadow: billingInterval === 'month' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              style={{
                padding: '8px 24px',
                borderRadius: 50,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                background: billingInterval === 'year' ? '#fff' : 'transparent',
                color: billingInterval === 'year' ? '#111' : '#737373',
                boxShadow: billingInterval === 'year' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              Yearly
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                background: '#22c55e',
                color: '#fff',
                borderRadius: 50,
                padding: '2px 8px',
              }}>
                Save 33%
              </span>
            </button>
          </div>
        </div>

        <div style={{ padding: '24px clamp(20px,4vw,40px) 36px' }}>
          <div style={{
            border: '1px solid rgba(221,0,0,0.25)',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 18px 40px rgba(221,0,0,0.12)',
          }}>
            <div style={{
              background: 'radial-gradient(circle at top, rgba(221,0,0,0.12), rgba(221,0,0,0))',
              padding: '26px 26px 22px',
              borderBottom: '1px solid rgba(221,0,0,0.08)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Zap size={18} color="#dd0000" />
                <span style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Pro</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: '#dd0000' }}>
                  {billingInterval === 'month' ? '€9.99' : '€6.66'}
                </span>
                <span style={{ fontSize: 14, color: '#737373' }}>/ month</span>
              </div>
              {billingInterval === 'year' && (
                <p style={{ fontSize: 12, color: '#22c55e', fontWeight: 600, margin: '4px 0 0' }}>
                  €79.99 billed yearly
                </p>
              )}
            </div>

            <div style={{ padding: '22px 26px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {PRO_BENEFITS.map((benefit, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(221,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Check size={10} color="#dd0000" strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: 13, color: '#444', lineHeight: 1.4 }}>{benefit}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleUpgrade(proKey)}
                disabled={loading !== null}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 14,
                  border: 'none',
                  background: loading === proKey ? '#ccc' : 'linear-gradient(135deg, #dd0000, #b91c1c)',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading !== null ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 16px rgba(221,0,0,0.25)',
                }}
              >
                {loading === proKey ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                {loading === proKey ? 'Redirecting...' : 'Get Pro'}
              </button>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '0 28px 30px' }}>
          <p style={{ fontSize: 12, color: '#999', margin: 0 }}>
            Cancel anytime · No hidden fees · Secure payment via Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
