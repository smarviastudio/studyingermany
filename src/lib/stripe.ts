import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
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

export function getPlans() {
  return {
    pro_monthly: {
      priceId: process.env.STRIPE_PRICE_STUDENT_MONTHLY || 'price_1THN89BhIRngoSRXQc7qKse',
      planType: 'pro',
      label: 'Pro Plan',
      interval: 'month',
      amount: 999,
    },
    pro_yearly: {
      priceId: process.env.STRIPE_PRICE_STUDENT_YEARLY || 'price_1THN89BhIRngoSRXlqKJkqhj',
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
    'price_1THN89BhIRngoSRXQc7qKse': 'pro',
    'price_1THN89BhIRngoSRXlqKJkqhj': 'pro',
    'price_1THNGmBhIRngoSRX4WNCJEX0': 'pro', // Pro monthly
    'price_1THNGmBhIRngoSRXlNk14xBe': 'pro', // Pro yearly
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
