export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeSecretKey, isStripeTestMode } from '@/lib/stripe';

export async function GET() {
  const stripe = new Stripe(getStripeSecretKey(), {
    apiVersion: '2026-02-25.clover',
  });

  const priceSources = {
    liveProMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    liveProYearly: process.env.STRIPE_PRICE_PRO_YEARLY,
    testEssentialMonthly: process.env.STRIPE_TEST_PRICE_ESSENTIAL_MONTHLY,
    testEssentialYearly: process.env.STRIPE_TEST_PRICE_ESSENTIAL_YEARLY,
    liveCredits20: process.env.STRIPE_PRICE_CREDITS_20,
    liveCredits100: process.env.STRIPE_PRICE_CREDITS_100,
    liveCredits300: process.env.STRIPE_PRICE_CREDITS_300,
    testCredits20: process.env.STRIPE_TEST_PRICE_CREDITS_20,
    testCredits100: process.env.STRIPE_TEST_PRICE_CREDITS_100,
    testCredits300: process.env.STRIPE_TEST_PRICE_CREDITS_300,
  };

  const priceIds = Object.entries(priceSources)
    .filter(([, priceId]) => Boolean(priceId))
    .map(([label, priceId]) => ({ label, priceId: priceId as string }));

  const results = await Promise.allSettled(
    priceIds.map(async ({ priceId, label }) => {
      try {
        const price = await stripe.prices.retrieve(priceId);
        return { label, priceId, valid: true, price };
      } catch (error) {
        return { label, priceId, valid: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    })
  );

  const validPrices: any[] = [];
  const invalidPrices: any[] = [];
  const missingPrices = Object.entries(priceSources)
    .filter(([, priceId]) => !priceId)
    .map(([label]) => label);

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      if (result.value.valid && result.value.price) {
        validPrices.push({
          label: result.value.label,
          priceId: result.value.priceId,
          amount: result.value.price.unit_amount,
          currency: result.value.price.currency,
          type: result.value.price.type,
          nickname: result.value.price.nickname,
        });
      } else {
        invalidPrices.push({
          label: result.value.label,
          priceId: result.value.priceId,
          error: result.value.error,
        });
      }
    }
  });

  return NextResponse.json({
    stripeMode: isStripeTestMode() ? 'test' : 'live',
    expectedPriceEnvVars: Object.keys(priceSources),
    missingPrices,
    validPrices,
    invalidPrices,
    message: `Found ${validPrices.length} valid prices out of ${priceIds.length}`,
  });
}
