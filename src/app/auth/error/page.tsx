'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowLeft, RefreshCw, Trash2 } from 'lucide-react';

// Inner component that uses useSearchParams
function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const [isClearing, setIsClearing] = useState(false);

  const getErrorMessage = (errorType: string | null) => {
    switch (errorType) {
      case 'Configuration':
        return 'There is a problem with the authentication configuration. This usually happens when your browser has old login cookies.';
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      case 'InvalidCheck':
        return 'This login attempt is stale or was started twice. Please clear your cookies and try again.';
      case 'OAuthCallback':
        return 'There was a problem completing your Google sign-in. Please try again.';
      case 'OAuthAccountNotLinked':
        return 'This email is already associated with another account. Please sign in with your original method.';
      case 'EmailSignin':
        return 'There was a problem sending the email. Please check your email address and try again.';
      case 'CredentialsSignin':
        return 'Invalid email or password. Please try again.';
      case 'SessionRequired':
        return 'You must be signed in to access this page.';
      default:
        return 'An error occurred during authentication. Please try again.';
    }
  };

  const clearAuthCookies = useCallback(() => {
    // Clear all NextAuth related cookies
    const cookiesToClear = [
      'next-auth.state',
      'next-auth.callback-url',
      'next-auth.csrf-token',
      'next-auth.session-token',
      '__Host-next-auth.csrf-token',
      '__Secure-next-auth.callback-url',
      '__Secure-next-auth.session-token',
    ];

    cookiesToClear.forEach((cookieName) => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
    });

    // Also clear Google OAuth cookies
    document.cookie = 'g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'g_csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'oauth_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }, []);

  const handleClearAndRetry = useCallback(() => {
    setIsClearing(true);
    clearAuthCookies();
    
    // Small delay to ensure cookies are cleared
    setTimeout(() => {
      window.location.href = '/auth/signin';
    }, 100);
  }, [clearAuthCookies]);

  const isOAuthError = error === 'Configuration' || error === 'InvalidCheck' || error === 'OAuthCallback';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: '#fff',
        borderRadius: '24px',
        padding: '48px 40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '88px',
          height: '88px',
          margin: '0 auto 28px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AlertCircle style={{ width: '44px', height: '44px', color: '#ef4444' }} />
        </div>

        <h1 style={{
          fontSize: '26px',
          fontWeight: '700',
          color: '#111',
          margin: '0 0 16px'
        }}>
          Authentication Error
        </h1>

        <p style={{
          fontSize: '15px',
          color: '#666',
          lineHeight: '1.7',
          margin: '0 0 32px'
        }}>
          {getErrorMessage(error)}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {isOAuthError ? (
            <button
              onClick={handleClearAndRetry}
              disabled={isClearing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                background: '#dd0000',
                color: '#fff',
                borderRadius: '12px',
                border: 'none',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '15px',
                cursor: isClearing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 14px rgba(221,0,0,0.3)',
              }}
            >
              {isClearing ? (
                <RefreshCw style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
              ) : (
                <Trash2 style={{ width: '18px', height: '18px' }} />
              )}
              {isClearing ? 'Clearing...' : 'Clear & Sign In Again'}
            </button>
          ) : (
            <Link
              href="/auth/signin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                background: '#dd0000',
                color: '#fff',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '15px',
                transition: 'all 0.2s',
                boxShadow: '0 4px 14px rgba(221,0,0,0.3)',
              }}
            >
              Try Again
            </Link>
          )}

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 24px',
              background: '#f5f5f5',
              color: '#333',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '15px',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft style={{ width: '18px', height: '18px' }} />
            Go Home
          </Link>
        </div>

        {/* Additional help text */}
        {isOAuthError && (
          <div style={{
            marginTop: '28px',
            padding: '20px',
            background: '#f8fafc',
            borderRadius: '12px',
            textAlign: 'left',
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 12px'
            }}>
              Why did this happen?
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#6b7280',
              lineHeight: '1.7',
              margin: 0
            }}>
              Google Sign-In uses temporary cookies for security. If you clicked sign-in twice or 
              waited too long, these cookies became stale. The button above clears them automatically 
              so you can sign in fresh.
            </p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Loading fallback
function AuthErrorLoading() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: '#fff',
        borderRadius: '24px',
        padding: '48px 40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '88px',
          height: '88px',
          margin: '0 auto 28px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AlertCircle style={{ width: '44px', height: '44px', color: '#ef4444' }} />
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#111', margin: '0 0 16px' }}>
          Loading...
        </h1>
      </div>
    </div>
  );
}

// Main export with Suspense
export default function AuthErrorPage() {
  return (
    <Suspense fallback={<AuthErrorLoading />}>
      <AuthErrorContent />
    </Suspense>
  );
}
