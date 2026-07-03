import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Free-preview tracking for anonymous (not signed-in) users of the AI tools.
 *
 * Anonymous visitors get a small shared pool of free generations per month so
 * they can see the output quality before creating an account (value-first).
 * Usage is tracked in a signed cookie; an in-memory per-IP throttle acts as a
 * best-effort backstop against cookie clearing. Signed-in users are handled by
 * usage-tracker.ts and never touch this module.
 */

const COOKIE_NAME = 'gp_anon_usage';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 62; // ~2 months

/** Free generations per month for anonymous users, shared across all AI tools. */
export const ANON_MONTHLY_TOTAL = 2;

/** Backstop: max anonymous generations per IP per day (per server instance). */
const IP_DAILY_LIMIT = 8;

type AnonUsage = { month: string; total: number };

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

function currentDay(): string {
  return new Date().toISOString().slice(0, 10);
}

function secret(): string {
  return process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'germanpath-anon-usage';
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
}

export function readAnonUsage(request: NextRequest): AnonUsage {
  const fresh: AnonUsage = { month: currentMonth(), total: 0 };
  const raw = request.cookies.get(COOKIE_NAME)?.value;
  if (!raw) return fresh;

  const dotIndex = raw.lastIndexOf('.');
  if (dotIndex === -1) return fresh;
  const payload = raw.slice(0, dotIndex);
  const sig = raw.slice(dotIndex + 1);

  try {
    const expected = sign(payload);
    if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return fresh;
    }
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AnonUsage;
    if (parsed.month !== currentMonth() || typeof parsed.total !== 'number') return fresh;
    return { month: parsed.month, total: Math.max(0, Math.floor(parsed.total)) };
  } catch {
    return fresh;
  }
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

const ipHits = new Map<string, { day: string; count: number }>();

function ipAllowed(request: NextRequest): boolean {
  const ip = getClientIp(request);
  const day = currentDay();
  const entry = ipHits.get(ip);
  if (!entry || entry.day !== day) return true;
  return entry.count < IP_DAILY_LIMIT;
}

function recordIpHit(request: NextRequest): void {
  const ip = getClientIp(request);
  const day = currentDay();
  const entry = ipHits.get(ip);
  if (!entry || entry.day !== day) {
    // Opportunistic cleanup of stale entries to bound memory
    if (ipHits.size > 5000) {
      for (const [key, value] of ipHits) {
        if (value.day !== day) ipHits.delete(key);
      }
    }
    ipHits.set(ip, { day, count: 1 });
  } else {
    entry.count += 1;
  }
}

/**
 * Check whether an anonymous request may run one more free generation.
 */
export function checkAnonUsage(request: NextRequest): {
  allowed: boolean;
  usage: AnonUsage;
  current: number;
  limit: number;
} {
  const usage = readAnonUsage(request);
  const allowed = usage.total < ANON_MONTHLY_TOTAL && ipAllowed(request);
  return { allowed, usage, current: usage.total, limit: ANON_MONTHLY_TOTAL };
}

/**
 * Record a successful anonymous generation: bump the IP counter and attach the
 * incremented, signed usage cookie to the response.
 */
export function recordAnonUsage(request: NextRequest, response: NextResponse, usage: AnonUsage): void {
  recordIpHit(request);
  const next: AnonUsage = { month: usage.month, total: usage.total + 1 };
  const payload = Buffer.from(JSON.stringify(next), 'utf8').toString('base64url');
  response.cookies.set(COOKIE_NAME, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

/** Standard 402 body for "free previews used up — create an account". */
export function anonLimitResponse(current: number, limit: number): NextResponse {
  return NextResponse.json({
    error: 'Free preview limit reached',
    signupRequired: true,
    current,
    limit,
    message: `You've used your ${limit} free previews this month. Create a free account to get 3 more free generations every month — it takes 30 seconds.`,
  }, { status: 402 });
}
