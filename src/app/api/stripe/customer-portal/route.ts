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

    if (!user?.subscription?.stripeCustomerId) {
      return NextResponse.json({ error: 'No customer ID found' }, { status: 400 });
    }

    const stripe = new Stripe(getStripeSecretKey(), {
      apiVersion: '2026-02-25.clover',
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.germanpath.com';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.subscription.stripeCustomerId,
      return_url: `${baseUrl}/subscription`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Customer portal error:', error);
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
}
