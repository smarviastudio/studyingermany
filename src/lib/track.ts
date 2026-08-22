import { track as vercelTrack } from '@vercel/analytics';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Queue an event for GA.
 *
 * Do NOT gate this on `typeof window.gtag === 'function'`. The GA init script
 * runs with strategy="afterInteractive", so `gtag` is still undefined while
 * React is running mount effects — which silently dropped every event fired on
 * mount, `view_pricing` among them.
 *
 * Instead install Google's own shim if it is not there yet. It queues calls on
 * dataLayer using the same `arguments` shape gtag.js expects, and gtag.js
 * replays whatever is already queued when it loads.
 *
 * If analytics consent is refused, gtag.js never loads and the queue is simply
 * an unread array — nobody who opted out is tracked.
 */
function ensureGtag(): ((...args: unknown[]) => void) | null {
  if (typeof window === 'undefined') return null;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtagShim() {
      // eslint-disable-next-line prefer-rest-params
      (window.dataLayer as unknown[]).push(arguments);
    };
  }
  return window.gtag as (...args: unknown[]) => void;
}

type EventProps = Record<string, string | number | boolean | null>;

// Single tracking entry point: sends every event to Vercel Analytics (as
// before) AND mirrors it to GA4, so funnel events can be marked as key events
// in Google Analytics. Import `track` from here instead of '@vercel/analytics'.
export function track(name: string, props?: EventProps) {
  vercelTrack(name, props);
  ensureGtag()?.('event', name, props ?? {});
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
  ensureGtag()?.('event', name, payload);
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
