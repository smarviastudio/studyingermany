'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  User,
  Crown,
  Zap,
  Bookmark,
  CreditCard,
  LogOut,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Clock3,
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

        if (accountRes.ok) {
          const account = await accountRes.json();
          setAccountData(account);
        }

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
      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        <SiteNav />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <Loader2 size={40} color={RED} className="animate-spin" />
        </div>
      </div>
    );
  }

  if (!accountData) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        <SiteNav />
        <main style={{ maxWidth: 980, margin: '0 auto', padding: '120px 24px 88px' }}>
          <section style={sectionCardStyle}>
            <div style={sectionHeaderStyle}>
              <div style={heroIconWrap('#fff3f3')}>
                <User size={20} color={RED} />
              </div>
              <div>
                <h1 style={{ ...sectionTitleStyle, fontSize: 28 }}>Sign in to view your account</h1>
                <p style={sectionSubtitleStyle}>Your session exists, but the account record is missing. Sign in again to restore access.</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/auth/signin?callbackUrl=/profile" style={primaryLinkStyle}>
                Sign in
              </Link>
              <Link href="/" style={secondaryLinkStyle}>
                Go home
              </Link>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const rawPlanType = accountData.subscription?.planType || 'free';
  const planName = getPlanDisplayName(rawPlanType);
  const normalizedPlanType = accountData.normalizedPlanType || normalizePlanType(rawPlanType);
  const billingDate = accountData.subscription?.currentPeriodEnd
    ? new Date(accountData.subscription.currentPeriodEnd).toLocaleDateString()
    : null;

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <SiteNav />

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '96px 24px 88px' }}>
        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 32,
            padding: '34px 34px 30px',
            marginBottom: 26,
            border: '1px solid rgba(15,23,42,0.08)',
            background: 'linear-gradient(135deg, #fff 0%, #fff7f7 45%, #f6f0ff 100%)',
            boxShadow: '0 24px 70px rgba(15,23,42,0.08)',
          }}
        >
          <div style={{ position: 'absolute', inset: 'auto -120px -120px auto', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(221,0,0,0.12) 0%, rgba(221,0,0,0) 70%)' }} />
          <div style={{ position: 'absolute', inset: '-110px auto auto -90px', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.10) 0%, rgba(124,58,237,0) 70%)' }} />

          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(320px, 0.95fr)', gap: 28, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8b8b8b', margin: '0 0 12px' }}>
                Account
              </p>
              <h1 style={{ fontSize: 'clamp(34px, 4vw, 52px)', lineHeight: 1.02, fontWeight: 900, color: '#0f172a', margin: '0 0 14px' }}>
                Manage your plan, credits, and shortlist in one place.
              </h1>
              <p style={{ maxWidth: 700, fontSize: 17, lineHeight: 1.7, color: '#4b5563', margin: 0 }}>
                A compact account page built for the current product: Free and Pro, AI credits, shortlist access, and billing.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 22 }}>
                <span style={heroChipStyle}><Shield size={14} /> Secure login</span>
                <span style={heroChipStyle}><Clock3 size={14} /> Live plan status</span>
                <span style={heroChipStyle}><Bookmark size={14} /> Shortlist tracking</span>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 14 }}>
              <div style={heroPanelStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={heroIconWrap('#fff3f3')}>
                    <User size={22} color={RED} />
                  </div>
                  <div>
                    <p style={panelLabelStyle}>Signed in as</p>
                    <p style={panelValueStyle}>{session?.user?.name || 'User'}</p>
                  </div>
                </div>
                <p style={panelSubtextStyle}>{accountData.email}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={miniStatStyle}>
                  <div style={heroIconWrap('#fff3f3')}>
                    <Crown size={20} color={RED} />
                  </div>
                  <p style={miniStatLabel}>Plan</p>
                  <p style={miniStatValue}>{planName}</p>
                </div>
                <div style={miniStatStyle}>
                  <div style={heroIconWrap('#f3f0ff')}>
                    <Zap size={20} color="#7c3aed" />
                  </div>
                  <p style={miniStatLabel}>Credits</p>
                  <p style={miniStatValue}>{accountData.displayCredits}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(300px, 0.9fr)', gap: 24, alignItems: 'start' }}>
          <section style={{ display: 'grid', gap: 18 }}>
            <div style={sectionCardStyle}>
              <div style={sectionHeaderStyle}>
                <div style={heroIconWrap('#fff3f3')}>
                  <Sparkles size={20} color={RED} />
                </div>
                <div>
                  <h2 style={sectionTitleStyle}>What you have access to</h2>
                  <p style={sectionSubtitleStyle}>A clean summary of your current entitlements.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                {[
                  normalizedPlanType === 'free' ? '3 AI credits after login' : '20 AI credits every month',
                  normalizedPlanType === 'free' ? 'Basic tool access' : 'Full Pro tool access',
                  normalizedPlanType === 'free' ? 'Limited templates' : 'All CV templates unlocked',
                  'Save programs to your shortlist',
                ].map((item) => (
                  <div key={item} style={featureRowStyle}>
                    <CheckCircle2 size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 15, color: '#374151', lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={sectionCardStyle}>
              <div style={sectionHeaderStyle}>
                <div style={heroIconWrap('#eefaf2')}>
                  <Bookmark size={20} color="#16a34a" />
                </div>
                <div>
                  <h2 style={sectionTitleStyle}>Shortlist overview</h2>
                  <p style={sectionSubtitleStyle}>Saved programs are tracked here for later review.</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
                <div style={statTileStyle}>
                  <p style={statTileLabel}>Saved</p>
                  <p style={statTileValue}>{shortlistCount}</p>
                </div>
                <div style={statTileStyle}>
                  <p style={statTileLabel}>Visibility</p>
                  <p style={statTileValue}>Private</p>
                </div>
                <div style={statTileStyle}>
                  <p style={statTileLabel}>Action</p>
                  <p style={statTileValue}><Link href="/my-shortlist" style={{ color: RED, textDecoration: 'none' }}>Open</Link></p>
                </div>
              </div>
            </div>
          </section>

          <aside style={{ display: 'grid', gap: 18 }}>
            <div style={sectionCardStyle}>
              <div style={sectionHeaderStyle}>
                <div style={heroIconWrap('#f8fafc')}>
                  <ArrowRight size={20} color="#111827" />
                </div>
                <div>
                  <h2 style={sectionTitleStyle}>Quick links</h2>
                  <p style={sectionSubtitleStyle}>Fast access to the main user flows.</p>
                </div>
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                <Link href="/my-shortlist" style={quickLinkStyle}>Open shortlist</Link>
                <Link href="/credits" style={quickLinkStyle}>View credits</Link>
                <Link href="/pricing" style={quickLinkStyle}>See pricing</Link>
                <Link href="/dashboard" style={quickLinkStyle}>Open dashboard</Link>
              </div>
            </div>

            <div style={sectionCardStyle}>
              <div style={sectionHeaderStyle}>
                <div style={heroIconWrap('#fff3f3')}>
                  <CreditCard size={20} color={RED} />
                </div>
                <div>
                  <h2 style={sectionTitleStyle}>Account actions</h2>
                  <p style={sectionSubtitleStyle}>Billing and access controls.</p>
                </div>
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {normalizedPlanType === 'pro' && (
                  <button onClick={handleManageBilling} disabled={actionLoading} style={primaryButtonStyle}>
                    {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
                    Manage billing
                  </button>
                )}
                <Link href="/pricing" style={normalizedPlanType === 'free' ? primaryLinkStyle : secondaryLinkStyle}>
                  <ExternalLink size={16} />
                  {normalizedPlanType === 'free' ? 'Upgrade to Pro' : 'Change plan'}
                </Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} style={secondaryButtonStyle}>
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

const heroChipStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 14px',
  borderRadius: 999,
  border: '1px solid rgba(15,23,42,0.08)',
  background: 'rgba(255,255,255,0.75)',
  color: '#374151',
  fontSize: 13,
  fontWeight: 700,
  backdropFilter: 'blur(10px)',
};

const heroPanelStyle: React.CSSProperties = {
  borderRadius: 24,
  border: '1px solid rgba(15,23,42,0.08)',
  background: 'rgba(255,255,255,0.82)',
  padding: 20,
  boxShadow: '0 16px 40px rgba(15,23,42,0.05)',
};

const heroIconWrap = (background: string): React.CSSProperties => ({
  width: 44,
  height: 44,
  borderRadius: 14,
  background,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const panelLabelStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#6b7280',
  margin: 0,
};

const panelValueStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  color: '#111827',
  margin: '2px 0 0',
};

const panelSubtextStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#6b7280',
  margin: '14px 0 0',
  wordBreak: 'break-word',
};

const miniStatStyle: React.CSSProperties = {
  borderRadius: 22,
  border: '1px solid rgba(15,23,42,0.08)',
  background: 'rgba(255,255,255,0.82)',
  padding: 18,
  boxShadow: '0 12px 30px rgba(15,23,42,0.04)',
};

const miniStatLabel: React.CSSProperties = {
  fontSize: 13,
  color: '#6b7280',
  margin: '12px 0 4px',
};

const miniStatValue: React.CSSProperties = {
  fontSize: 22,
  lineHeight: 1.1,
  fontWeight: 900,
  color: '#111827',
  margin: 0,
};

const sectionCardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 28,
  padding: 26,
  boxShadow: '0 14px 40px rgba(15,23,42,0.04)',
};

const sectionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  marginBottom: 18,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 850,
  color: '#111827',
  margin: 0,
};

const sectionSubtitleStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#6b7280',
  margin: '4px 0 0',
};

const featureRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  padding: '14px 16px',
  background: '#fafafa',
  border: '1px solid #f0f0f0',
  borderRadius: 18,
};

const statTileStyle: React.CSSProperties = {
  borderRadius: 18,
  background: '#fafafa',
  border: '1px solid #f0f0f0',
  padding: 16,
};

const statTileLabel: React.CSSProperties = {
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: '#6b7280',
  margin: '0 0 8px',
  fontWeight: 700,
};

const statTileValue: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 900,
  color: '#111827',
  margin: 0,
};

const quickLinkStyle: React.CSSProperties = {
  padding: '13px 16px',
  borderRadius: 16,
  border: '1px solid #ececec',
  textDecoration: 'none',
  color: '#222',
  fontWeight: 700,
  fontSize: 14,
  background: 'linear-gradient(180deg, #ffffff, #fafafa)',
};

const primaryButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '13px 16px',
  borderRadius: 16,
  border: 'none',
  background: '#111827',
  color: '#fff',
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
};

const secondaryButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '13px 16px',
  borderRadius: 16,
  border: '1px solid #e5e5e5',
  background: '#fff',
  color: '#444',
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
};

const primaryLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '13px 16px',
  borderRadius: 16,
  border: 'none',
  background: RED,
  color: '#fff',
  fontWeight: 700,
  fontSize: 14,
  textDecoration: 'none',
};

const secondaryLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '13px 16px',
  borderRadius: 16,
  border: `1px solid ${RED}`,
  background: '#fff',
  color: RED,
  fontWeight: 700,
  fontSize: 14,
  textDecoration: 'none',
};
