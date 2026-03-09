'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  GraduationCap, Bookmark, Calendar, FileText, Target, TrendingUp, Award,
  Briefcase, Star, ChevronRight, Calculator, Search, ArrowRight
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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [shortlistEntries, setShortlistEntries] = useState<ShortlistEntry[]>([]);
  const [planProgress, setPlanProgress] = useState<PlanProgress[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Calculate profile completion percentage
  const calculateProfileCompletion = (profile: UserProfile | null) => {
    if (!profile) return 0;
    const fields = [
      profile.targetDegreeLevel,
      profile.targetSubjects && profile.targetSubjects.length > 0,
      profile.preferredLanguage,
      profile.germanLevel,
      profile.englishLevel,
      profile.academicBackground,
      profile.backgroundSummary,
      profile.skills,
      profile.careerGoals,
      profile.preferredCities && profile.preferredCities.length > 0
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  // Load user's shortlist, progress, and profile
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    const loadShortlist = async () => {
      try {
        const res = await fetch('/api/user/shortlist');
        if (res.ok && !cancelled) {
          const data = await res.json();
          setShortlistEntries(data.entries || []);
        }
      } catch (error) {
        console.warn('Failed to load shortlist', error);
      }
    };
    const loadProgress = async () => {
      try {
        const res = await fetch('/api/user/progress');
        if (res.ok && !cancelled) {
          const data = await res.json();
          setPlanProgress(data.progress || []);
        }
      } catch (error) {
        console.warn('Failed to load progress', error);
      }
    };
    const loadProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok && !cancelled) {
          const data = await res.json();
          setUserProfile(data.profile || null);
          setProfileCompletion(calculateProfileCompletion(data.profile || null));
        }
      } catch (error) {
        console.warn('Failed to load profile', error);
      }
    };
    loadShortlist();
    loadProgress();
    loadProfile();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  const hasShortlist = shortlistEntries.length > 0;
  const hasPlans = planProgress.length > 0;

  // Helper: get plan progress for a program
  const getPlanFor = (programId: string) => planProgress.find((p) => p.programId === programId);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <SiteNav />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #dd0000, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(221,0,0,0.2)' }}>
              <GraduationCap className="w-8 h-8" style={{ color: '#fff' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#0a0a0a', margin: '0 0 6px' }}>Your Dashboard</h1>
              <p style={{ fontSize: 15, color: '#737373', margin: 0 }}>Track your study in Germany journey</p>
            </div>
          </div>
          
          {/* Main CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, #dd0000, #7c3aed)', borderRadius: 16, padding: '20px 24px', boxShadow: '0 4px 20px rgba(221,0,0,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap className="w-6 h-6" style={{ color: '#fff' }} />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>Welcome to Your Dashboard</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: 0 }}>Track your study in Germany journey</p>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards - Now Clickable */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 40 }}>
          <Link href={hasShortlist ? "/my-shortlist" : "/"} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24, textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#dd0000'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#ebebeb'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(221,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bookmark className="w-6 h-6" style={{ color: '#dd0000' }} />
              </div>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#0a0a0a' }}>{shortlistEntries.length}</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111', margin: '0 0 4px' }}>Saved Programs</h3>
            <p style={{ fontSize: 14, color: '#737373', margin: '0 0 12px' }}>Programs you've shortlisted</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#dd0000', fontSize: 13, fontWeight: 600 }}>
              {hasShortlist ? 'View saved programs' : 'Browse homepage'}
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target className="w-6 h-6" style={{ color: '#22c55e' }} />
              </div>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#0a0a0a' }}>{planProgress.length}</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111', margin: '0 0 4px' }}>Application Plans</h3>
            <p style={{ fontSize: 14, color: '#737373', margin: 0 }}>Track your applications</p>
          </div>

          <Link href="/profile" style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24, textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#ebebeb'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp className="w-6 h-6" style={{ color: '#3b82f6' }} />
              </div>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#0a0a0a' }}>{profileCompletion}%</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111', margin: '0 0 4px' }}>Profile Complete</h3>
            <p style={{ fontSize: 14, color: '#737373', margin: '0 0 12px' }}>Complete your profile for better recommendations</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#3b82f6', fontSize: 13, fontWeight: 600 }}>
              {profileCompletion === 100 ? 'View profile' : 'Complete profile'}
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Application Tools */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 20px' }}>Application Tools</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>

            <Link href="/cv-maker" style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24, textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#dd0000'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#ebebeb'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #dd0000, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText className="w-6 h-6" style={{ color: '#fff' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>Create CV</h3>
                  <p style={{ fontSize: 14, color: '#737373', margin: 0 }}>Build professional CV</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#dd0000', fontSize: 14, fontWeight: 600 }}>
                Create CV
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

            <Link href="/motivation-letter" style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24, textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#dd0000'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#ebebeb'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #dd0000, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase className="w-6 h-6" style={{ color: '#fff' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>Write Letter</h3>
                  <p style={{ fontSize: 14, color: '#737373', margin: 0 }}>Generate motivation letter</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#dd0000', fontSize: 14, fontWeight: 600 }}>
                Write Letter
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

            <Link href="/cover-letter" style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24, textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#dd0000'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#ebebeb'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #dd0000, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award className="w-6 h-6" style={{ color: '#fff' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>Cover Letter</h3>
                  <p style={{ fontSize: 14, color: '#737373', margin: 0 }}>Professional cover letters</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#dd0000', fontSize: 14, fontWeight: 600 }}>
                Create Cover Letter
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

            <Link href="/gpa-converter" style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24, textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#dd0000'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#ebebeb'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #dd0000, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calculator className="w-6 h-6" style={{ color: '#fff' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>GPA Converter</h3>
                  <p style={{ fontSize: 14, color: '#737373', margin: 0 }}>Convert your grades</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#dd0000', fontSize: 14, fontWeight: 600 }}>
                Convert GPA
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

            <Link href="/netto-brutto-calculator" style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24, textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#dd0000'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#ebebeb'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #dd0000, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp className="w-6 h-6" style={{ color: '#fff' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>Salary Calculator</h3>
                  <p style={{ fontSize: 14, color: '#737373', margin: 0 }}>Calculate net/gross salary</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#dd0000', fontSize: 14, fontWeight: 600 }}>
                Calculate Salary
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

          </div>
        </section>

        {/* Recent Activity */}
        {hasShortlist && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>Recent Activity</h2>
              <Link href="/my-shortlist" style={{ color: '#dd0000', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                View all
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              {shortlistEntries.slice(0, 3).map((entry) => {
                const plan = getPlanFor(entry.programId);
                const pct = plan ? Math.round((plan.completed / plan.total) * 100) : 0;

                return (
                  <div key={entry.id} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 16, padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <GraduationCap className="w-5 h-5" style={{ color: '#999' }} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111', margin: '0 0 2px' }}>{entry.programName}</h3>
                          <p style={{ fontSize: 12, color: '#737373', margin: 0 }}>{entry.university}</p>
                        </div>
                      </div>
                      <Bookmark className="w-4 h-4" style={{ color: '#dd0000', fill: '#dd0000' }} />
                    </div>
                    {plan && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: '#737373' }}>Application Progress</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>{pct}%</span>
                        </div>
                        <div style={{ height: 6, background: '#f5f5f5', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #dd0000, #7c3aed)', borderRadius: 3 }} />
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#737373' }}>
                      <Calendar className="w-3 h-3" />
                      Added {new Date(entry.addedAt).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!hasShortlist && (
          <section style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: 80, height: 80, margin: '0 auto 24px', borderRadius: 20, background: '#fafafa', border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search className="w-10 h-10" style={{ color: '#999' }} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#111', marginBottom: 12 }}>Start Your Journey</h2>
            <p style={{ fontSize: 16, color: '#737373', marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
              Complete your profile and explore our tools to prepare for studying in Germany.
            </p>
            <Link href="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 12, fontSize: 15, fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #dd0000, #7c3aed)', textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(221,0,0,0.2)' }}>
              <TrendingUp className="w-5 h-5" />
              Complete Profile
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
