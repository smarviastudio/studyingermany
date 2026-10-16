import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getStripe } from '@/lib/stripe';
import { VORFAHRT_WEB, hasVorfahrtWebUnlock, stripeLocale } from '@/lib/vorfahrtWeb';

export const runtime = 'nodejs';

const SUBMIT_TEXT: Record<string, string> = {
  de: 'Die Web-Version wird direkt nach der Zahlung in deinem Browser freigeschaltet.',
  en: 'The web version is unlocked in your browser right after payment.',
  nl: 'De webversie wordt direct na betaling in je browser ontgrendeld.',
  it: 'La versione web viene sbloccata nel browser subito dopo il pagamento.',
  es: 'La versión web se desbloquea en tu navegador justo después del pago.',
  pl: 'Wersja web zostanie odblokowana w przeglądarce zaraz po płatności.',
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    // Digital content: the buyer must agree that access starts now and the
    // 14-day withdrawal right ends with it (§ 356 Abs. 5 BGB).
    if (body?.consent !== true) {
      return NextResponse.json({ error: 'consent_required' }, { status: 400 });
    }

    if (await hasVorfahrtWebUnlock(session.user.id)) {
      return NextResponse.json({ unlocked: true });
    }

    const locale = stripeLocale(body?.lang);
    // Return to the host that served the request, so previews and localhost
    // come back to themselves instead of production.
    const origin = req.nextUrl.origin;

    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: 'payment',
      customer_email: session.user.email,
      locale,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: VORFAHRT_WEB.currency,
            unit_amount: VORFAHRT_WEB.amountCents,
            // EUR 14.99 is the final price; any VAT is included, never added on top.
            tax_behavior: 'inclusive',
            product_data: {
              name: VORFAHRT_WEB.name,
              description: 'Einmalzahlung, kein Abo. Gilt für die Web-Version auf germanpath.com.',
              tax_code: VORFAHRT_WEB.taxCode,
            },
          },
        },
      ],
      // Stripe Tax: charges VAT only where the account is registered (none as of
      // Oct 2026, so nothing is added) and tracks registration thresholds.
      automatic_tax: { enabled: true },
      // The purchase confirmation on a durable medium (§ 356 (5) BGB). Sent per
      // payment, independent of the account-wide receipt setting.
      payment_intent_data: { receipt_email: session.user.email },
      custom_text: { submit: { message: SUBMIT_TEXT[locale] } },
      success_url: `${origin}${VORFAHRT_WEB.path}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${VORFAHRT_WEB.path}?checkout=cancel`,
      metadata: {
        userId: session.user.id,
        product: VORFAHRT_WEB.product,
        consentAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('[Vorfahrt Web Checkout] Error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
