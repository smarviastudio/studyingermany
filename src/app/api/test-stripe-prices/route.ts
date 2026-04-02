export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeSecretKey) {
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY not configured' }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2026-02-25.clover',
  });

  const priceIds = [
    'price_1THMg9BhIRngoSRXuAF4cOig', // Starter Monthly
    'price_1THMg9BhIRngoSRXHPAOCeLp', // Starter Yearly
    'price_1THMhjBhIRngoSRXvbQyNKcE', // Essential Monthly
    'price_1THMhjBhIRngoSRXNhX1dcad', // Essential Yearly
    'price_1THMj0BhIRngoSRXUxFgCUdS', // Pro Monthly
    'price_1THMj0BhIRngoSRXLxEVsAmJ', // Pro Yearly
    'price_1THMl6BhIRngoSRXMBbRuS2m', // Credits 20
    'price_1THMl6BhIRngoSRXEH2UHrYP', // Credits 100
    'price_1THMl6BhIRngoSRXrR48BBwX', // Credits 300
  ];

  const results = await Promise.allSettled(
    priceIds.map(async (priceId) => {
      try {
        const price = await stripe.prices.retrieve(priceId);
        return { priceId, valid: true, price };
      } catch (error) {
        return { priceId, valid: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    })
  );

  const validPrices: any[] = [];
  const invalidPrices: any[] = [];

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      if (result.value.valid && result.value.price) {
        validPrices.push({
          priceId: result.value.priceId,
          amount: result.value.price.unit_amount,
          currency: result.value.price.currency,
          type: result.value.price.type,
          nickname: result.value.price.nickname,
        });
      } else {
        invalidPrices.push({
          priceId: result.value.priceId,
          error: result.value.error,
        });
      }
    }
  });

  return NextResponse.json({
    validPrices,
    invalidPrices,
    message: `Found ${validPrices.length} valid prices out of ${priceIds.length}`,
  });
}
