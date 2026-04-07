import { NextResponse } from 'next/server';
import { isStripeTestMode, getStripeSecretKey } from '@/lib/stripe';
import Stripe from 'stripe';

export async function GET() {
  const testMode = isStripeTestMode();
  const secretKeyPrefix = getStripeSecretKey().substring(0, 12) + '...';
  
  // Test price IDs that we're trying to use
  const testPriceIds = {
    pro_monthly: 'price_1THMhjBhIRngoSRXvbQyNKcE',
    pro_yearly: 'price_1THMhjBhIRngoSRXNhX1dcad',
  };
  
  const livePriceIds = {
    pro_monthly: 'price_1T9WRxBhlRngoSRXX9UJTQPY',
    pro_yearly: 'price_1T9WSyBhlRngoSRXQPTRKZib',
  };
  
  const stripe = new Stripe(getStripeSecretKey(), {
    apiVersion: '2026-02-25.clover',
  });
  
  const results: Record<string, unknown> = {
    currentMode: testMode ? 'TEST' : 'LIVE',
    secretKeyPrefix,
    envVars: {
      STRIPE_USE_TEST_MODE: process.env.STRIPE_USE_TEST_MODE,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      STRIPE_TEST_SECRET_KEY_SET: !!process.env.STRIPE_TEST_SECRET_KEY,
      STRIPE_SECRET_KEY_SET: !!process.env.STRIPE_SECRET_KEY,
    },
    priceChecks: {},
  };
  
  // Check which prices exist with current key
  const priceIdsToCheck = testMode ? testPriceIds : livePriceIds;
  
  for (const [name, priceId] of Object.entries(priceIdsToCheck)) {
    try {
      const price = await stripe.prices.retrieve(priceId);
      (results.priceChecks as Record<string, unknown>)[name] = {
        id: priceId,
        status: 'EXISTS',
        active: price.active,
        currency: price.currency,
        unitAmount: price.unit_amount,
      };
    } catch (error) {
      (results.priceChecks as Record<string, unknown>)[name] = {
        id: priceId,
        status: 'NOT_FOUND',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  // Also check the "test" prices with current key to see if they exist
  results.testPricesWithCurrentKey = {};
  for (const [name, priceId] of Object.entries(testPriceIds)) {
    try {
      const price = await stripe.prices.retrieve(priceId);
      (results.testPricesWithCurrentKey as Record<string, unknown>)[name] = {
        id: priceId,
        status: 'EXISTS',
        active: price.active,
      };
    } catch (error) {
      (results.testPricesWithCurrentKey as Record<string, unknown>)[name] = {
        id: priceId,
        status: 'NOT_FOUND',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  return NextResponse.json(results, { status: 200 });
}
