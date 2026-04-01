'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import { Crown, Zap, Calendar, CreditCard, AlertCircle, Check, X, Loader2, ExternalLink } from 'lucide-react';
import { getPlanDisplayName, hasUnlimitedAi, normalizePlanType } from '@/lib/plans';

const RED = '#dd0000';

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
  const normalizedPlanType = normalizePlanType(rawPlanType);
  const planName = getPlanDisplayName(rawPlanType);
  const unlimitedAi = hasUnlimitedAi(rawPlanType);
  const isActive = userData.subscription?.status === 'active';
  const willCancel = userData.subscription?.cancelAtPeriodEnd;

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <SiteNav />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px 80px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#111', marginBottom: 8 }}>
          Subscription & Credits
        </h1>
        <p style={{ fontSize: 16, color: '#666', marginBottom: 40 }}>
          Manage your plan, view credits, and update billing information
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 40 }}>
          {/* Current Plan Card */}
          <div style={{ background: '#fff', border: '2px solid #e5e5e5', borderRadius: 20, padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${RED}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Crown size={24} color={RED} />
              </div>
              <div>
                <p style={{ fontSize: 14, color: '#666', margin: 0 }}>Current Plan</p>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#111', margin: 0 }}>{planName}</h2>
              </div>
            </div>

            {userData.subscription && isActive && (
              <>
                <div style={{ padding: '12px 16px', background: '#f5f5f5', borderRadius: 12, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Calendar size={16} color="#666" />
                    <span style={{ fontSize: 13, color: '#666', fontWeight: 600 }}>Billing Period</span>
                  </div>
                  <p style={{ fontSize: 15, color: '#111', margin: 0, fontWeight: 700 }}>
                    {userData.subscription.currentPeriodEnd
                      ? `Renews ${new Date(userData.subscription.currentPeriodEnd).toLocaleDateString()}`
                      : 'No renewal date'}
                  </p>
                </div>

                {willCancel && (
                  <div style={{ padding: '12px 16px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 12, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <AlertCircle size={16} color="#ff9800" />
                      <span style={{ fontSize: 13, color: '#856404', fontWeight: 600 }}>
                        Cancels on {new Date(userData.subscription.currentPeriodEnd!).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
              {normalizedPlanType !== 'free' && isActive && !willCancel && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={actionLoading}
                  style={{
                    padding: '12px 20px',
                    borderRadius: 12,
                    border: '2px solid #e5e5e5',
                    background: '#fff',
                    color: '#666',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                  Cancel Subscription
                </button>
              )}

              {willCancel && (
                <button
                  onClick={handleReactivateSubscription}
                  disabled={actionLoading}
                  style={{
                    padding: '12px 20px',
                    borderRadius: 12,
                    border: 'none',
                    background: RED,
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
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  Reactivate Subscription
                </button>
              )}

              {normalizedPlanType !== 'free' && (
                <button
                  onClick={handleManageBilling}
                  disabled={actionLoading}
                  style={{
                    padding: '12px 20px',
                    borderRadius: 12,
                    border: '2px solid #111',
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
                  padding: '12px 20px',
                  borderRadius: 12,
                  border: `2px solid ${RED}`,
                  background: 'transparent',
                  color: RED,
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <ExternalLink size={16} />
                {normalizedPlanType === 'free' ? 'Upgrade Plan' : 'Change Plan'}
              </Link>
            </div>
          </div>

          {/* AI Credits Card */}
          <div style={{ background: '#fff', border: '2px solid #e5e5e5', borderRadius: 20, padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#22c55e15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={24} color="#22c55e" />
              </div>
              <div>
                <p style={{ fontSize: 14, color: '#666', margin: 0 }}>AI Credits</p>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#111', margin: 0 }}>
                  {unlimitedAi ? 'Unlimited' : userData.aiCredits}
                </h2>
              </div>
            </div>

            <p style={{ fontSize: 14, color: '#666', marginBottom: 20, lineHeight: 1.6 }}>
              {normalizedPlanType === 'free'
                ? 'Free plan includes 3 AI generations per month. Upgrade for unlimited generations or buy credit packs.'
                : normalizedPlanType === 'starter'
                ? 'Starter plan includes 30 AI generations per month. Buy credit packs for additional generations.'
                : 'Your plan includes unlimited AI generations!'}
            </p>

            <Link
              href="/pricing#credits"
              style={{
                padding: '12px 20px',
                borderRadius: 12,
                border: 'none',
                background: '#22c55e',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Zap size={16} />
              Buy More Credits
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
      '3 AI document generations/month',
      '2 CV templates',
      'Save up to 10 programs',
      'Track 3 applications',
      'GPA converter (free forever)',
      'Salary calculator (free forever)',
    ],
    starter: [
      '30 AI generations/month',
      '10 CV templates',
      'Save up to 50 programs',
      'Track 15 applications',
      'Email support (48h)',
      'All free features included',
    ],
    essential: [
      'Unlimited AI generations',
      'All 20+ CV templates (ATS-optimized)',
      'Unlimited program saves',
      'Unlimited application tracking',
      'Deadline reminders',
      '5 AI Chat messages/day',
      'AI program recommendations',
      'Email support (24h)',
    ],
    pro: [
      'Everything in Essential',
      'Unlimited AI Chat Consultant',
      'Personalized visa & admission roadmap',
      'AI application document review',
      'Downloadable offline guides (PDF)',
      'Priority support (8h response)',
      'Early access to new tools',
    ],
  };

  const normalizedPlanType = planType === 'student' ? 'essential' : planType;
  return features[normalizedPlanType] || features.free;
}
