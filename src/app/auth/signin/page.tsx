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
  const [error, setError] = useState('');

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

  return (
    <div className="min-h-screen bg-[#f7f7f3] text-[#171717]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 px-6 py-16 items-center">
        <div className="space-y-6">
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

        <div className="bg-white border border-[#e5e5e5] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8">
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

          {/* Email sign-in — coming soon */}
          <div className="relative rounded-2xl border border-dashed border-[#e0e0e0] bg-[#fafafa] overflow-hidden">
            {/* Blurred fields preview */}
            <div className="p-5 space-y-4 select-none pointer-events-none" aria-hidden="true">
              <div>
                <div className="text-xs font-semibold text-[#6b6b6b] mb-1 uppercase tracking-[0.2em]">Email address</div>
                <div className="w-full h-11 rounded-xl border border-[#e8e8e8] bg-white flex items-center px-4 blur-[2px]">
                  <Mail className="w-4 h-4 text-[#d0d0d0] mr-2 shrink-0" />
                  <div className="h-3 w-32 bg-[#e8e8e8] rounded-full" />
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-[#6b6b6b] mb-1 uppercase tracking-[0.2em]">Password</div>
                <div className="w-full h-11 rounded-xl border border-[#e8e8e8] bg-white flex items-center px-4 blur-[2px]">
                  <Lock className="w-4 h-4 text-[#d0d0d0] mr-2 shrink-0" />
                  <div className="h-3 w-24 bg-[#e8e8e8] rounded-full" />
                </div>
              </div>
              <div className="h-11 w-full rounded-xl bg-[#e8e8e8] blur-[2px]" />
            </div>

            {/* Overlay badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-[#111] text-white text-xs font-semibold px-3 py-1.5 rounded-full tracking-widest uppercase shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-[#dd0000] animate-pulse" />
                Coming Soon
              </span>
              <p className="text-xs text-[#6b6b6b] text-center max-w-[160px] leading-relaxed">
                Email sign-in is being rolled out soon
              </p>
            </div>
          </div>

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
