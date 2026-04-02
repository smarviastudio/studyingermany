export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeSecretKey } from '@/lib/stripe';

export async function POST() {
  try {
    const stripe = new Stripe(getStripeSecretKey(), {
      apiVersion: '2026-02-25.clover',
    });

    const results: Record<string, string> = {};

    // 1. STARTER PLAN
    const starterProduct = await stripe.products.create({
      name: 'Starter',
      description: 'Perfect for students starting their journey',
    });

    const starterMonthly = await stripe.prices.create({
      product: starterProduct.id,
      unit_amount: 499, // €4.99
      currency: 'eur',
      recurring: { interval: 'month' },
      nickname: 'Starter Monthly',
    });
    results.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY = starterMonthly.id;

    const starterYearly = await stripe.prices.create({
      product: starterProduct.id,
      unit_amount: 3999, // €39.99
      currency: 'eur',
      recurring: { interval: 'year' },
      nickname: 'Starter Yearly',
    });
    results.NEXT_PUBLIC_STRIPE_STARTER_YEARLY = starterYearly.id;

    // 2. ESSENTIAL PLAN
    const essentialProduct = await stripe.products.create({
      name: 'Essential',
      description: 'Everything you need for a successful application',
    });

    const essentialMonthly = await stripe.prices.create({
      product: essentialProduct.id,
      unit_amount: 999, // €9.99
      currency: 'eur',
      recurring: { interval: 'month' },
      nickname: 'Essential Monthly',
    });
    results.NEXT_PUBLIC_STRIPE_ESSENTIAL_MONTHLY = essentialMonthly.id;

    const essentialYearly = await stripe.prices.create({
      product: essentialProduct.id,
      unit_amount: 7999, // €79.99
      currency: 'eur',
      recurring: { interval: 'year' },
      nickname: 'Essential Yearly',
    });
    results.NEXT_PUBLIC_STRIPE_ESSENTIAL_YEARLY = essentialYearly.id;

    // 3. PRO PLAN
    const proProduct = await stripe.products.create({
      name: 'Pro',
      description: 'Complete support for your study abroad journey',
    });

    const proMonthly = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 1999, // €19.99
      currency: 'eur',
      recurring: { interval: 'month' },
      nickname: 'Pro Monthly',
    });
    results.NEXT_PUBLIC_STRIPE_PRO_MONTHLY = proMonthly.id;

    const proYearly = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 14999, // €149.99
      currency: 'eur',
      recurring: { interval: 'year' },
      nickname: 'Pro Yearly',
    });
    results.NEXT_PUBLIC_STRIPE_PRO_YEARLY = proYearly.id;

    // 4. CREDIT PACKS
    const creditsProduct = await stripe.products.create({
      name: 'AI Credits',
      description: 'Top up your AI generation credits anytime',
    });

    const credits20 = await stripe.prices.create({
      product: creditsProduct.id,
      unit_amount: 299, // €2.99
      currency: 'eur',
      nickname: '20 Credits',
      metadata: { credits: '20' },
    });
    results.NEXT_PUBLIC_STRIPE_CREDITS_20 = credits20.id;

    const credits100 = await stripe.prices.create({
      product: creditsProduct.id,
      unit_amount: 999, // €9.99
      currency: 'eur',
      nickname: '100 Credits',
      metadata: { credits: '100' },
    });
    results.NEXT_PUBLIC_STRIPE_CREDITS_100 = credits100.id;

    const credits300 = await stripe.prices.create({
      product: creditsProduct.id,
      unit_amount: 2499, // €24.99
      currency: 'eur',
      nickname: '300 Credits',
      metadata: { credits: '300' },
    });
    results.NEXT_PUBLIC_STRIPE_CREDITS_300 = credits300.id;

    return NextResponse.json({
      success: true,
      message: 'All Stripe products and prices created successfully!',
      priceIds: results,
      instructions: 'Add these environment variables to your .env.local and Vercel:',
    });
  } catch (error) {
    console.error('Stripe setup error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create products' },
      { status: 500 }
    );
  }
}
