'use client';

import { useState } from 'react';
import { X, Zap, Check, Loader2, Crown, Star } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  currentUsage?: number;
  limit?: number;
}

const STUDENT_BENEFITS = [
  'Unlimited AI document generations',
  'All 20+ professional CV templates',
  'Advanced AI quality (GPT-4 class)',
  'Unlimited program saves',
  'Unlimited application tracking',
  'Export to PDF & DOCX',
  'Email support',
];

const PRO_BENEFITS = [
  'Everything in Student Plan',
  'AI Chat Consultant (unlimited)',
  'Priority support (12h response)',
  'Live chat support',
  'Monthly document review',
  'Advanced analytics',
  'Early access to new features',
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

  const studentKey = billingInterval === 'month' ? 'student_monthly' : 'student_yearly';
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
        borderRadius: 28,
        maxWidth: 780,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 40px 100px rgba(0,0,0,0.25)',
        animation: 'slideUp 0.3s ease',
        position: 'relative',
      }}>
        {/* Close button */}
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

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #dd0000 0%, #7c3aed 100%)',
          borderRadius: '28px 28px 0 0',
          padding: '40px 40px 32px',
          textAlign: 'center',
          color: '#fff',
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Crown size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 10px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {limit !== undefined && currentUsage !== undefined
              ? `You've used ${currentUsage}/${limit} free ${feature || 'generations'} this month`
              : 'Unlock Premium Features'}
          </h2>
          <p style={{ fontSize: 15, opacity: 0.9, margin: 0, maxWidth: 460, marginInline: 'auto' }}>
            Upgrade your plan to generate unlimited AI documents, access all templates, and more.
          </p>
        </div>

        {/* Billing toggle */}
        <div style={{ padding: '28px 40px 0', display: 'flex', justifyContent: 'center' }}>
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
                transition: 'all 0.2s',
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
                transition: 'all 0.2s',
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

        {/* Plans */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
          padding: '24px 40px 40px',
        }}>
          {/* Student Plan */}
          <div style={{
            border: '2px solid #dd0000',
            borderRadius: 20,
            overflow: 'hidden',
            position: 'relative',
          }}>
            <div style={{
              background: 'rgba(221,0,0,0.04)',
              padding: '24px 24px 20px',
              borderBottom: '1px solid #f5e5e5',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Zap size={18} color="#dd0000" />
                <span style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Student Plan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: '#dd0000' }}>
                  {billingInterval === 'month' ? '€9.99' : '€6.58'}
                </span>
                <span style={{ fontSize: 14, color: '#737373' }}>/ month</span>
              </div>
              {billingInterval === 'year' && (
                <p style={{ fontSize: 12, color: '#22c55e', fontWeight: 600, margin: '4px 0 0' }}>
                  €79.99 billed yearly • Save €39.89
                </p>
              )}
            </div>

            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {STUDENT_BENEFITS.map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(221,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Check size={10} color="#dd0000" strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: 13, color: '#444', lineHeight: 1.4 }}>{b}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleUpgrade(studentKey)}
                disabled={loading !== null}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 12,
                  border: 'none',
                  background: loading === studentKey ? '#ccc' : 'linear-gradient(135deg, #dd0000, #b91c1c)',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading !== null ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 16px rgba(221,0,0,0.25)',
                  transition: 'all 0.2s',
                }}
              >
                {loading === studentKey ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                {loading === studentKey ? 'Redirecting...' : 'Get Student Plan'}
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <div style={{
            border: '2px solid #7c3aed',
            borderRadius: 20,
            overflow: 'hidden',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: 50,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              Best Value
            </div>

            <div style={{
              background: 'rgba(124,58,237,0.04)',
              padding: '24px 24px 20px',
              borderBottom: '1px solid #ede9fe',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Star size={18} color="#7c3aed" />
                <span style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Pro Plan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: '#7c3aed' }}>
                  {billingInterval === 'month' ? '€24.99' : '€16.58'}
                </span>
                <span style={{ fontSize: 14, color: '#737373' }}>/ month</span>
              </div>
              {billingInterval === 'year' && (
                <p style={{ fontSize: 12, color: '#22c55e', fontWeight: 600, margin: '4px 0 0' }}>
                  €199.99 billed yearly • Save €99.89
                </p>
              )}
            </div>

            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {PRO_BENEFITS.map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Check size={10} color="#7c3aed" strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: 13, color: '#444', lineHeight: 1.4 }}>{b}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleUpgrade(proKey)}
                disabled={loading !== null}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 12,
                  border: 'none',
                  background: loading === proKey ? '#ccc' : 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading !== null ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 16px rgba(124,58,237,0.25)',
                  transition: 'all 0.2s',
                }}
              >
                {loading === proKey ? <Loader2 size={16} className="animate-spin" /> : <Star size={16} />}
                {loading === proKey ? 'Redirecting...' : 'Get Pro Plan'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div style={{ textAlign: 'center', padding: '0 40px 28px' }}>
          <p style={{ fontSize: 12, color: '#999', margin: 0 }}>
            Cancel anytime · Secure payment via Stripe · 30-day refund guarantee
          </p>
        </div>
      </div>
    </div>
  );
}
