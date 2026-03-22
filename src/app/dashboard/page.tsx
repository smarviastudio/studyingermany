'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap, Bookmark, Calendar, FileText, TrendingUp, Award,
  Briefcase, ChevronRight, Calculator, Search, ArrowRight, Crown, Zap, Loader2,
  Sparkles, AlertCircle, User, Euro
} from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';

type ShortlistEntry = {
  id: string;
  programId: string;
  programName: string;
  university: string;
  addedAt: string;
  notes?: string;
};

type PlanProgress = {
  programId: string;
  completed: number;
  total: number;
  nextStep?: string;
  nextStepDue?: string;
};

type UserProfile = {
  fullName?: string;
  phone?: string;
  nationality?: string;
  targetDegreeLevel?: string;
  targetSubjects?: string[];
  preferredLanguage?: string;
  germanLevel?: string;
  englishLevel?: string;
  academicBackground?: string;
  backgroundSummary?: string;
  skills?: string;
  careerGoals?: string;
  preferredCities?: string[];
};

type RecommendedProgram = {
  id: string;
  name: string;
  university: string;
  city: string;
  language: string;
  matchScore: number;
  matchReason: string;
  degreeLevel: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin?callbackUrl=/dashboard');
    }
  }, [status, router]);

  const [shortlistEntries, setShortlistEntries] = useState<ShortlistEntry[]>([]);
  const [planProgress, setPlanProgress] = useState<PlanProgress[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [subscription, setSubscription] = useState<{ planType: string; status: string; currentPeriodEnd?: string } | null>(null);
  const [usage, setUsage] = useState<{ cv: number; motivation: number; cover: number } | null>(null);
  const [recommendedPrograms, setRecommendedPrograms] = useState<RecommendedProgram[]>([]);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [aiCredits, setAiCredits] = useState<number | null>(null);

  const calculateProfileCompletion = (profile: UserProfile | null) => {
    if (!profile) return 0;
    const fields = [
      profile.fullName, profile.phone, profile.nationality, profile.targetDegreeLevel,
      profile.targetSubjects && profile.targetSubjects.length > 0, profile.preferredLanguage,
      profile.germanLevel, profile.englishLevel, profile.academicBackground,
      profile.backgroundSummary, profile.skills, profile.careerGoals,
      profile.preferredCities && profile.preferredCities.length > 0
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  };

  const loadRecommendations = async (profile: UserProfile) => {
    if (!profile.targetSubjects?.length && !profile.targetDegreeLevel) return;
    setRecommendLoading(true);
    try {
      const res = await fetch('/api/programs/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetSubjects: profile.targetSubjects || [],
          degreeLevel: profile.targetDegreeLevel || '',
          preferredLanguage: profile.preferredLanguage || '',
          germanLevel: profile.germanLevel || '',
          englishLevel: profile.englishLevel || '',
          preferredCities: profile.preferredCities || [],
          academicBackground: profile.academicBackground || '',
          careerGoals: profile.careerGoals || ''
        })
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendedPrograms(data.programs || []);
      }
    } catch (error) {
      console.warn('Failed to load recommendations', error);
    } finally {
      setRecommendLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    const loadShortlist = async () => {
      try {
        const res = await fetch('/api/shortlist');
        if (res.ok && !cancelled) {
          const data = await res.json();
          setShortlistEntries(data.entries || []);
        }
      } catch { /* silent */ }
    };

    const loadProgress = async () => {
      try {
        const res = await fetch('/api/plan-progress');
        if (res.ok && !cancelled) {
          const data = await res.json();
          setPlanProgress(data.progress || []);
        }
      } catch { /* silent */ }
    };

    const loadProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok && !cancelled) {
          const data = await res.json();
          const p = data.profile || null;
          setUserProfile(p);
          const pct = calculateProfileCompletion(p);
          setProfileCompletion(pct);
          if (p && pct >= 40) loadRecommendations(p);
        }
      } catch { /* silent */ }
    };

    const loadSubscription = async () => {
      try {
        const res = await fetch('/api/subscription');
        if (res.ok && !cancelled) {
          const data = await res.json();
          setSubscription(data.subscription || { planType: data.planType || 'free', status: 'active' });
          setUsage(data.usage || null);
        }
      } catch { /* silent */ }
    };

    const loadCredits = async () => {
      try {
        const res = await fetch('/api/credits/balance');
        if (res.ok && !cancelled) {
          const data = await res.json();
          if (!data.hasUnlimited) setAiCredits(data.credits);
        }
      } catch { /* silent */ }
    };

    loadShortlist();
    loadProgress();
    loadProfile();
    loadSubscription();
    loadCredits();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  const hasShortlist = shortlistEntries.length > 0;
  const getPlanFor = (programId: string) => planProgress.find((p) => p.programId === programId);
  const userName = session?.user?.name?.split(' ')[0] || 'there';

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteNav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-slate-600">
            Here&apos;s an overview of your study in Germany journey.
          </p>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/my-shortlist" className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-red-300 hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{shortlistEntries.length}</span>
            </div>
            <p className="text-sm font-medium text-slate-600 group-hover:text-red-600 transition-colors">Saved Programs</p>
          </Link>

          <Link href="/profile" className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{profileCompletion}%</span>
            </div>
            <p className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">Profile Complete</p>
          </Link>

          {aiCredits !== null && (
            <Link href="/credits" className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-2xl font-bold text-slate-900">{aiCredits}</span>
              </div>
              <p className="text-sm font-medium text-slate-600 group-hover:text-purple-600 transition-colors">AI Credits</p>
            </Link>
          )}

          <Link href="/course-finder" className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Search className="w-5 h-5 text-emerald-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <p className="text-sm font-medium text-slate-600 group-hover:text-emerald-600 transition-colors">Find Programs</p>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subscription Card */}
            {(subscription?.planType === 'free' || !subscription) && (
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm font-medium text-slate-300">Free Plan</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Upgrade for unlimited AI</h3>
                    <p className="text-sm text-slate-400">
                      {usage ? `${usage.cv + usage.motivation + usage.cover}/5 generations used` : 'Get unlimited AI documents & premium templates'}
                    </p>
                  </div>
                  <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors shrink-0">
                    <Crown className="w-4 h-4" />
                    Upgrade
                  </Link>
                </div>
              </div>
            )}

            {/* AI Recommendations */}
            {profileCompletion >= 40 && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-slate-900">Recommended for You</h2>
                      <p className="text-xs text-slate-500">Based on your profile</p>
                    </div>
                  </div>
                  <Link href="/course-finder" className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1">
                    View all <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="p-4">
                  {recommendLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
                    </div>
                  ) : recommendedPrograms.length > 0 ? (
                    <div className="space-y-3">
                      {recommendedPrograms.slice(0, 3).map((prog) => (
                        <div key={prog.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                            <GraduationCap className="w-6 h-6 text-slate-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate group-hover:text-red-600 transition-colors">{prog.name}</h3>
                            <p className="text-sm text-slate-500 truncate">{prog.university} · {prog.city}</p>
                          </div>
                          <div className="shrink-0 flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-red-500 to-purple-600 text-white text-xs font-bold">
                              {prog.matchScore}%
                            </span>
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-red-600 transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                      <p className="text-sm text-slate-600 mb-3">Complete your profile to get personalized recommendations</p>
                      <Link href="/profile" className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                        Complete Profile <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recent Saved Programs */}
            {hasShortlist && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">Recently Saved</h2>
                  <Link href="/my-shortlist" className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1">
                    View all <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="divide-y divide-slate-100">
                  {shortlistEntries.slice(0, 3).map((entry) => {
                    const plan = getPlanFor(entry.programId);
                    const pct = plan ? Math.round((plan.completed / plan.total) * 100) : 0;
                    return (
                      <div key={entry.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                            <GraduationCap className="w-5 h-5 text-slate-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-slate-900 truncate">{entry.programName}</h3>
                            <p className="text-sm text-slate-500 truncate">{entry.university}</p>
                          </div>
                          <Bookmark className="w-5 h-5 text-red-600 fill-red-600 shrink-0" />
                        </div>
                        {plan && (
                          <div className="mt-3 ml-14">
                            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                              <span>Progress</span>
                              <span className="font-medium">{pct}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-red-500 to-purple-600 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Quick Actions</h2>
              </div>
              <div className="p-3 space-y-1">
                <Link href="/cv-maker" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 text-sm">Create CV</p>
                    <p className="text-xs text-slate-500">German format</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link href="/motivation-letter" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 text-sm">Motivation Letter</p>
                    <p className="text-xs text-slate-500">For universities</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link href="/cover-letter" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <Award className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 text-sm">Cover Letter</p>
                    <p className="text-xs text-slate-500">For jobs</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link href="/gpa-converter" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Calculator className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 text-sm">GPA Converter</p>
                    <p className="text-xs text-slate-500">German scale</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link href="/netto-brutto-calculator" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                    <Euro className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 text-sm">Salary Calculator</p>
                    <p className="text-xs text-slate-500">Net/Gross</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>
            </div>

            {/* Profile Completion - Only show if less than 60% complete */}
            {profileCompletion < 60 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Complete Your Profile</p>
                    <p className="text-xs text-slate-600">{profileCompletion}% complete</p>
                  </div>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all" style={{ width: `${profileCompletion}%` }} />
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Get personalized program recommendations by completing your profile.
                </p>
                <Link href="/profile" className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors">
                  Complete Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Help Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
              <p className="text-sm text-slate-600 mb-4">
                Check our guides for tips on studying in Germany.
              </p>
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700">
                Browse Guides <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {!hasShortlist && profileCompletion < 40 && (
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Start Your Journey</h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Complete your profile and explore programs to begin your path to studying in Germany.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/profile" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">
                <User className="w-5 h-5" />
                Complete Profile
              </Link>
              <Link href="/course-finder" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
                <Search className="w-5 h-5" />
                Find Programs
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
