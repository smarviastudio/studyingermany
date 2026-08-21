export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import Stripe from 'stripe';
import { getPlans, getStripe, getStripeBaseUrl, isStripeTestMode } from '@/lib/stripe';
import { PRICE_ID_TO_CREDITS } from '@/lib/creditPacks';

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

    if (mode !== 'subscription' && mode !== 'payment') {
      return NextResponse.json({ error: 'Invalid checkout mode' }, { status: 400 });
    }

    const plans = mode === 'subscription' ? getPlans() : null;
    const resolvedPlan =
      mode === 'subscription' && planKey && plans?.[planKey as keyof typeof plans]
        ? plans[planKey as keyof typeof plans]
        : null;
    const resolvedPriceId = mode === 'subscription' ? resolvedPlan?.priceId : priceId;

    if (!resolvedPriceId) {
      return NextResponse.json(
        { error: 'Price ID or planKey is required', receivedBody: body },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const baseUrl = getStripeBaseUrl();

    const currentMode = isStripeTestMode() ? 'test' : 'live';
    
    console.log('Creating Stripe session with:', {
      mode,
      planKey,
      priceId: resolvedPriceId,
      baseUrl,
      stripeMode: currentMode,
    });
    
    // First, verify the price exists
    try {
      const price = await stripe.prices.retrieve(resolvedPriceId);
      const credits = PRICE_ID_TO_CREDITS[resolvedPriceId];

      if (!price.active) {
        throw new Error('This Stripe price is inactive');
      }
      if (mode === 'payment' && !credits) {
        throw new Error('This Stripe price is not an approved AI credit pack');
      }
      if (mode === 'subscription' && !price.recurring) {
        throw new Error('This Stripe price is not a recurring subscription price');
      }

      console.log('Price retrieved successfully:', { id: price.id, type: price.type, active: price.active });
    } catch (priceError) {
      console.error('Failed to retrieve price:', priceError);
      const errorMsg = priceError instanceof Error ? priceError.message : 'Unknown error';
      return NextResponse.json(
        { 
          error: `Invalid price ID: No such price: '${resolvedPriceId}'; a similar object exists in ${currentMode === 'live' ? 'test' : 'live'} mode, but a ${currentMode} mode key was used to make this request.`,
          details: errorMsg,
          currentMode,
          priceId: resolvedPriceId,
          suggestion: `The app is currently in ${currentMode.toUpperCase()} mode. Please ensure STRIPE_USE_TEST_MODE is set correctly in Vercel environment variables.`
        },
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
      success_url:
        mode === 'payment'
          ? `${baseUrl}/credits/success?session_id={CHECKOUT_SESSION_ID}`
          : `${baseUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      client_reference_id: userId,
      metadata: { userId },
    };

    if (mode === 'subscription') {
      sessionConfig.subscription_data = {
        metadata: {
          userId,
          planType: resolvedPlan?.planType || 'pro',
        },
      };
    }

    // Add credits metadata for one-time purchases. PRICE_ID_TO_CREDITS covers
    // BOTH live and test price IDs — the webhook only grants credits when this
    // metadata is present, so a missing live ID means the customer pays and
    // gets nothing.
    if (mode === 'payment') {
      const credits = PRICE_ID_TO_CREDITS[resolvedPriceId];
      if (credits) {
        sessionConfig.metadata!.credits = String(credits);
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
