import { track as vercelTrack } from '@vercel/analytics';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type EventProps = Record<string, string | number | boolean | null>;

// Single tracking entry point: sends every event to Vercel Analytics (as
// before) AND mirrors it to GA4, so funnel events can be marked as key events
// in Google Analytics. Import `track` from here instead of '@vercel/analytics'.
export function track(name: string, props?: EventProps) {
  vercelTrack(name, props);
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, props ?? {});
  }
}

export function trackEcommerce(
  name: string,
  payload: {
    currency?: string;
    value?: number;
    transaction_id?: string;
    item_list_name?: string;
    items?: Array<Record<string, string | number>>;
  },
) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, payload);
  }
}

// GA4 standard ecommerce purchase event. GA4 dedupes by transaction_id, so
// firing this on every visit to the success page is safe.
export function trackPurchase(sessionId: string, value?: number) {
  track('credits_purchase', { session_id: sessionId });
  trackEcommerce('purchase', {
    transaction_id: sessionId,
    currency: 'EUR',
    ...(typeof value === 'number' ? { value } : {}),
  });
}
