import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe, PLANS, PlanKey } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planKey } = await req.json();

    const plan = PLANS[planKey as PlanKey];
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://germanpath.com';

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email!,
      line_items: [{ price: plan.priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${baseUrl}/dashboard?success=true&plan=${plan.planType}`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      metadata: {
        userId: session.user.id,
        planType: plan.planType,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          planType: plan.planType,
        },
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('[Stripe Checkout] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
