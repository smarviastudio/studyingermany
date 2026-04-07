import { NextResponse } from 'next/server';
import { isStripeTestMode } from '@/lib/stripe';

export async function GET() {
  return NextResponse.json({
    testMode: isStripeTestMode(),
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || 'local',
  });
}
