// Single source of truth for what the Pro subscription costs.
//
// IMPORTANT: This is the only place the advertised amounts are defined. The
// pricing page renders these values and @/lib/stripe reports them alongside the
// Stripe price IDs, so the price a visitor sees and the price Stripe charges
// cannot drift apart. They previously did: the page hardcoded €9.99/month while
// checkout resolved a CHF 9.99 price through a stale environment variable.
//
// Changing an amount here is NOT enough on its own — Stripe prices are
// immutable, so a new price must be created in Stripe and PLAN_PRICE_IDS in
// @/lib/stripe pointed at it.

export type PlanKey = 'pro_monthly' | 'pro_yearly';

// Amounts in cents. Currency is EUR for every plan price.
export const PLAN_AMOUNTS: Record<PlanKey, number> = {
  pro_monthly: 999,
  pro_yearly: 7999,
};

export const PLAN_CURRENCY = 'EUR';

export function formatPlanPrice(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`;
}

// What the yearly plan works out to per month, for the "billed yearly" copy.
export function yearlyPricePerMonth(): string {
  return formatPlanPrice(Math.round(PLAN_AMOUNTS.pro_yearly / 12));
}

// Headline discount on the yearly plan, e.g. 33 for "Yearly −33%".
export function yearlyDiscountPercent(): number {
  const yearlyAtMonthlyRate = PLAN_AMOUNTS.pro_monthly * 12;
  return Math.round((1 - PLAN_AMOUNTS.pro_yearly / yearlyAtMonthlyRate) * 100);
}
