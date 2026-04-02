import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { upsertStripeSubscription, syncStripeSubscriptionBenefits } from '@/lib/stripe-subscription-sync';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const email = session.user.email;

    // Find the user's Stripe customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    
    if (customers.data.length === 0) {
      return NextResponse.json({ 
        error: 'No Stripe customer found',
        email,
      }, { status: 404 });
    }

    const customer = customers.data[0];
    
    // Get all subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      limit: 10,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ 
        error: 'No subscriptions found',
        customerId: customer.id,
      }, { status: 404 });
    }

    // Get the most recent active subscription
    const activeSubscription = subscriptions.data.find(
      sub => sub.status === 'active' || sub.status === 'trialing'
    ) || subscriptions.data[0];

    // Sync the subscription
    await upsertStripeSubscription(userId, activeSubscription);
    await syncStripeSubscriptionBenefits(userId, activeSubscription);

    // Get updated user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription synced successfully',
      subscription: activeSubscription,
      userSubscription: user?.subscription,
      aiCredits: user?.aiCredits,
    });
  } catch (error) {
    console.error('Error syncing subscription:', error);
    return NextResponse.json({ 
      error: 'Failed to sync subscription',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
