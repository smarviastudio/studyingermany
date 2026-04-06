'use client';

import { Suspense, useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const RED = '#dd0000';

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

  const [loading, setLoading] = useState(false);
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
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl });
    } catch {
      setError('Could not start Google sign-in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fafafa',
      padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: 440, textAlign: 'center' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'inline-block', marginBottom: 48 }}>
          <img src="/logo_wp.png" alt="Students in Germany" style={{ height: 48, width: 'auto' }} />
        </Link>

        {/* Card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e5e5',
          borderRadius: 24,
          padding: 48,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <h1 style={{
            fontSize: 32,
            fontWeight: 800,
            color: '#111',
            marginBottom: 12,
            letterSpacing: '-0.01em'
          }}>
            Sign in to continue
          </h1>
          <p style={{
            fontSize: 16,
            color: '#666',
            marginBottom: 40,
            lineHeight: 1.5
          }}>
            Access your saved programs and AI tools
          </p>

          {error && (
            <div style={{
              padding: '14px 18px',
              borderRadius: 12,
              background: '#fff5f5',
              border: '1px solid #fecaca',
              color: '#dc2626',
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 24
            }}>
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px 24px',
              borderRadius: 14,
              border: `2px solid ${RED}`,
              background: RED,
              color: '#ffffff',
              fontSize: 17,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1,
              boxShadow: `0 4px 12px ${RED}30`
            }}
            onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-1px)', e.currentTarget.style.boxShadow = `0 6px 16px ${RED}40`)}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = `0 4px 12px ${RED}30`)}
          >
            {loading ? (
              <>
                <Loader2 style={{ width: 20, height: 20 }} className="animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" style={{ width: 22, height: 22 }} />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Footer */}
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #f0f0f0' }}>
            <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>
              By signing in, you agree to our Terms of Service
            </p>
            <Link href="/" style={{ fontSize: 14, color: RED, textDecoration: 'none', fontWeight: 600 }}>
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
