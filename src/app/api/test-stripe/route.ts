export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    starterMonthly: process.env.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_PRICE_ID,
    starterYearly: process.env.NEXT_PUBLIC_STRIPE_STARTER_YEARLY_PRICE_ID,
    essentialMonthly: process.env.NEXT_PUBLIC_STRIPE_ESSENTIAL_MONTHLY_PRICE_ID,
    essentialYearly: process.env.NEXT_PUBLIC_STRIPE_ESSENTIAL_YEARLY_PRICE_ID,
    proMonthly: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
    proYearly: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID,
    credits20: process.env.NEXT_PUBLIC_STRIPE_CREDITS_20_PRICE_ID,
    credits100: process.env.NEXT_PUBLIC_STRIPE_CREDITS_100_PRICE_ID,
    credits300: process.env.NEXT_PUBLIC_STRIPE_CREDITS_300_PRICE_ID,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    stripeSecret: process.env.STRIPE_SECRET_KEY ? 'SET' : 'NOT SET',
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
