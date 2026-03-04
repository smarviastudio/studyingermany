'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Loader2, Bookmark, Trash2, ArrowRight, ArrowLeft, Search,
  GraduationCap, MapPin, Calendar, FileText, Sparkles, ChevronRight,
  BookOpen, ExternalLink
} from 'lucide-react';
import type { Program } from '@/lib/types';

interface ShortlistItem {
  id: string;
  programId: string;
  programName: string;
  university: string;
  addedAt: string;
  notes?: string;
}

type PlanProgress = {
  completed: number;
  total: number;
  updatedAt?: string;
};

export default function MyShortlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shortlist, setShortlist] = useState<ShortlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [programDetails, setProgramDetails] = useState<Record<string, Program>>({});
  const [planProgress, setPlanProgress] = useState<Record<string, PlanProgress>>({});
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [navigatingId, setNavigatingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/my-shortlist');
      return;
    }

    if (status === 'authenticated') {
      fetchShortlist();
    }
  }, [status, router]);

  const fetchShortlist = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/shortlist');
      
      if (!response.ok) {
        throw new Error('Failed to fetch shortlist');
      }

      const data = await response.json();
      setShortlist(data.shortlists || []);
    } catch (err) {
      setError('Failed to load shortlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status !== 'authenticated') return;

    let cancelled = false;
    const loadPlans = async () => {
      try {
        const response = await fetch('/api/application-plans', { cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        if (cancelled) return;

        const progressMap: Record<string, PlanProgress> = {};
        (data.plans || []).forEach((planRecord: any) => {
          if (!planRecord?.programId || !planRecord?.planData) return;
          try {
            const parsed = JSON.parse(planRecord.planData);
            const steps = Array.isArray(parsed?.steps) ? parsed.steps : [];
            const total = steps.length;
            const completed = steps.filter((step: any) => step?.completed).length;
            if (total > 0) {
              progressMap[planRecord.programId] = {
                completed,
                total,
                updatedAt: planRecord.updatedAt,
              };
            }
          } catch (parseError) {
            console.error('Failed to parse plan progress', parseError);
          }
        });

        setPlanProgress(progressMap);
      } catch (planError) {
        console.error('Plan progress fetch error', planError);
      }
    };

    loadPlans();

    return () => {
      cancelled = true;
    };
  }, [status]);

  useEffect(() => {
    if (shortlist.length === 0) return;

    const missingProgramIds = shortlist
      .map((item) => item.programId)
      .filter((programId) => !programDetails[programId]);

    if (missingProgramIds.length === 0) return;

    let cancelled = false;

    const loadProgramDetails = async () => {
      const entries = await Promise.all(
        missingProgramIds.map(async (programId) => {
          try {
            const response = await fetch(`/api/programs/${programId}`, { cache: 'no-store' });
            if (!response.ok) return null;
            const data = await response.json();
            return { programId, program: data.program as Program };
          } catch (detailError) {
            console.error('Program detail fetch error', detailError);
            return null;
          }
        })
      );

      if (cancelled) return;

      setProgramDetails((prev) => {
        const next = { ...prev };
        entries.forEach((entry) => {
          if (entry?.programId && entry.program && !next[entry.programId]) {
            next[entry.programId] = entry.program;
          }
        });
        return next;
      });
    };

    loadProgramDetails();

    return () => {
      cancelled = true;
    };
  }, [shortlist]);

  const removeFromShortlist = async (programId: string) => {
    try {
      setRemovingId(programId);
      const response = await fetch(`/api/shortlist?programId=${programId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove from shortlist');
      }

      setShortlist(shortlist.filter(item => item.programId !== programId));
    } catch (err) {
      console.error('Remove error:', err);
    } finally {
      setRemovingId(null);
    }
  };

  const handleNavigate = (programId: string, path: string) => {
    setNavigatingId(programId + path);
    router.push(path);
  };

  /* ── Loading skeleton ── */
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a]">
        <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0a1a]/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
            <div className="flex items-center gap-2 text-white/40 text-sm"><ArrowLeft className="w-4 h-4" /> Dashboard</div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"><GraduationCap className="w-3.5 h-3.5 text-white" /></div>
              <span className="text-white font-semibold text-sm">StudyGermany</span>
            </div>
          </div>
        </nav>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <p className="text-white/40 text-sm">Loading your shortlist...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progressPct = (p: PlanProgress) => Math.round((p.completed / p.total) * 100);

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0a1a]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
          <Link href="/dashboard" className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"><GraduationCap className="w-3.5 h-3.5 text-white" /></div>
            <span className="text-white font-semibold text-sm">StudyGermany</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">My Shortlist</h1>
            <p className="text-white/40 text-sm">
              {shortlist.length} program{shortlist.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <Link
            href="/course-finder"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-600/20"
          >
            <Search className="w-4 h-4" /> Find Programs
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {shortlist.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-[#0f0f23] p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-5">
              <Bookmark className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No programs shortlisted yet</h2>
            <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">
              Start exploring programs and save the ones you&apos;re interested in to track your applications.
            </p>
            <Link
              href="/course-finder"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
            >
              Browse Programs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {shortlist.map((item) => {
              const prog = programDetails[item.programId];
              const plan = planProgress[item.programId];
              const isRemoving = removingId === item.programId;

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border border-white/[0.06] bg-[#0f0f23] hover:border-white/[0.12] transition-all ${isRemoving ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <div className="p-5 flex flex-col md:flex-row gap-5">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      {prog?.image_url ? (
                        <div className="w-full md:w-28 h-28 relative rounded-lg overflow-hidden border border-white/[0.06]">
                          <Image
                            src={prog.image_url as string}
                            alt={item.programName}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 112px"
                            unoptimized={true}
                          />
                        </div>
                      ) : (
                        <div className="w-full md:w-28 h-28 rounded-lg border border-dashed border-white/[0.08] flex items-center justify-center bg-white/[0.02]">
                          <GraduationCap className="w-8 h-8 text-white/10" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-lg mb-1 truncate">{item.programName}</h3>
                      <p className="text-white/50 text-sm mb-3">{item.university}</p>

                      <div className="flex flex-wrap gap-3 text-xs text-white/30">
                        {prog?.city && (
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{prog.city}</span>
                        )}
                        {prog?.degree_level && (
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{prog.degree_level}</span>
                        )}
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Added {new Date(item.addedAt).toLocaleDateString()}</span>
                      </div>

                      {/* Progress bar */}
                      {plan && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-emerald-400 font-medium">Application progress</span>
                            <span className="text-white/40">{plan.completed}/{plan.total} steps</span>
                          </div>
                          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all" style={{ width: `${progressPct(plan)}%` }} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 md:w-52 flex-shrink-0">
                      <button
                        onClick={() => handleNavigate(item.programId, `/course-finder/${item.programId}?source=shortlist`)}
                        disabled={navigatingId === item.programId + `/course-finder/${item.programId}?source=shortlist`}
                        className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-60"
                      >
                        <span>{plan ? 'Continue application' : 'Start application'}</span>
                        {navigatingId === item.programId + `/course-finder/${item.programId}?source=shortlist` ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleNavigate(item.programId, `/motivation-letter?programId=${item.programId}`)}
                        disabled={navigatingId === item.programId + `/motivation-letter?programId=${item.programId}`}
                        className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white/80 hover:bg-white/[0.06] font-medium text-sm transition-all disabled:opacity-60"
                      >
                        <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Motivation Letter</span>
                        {navigatingId === item.programId + `/motivation-letter?programId=${item.programId}` ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => removeFromShortlist(item.programId)}
                        disabled={isRemoving}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 text-xs transition-all disabled:opacity-60"
                      >
                        {isRemoving ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
