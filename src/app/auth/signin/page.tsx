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

  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  // Show loading while checking auth status
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#f7f7f3] flex items-center justify-center">
        <p className="text-sm text-[#5a5a5a] tracking-[0.2em] uppercase">Checking authentication...</p>
      </div>
    );
  }

  // Don't render signin form if already authenticated
  if (status === 'authenticated') {
    return (
      <div className="min-h-screen bg-[#f7f7f3] flex items-center justify-center">
        <p className="text-sm text-[#5a5a5a] tracking-[0.2em] uppercase">Redirecting...</p>
      </div>
    );
  }

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

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailLoading) return;
    setEmailLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
        setEmailLoading(false);
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch {
      setError('Sign-in failed. Please try again.');
      setEmailLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f3] text-[#171717]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 px-6 py-16 items-center">
        <div className="space-y-6 order-2 lg:order-1">
          <Link href="/" className="inline-flex items-center gap-3">
            <img src="/logo_wp.png" alt="Students in Germany" className="h-12 w-auto" />
            <span className="text-sm font-semibold tracking-[0.15em] uppercase text-[#a3a3a3]">Students in Germany</span>
          </Link>
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#dd0000] mb-3">Welcome back</p>
            <h1 className="font-['Space_Grotesk'] text-4xl lg:text-5xl font-bold leading-tight text-[#111]">
              Sign in to continue your journey
            </h1>
            <p className="text-base text-[#5a5a5a] mt-4 max-w-md">
              Access your saved programs, AI tools, and personalized roadmaps for studying and working in Germany.
            </p>
          </div>
          <div className="flex gap-4 text-sm text-[#5a5a5a]">
            <div>
              <p className="font-semibold text-[#111]">Need help?</p>
              <Link href="http://localhost:8000/#contact" className="text-[#dd0000] font-semibold">Contact support →</Link>
            </div>
            <div>
              <p className="font-semibold text-[#111]">New here?</p>
              <Link href="/auth/signup" className="text-[#dd0000] font-semibold">Create account →</Link>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e5e5e5] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 order-1 lg:order-2 w-full">
          <h2 className="text-xl font-semibold mb-6">Sign in</h2>

          {error && (
            <div className="bg-[#fff5f5] border border-[#f4cece] text-[#b42318] px-4 py-3 rounded-xl text-sm mb-5">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full border border-[#e0e0e0] bg-white text-[#111] font-semibold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 hover:border-[#dd0000]/60 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
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

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#ebebeb]" />
            <span className="text-xs text-[#b0b0b0] font-medium tracking-widest uppercase">or</span>
            <div className="flex-1 h-px bg-[#ebebeb]" />
          </div>

          {/* Email/Password Sign-in Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-xs font-semibold text-[#6b6b6b] mb-1 uppercase tracking-[0.2em] block">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b0b0b0]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full h-11 rounded-xl border border-[#e0e0e0] bg-white pl-11 pr-4 text-sm focus:outline-none focus:border-[#dd0000] transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-xs font-semibold text-[#6b6b6b] mb-1 uppercase tracking-[0.2em] block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b0b0b0]" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-11 rounded-xl border border-[#e0e0e0] bg-white pl-11 pr-4 text-sm focus:outline-none focus:border-[#dd0000] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={emailLoading}
              className="w-full bg-[#dd0000] text-white font-semibold py-3 rounded-2xl transition-all hover:bg-[#b30000] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {emailLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in with Email'
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
