'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  GraduationCap, Bookmark, Zap, Loader2, Sparkles, Search, ArrowRight,
  Crown, FileText, Briefcase, Award, Calculator, ChevronRight, LayoutGrid,
  Heart, Settings, CheckCircle2, BookOpen, User, CreditCard, LogOut,
  ExternalLink, Calendar, AlertCircle, Mail
} from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';
import { getPlanDisplayName, normalizePlanType } from '@/lib/plans';

// Types
interface ShortlistEntry {
  id: string;
  programId: string;
  programName: string;
  university: string;
  addedAt: string;
}

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

// Dashboard Component
function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = status === 'authenticated';
  const checkoutSuccess = searchParams.get('success') === 'true';
  const checkoutSessionId = searchParams.get('session_id');

  // State
  const [shortlistEntries, setShortlistEntries] = useState<ShortlistEntry[]>([]);
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncingCheckout, setSyncingCheckout] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'account'>('overview');

  // Load data
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    const loadData = async () => {
      try {
        const [shortlistRes, accountRes] = await Promise.all([
          fetch('/api/shortlist').catch(() => null),
          fetch('/api/user/subscription').catch(() => null),
        ]);

        if (!cancelled) {
          if (shortlistRes?.ok) {
            const data = await shortlistRes.json();
            setShortlistEntries(data.entries || data.shortlists || []);
          }
          if (accountRes?.ok) setAccountData(await accountRes.json());
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  // Sync checkout
  useEffect(() => {
    if (!isAuthenticated || !checkoutSuccess) return;
    const syncCheckout = async () => {
      setSyncingCheckout(true);
      try {
        await fetch('/api/stripe/sync-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(checkoutSessionId ? { sessionId: checkoutSessionId } : {}),
        });
        const res = await fetch('/api/user/subscription');
        if (res.ok) setAccountData(await res.json());
        router.replace('/dashboard');
      } finally {
        setSyncingCheckout(false);
      }
    };
    syncCheckout();
  }, [isAuthenticated, checkoutSuccess, checkoutSessionId, router]);

  // Auth redirect
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin?callbackUrl=/dashboard');
    }
  }, [status, router]);

  const handleManageBilling = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/stripe/customer-portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert('Failed to open billing portal');
    } finally {
      setActionLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  const userName = session?.user?.name?.split(' ')[0] || 'there';
  const rawPlanType = accountData?.subscription?.planType || 'free';
  const planName = getPlanDisplayName(rawPlanType);
  const normalizedPlanType = accountData?.normalizedPlanType || normalizePlanType(rawPlanType);
  const isPro = normalizedPlanType === 'pro';
  const aiCredits = accountData?.displayCredits ?? 3;
  const billingDate = accountData?.subscription?.currentPeriodEnd
    ? new Date(accountData.subscription.currentPeriodEnd).toLocaleDateString()
    : null;
  const hasShortlist = shortlistEntries.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteNav />

      <main className="pt-20 pb-12">
        {/* Top Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {userName}!
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Here&apos;s what&apos;s happening with your study journey
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!isPro && (
                <Link
                  href="/pricing"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg text-sm font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-sm"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade to Pro
                </Link>
              )}
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {syncingCheckout && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-800">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Finalizing your subscription...</span>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Saved Programs */}
            <Link href="/my-shortlist" className="group">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-red-200 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                    <Heart className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{shortlistEntries.length}</span>
                </div>
                <p className="text-sm font-medium text-gray-600">Saved Programs</p>
                <p className="text-xs text-gray-400 mt-1">View your shortlist</p>
              </div>
            </Link>

            {/* Plan Status */}
            <Link href="/pricing" className="group">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-amber-200 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${isPro ? 'bg-amber-50 group-hover:bg-amber-100' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                    {isPro ? <Crown className="w-5 h-5 text-amber-600" /> : <Zap className="w-5 h-5 text-gray-600" />}
                  </div>
                  <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${isPro ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                    {isPro ? 'Pro' : 'Free'}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600">Current Plan</p>
                <p className="text-xs text-gray-400 mt-1">{isPro ? 'All features unlocked' : 'Upgrade for more'}</p>
              </div>
            </Link>

            {/* AI Credits */}
            <Link href="/credits" className="group">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{aiCredits}</span>
                </div>
                <p className="text-sm font-medium text-gray-600">AI Credits</p>
                <p className="text-xs text-gray-400 mt-1">For AI generations</p>
              </div>
            </Link>

            {/* Find Programs */}
            <Link href="/" className="group">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <Search className="w-5 h-5 text-emerald-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                <p className="text-sm font-medium text-gray-600">Find Programs</p>
                <p className="text-xs text-gray-400 mt-1">Search courses</p>
              </div>
            </Link>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Featured Programs / Course Finder CTA */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50/50 to-purple-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center shadow-sm">
                        <Search className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900">Find Your Perfect Program</h2>
                        <p className="text-xs text-gray-500">Search 600+ programs in Germany</p>
                      </div>
                    </div>
                    <Link href="/" className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1">
                      Search <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">600+ Programs</p>
                        <p className="text-xs text-gray-500">Bachelor & Master</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">AI Search</p>
                        <p className="text-xs text-gray-500">Smart matching</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Save Favorites</p>
                        <p className="text-xs text-gray-500">Shortlist anytime</p>
                      </div>
                    </div>
                  </div>
                  <Link href="/" className="block w-full text-center px-5 py-3 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                    Start Searching Programs
                  </Link>
                </div>
              </div>

              {/* Saved Programs */}
              {hasShortlist ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                        <Bookmark className="w-4 h-4 text-red-600" />
                      </div>
                      <h2 className="font-semibold text-gray-900">Saved Programs</h2>
                    </div>
                    <Link href="/my-shortlist" className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1">
                      View all <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {shortlistEntries.slice(0, 3).map((entry) => (
                      <Link
                        key={entry.id}
                        href="/my-shortlist"
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{entry.programName}</h3>
                          <p className="text-sm text-gray-500 truncate">{entry.university}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Start Your Journey</h3>
                      <p className="text-sm text-gray-300 max-w-md">
                        Discover programs that match your profile and save them to your shortlist for later.
                      </p>
                    </div>
                    <div className="hidden sm:flex w-12 h-12 rounded-xl bg-white/10 items-center justify-center">
                      <Search className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
                      <Search className="w-4 h-4" />
                      Find Programs
                    </Link>
                    <Link href="/tools" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
                      <LayoutGrid className="w-4 h-4" />
                      Explore Tools
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Quick Actions */}
            <div className="space-y-6">
              {/* Tools Grid */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Quick Tools</h2>
                </div>
                <div className="p-3 grid grid-cols-2 gap-2">
                  <Link href="/cv-maker" className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-red-50 transition-colors group text-center">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                      <FileText className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Create CV</span>
                  </Link>

                  <Link href="/motivation-letter" className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-purple-50 transition-colors group text-center">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Motivation</span>
                  </Link>

                  <Link href="/cover-letter" className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-emerald-50 transition-colors group text-center">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                      <Award className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Cover Letter</span>
                  </Link>

                  <Link href="/gpa-converter" className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-blue-50 transition-colors group text-center">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Calculator className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">GPA</span>
                  </Link>
                </div>
              </div>

              {/* Pro Card for Free Users */}
              {!isPro && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Crown className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Go Pro</h3>
                      <p className="text-xs text-gray-500">Unlock all features</p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      20 AI credits monthly
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      All CV templates
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Priority support
                    </li>
                  </ul>
                  <Link href="/pricing" className="block w-full text-center px-4 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors">
                    Upgrade Now
                  </Link>
                </div>
              )}

              {/* Help Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Need Help?</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Browse our guides for tips on studying in Germany.
                </p>
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700">
                  Browse Guides <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Account & Billing Section */}
          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            {/* Account Details */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <h2 className="font-semibold text-gray-900">Account Details</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-gray-900 font-medium">{session?.user?.name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                  <p className="text-gray-900 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {accountData?.email || session?.user?.email || 'Not set'}
                  </p>
                </div>
                {billingDate && (
                  <div className={`p-4 rounded-xl ${accountData?.subscription?.cancelAtPeriodEnd ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {accountData?.subscription?.cancelAtPeriodEnd ? (
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Calendar className="w-4 h-4 text-green-600" />
                      )}
                      <p className={`text-xs font-bold uppercase ${accountData?.subscription?.cancelAtPeriodEnd ? 'text-amber-700' : 'text-green-700'}`}>
                        {accountData?.subscription?.cancelAtPeriodEnd ? 'Subscription Ends' : 'Next Renewal'}
                      </p>
                    </div>
                    <p className={`font-bold ${accountData?.subscription?.cancelAtPeriodEnd ? 'text-amber-800' : 'text-green-800'}`}>
                      {billingDate}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Subscription & Billing */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-red-600" />
                </div>
                <h2 className="font-semibold text-gray-900">Subscription & Billing</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Current Plan</p>
                    <p className="text-lg font-bold text-gray-900">{planName}</p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${isPro ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-600'}`}>
                    {isPro ? 'Active' : 'Free Tier'}
                  </div>
                </div>

                {isPro ? (
                  <>
                    <Link href="/subscription" className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">
                      <Settings className="w-4 h-4" />
                      Manage Subscription
                    </Link>
                    <button
                      onClick={handleManageBilling}
                      disabled={actionLoading}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                      Open Billing Portal
                    </button>
                  </>
                ) : (
                  <Link href="/pricing" className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all">
                    <Crown className="w-4 h-4" />
                    Upgrade to Pro
                  </Link>
                )}

                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white border border-gray-200 text-gray-500 rounded-xl font-medium hover:bg-gray-50 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Export with Suspense
export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
