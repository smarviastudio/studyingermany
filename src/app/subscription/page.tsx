'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import { Crown, Zap, Calendar, CreditCard, AlertCircle, Check, X, Loader2, ExternalLink, ArrowRight, Sparkles, Shield, RefreshCw } from 'lucide-react';
import { getPlanDisplayName, normalizePlanType } from '@/lib/plans';

const RED = '#dd0000';
const GRADIENT_START = '#fef2f2';
const GRADIENT_END = '#fef9f3';

type Subscription = {
  planType: string;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  stripePriceId: string | null;
};

type UserData = {
  email: string;
  aiCredits: number;
  displayCredits: number;
  normalizedPlanType: 'free' | 'pro';
  subscription: Subscription | null;
};

export default function SubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user/subscription');
      const data = await res.json();
      setUserData(data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.')) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        alert('Subscription canceled successfully. You will have access until ' + new Date(data.cancelAt).toLocaleDateString());
        fetchUserData();
      } else {
        alert('Failed to cancel subscription: ' + data.error);
      }
    } catch (error) {
      alert('Failed to cancel subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/stripe/reactivate-subscription', {
        method: 'POST',
      });
      if (res.ok) {
        alert('Subscription reactivated successfully!');
        fetchUserData();
      } else {
        alert('Failed to reactivate subscription');
      }
    } catch (error) {
      alert('Failed to reactivate subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      alert('Failed to open billing portal');
    } finally {
      setActionLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        <SiteNav />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <Loader2 size={40} color={RED} className="animate-spin" />
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  const rawPlanType = userData.subscription?.planType || 'free';
  const normalizedPlanType = userData.normalizedPlanType || normalizePlanType(rawPlanType);
  const planName = getPlanDisplayName(rawPlanType);
  const isActive = userData.subscription?.status === 'active';
  const willCancel = userData.subscription?.cancelAtPeriodEnd;

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(to bottom, ${GRADIENT_START} 0%, #ffffff 100%)` }}>
      <SiteNav />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 100px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 8, 
            padding: '8px 16px', 
            background: 'rgba(221,0,0,0.08)', 
            borderRadius: 999, 
            marginBottom: 20,
            border: '1px solid rgba(221,0,0,0.15)'
          }}>
            <Sparkles size={16} color={RED} />
            <span style={{ fontSize: 13, fontWeight: 700, color: RED, letterSpacing: '0.02em' }}>SUBSCRIPTION MANAGEMENT</span>
          </div>
          <h1 style={{ 
            fontSize: 'clamp(36px, 5vw, 56px)', 
            fontWeight: 900, 
            color: '#0a0a0a', 
            marginBottom: 16,
            lineHeight: 1.1,
            letterSpacing: '-0.02em'
          }}>
            Your Plan & Credits
          </h1>
          <p style={{ 
            fontSize: 18, 
            color: '#6b7280', 
            marginBottom: 0,
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Manage your subscription, monitor credits, and control billing with ease
          </p>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, marginBottom: 48 }}>
          {/* Current Plan Card */}
          <div style={{ 
            background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)', 
            border: '1px solid #e5e7eb', 
            borderRadius: 24, 
            padding: 40,
            boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative gradient blob */}
            <div style={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              background: `radial-gradient(circle, ${RED}08 0%, transparent 70%)`,
              borderRadius: '50%',
              filter: 'blur(40px)'
            }} />
            <div style={{ position: 'relative', marginBottom: 32 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(0,0,0,0.04)', borderRadius: 999, marginBottom: 16 }}>
                <Shield size={14} color="#6b7280" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Plan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ 
                  width: 64, 
                  height: 64, 
                  borderRadius: 20, 
                  background: `linear-gradient(135deg, ${RED} 0%, #ff4444 100%)`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: `0 8px 16px ${RED}30`
                }}>
                  <Crown size={32} color="#fff" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0a0a0a', margin: 0, letterSpacing: '-0.02em' }}>{planName}</h2>
                  <p style={{ fontSize: 15, color: '#6b7280', margin: '4px 0 0', fontWeight: 500 }}>Premium subscription</p>
                </div>
              </div>
            </div>

            {userData.subscription && isActive && (
              <>
                <div style={{ 
                  padding: '20px 24px', 
                  background: willCancel ? '#fef3c7' : '#f0fdf4', 
                  borderRadius: 16, 
                  marginBottom: 24,
                  border: `1px solid ${willCancel ? '#fde68a' : '#bbf7d0'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {willCancel ? <AlertCircle size={20} color="#f59e0b" /> : <Calendar size={20} color="#16a34a" />}
                      <span style={{ fontSize: 14, color: willCancel ? '#92400e' : '#166534', fontWeight: 700 }}>
                        {willCancel ? 'Subscription Ending' : 'Next Billing Date'}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: 18, color: willCancel ? '#78350f' : '#15803d', margin: 0, fontWeight: 800 }}>
                    {userData.subscription.currentPeriodEnd
                      ? new Date(userData.subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                      : 'No date set'}
                  </p>
                  {willCancel && (
                    <p style={{ fontSize: 13, color: '#92400e', margin: '8px 0 0', fontWeight: 500 }}>
                      Your subscription will not renew. Reactivate to continue.
                    </p>
                  )}
                </div>
              </>
            )}

            <div style={{ display: 'grid', gap: 12 }}>
              {normalizedPlanType !== 'free' && isActive && !willCancel && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={actionLoading}
                  style={{
                    padding: '14px 24px',
                    borderRadius: 14,
                    border: '1.5px solid #e5e7eb',
                    background: '#ffffff',
                    color: '#6b7280',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.background = '#f9fafb';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.background = '#ffffff';
                  }}
                >
                  {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <X size={18} />}
                  Cancel Subscription
                </button>
              )}

              {willCancel && (
                <button
                  onClick={handleReactivateSubscription}
                  disabled={actionLoading}
                  style={{
                    padding: '14px 24px',
                    borderRadius: 14,
                    border: 'none',
                    background: `linear-gradient(135deg, ${RED} 0%, #ff4444 100%)`,
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    boxShadow: `0 4px 12px ${RED}30`,
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = `0 6px 16px ${RED}40`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${RED}30`;
                  }}
                >
                  {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                  Reactivate Subscription
                </button>
              )}

              {normalizedPlanType !== 'free' && (
                <button
                  onClick={handleManageBilling}
                  disabled={actionLoading}
                  style={{
                    padding: '14px 24px',
                    borderRadius: 14,
                    border: '1.5px solid #0a0a0a',
                    background: '#111',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
                  Manage Billing
                </button>
              )}

              <Link
                href="/pricing"
                style={{
                  padding: '14px 24px',
                  borderRadius: 14,
                  border: `1.5px solid ${RED}`,
                  background: 'transparent',
                  color: RED,
                  fontSize: 15,
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                  transition: 'all 0.2s',
                }}
              >
                <ExternalLink size={18} />
                View All Plans
              </Link>
            </div>
          </div>

          {/* AI Credits Card */}
          <div style={{ 
            background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)', 
            border: '1px solid #e5e7eb', 
            borderRadius: 24, 
            padding: 40,
            boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative gradient blob */}
            <div style={{
              position: 'absolute',
              top: -50,
              left: -50,
              width: 200,
              height: 200,
              background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(40px)'
            }} />
            <div style={{ position: 'relative', marginBottom: 32 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(124,58,237,0.08)', borderRadius: 999, marginBottom: 16 }}>
                <Sparkles size={14} color="#7c3aed" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Credits</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ 
                  width: 64, 
                  height: 64, 
                  borderRadius: 20, 
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 8px 16px rgba(124,58,237,0.3)'
                }}>
                  <Zap size={32} color="#fff" strokeWidth={2.5} fill="#fff" />
                </div>
                <div>
                  <h2 style={{ fontSize: 48, fontWeight: 900, color: '#0a0a0a', margin: 0, letterSpacing: '-0.03em' }}>{userData.displayCredits}</h2>
                  <p style={{ fontSize: 15, color: '#6b7280', margin: '4px 0 0', fontWeight: 500 }}>Available credits</p>
                </div>
              </div>
            </div>

            <div style={{ 
              padding: '20px 24px', 
              background: '#f5f3ff', 
              borderRadius: 16, 
              marginBottom: 24,
              border: '1px solid #e9d5ff'
            }}>
              <p style={{ fontSize: 14, color: '#6b21a8', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
                {normalizedPlanType === 'pro' 
                  ? '✨ Pro plan includes 20 AI credits every month. Purchase additional credit packs anytime to boost your balance.' 
                  : '💡 Upgrade to Pro for 20 monthly credits, or buy credit packs as needed.'}
              </p>
            </div>

            <Link
              href="/pricing"
              style={{
                padding: '16px 28px',
                borderRadius: 14,
                border: 'none',
                background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                transition: 'all 0.2s',
              }}
            >
              <Zap size={18} fill="#fff" />
              Purchase Credits
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Plan Features */}
        <div style={{ background: '#fff', border: '2px solid #e5e5e5', borderRadius: 20, padding: 32 }}>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: '#111', marginBottom: 24 }}>
            Your Plan Features
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
            {getPlanFeatures(rawPlanType).map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <Check size={20} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function getPlanFeatures(planType: string): string[] {
  const features: Record<string, string[]> = {
    free: [
      'Sign in to get 3 AI credits',
      '2 CV templates',
      'Save programs to your shortlist',
      'GPA converter (free forever)',
      'Salary calculator (free forever)',
    ],
    pro: [
      '20 AI credits every month',
      'All 20+ CV templates',
      'Premium access to CV, motivation letter, and cover letter tools',
      'Save programs to your shortlist',
      'Priority support',
      'All free features included',
    ],
  };

  return features[normalizePlanType(planType)] || features.free;
}
