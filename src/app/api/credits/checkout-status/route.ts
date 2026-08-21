import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = request.nextUrl.searchParams.get('session_id');
    if (!sessionId) {
      return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
    }

    const checkoutSession = await getStripe().checkout.sessions.retrieve(sessionId);
    if (checkoutSession.metadata?.userId !== session.user.id) {
      return NextResponse.json({ error: 'Checkout session does not belong to this user' }, { status: 403 });
    }

    const transaction = await prisma.creditTransaction.findUnique({
      where: { stripeSessionId: sessionId },
      select: { amount: true },
    });

    return NextResponse.json({
      paid: checkoutSession.payment_status === 'paid',
      granted: Boolean(transaction),
      credits: transaction?.amount ?? 0,
    });
  } catch (error) {
    console.error('[Credit Checkout Status]', error);
    return NextResponse.json({ error: 'Unable to verify checkout status' }, { status: 500 });
  }
}
