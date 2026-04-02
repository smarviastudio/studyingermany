export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { syncStripeSubscriptionForUser } from '@/lib/stripe-subscription-sync';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let checkoutSessionId: string | undefined;
    try {
      const body = await request.json();
      checkoutSessionId = typeof body?.sessionId === 'string' ? body.sessionId : undefined;
    } catch {
      checkoutSessionId = undefined;
    }

    const result = await syncStripeSubscriptionForUser({
      userId: session.user.id,
      email: session.user.email,
      checkoutSessionId,
    });

    if (!result) {
      return NextResponse.json(
        { synced: false, error: 'No Stripe subscription found for this user' },
        { status: 404 }
      );
    }

    return NextResponse.json({ synced: true, subscription: result });
  } catch (error) {
    console.error('[Stripe Sync] Error:', error);
    return NextResponse.json({ error: 'Failed to sync subscription' }, { status: 500 });
  }
}
