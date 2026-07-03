// Single source of truth for one-time AI credit packs.
//
// IMPORTANT: The Stripe webhook grants credits based on the `credits` value in
// the checkout session metadata. That metadata is set in
// /api/stripe/create-checkout using PRICE_ID_TO_CREDITS below. If a live price
// ID is missing from this map, the customer is charged but receives NO credits.
// Keep this file as the only place credit-pack price IDs are defined.

export type CreditPackKey = 'credits_20' | 'credits_100' | 'credits_300';

export type CreditPack = {
  key: CreditPackKey;
  credits: number;
  price: number; // EUR
  perCredit: number;
  label: string;
  popular?: boolean;
  badge?: boolean;
};

// Display metadata for the packs (price IDs are resolved separately by mode).
export const CREDIT_PACKS: CreditPack[] = [
  { key: 'credits_20', credits: 20, price: 2.99, perCredit: 0.15, label: 'Best for trying' },
  { key: 'credits_100', credits: 100, price: 9.99, perCredit: 0.1, label: 'Most popular', popular: true },
  { key: 'credits_300', credits: 300, price: 24.99, perCredit: 0.08, label: 'Best value 🔥', badge: true },
];

// Stripe price IDs per mode. Live IDs come from the Stripe dashboard; test IDs
// from the Stripe test environment.
export const CREDIT_PACK_PRICE_IDS: Record<'live' | 'test', Record<CreditPackKey, string>> = {
  live: {
    credits_20: 'price_1THMl6BhIRngoSRXMBbRuS2m', // €2.99
    credits_100: 'price_1THMl6BhIRngoSRXEH2UHrYP', // €9.99
    credits_300: 'price_1THMl6BhIRngoSRXrR48BBwX', // €24.99
  },
  test: {
    credits_20: 'price_1THNNCBhIRngoSRXEd8VpVkv',
    credits_100: 'price_1THNNCBhIRngoSRXR97jnrrf',
    credits_300: 'price_1THNNCBhIRngoSRXROohsxsl',
  },
};

// Reverse map: every known credit price ID (live AND test) -> credits granted.
// Used by the webhook path in /api/stripe/create-checkout to stamp the
// `credits` metadata regardless of which mode the purchase was made in.
export const PRICE_ID_TO_CREDITS: Record<string, number> = (() => {
  const map: Record<string, number> = {};
  for (const mode of ['live', 'test'] as const) {
    for (const pack of CREDIT_PACKS) {
      map[CREDIT_PACK_PRICE_IDS[mode][pack.key]] = pack.credits;
    }
  }
  return map;
})();

export function getCreditPackPriceId(key: CreditPackKey, testMode: boolean): string {
  return CREDIT_PACK_PRICE_IDS[testMode ? 'test' : 'live'][key];
}
