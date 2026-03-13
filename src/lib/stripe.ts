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

export type PlanKey = 'student_monthly' | 'student_yearly' | 'pro_monthly' | 'pro_yearly';

export function getPlans() {
  return {
    student_monthly: {
      priceId: process.env.STRIPE_PRICE_STUDENT_MONTHLY!,
      planType: 'student',
      label: 'Student Plan',
      interval: 'month',
      amount: 999,
    },
    student_yearly: {
      priceId: process.env.STRIPE_PRICE_STUDENT_YEARLY!,
      planType: 'student',
      label: 'Student Plan',
      interval: 'year',
      amount: 7999,
    },
    pro_monthly: {
      priceId: process.env.STRIPE_PRICE_PRO_MONTHLY!,
      planType: 'pro',
      label: 'Pro Plan',
      interval: 'month',
      amount: 2499,
    },
    pro_yearly: {
      priceId: process.env.STRIPE_PRICE_PRO_YEARLY!,
      planType: 'pro',
      label: 'Pro Plan',
      interval: 'year',
      amount: 19999,
    },
  } as const;
}

export function getPlanTypeFromPriceId(priceId: string): 'student' | 'pro' | 'free' {
  const plans = getPlans();
  for (const plan of Object.values(plans)) {
    if (plan.priceId === priceId) return plan.planType as 'student' | 'pro';
  }
  return 'free';
}

export const FREE_LIMITS = {
  cvGenerations: 5,
  motivationLetterGenerations: 5,
  coverLetterGenerations: 5,
  programSearches: 30,
};

export const FREE_MONTHLY_TOTAL = 5; // shared pool across all AI tools

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
