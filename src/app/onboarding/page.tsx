'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, GraduationCap, BookOpen, Globe, ChevronDown } from 'lucide-react';

export default function OnboardingPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [degreeLevel, setDegreeLevel] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [language, setLanguage] = useState('either');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const isValid = degreeLevel !== '' && fieldOfStudy.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetDegreeLevel: degreeLevel,
          targetSubjects: [fieldOfStudy.trim()],
          preferredLanguage: language,
        }),
      });
      if (!response.ok) throw new Error('Failed to save');
      router.push('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">StudyGermany</span>
          </div>
          <h1 className="text-white text-xl font-semibold mt-4">Welcome! Let&apos;s personalize your experience</h1>
          <p className="text-white/35 text-sm mt-1.5">Two quick questions so AI can find better matches for you</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Degree level */}
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <label className="text-white text-sm font-medium">What degree are you looking for?</label>
            </div>
            <div className="relative">
              <select
                value={degreeLevel}
                onChange={(e) => setDegreeLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 text-sm transition-colors appearance-none"
              >
                <option value="" className="bg-[#1a1a2e]">Select degree level</option>
                <option value="bachelor" className="bg-[#1a1a2e]">Bachelor&apos;s</option>
                <option value="master" className="bg-[#1a1a2e]">Master&apos;s</option>
                <option value="phd" className="bg-[#1a1a2e]">PhD</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
            </div>
          </div>

          {/* Field of study */}
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <label className="text-white text-sm font-medium">What do you want to study?</label>
            </div>
            <input
              type="text"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 text-sm transition-colors"
              placeholder="e.g., Data Science, Mechanical Engineering"
            />
          </div>

          {/* Language preference */}
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <label className="text-white text-sm font-medium">Preferred language?</label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'english', label: 'English' },
                { key: 'german', label: 'German' },
                { key: 'either', label: 'Either' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setLanguage(opt.key)}
                  className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                    language === opt.key
                      ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300'
                      : 'bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.12]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-1">
            <button
              type="submit"
              disabled={!isValid || loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-40 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Continue to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="w-full py-2.5 text-white/30 hover:text-white/50 text-sm transition-colors"
            >
              Skip for now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
