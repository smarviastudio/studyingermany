export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { getStripeSecretKey } from '@/lib/stripe';

export async function POST() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscription: true },
    });

    if (!user?.subscription?.stripeSubscriptionId) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
    }

    const stripe = new Stripe(getStripeSecretKey(), {
      apiVersion: '2026-02-25.clover',
    });

    await stripe.subscriptions.update(
      user.subscription.stripeSubscriptionId,
      { cancel_at_period_end: false }
    );

    await prisma.subscription.update({
      where: { id: user.subscription.id },
      data: { cancelAtPeriodEnd: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reactivate subscription error:', error);
    return NextResponse.json({ error: 'Failed to reactivate subscription' }, { status: 500 });
  }
}
