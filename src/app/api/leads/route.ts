import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ALLOWED_SOURCES = new Set(['deadline_calendar']);

// Deliberately permissive: catches obvious typos without rejecting the unusual
// but valid addresses this audience actually uses.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const source = typeof body.source === 'string' ? body.source : '';
    const page = typeof body.page === 'string' ? body.page.slice(0, 200) : null;

    if (!EMAIL_PATTERN.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!ALLOWED_SOURCES.has(source)) {
      return NextResponse.json({ error: 'Unknown signup source.' }, { status: 400 });
    }

    // Vercel resolves this from the edge; absent in local dev.
    const country = req.headers.get('x-vercel-ip-country');

    // Re-subscribing is not an error from the visitor's point of view.
    await prisma.emailLead.upsert({
      where: { email },
      update: {},
      create: { email, source, page, country },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Leads] Failed to save lead:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
