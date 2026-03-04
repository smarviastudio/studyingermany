'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Loader2, Mail, Lock, User } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      // Auto sign in after successful signup
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Account created but failed to sign in. Please try signing in manually.');
      } else {
        router.push('/onboarding');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-[#fff5f5] border border-[#f4cece] text-[#b42318] px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#6b6b6b] mb-1 uppercase tracking-[0.2em]">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c5c5c5]" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e0e0e0] bg-white text-sm focus:outline-none focus:border-[#dd0000] focus:ring-2 focus:ring-[#dd0000]/10"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6b6b6b] mb-1 uppercase tracking-[0.2em]">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c5c5c5]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e0e0e0] bg-white text-sm focus:outline-none focus:border-[#dd0000] focus:ring-2 focus:ring-[#dd0000]/10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6b6b6b] mb-1 uppercase tracking-[0.2em]">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c5c5c5]" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
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
