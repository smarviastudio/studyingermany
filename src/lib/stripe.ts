import Stripe from 'stripe';

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

export type PlanKey = 'pro_monthly' | 'pro_yearly';

function getPaidPlanPriceIds() {
  if (isStripeTestMode()) {
    const monthly = process.env.STRIPE_TEST_PRICE_ESSENTIAL_MONTHLY;
    const yearly = process.env.STRIPE_TEST_PRICE_ESSENTIAL_YEARLY;

    if (!monthly || !yearly) {
      throw new Error('STRIPE_TEST_PRICE_ESSENTIAL_MONTHLY and STRIPE_TEST_PRICE_ESSENTIAL_YEARLY are required in test mode');
    }

    return { monthly, yearly };
  }

  // In live mode, also use Essential prices
  const monthly = process.env.STRIPE_TEST_PRICE_ESSENTIAL_MONTHLY || process.env.STRIPE_PRICE_PRO_MONTHLY;
  const yearly = process.env.STRIPE_TEST_PRICE_ESSENTIAL_YEARLY || process.env.STRIPE_PRICE_PRO_YEARLY;

  if (!monthly || !yearly) {
    throw new Error('STRIPE_TEST_PRICE_ESSENTIAL_MONTHLY and STRIPE_TEST_PRICE_ESSENTIAL_YEARLY are required in live mode');
  }

  return { monthly, yearly };
}

export function getPlans() {
  const paidPlanPriceIds = getPaidPlanPriceIds();

  return {
    pro_monthly: {
      priceId: paidPlanPriceIds.monthly,
      planType: 'pro',
      label: 'Pro Plan',
      interval: 'month',
      amount: 999,
    },
    pro_yearly: {
      priceId: paidPlanPriceIds.yearly,
      planType: 'pro',
      label: 'Pro Plan',
      interval: 'year',
      amount: 7999,
    },
  } as const;
}

export function getPlanTypeFromPriceId(priceId: string): 'pro' | 'free' {
  const priceIdMap: Record<string, 'pro'> = {
    'price_1THN5NBhIRngoSRXiAUcKhva': 'pro',
    'price_1THN5NBhIRngoSRX93yw0Txf': 'pro',
    'price_1THMhjBhIRngoSRXvbQyNKcE': 'pro', // Essential monthly used as paid plan
    'price_1THMhjBhIRngoSRXNhX1dcad': 'pro', // Essential yearly used as paid plan
  };
  
  if (priceIdMap[priceId]) {
    return priceIdMap[priceId];
  }
  
  // Fallback to old logic
  const plans = getPlans();
  for (const plan of Object.values(plans)) {
    if (plan.priceId === priceId) return 'pro';
  }
  return 'free';
}

export const FREE_LIMITS = {
  cvGenerations: 3,
  motivationLetterGenerations: 3,
  coverLetterGenerations: 3,
  programSearches: 30,
};

export const FREE_MONTHLY_TOTAL = 3; // shared pool across all AI tools

export type CreditBundleKey = 'credits_50' | 'credits_200';

export function getCreditBundles() {
  return {
    credits_50: {
      priceId: 'price_1TAez6BhIRngoSRXGt4fAgNN',
      credits: 50,
      amount: 500,
      label: '50 AI Credits',
      description: '50 credits for AI generations',
    },
    credits_200: {
      priceId: 'price_1TAf0dBhIRngoSRX3VguFhEk',
      credits: 200,
      amount: 1500,
      label: '200 AI Credits',
      description: '200 credits for AI generations',
    },
  } as const;
}

export function getCreditAmountFromPriceId(priceId: string): number {
  const bundles = getCreditBundles();
  for (const bundle of Object.values(bundles)) {
    if (bundle.priceId === priceId) return bundle.credits;
  }
  return 0;
}
