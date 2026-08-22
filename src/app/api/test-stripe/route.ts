export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { isStripeTestMode } from '@/lib/stripe';
import { requireDiagnosticsAccess } from '@/lib/adminGuard';

export async function GET() {
  if (!(await requireDiagnosticsAccess())) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const envVars = {
    stripeMode: isStripeTestMode() ? 'test' : 'live',
    stripeSecret: process.env.STRIPE_SECRET_KEY ? 'SET' : 'NOT SET',
    stripeTestSecret: process.env.STRIPE_TEST_SECRET_KEY ? 'SET' : 'NOT SET',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? 'SET' : 'NOT SET',
    stripeTestWebhookSecret: process.env.STRIPE_TEST_WEBHOOK_SECRET ? 'SET' : 'NOT SET',
    // Live price IDs are pinned in @/lib/stripe and @/lib/creditPacks; only the
    // sandbox subscription prices still come from the environment.
    testProMonthly: process.env.STRIPE_TEST_PRICE_PRO_MONTHLY,
    testProYearly: process.env.STRIPE_TEST_PRICE_PRO_YEARLY,
  };

  const missingVars = Object.entries(envVars)
    .filter(([key, value]) => !value && !key.toLowerCase().includes('secret'))
    .map(([key]) => key);

  return NextResponse.json({
    status: missingVars.length === 0 ? 'OK' : 'MISSING_VARS',
    envVars,
    missingVars,
    message: missingVars.length === 0 
      ? 'All environment variables are set!' 
      : `Missing: ${missingVars.join(', ')}`,
  });
}
