'use client';

import { Suspense, useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock } from 'lucide-react';

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f7f7f3] flex items-center justify-center">
        <p className="text-sm text-[#5a5a5a] tracking-[0.2em] uppercase">Loading...</p>
      </div>
    }>
      <SignInPageContent />
    </Suspense>
  );
}

function SignInPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl });
    } catch {
      setError('Google sign-in could not be started. Please try again.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef2f2] via-white to-[#fef9f3] text-[#0a0a0a]" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 px-8 py-12 items-center min-h-screen">
        <div className="space-y-10 lg:pr-12">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <img src="/logo_wp.png" alt="Students in Germany" className="h-14 w-auto transition-transform group-hover:scale-105" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#9ca3af]">Students in Germany</span>
          </Link>
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#dd0000]/8 border border-[#dd0000]/15 rounded-full">
              <div className="w-2 h-2 bg-[#dd0000] rounded-full animate-pulse"></div>
              <span className="text-xs font-bold tracking-[0.1em] uppercase text-[#dd0000]">Welcome Back</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-black leading-[1.1] text-[#0a0a0a] tracking-tight">
              Sign in to continue
              <span className="block mt-2 bg-gradient-to-r from-[#dd0000] to-[#ff4444] bg-clip-text text-transparent">your journey</span>
            </h1>
            
            <p className="text-lg text-[#6b7280] leading-relaxed max-w-lg">
              Access your saved programs, AI-powered tools, and personalized roadmaps for studying and working in Germany.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#dd0000] to-[#ff4444] flex items-center justify-center shadow-lg shadow-[#dd0000]/20">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-bold text-[#0a0a0a] text-sm">AI-Powered Tools</p>
              </div>
              <p className="text-xs text-[#9ca3af] leading-relaxed pl-10">Smart assistance for your journey</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-bold text-[#0a0a0a] text-sm">Saved Programs</p>
              </div>
              <p className="text-xs text-[#9ca3af] leading-relaxed pl-10">Track your favorite options</p>
            </div>
          </div>

          <div className="flex gap-8 pt-6 border-t border-[#e5e7eb]">
            <div>
              <p className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Need help?</p>
              <Link href="http://localhost:8000/#contact" className="text-[#dd0000] font-bold text-sm hover:underline inline-flex items-center gap-1">
                Contact support
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div>
              <p className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider mb-1">New here?</p>
              <Link href="/auth/signup" className="text-[#dd0000] font-bold text-sm hover:underline inline-flex items-center gap-1">
                Create account
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e5e5e5] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8">
          <h2 className="text-xl font-semibold mb-6">Sign in</h2>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full border border-[#e0e0e0] bg-white text-[#111] font-semibold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 mb-5 hover:border-[#dd0000]/60 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
              </>
            )}
          </button>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-[#fff5f5] border border-[#f4cece] text-[#b42318] px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#6b6b6b] mb-1 uppercase tracking-[0.2em]">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c5c5c5]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e0e0e0] bg-white text-sm focus:outline-none focus:border-[#dd0000] focus:ring-2 focus:ring-[#dd0000]/10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6b6b6b] mb-1 uppercase tracking-[0.2em]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c5c5c5]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e0e0e0] bg-white text-sm focus:outline-none focus:border-[#dd0000] focus:ring-2 focus:ring-[#dd0000]/10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#dd0000] hover:bg-[#c10000] disabled:opacity-60 text-white font-semibold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#dd0000]/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-sm text-[#6b6b6b] text-center">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-[#dd0000] font-semibold">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
