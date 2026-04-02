export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import Stripe from 'stripe';
import { getPlans, getStripeSecretKey, isStripeTestMode } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const userSession = await auth();
    
    if (!userSession?.user?.email || !userSession?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Request body:', body);
    
    const { priceId, planKey, mode = 'subscription' } = body;

    const plans = getPlans();
    const resolvedPlan =
      planKey && plans[planKey as keyof typeof plans]
        ? plans[planKey as keyof typeof plans]
        : null;
    const resolvedPriceId = resolvedPlan?.priceId || priceId;

    if (!resolvedPriceId) {
      return NextResponse.json(
        { error: 'Price ID or planKey is required', receivedBody: body },
        { status: 400 }
      );
    }

    const stripe = new Stripe(getStripeSecretKey(), {
      apiVersion: '2026-02-25.clover',
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.germanpath.com';

    console.log('Creating Stripe session with:', {
      mode,
      planKey,
      priceId: resolvedPriceId,
      baseUrl,
      stripeMode: isStripeTestMode() ? 'test' : 'live',
    });
    
    // First, verify the price exists
    try {
      const price = await stripe.prices.retrieve(resolvedPriceId);
      console.log('Price retrieved successfully:', { id: price.id, type: price.type, active: price.active });
    } catch (priceError) {
      console.error('Failed to retrieve price:', priceError);
      return NextResponse.json(
        { error: 'Invalid price ID: ' + (priceError instanceof Error ? priceError.message : 'Unknown error') },
        { status: 400 }
      );
    }
    
    // Use authenticated user's data
    const userId = userSession.user.id;
    const userEmail = userSession.user.email;
    
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: mode as 'subscription' | 'payment',
      customer_email: userEmail,
      line_items: [
        {
          price: resolvedPriceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: { userId },
    };

    // Add credits metadata for one-time purchases
    if (mode === 'payment') {
      const creditsMap: Record<string, string> = {
        'price_1THNNCBhIRngoSRXEd8VpVkv': '20',
        'price_1THNNCBhIRngoSRXR97jnrrf': '100',
        'price_1THNNCBhIRngoSRXROohsxsl': '300',
      };
      if (creditsMap[resolvedPriceId]) {
        sessionConfig.metadata!.credits = creditsMap[resolvedPriceId];
      }
    }
    
    const stripeSession = await stripe.checkout.sessions.create(sessionConfig);

    console.log('Stripe session created:', stripeSession.id);
    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { 
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
