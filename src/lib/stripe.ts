import Stripe from 'stripe';
import { CREDIT_PACKS, CREDIT_PACK_PRICE_IDS, type CreditPackKey } from './creditPacks';
import { PLAN_AMOUNTS, type PlanKey } from './subscriptionPlans';

let _stripe: Stripe | null = null;

export function isStripeTestMode(): boolean {
  // Auto-detect test mode based on environment
  // Use test mode if:
  // 1. Explicitly set via STRIPE_USE_TEST_MODE
  // 2. Running on localhost
  // 3. Running on Vercel preview deployments
  
  if (process.env.STRIPE_USE_TEST_MODE === 'true') {
    return true;
  }
  
  // Auto-enable test mode for local development
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  // Auto-enable test mode for Vercel preview deployments
  if (process.env.VERCEL_ENV === 'preview') {
    return true;
  }
  
  return false;
}

export function getStripeSecretKey(): string {
  const stripeSecretKey = isStripeTestMode()
    ? process.env.STRIPE_TEST_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error(
      isStripeTestMode() ? 'STRIPE_TEST_SECRET_KEY is not set' : 'STRIPE_SECRET_KEY is not set'
    );
  }

  return stripeSecretKey;
}

export function getStripePublishableKey(): string {
  const publishableKey = isStripeTestMode()
    ? process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      isStripeTestMode()
        ? 'NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY is not set'
        : 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set'
    );
  }

  return publishableKey;
}

export function getStripeWebhookSecret(): string {
  const webhookSecret = isStripeTestMode()
    ? process.env.STRIPE_TEST_WEBHOOK_SECRET
    : process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error(
      isStripeTestMode()
        ? 'STRIPE_TEST_WEBHOOK_SECRET is not set'
        : 'STRIPE_WEBHOOK_SECRET is not set'
    );
  }

  return webhookSecret;
}

export function getStripeBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_URL ||
    process.env.NEXTAUTH_URL ||
    'https://www.germanpath.com'
  ).replace(/\/$/, '');
}

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(getStripeSecretKey(), {
      apiVersion: '2026-02-25.clover',
    });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop];
  },
});

export type { PlanKey };

// Live subscription price IDs are pinned here, not read from environment
// variables. A stale STRIPE_PRICE_PRO_MONTHLY in Vercel used to point checkout
// at a CHF price while the pricing page advertised EUR, so visitors were quoted
// euros and charged francs. Pinning them keeps this file and Stripe in step,
// the same way @/lib/creditPacks pins the credit-pack IDs.
//
// Test-mode IDs still come from the environment because every sandbox has its
// own; there is deliberately no fallback, so a missing value fails loudly
// instead of quietly borrowing a live ID.
export const PLAN_PRICE_IDS: Record<'live' | 'test', Record<PlanKey, string>> = {
  live: {
    pro_monthly: 'price_1U7AXZBhIRngoSRXrD7zZrUr', // EUR 9.99 / month
    pro_yearly: 'price_1U7AXqBhIRngoSRXHKE1l7iq', // EUR 79.99 / year
  },
  test: {
    pro_monthly: process.env.STRIPE_TEST_PRICE_PRO_MONTHLY || '',
    pro_yearly: process.env.STRIPE_TEST_PRICE_PRO_YEARLY || '',
  },
};

// Subscriptions sold before the EUR/CHF price cleanup still reference retired
// price IDs. They stay on Pro for the life of the subscription.
const LEGACY_PRO_PRICE_IDS = new Set([
  'price_1THMhjBhIRngoSRXvbQyNKcE', // Essential monthly, EUR 0.05 (mispriced)
  'price_1THMhjBhIRngoSRXNhX1dcad', // Essential yearly, EUR 79.99
  'price_1TKPLjBhIRngoSRX4JOzywq4', // Pro monthly, CHF 9.99
  'price_1THMj0BhIRngoSRXUxFgCUdS', // Pro monthly, EUR 19.99
  'price_1THMj0BhIRngoSRXLxEVsAmJ', // Pro yearly, EUR 149.99
]);

function getPaidPlanPriceIds(): Record<PlanKey, string> {
  const ids = PLAN_PRICE_IDS[isStripeTestMode() ? 'test' : 'live'];

  if (!ids.pro_monthly || !ids.pro_yearly) {
    throw new Error(
      'STRIPE_TEST_PRICE_PRO_MONTHLY and STRIPE_TEST_PRICE_PRO_YEARLY are required in test mode'
    );
  }

  return ids;
}

export function getPlans() {
  const priceIds = getPaidPlanPriceIds();

  return {
    pro_monthly: {
      priceId: priceIds.pro_monthly,
      planType: 'pro',
      label: 'Pro Plan',
      interval: 'month',
      amount: PLAN_AMOUNTS.pro_monthly,
    },
    pro_yearly: {
      priceId: priceIds.pro_yearly,
      planType: 'pro',
      label: 'Pro Plan',
      interval: 'year',
      amount: PLAN_AMOUNTS.pro_yearly,
    },
  } as const;
}

export function getPlanTypeFromPriceId(priceId: string): 'pro' | 'free' {
  const isCurrentPlanPrice = (['live', 'test'] as const).some((mode) =>
    Object.values(PLAN_PRICE_IDS[mode]).includes(priceId)
  );

  return isCurrentPlanPrice || LEGACY_PRO_PRICE_IDS.has(priceId) ? 'pro' : 'free';
}

export const FREE_LIMITS = {
  cvGenerations: 3,
  motivationLetterGenerations: 3,
  coverLetterGenerations: 3,
  programSearches: 30,
};

export const FREE_MONTHLY_TOTAL = 3; // shared pool across all AI tools

export type CreditBundleKey = CreditPackKey;

// Resolved from CREDIT_PACKS so /credits and /pricing sell the same thing.
// This used to hardcode a separate 50/200 pair against different Stripe
// products, which meant the two pages advertised different offers.
export function getCreditBundles(): Record<
  CreditPackKey,
  { priceId: string; credits: number; amount: number; label: string; description: string }
> {
  const priceIds = CREDIT_PACK_PRICE_IDS[isStripeTestMode() ? 'test' : 'live'];

  return Object.fromEntries(
    CREDIT_PACKS.map((pack) => [
      pack.key,
      {
        priceId: priceIds[pack.key],
        credits: pack.credits,
        amount: Math.round(pack.price * 100),
        label: `${pack.credits} AI Credits`,
        description: `${pack.credits} credits for AI generations`,
      },
    ])
  ) as Record<
    CreditPackKey,
    { priceId: string; credits: number; amount: number; label: string; description: string }
  >;
}

export function getCreditAmountFromPriceId(priceId: string): number {
  const pack = CREDIT_PACKS.find(
    (p) =>
      CREDIT_PACK_PRICE_IDS.live[p.key] === priceId ||
      CREDIT_PACK_PRICE_IDS.test[p.key] === priceId
  );
  return pack?.credits ?? 0;
}
