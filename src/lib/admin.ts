import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null) {
  const adminEmails = getAdminEmails();
  if (!adminEmails.length) {
    return true;
  }

  return !!email && adminEmails.includes(email.toLowerCase());
}

export async function requireAdminApi() {
  const session = await auth();
  const email = session?.user?.email || null;

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return null;
}
