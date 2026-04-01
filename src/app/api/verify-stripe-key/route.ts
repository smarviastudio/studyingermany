export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function GET() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeSecretKey) {
    return NextResponse.json({ 
      error: 'STRIPE_SECRET_KEY not configured',
      configured: false,
    });
  }

  const keyInfo = {
    configured: true,
    startsWithTest: stripeSecretKey.startsWith('sk_test_'),
    startsWithLive: stripeSecretKey.startsWith('sk_live_'),
    first10Chars: stripeSecretKey.substring(0, 10),
    length: stripeSecretKey.length,
  };

  return NextResponse.json(keyInfo);
}
