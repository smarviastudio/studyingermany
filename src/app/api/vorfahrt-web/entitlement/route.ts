import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getStripe } from '@/lib/stripe';
import { grantVorfahrtWebUnlock, hasVorfahrtWebUnlock } from '@/lib/vorfahrtWeb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Tells the web game whether the signed-in account owns the unlock. With
// ?session_id= (the Stripe return URL) it first verifies and records that
// payment, so the unlock does not depend on the webhook arriving first.
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ signedIn: false, unlocked: false });
    }
    const userId = session.user.id;

    const sessionId = req.nextUrl.searchParams.get('session_id');
    if (sessionId) {
      const checkout = await getStripe().checkout.sessions.retrieve(sessionId);
      if (checkout.metadata?.userId === userId) {
        await grantVorfahrtWebUnlock(userId, checkout);
      }
    }

    return NextResponse.json({
      signedIn: true,
      email: session.user.email ?? null,
      unlocked: await hasVorfahrtWebUnlock(userId),
    });
  } catch (error) {
    console.error('[Vorfahrt Web Entitlement]', error);
    return NextResponse.json({ error: 'Unable to check access' }, { status: 500 });
  }
}
