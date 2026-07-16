import { auth } from '@/lib/auth';

const ADMIN_EMAILS = ['smarviastudio@gmail.com', 'smarviastudio2@gmail.com'];

// Guard for diagnostic/debug endpoints: freely accessible in local dev and
// Vercel preview deployments, but owner-only on production so infrastructure
// details (Stripe mode, key prefixes, price IDs, webhook config) are not
// exposed publicly.
export async function requireDiagnosticsAccess(): Promise<boolean> {
  if (process.env.VERCEL_ENV !== 'production') return true;
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  return !!email && ADMIN_EMAILS.includes(email);
}
