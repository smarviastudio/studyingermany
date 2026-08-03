import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

// Returns the amount paid for a completed checkout session so the success pages
// can send a GA4 purchase event carrying real revenue. Without this the
// purchase event fires with no value and GA reports €0.00 forever.
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = req.nextUrl.searchParams.get('session_id');
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    // Only the buyer may read their own session.
    if (checkoutSession.metadata?.userId && checkoutSession.metadata.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (checkoutSession.payment_status !== 'paid') {
      return NextResponse.json({ paid: false });
    }

    return NextResponse.json({
      paid: true,
      value: (checkoutSession.amount_total ?? 0) / 100,
      currency: (checkoutSession.currency ?? 'eur').toUpperCase(),
      credits: checkoutSession.metadata?.credits ?? null,
    });
  } catch (error) {
    console.error('[Session Summary] Error:', error);
    return NextResponse.json({ error: 'Failed to load session' }, { status: 500 });
  }
}
