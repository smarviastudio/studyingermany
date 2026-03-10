import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

export const PLANS = {
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

export type PlanKey = keyof typeof PLANS;

export function getPlanTypeFromPriceId(priceId: string): 'student' | 'pro' | 'free' {
  for (const plan of Object.values(PLANS)) {
    if (plan.priceId === priceId) return plan.planType as 'student' | 'pro';
  }
  return 'free';
}

export const FREE_LIMITS = {
  cvGenerations: 3,
  motivationLetterGenerations: 3,
  coverLetterGenerations: 3,
  programSearches: 30,
};
