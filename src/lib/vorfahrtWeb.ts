import type Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

// Vorfahrt 3D web version (/vorfahrt-3d/spielen): a one-time unlock bought with
// a germanpath account. It is its own product — separate from the iOS in-app
// purchase — and is stored as a CreditTransaction row (amount 0) so it needs no
// schema migration. Signing in on any browser restores it.
export const VORFAHRT_WEB = {
  product: 'vorfahrt3d-web',
  transactionType: 'vorfahrt3d_web_unlock',
  amountCents: 1499,
  currency: 'eur',
  // Stripe Tax category "Electronically Supplied Services".
  taxCode: 'txcd_10000000',
  name: 'Vorfahrt 3D – Web-Version (alle Übungen)',
  path: '/vorfahrt-3d/spielen',
} as const;

const STRIPE_LOCALES = ['de', 'en', 'nl', 'it', 'es', 'pl'] as const;
export type VorfahrtWebLang = (typeof STRIPE_LOCALES)[number];

export function stripeLocale(lang: unknown): VorfahrtWebLang {
  return STRIPE_LOCALES.includes(lang as VorfahrtWebLang) ? (lang as VorfahrtWebLang) : 'de';
}

export async function hasVorfahrtWebUnlock(userId: string): Promise<boolean> {
  const row = await prisma.creditTransaction.findFirst({
    where: { userId, type: VORFAHRT_WEB.transactionType },
    select: { id: true },
  });
  return Boolean(row);
}

/**
 * Records the unlock for a paid checkout session. Called from the return URL
 * and from the Stripe webhook, so it must be idempotent.
 */
export async function grantVorfahrtWebUnlock(
  userId: string,
  session: Stripe.Checkout.Session,
): Promise<boolean> {
  if (session.metadata?.product !== VORFAHRT_WEB.product) return false;
  if (session.payment_status !== 'paid') return false;

  const existing = await prisma.creditTransaction.findUnique({
    where: { stripeSessionId: session.id },
    select: { id: true },
  });
  if (existing) return true;

  try {
    await prisma.creditTransaction.create({
      data: {
        userId,
        amount: 0,
        type: VORFAHRT_WEB.transactionType,
        description: `Vorfahrt 3D web unlock (${(session.amount_total ?? 0) / 100} ${session.currency?.toUpperCase() ?? ''})`,
        stripeSessionId: session.id,
      },
    });
  } catch (error) {
    // The webhook and the return URL can race; the unique session id wins once.
    if ((error as { code?: string }).code !== 'P2002') throw error;
  }
  return true;
}
