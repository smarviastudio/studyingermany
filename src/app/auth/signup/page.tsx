'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { track } from '@/lib/track';

export default function SignUpPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = useState('/dashboard');

  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleGoogleSignUp = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    setError('');
    try {
      track('sign_up_start', { method: 'google' });
      await signIn('google', { callbackUrl });
    } catch {
      setError('Google sign-up could not be started. Please try again.');
      setGoogleLoading(false);
    }
  };

  const handleEmailSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    track('sign_up_start', { method: 'email' });
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to create account');
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) throw new Error('Account created, but sign-in failed. Please sign in.');
      track('sign_up_success', { method: 'email' });
      track('sign_up', { method: 'email' });
      router.push(callbackUrl);
    } catch (signupError) {
      track('sign_up_error', { method: 'email' });
      setError(signupError instanceof Error ? signupError.message : 'Unable to create account');
    } finally {
      setSubmitting(false);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    const queryCallback = new URLSearchParams(window.location.search).get('callbackUrl');
    if (queryCallback) setCallbackUrl(queryCallback);
    if (status === 'authenticated' && session) {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  // Show loading while checking auth status
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#f7f7f3] flex items-center justify-center">
        <p className="text-sm text-[#5a5a5a] tracking-[0.2em] uppercase">Checking authentication...</p>
      </div>
    );
  }

  // Don't render signup form if already authenticated
  if (status === 'authenticated') {
    return (
      <div className="min-h-screen bg-[#f7f7f3] flex items-center justify-center">
        <p className="text-sm text-[#5a5a5a] tracking-[0.2em] uppercase">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f3] text-[#171717]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 px-6 py-16 items-center">
        <div className="space-y-6">
          <Link href="/" className="inline-flex items-center gap-3">
            <img src="/logo_wp.png" alt="Students in Germany" className="h-12 w-auto" />
            <span className="text-sm font-semibold tracking-[0.15em] uppercase text-[#a3a3a3]">Students in Germany</span>
          </Link>
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#dd0000] mb-3">Create your profile</p>
            <h1 className="font-['Space_Grotesk'] text-4xl lg:text-5xl font-bold leading-tight text-[#111]">
              Start your German journey with us
            </h1>
            <p className="text-base text-[#5a5a5a] mt-4 max-w-md">
              Build your account to unlock AI course search, visa guides, and personalized planning tools in one elegant dashboard.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-[#5a5a5a]">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-[#111]">Already registered?</span>
              <Link href="/auth/signin" className="text-[#dd0000] font-semibold">Sign in instead →</Link>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-[#111]">Need assistance?</span>
              <Link href="http://localhost:8000/#contact" className="text-[#dd0000] font-semibold">Talk to us →</Link>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e5e5e5] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8">
          <h2 className="text-xl font-semibold mb-6">Create account</h2>

          {error && (
            <div className="bg-[#fff5f5] border border-[#f4cece] text-[#b42318] px-4 py-3 rounded-xl text-sm mb-5">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignUp}
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
                Sign up with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#ebebeb]" />
            <span className="text-xs text-[#b0b0b0] font-medium tracking-widest uppercase">or</span>
            <div className="flex-1 h-px bg-[#ebebeb]" />
          </div>

          {/* Email/Password Sign-up Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#6b6b6b] mb-1 uppercase tracking-[0.2em]">Full name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c5c5c5]" />
                  <input required value={name} onChange={(event) => setName(event.target.value)} type="text" placeholder="John Doe" className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e0e0e0] bg-white text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6b6b6b] mb-1 uppercase tracking-[0.2em]">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c5c5c5]" />
                  <input required value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@example.com" className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e0e0e0] bg-white text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6b6b6b] mb-1 uppercase tracking-[0.2em]">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c5c5c5]" />
                  <input required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="At least 6 characters" className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e0e0e0] bg-white text-sm" />
                </div>
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-[#dd0000] text-white font-semibold py-3 rounded-2xl disabled:opacity-60">
                {submitting ? 'Creating account…' : 'Create Account'}
              </button>
          </form>

          <div className="mt-6 text-sm text-[#6b6b6b] text-center">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-[#dd0000] font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
