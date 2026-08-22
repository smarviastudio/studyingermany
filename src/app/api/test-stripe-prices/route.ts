export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeSecretKey, isStripeTestMode, PLAN_PRICE_IDS } from '@/lib/stripe';
import { CREDIT_PACK_PRICE_IDS } from '@/lib/creditPacks';
import { PLAN_AMOUNTS, PLAN_CURRENCY } from '@/lib/subscriptionPlans';
import { requireDiagnosticsAccess } from '@/lib/adminGuard';

export async function GET() {
  if (!(await requireDiagnosticsAccess())) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const stripe = new Stripe(getStripeSecretKey(), {
    apiVersion: '2026-02-25.clover',
  });

  // Check the price IDs the app actually resolves in the current mode, not the
  // environment variables it used to read. Subscription prices are additionally
  // checked against PLAN_AMOUNTS, which is what the pricing page advertises —
  // that comparison is what catches a price drifting into the wrong amount or
  // currency, as the CHF 9.99 "€9.99" monthly price once did.
  const mode = isStripeTestMode() ? 'test' : 'live';

  const priceSources: Record<string, string | undefined> = {
    proMonthly: PLAN_PRICE_IDS[mode].pro_monthly,
    proYearly: PLAN_PRICE_IDS[mode].pro_yearly,
    credits20: CREDIT_PACK_PRICE_IDS[mode].credits_20,
    credits100: CREDIT_PACK_PRICE_IDS[mode].credits_100,
    credits300: CREDIT_PACK_PRICE_IDS[mode].credits_300,
  };

  const advertisedAmounts: Record<string, number> = {
    proMonthly: PLAN_AMOUNTS.pro_monthly,
    proYearly: PLAN_AMOUNTS.pro_yearly,
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
        const { label, priceId, price } = result.value;
        const expectedAmount = advertisedAmounts[label];
        const mismatch =
          expectedAmount !== undefined &&
          (price.unit_amount !== expectedAmount ||
            price.currency !== PLAN_CURRENCY.toLowerCase());

        (mismatch ? invalidPrices : validPrices).push({
          label,
          priceId,
          amount: price.unit_amount,
          currency: price.currency,
          type: price.type,
          nickname: price.nickname,
          ...(mismatch
            ? {
                error: `Stripe charges ${price.unit_amount} ${price.currency.toUpperCase()} but the pricing page advertises ${expectedAmount} ${PLAN_CURRENCY}`,
              }
            : {}),
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
    checkedPrices: Object.keys(priceSources),
    missingPrices,
    validPrices,
    invalidPrices,
    message: `Found ${validPrices.length} valid prices out of ${priceIds.length}`,
  });
}
