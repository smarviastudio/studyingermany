'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Loader2, Bookmark, Trash2, ArrowRight, Search,
  GraduationCap, MapPin, Calendar, FileText, Sparkles,
  BookOpen, ExternalLink, X, Euro, Clock, Globe, Award, CheckCircle2, Info
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
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

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

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#dd0000' }} />
            <p style={{ fontSize: 15, color: '#737373', fontWeight: 500 }}>Loading your shortlist...</p>
          </div>
        </div>
      </div>
    );
  }

  const progressPct = (p: PlanProgress) => Math.round((p.completed / p.total) * 100);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <div className="program-detail-modal-overlay" onClick={() => setSelectedProgram(null)}>
          <div className="program-detail-modal" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProgram(null)} className="program-detail-close">
              <X className="w-5 h-5" />
            </button>

            {selectedProgram.image_url && (
              <div style={{ height: 240, position: 'relative', borderRadius: '20px 20px 0 0', overflow: 'hidden', background: 'linear-gradient(135deg, #f5f5f0, #eee)' }}>
                <Image src={selectedProgram.image_url} alt={selectedProgram.program_name} fill style={{ objectFit: 'cover' }} sizes="800px" unoptimized />
              </div>
            )}

            <div style={{ padding: 32 }}>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, color: '#0a0a0a', margin: '0 0 8px', lineHeight: 1.2 }}>
                  {selectedProgram.program_name}
                </h2>
                <p style={{ fontSize: 16, color: '#666', margin: '0 0 16px' }}>{selectedProgram.university}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {selectedProgram.city && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#f5f5f5', borderRadius: 8, fontSize: 13, color: '#555', fontWeight: 600 }}>
                      <MapPin className="w-3.5 h-3.5" /> {selectedProgram.city}
                    </span>
                  )}
                  {selectedProgram.degree_level && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#f5f5f5', borderRadius: 8, fontSize: 13, color: '#555', fontWeight: 600 }}>
                      <Award className="w-3.5 h-3.5" /> {selectedProgram.degree_level}
                    </span>
                  )}
                  {selectedProgram.beginning_normalized && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#f5f5f5', borderRadius: 8, fontSize: 13, color: '#555', fontWeight: 600 }}>
                      <Calendar className="w-3.5 h-3.5" /> {selectedProgram.beginning_normalized}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 28 }}>
                <div style={{ padding: 20, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Euro className="w-4 h-4" style={{ color: '#dd0000' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999' }}>Tuition</span>
                  </div>
                  <p style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>
                    {selectedProgram.is_free ? 'Free' : selectedProgram.tuition_fee_number != null ? `€${selectedProgram.tuition_fee_number.toLocaleString()}` : 'N/A'}
                  </p>
                </div>

                <div style={{ padding: 20, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Clock className="w-4 h-4" style={{ color: '#dd0000' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999' }}>Duration</span>
                  </div>
                  <p style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>
                    {selectedProgram.duration || 'N/A'}
                  </p>
                </div>

                <div style={{ padding: 20, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Globe className="w-4 h-4" style={{ color: '#dd0000' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999' }}>Language</span>
                  </div>
                  <p style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>
                    {selectedProgram.languages || 'N/A'}
                  </p>
                </div>

                <div style={{ padding: 20, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <BookOpen className="w-4 h-4" style={{ color: '#dd0000' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999' }}>Subject</span>
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>
                    {selectedProgram.subject_area || 'N/A'}
                  </p>
                </div>
              </div>

              {selectedProgram.detail_url && (
                <a href={selectedProgram.detail_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#dd0000', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 15, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#b91c1c'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#dd0000'; e.currentTarget.style.transform = 'none'; }}>
                  View on DAAD <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 32, fontWeight: 800, color: '#0a0a0a', margin: '0 0 8px', lineHeight: 1.2 }}>
                My Shortlist
              </h1>
              <p style={{ fontSize: 16, color: '#737373', margin: 0, lineHeight: 1.5 }}>
                {shortlist.length} program{shortlist.length !== 1 ? 's' : ''} saved
              </p>
            </div>
            <Link href="/#hero" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: '#dd0000', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 15, transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(221,0,0,0.2)', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#b91c1c'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(221,0,0,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#dd0000'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(221,0,0,0.2)'; }}>
              <Search className="w-4 h-4" /> Find More Programs
            </Link>
          </div>
          
          {/* Divider line for cleaner separation */}
          <div style={{ height: 1, background: 'linear-gradient(90deg, #e5e5e5, transparent)', marginBottom: 20 }} />
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626', padding: '14px 18px', borderRadius: 12, marginBottom: 24, fontSize: 14 }}>
            {error}
          </div>
        )}

        {shortlist.length === 0 ? (
          <div style={{ background: '#fff', border: '2px dashed #e5e5e5', borderRadius: 24, padding: '80px 24px', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, rgba(221,0,0,0.08), rgba(221,0,0,0.04))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Bookmark className="w-8 h-8" style={{ color: '#dd0000' }} />
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 700, color: '#111', margin: '0 0 10px' }}>
              No programs shortlisted yet
            </h2>
            <p style={{ fontSize: 15, color: '#737373', margin: '0 auto 28px', maxWidth: 480, lineHeight: 1.6 }}>
              Start exploring programs and save the ones you're interested in to track your applications.
            </p>
            <Link href="/#hero" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: '#dd0000', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 15, transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(221,0,0,0.2)' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#b91c1c'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#dd0000'; e.currentTarget.style.transform = 'none'; }}>
              Browse Programs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {shortlist.map((item) => {
              const prog = programDetails[item.programId];
              const plan = planProgress[item.programId];
              const isRemoving = removingId === item.programId;

              return (
                <div key={item.id} className="shortlist-card" style={{ opacity: isRemoving ? 0.5 : 1, pointerEvents: isRemoving ? 'none' : 'auto', display: 'flex', flexDirection: 'column', height: '580px', background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #e5e5e5' }}>
                  <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: 'linear-gradient(135deg, #f5f5f0, #eee)', flexShrink: 0 }}>
                    {prog?.image_url ? (
                      <Image src={prog.image_url} alt={item.programName} fill style={{ objectFit: 'cover' }} sizes="340px" unoptimized />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <GraduationCap className="w-12 h-12" style={{ color: '#d4d4d4' }} />
                      </div>
                    )}
                    {prog?.is_free && (
                      <span style={{ position: 'absolute', top: 12, left: 12, background: '#16a34a', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        No Tuition
                      </span>
                    )}
                    <button onClick={() => removeFromShortlist(item.programId)} disabled={isRemoving} style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 999, background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.borderColor = '#dc2626'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.95)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; }}>
                      {isRemoving ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#dc2626' }} /> : <Trash2 className="w-4 h-4" style={{ color: '#dc2626' }} />}
                    </button>
                  </div>

                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                    <div style={{ marginBottom: 16 }}>
                      <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 17, fontWeight: 700, color: '#111', margin: '0 0 6px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.6em' }}>
                        {item.programName}
                      </h3>
                      <p style={{ fontSize: 14, color: '#666', margin: '0 0 14px', lineHeight: 1.4, height: '1.4em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.university}</p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, height: '24px', overflow: 'hidden' }}>
                        {prog?.city && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#888', fontWeight: 500 }}>
                            <MapPin className="w-3 h-3" /> {prog.city}
                          </span>
                        )}
                        {prog?.degree_level && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#888', fontWeight: 500 }}>
                            <Award className="w-3 h-3" /> {prog.degree_level}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ height: '70px', marginBottom: 16, flexShrink: 0 }}>
                      {plan && (
                        <div style={{ padding: 12, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Application Progress
                            </span>
                            <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>{plan.completed}/{plan.total} steps</span>
                          </div>
                          <div style={{ height: 6, background: '#dcfce7', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: 'linear-gradient(90deg, #16a34a, #22c55e)', borderRadius: 99, transition: 'width 0.3s ease', width: `${progressPct(plan)}%` }} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
                      <button onClick={() => handleNavigate(item.programId, `/my-applications/${item.programId}`)} disabled={navigatingId === item.programId + `/my-applications/${item.programId}`} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 20px', background: '#dd0000', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#b91c1c'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#dd0000'; e.currentTarget.style.transform = 'none'; }}>
                        {navigatingId === item.programId + `/my-applications/${item.programId}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{plan ? 'Continue Application' : 'Start Application'}</>}
                      </button>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <button onClick={() => prog && setSelectedProgram(prog)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 14px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#555', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#dd0000'; e.currentTarget.style.color = '#dd0000'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.color = '#555'; }}>
                          <Info className="w-3.5 h-3.5" /> Details
                        </button>

                        <button onClick={() => handleNavigate(item.programId, `/motivation-letter?programId=${item.programId}`)} disabled={navigatingId === item.programId + `/motivation-letter?programId=${item.programId}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 14px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#555', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#dd0000'; e.currentTarget.style.color = '#dd0000'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.color = '#555'; }}>
                          {navigatingId === item.programId + `/motivation-letter?programId=${item.programId}` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><FileText className="w-3.5 h-3.5" /> Letter</>}
                        </button>
                      </div>
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
