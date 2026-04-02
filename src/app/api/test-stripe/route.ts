export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { isStripeTestMode } from '@/lib/stripe';

export async function GET() {
  const envVars = {
    stripeMode: isStripeTestMode() ? 'test' : 'live',
    stripeSecret: process.env.STRIPE_SECRET_KEY ? 'SET' : 'NOT SET',
    stripeTestSecret: process.env.STRIPE_TEST_SECRET_KEY ? 'SET' : 'NOT SET',
    liveProMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    liveProYearly: process.env.STRIPE_PRICE_PRO_YEARLY,
    testEssentialMonthly: process.env.STRIPE_TEST_PRICE_ESSENTIAL_MONTHLY,
    testEssentialYearly: process.env.STRIPE_TEST_PRICE_ESSENTIAL_YEARLY,
    testCredit20: process.env.STRIPE_TEST_PRICE_CREDITS_20,
    testCredit100: process.env.STRIPE_TEST_PRICE_CREDITS_100,
    testCredit300: process.env.STRIPE_TEST_PRICE_CREDITS_300,
  };

  const missingVars = Object.entries(envVars)
    .filter(([key, value]) => !value && key !== 'stripeSecret')
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
