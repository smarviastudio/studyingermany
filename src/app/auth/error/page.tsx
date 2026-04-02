import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface AuthErrorPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const params = await searchParams;
  const rawError = params?.error;
  const error = Array.isArray(rawError) ? rawError[0] : rawError || null;

  const getErrorMessage = (errorType: string | null) => {
    switch (errorType) {
      case 'Configuration':
        return 'There is a problem with the server configuration. Please contact support.';
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      case 'InvalidCheck':
        return 'This login attempt is stale or was started twice. Go back to the sign-in page and try again once.';
      default:
        return 'An error occurred during authentication. Please try again.';
    }
  };

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
        maxWidth: '500px',
        width: '100%',
        background: '#fff',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 24px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AlertCircle style={{ width: '40px', height: '40px', color: '#ef4444' }} />
        </div>

        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#111',
          margin: '0 0 12px'
        }}>
          Authentication Error
        </h1>

        <p style={{
          fontSize: '15px',
          color: '#666',
          lineHeight: '1.6',
          margin: '0 0 32px'
        }}>
          {getErrorMessage(error)}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link
            href="/auth/signin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: '#dd0000',
              color: '#fff',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            Try Again
          </Link>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: '#f5f5f5',
              color: '#333',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Go Home
          </Link>
        </div>

        {(error === 'Configuration' || error === 'InvalidCheck') && (
          <p style={{
            marginTop: '24px',
            padding: '12px',
            background: '#fef3c7',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#92400e',
            lineHeight: '1.5'
          }}>
            <strong>Note:</strong> If you see this after clicking Google sign-in, the browser likely reused an old OAuth state cookie. Close the tab, return to sign in, and try again once.
          </p>
        )}
      </div>
    </div>
  );
}
