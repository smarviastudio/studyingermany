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
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(to bottom, #fafafa 0%, #ffffff 100%)',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif"
    }}>
      {/* Logo */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="inline-flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
          <img src="/logo_wp.png" alt="Students in Germany" className="h-10 w-auto" />
        </Link>
      </div>

      {/* Centered Content */}
      <div className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 700,
              color: '#1d1d1f',
              marginBottom: 12,
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              Sign in to continue
            </h1>
            <p style={{
              fontSize: 17,
              color: '#86868b',
              lineHeight: 1.5,
              fontWeight: 400
            }}>
              Access your saved programs and AI tools
            </p>
          </div>

          {/* Form Card */}
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: 24,
            padding: 40,
            boxShadow: '0 4px 24px rgba(0,0,0,0.04), 0 0 1px rgba(0,0,0,0.04)'
          }}>
            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: 12,
                border: '1px solid rgba(0,0,0,0.1)',
                background: '#ffffff',
                color: '#1d1d1f',
                fontSize: 17,
                fontWeight: 600,
                cursor: googleLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                transition: 'all 0.2s',
                opacity: googleLoading ? 0.6 : 1,
                marginBottom: 24
              }}
              onMouseOver={(e) => !googleLoading && (e.currentTarget.style.background = '#f5f5f7')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#ffffff')}
            >
              {googleLoading ? (
                <>
                  <Loader2 style={{ width: 20, height: 20 }} className="animate-spin" />
                  <span>Redirecting...</span>
                </>
              ) : (
                <>
                  <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" style={{ width: 20, height: 20 }} />
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div style={{ position: 'relative', marginBottom: 24 }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.06)' }} />
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <span style={{ background: '#ffffff', padding: '0 16px', fontSize: 13, color: '#86868b', fontWeight: 500 }}>or</span>
              </div>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
              {error && (
                <div style={{
                  padding: '14px 18px',
                  borderRadius: 12,
                  background: '#fff5f5',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  fontSize: 14,
                  fontWeight: 500
                }}>
                  {error}
                </div>
              )}

              <div>
                <label style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#86868b',
                  marginBottom: 8
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 10,
                    border: '1px solid rgba(0,0,0,0.1)',
                    background: '#fafafa',
                    fontSize: 17,
                    color: '#1d1d1f',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  placeholder="you@example.com"
                  onFocus={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#0071e3';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = '#fafafa';
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#86868b',
                  marginBottom: 8
                }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 10,
                    border: '1px solid rgba(0,0,0,0.1)',
                    background: '#fafafa',
                    fontSize: 17,
                    color: '#1d1d1f',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  placeholder="Enter your password"
                  onFocus={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#0071e3';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = '#fafafa';
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  borderRadius: 12,
                  border: 'none',
                  background: loading ? '#0071e3' : '#0071e3',
                  color: '#ffffff',
                  fontSize: 17,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 0.2s',
                  marginTop: 8
                }}
                onMouseOver={(e) => !loading && (e.currentTarget.style.background = '#0077ed')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#0071e3')}
              >
                {loading ? (
                  <>
                    <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div style={{ marginTop: 32, textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: '#86868b', marginBottom: 16 }}>
                Don't have an account?{' '}
                <Link href="/auth/signup" style={{ color: '#0071e3', fontWeight: 600, textDecoration: 'none' }}>
                  Create one
                </Link>
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 24, fontSize: 13 }}>
                <Link href="http://localhost:8000/#contact" style={{ color: '#86868b', textDecoration: 'none', fontWeight: 500 }}>Need help?</Link>
                <span style={{ color: '#d2d2d7' }}>•</span>
                <Link href="/" style={{ color: '#86868b', textDecoration: 'none', fontWeight: 500 }}>Back to home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
