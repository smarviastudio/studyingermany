export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getStripeSecretKey, isStripeTestMode } from '@/lib/stripe';

export async function GET() {
  let stripeSecretKey: string;
  try {
    stripeSecretKey = getStripeSecretKey();
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Stripe key not configured',
      configured: false,
      stripeMode: isStripeTestMode() ? 'test' : 'live',
    });
  }

  const keyInfo = {
    configured: true,
    stripeMode: isStripeTestMode() ? 'test' : 'live',
    startsWithTest: stripeSecretKey.startsWith('sk_test_'),
    startsWithLive: stripeSecretKey.startsWith('sk_live_'),
    first10Chars: stripeSecretKey.substring(0, 10),
    length: stripeSecretKey.length,
  };

  return NextResponse.json(keyInfo);
}
