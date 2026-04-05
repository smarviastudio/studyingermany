'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Loader2, User, Crown, Zap, Bookmark, CreditCard, LogOut, ExternalLink,
  CheckCircle2, Sparkles, ArrowRight, Shield, Calendar, AlertCircle, Settings
} from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';
import { getPlanDisplayName, normalizePlanType } from '@/lib/plans';

const RED = '#dd0000';

type Subscription = {
  planType: string;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

type AccountData = {
  email: string;
  displayCredits: number;
  normalizedPlanType: 'free' | 'pro';
  subscription: Subscription | null;
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [shortlistCount, setShortlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin?callbackUrl=/profile');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    const load = async () => {
      try {
        const [accountRes, shortlistRes] = await Promise.all([
          fetch('/api/user/subscription'),
          fetch('/api/shortlist'),
        ]);
        if (accountRes.ok) setAccountData(await accountRes.json());
        if (shortlistRes.ok) {
          const shortlist = await shortlistRes.json();
          setShortlistCount((shortlist.shortlists || []).length);
        }
      } catch (error) {
        console.error('Failed to load account page', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [status]);

  const handleManageBilling = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/stripe/customer-portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      alert('Failed to open billing portal');
    } finally {
      setActionLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #fef2f2 0%, #ffffff 100%)' }}>
        <SiteNav />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <Loader2 size={40} color={RED} className="animate-spin" />
        </div>
      </div>
    );
  }

  if (!accountData) return null;

  const rawPlanType = accountData.subscription?.planType || 'free';
  const planName = getPlanDisplayName(rawPlanType);
  const normalizedPlanType = accountData.normalizedPlanType || normalizePlanType(rawPlanType);
  const billingDate = accountData.subscription?.currentPeriodEnd
    ? new Date(accountData.subscription.currentPeriodEnd).toLocaleDateString()
    : null;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #fef2f2 0%, #ffffff 100%)' }}>
      <SiteNav />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 100px' }}>
        
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(221,0,0,0.08)', borderRadius: 999, marginBottom: 20, border: '1px solid rgba(221,0,0,0.15)' }}>
            <User size={16} color={RED} />
            <span style={{ fontSize: 13, fontWeight: 700, color: RED, letterSpacing: '0.02em' }}>YOUR ACCOUNT</span>
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: '#0a0a0a', marginBottom: 16, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Welcome back, {session?.user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p style={{ fontSize: 18, color: '#6b7280', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
            Manage your subscription, track progress, and access all your tools
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 48 }}>
          <StatCard icon={<Crown size={24} color="#fff" strokeWidth={2.5} />} label="Current Plan" value={planName} gradient={`linear-gradient(135deg, ${RED} 0%, #ff4444 100%)`} />
          <StatCard icon={<Zap size={24} color="#fff" strokeWidth={2.5} fill="#fff" />} label="AI Credits" value={accountData.displayCredits} gradient="linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)" />
          <StatCard icon={<Bookmark size={24} color="#fff" strokeWidth={2.5} />} label="Saved Programs" value={shortlistCount} gradient="linear-gradient(135deg, #16a34a 0%, #22c55e 100%)" />
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32 }}>
          
          {/* Left */}
          <div style={{ display: 'grid', gap: 24 }}>
            <Card title="Account Details" icon={<User size={24} color="#6b7280" strokeWidth={2.5} />}>
              <InfoRow label="Full Name" value={session?.user?.name || 'Not set'} />
              <InfoRow label="Email Address" value={accountData.email} />
              {billingDate && (
                <div style={{ padding: '16px 20px', background: accountData.subscription?.cancelAtPeriodEnd ? '#fef3c7' : '#f0fdf4', borderRadius: 14, border: `1px solid ${accountData.subscription?.cancelAtPeriodEnd ? '#fde68a' : '#bbf7d0'}`, marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    {accountData.subscription?.cancelAtPeriodEnd ? <AlertCircle size={16} color="#f59e0b" /> : <Calendar size={16} color="#16a34a" />}
                    <p style={{ fontSize: 12, color: accountData.subscription?.cancelAtPeriodEnd ? '#92400e' : '#166534', margin: 0, fontWeight: 700 }}>
                      {accountData.subscription?.cancelAtPeriodEnd ? 'ENDS' : 'RENEWS'}
                    </p>
                  </div>
                  <p style={{ fontSize: 15, color: accountData.subscription?.cancelAtPeriodEnd ? '#78350f' : '#15803d', margin: 0, fontWeight: 800 }}>{billingDate}</p>
                </div>
              )}
            </Card>

            <Card title="Your Benefits" icon={<Sparkles size={24} color="#7c3aed" strokeWidth={2.5} />}>
              {[
                normalizedPlanType === 'free' ? '3 AI credits after login' : '20 AI credits every month',
                normalizedPlanType === 'free' ? 'Basic tool access' : 'Full Pro tool access',
                normalizedPlanType === 'free' ? 'Limited templates' : 'All CV templates unlocked',
                'Save unlimited programs',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#fafafa', borderRadius: 14, border: '1px solid #f0f0f0', marginBottom: 8 }}>
                  <CheckCircle2 size={20} color="#16a34a" strokeWidth={2.5} />
                  <span style={{ fontSize: 15, color: '#374151', fontWeight: 600 }}>{item}</span>
                </div>
              ))}
            </Card>
          </div>

          {/* Right */}
          <div style={{ display: 'grid', gap: 24, alignContent: 'start' }}>
            <Card title="Quick Actions" icon={<Settings size={24} color="#6b7280" strokeWidth={2.5} />}>
              <ActionLink href="/my-shortlist" icon={<Bookmark size={18} />} label="View Shortlist" />
              <ActionLink href="/dashboard" icon={<ArrowRight size={18} />} label="Open Dashboard" />
              <ActionLink href="/pricing" icon={<Crown size={18} />} label="View Plans" />
            </Card>

            <Card title="Subscription & Billing" icon={<CreditCard size={24} color={RED} strokeWidth={2.5} />}>
              {normalizedPlanType === 'free' ? (
                <ActionButton href="/pricing" label="Upgrade to Pro" icon={<Crown size={18} />} primary />
              ) : (
                <>
                  <ActionButton href="/subscription" label="Manage Subscription" icon={<CreditCard size={18} />} primary />
                  <button onClick={handleManageBilling} disabled={actionLoading} style={{ padding: '14px 24px', borderRadius: 14, border: '1.5px solid #e5e7eb', background: '#fff', color: '#6b7280', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 12, width: '100%' }}>
                    {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <ExternalLink size={18} />}
                    Billing Portal
                  </button>
                </>
              )}
              <button onClick={() => signOut({ callbackUrl: '/' })} style={{ padding: '14px 24px', borderRadius: 14, border: '1.5px solid #e5e7eb', background: '#fff', color: '#6b7280', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 12, width: '100%' }}>
                <LogOut size={18} />
                Sign Out
              </button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, gradient }: any) {
  return (
    <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)', border: '1px solid #e5e7eb', borderRadius: 20, padding: 32, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: 48, height: 48, borderRadius: 16, background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        {icon}
      </div>
      <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <h3 style={{ fontSize: 28, fontWeight: 900, color: '#0a0a0a', margin: 0, letterSpacing: '-0.02em' }}>{value}</h3>
    </div>
  );
}

function Card({ title, icon, children }: any) {
  return (
    <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)', border: '1px solid #e5e7eb', borderRadius: 24, padding: 40, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0a0a0a', margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ fontSize: 16, color: '#0a0a0a', margin: 0, fontWeight: 600 }}>{value}</p>
    </div>
  );
}

function ActionLink({ href, icon, label }: any) {
  return (
    <Link href={href} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#fafafa', borderRadius: 14, textDecoration: 'none', color: '#374151', fontWeight: 600, fontSize: 15, marginBottom: 8, border: '1px solid #f0f0f0' }}>
      {icon}
      {label}
    </Link>
  );
}

function ActionButton({ href, label, icon, primary }: any) {
  return (
    <Link href={href} style={{ padding: '16px 24px', borderRadius: 14, border: 'none', background: primary ? `linear-gradient(135deg, ${RED} 0%, #ff4444 100%)` : '#fff', color: primary ? '#fff' : RED, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: primary ? `0 4px 12px ${RED}30` : 'none' }}>
      {icon}
      {label}
    </Link>
  );
}
