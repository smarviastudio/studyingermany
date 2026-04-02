import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getIncludedAiCredits } from '@/lib/plans';
import { getPlanTypeFromPriceId, stripe } from '@/lib/stripe';

const ACTIVE_SUBSCRIPTION_STATUSES = new Set<Stripe.Subscription.Status>([
  'active',
  'trialing',
  'past_due',
  'unpaid',
]);

export async function upsertStripeSubscription(
  userId: string,
  stripeSubscription: Stripe.Subscription
) {
  const priceId = stripeSubscription.items.data[0]?.price?.id ?? '';
  const planType = getPlanTypeFromPriceId(priceId);
  
  // Calculate period dates from billing_cycle_anchor and interval
  const subscriptionData = stripeSubscription as any;
  const startTimestamp = subscriptionData.start_date || subscriptionData.billing_cycle_anchor || subscriptionData.created;
  
  // Get interval from plan (month, year, etc.)
  const interval = subscriptionData.plan?.interval || 'month';
  const intervalCount = subscriptionData.plan?.interval_count || 1;
  
  // Calculate end date based on interval
  const startDate = new Date(startTimestamp * 1000);
  const endDate = new Date(startDate);
  
  if (interval === 'month') {
    endDate.setMonth(endDate.getMonth() + intervalCount);
  } else if (interval === 'year') {
    endDate.setFullYear(endDate.getFullYear() + intervalCount);
  } else if (interval === 'week') {
    endDate.setDate(endDate.getDate() + (7 * intervalCount));
  } else if (interval === 'day') {
    endDate.setDate(endDate.getDate() + intervalCount);
  }
  
  const currentPeriodStart = startDate;
  const currentPeriodEnd = endDate;
  
  console.log('[Stripe Sync] Calculated periods:', {
    id: stripeSubscription.id,
    startTimestamp,
    interval,
    intervalCount,
    currentPeriodStart: currentPeriodStart.toISOString(),
    currentPeriodEnd: currentPeriodEnd.toISOString(),
  });

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      planType,
      status: stripeSubscription.status,
      stripeSubscriptionId: stripeSubscription.id,
      stripeCustomerId: stripeSubscription.customer as string,
      stripePriceId: priceId,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
    },
    update: {
      planType,
      status: stripeSubscription.status,
      stripeSubscriptionId: stripeSubscription.id,
      stripeCustomerId: stripeSubscription.customer as string,
      stripePriceId: priceId,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      updatedAt: new Date(),
    },
  });

  return { priceId, planType };
}

export async function syncStripeSubscriptionBenefits(
  userId: string,
  stripeSubscription: Stripe.Subscription
) {
  const priceId = stripeSubscription.items.data[0]?.price?.id ?? '';
  const planType = getPlanTypeFromPriceId(priceId);
  const includedCredits = getIncludedAiCredits(planType);

  if (includedCredits === null) return;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { aiCredits: true },
  });

  if (!user || user.aiCredits >= includedCredits) return;

  await prisma.user.update({
    where: { id: userId },
    data: { aiCredits: includedCredits },
  });
}

async function getSubscriptionFromCheckoutSession(
  checkoutSessionId: string,
  userId: string,
  email: string
) {
  const checkoutSession = await stripe.checkout.sessions.retrieve(checkoutSessionId);

  if (checkoutSession.mode !== 'subscription' || !checkoutSession.subscription) {
    throw new Error('Checkout session does not contain a subscription');
  }

  const sessionUserId = checkoutSession.metadata?.userId;
  const sessionEmail = checkoutSession.customer_details?.email || checkoutSession.customer_email;

  if (sessionUserId && sessionUserId !== userId) {
    throw new Error('Checkout session does not belong to the current user');
  }

  if (sessionEmail && sessionEmail.toLowerCase() !== email.toLowerCase()) {
    throw new Error('Checkout session email does not match the current user');
  }

  return stripe.subscriptions.retrieve(checkoutSession.subscription as string);
}

async function findLatestStripeSubscriptionByEmail(email: string) {
  const customers = await stripe.customers.list({ email, limit: 10 });
  const subscriptions = (
    await Promise.all(
      customers.data.map((customer) =>
        stripe.subscriptions.list({ customer: customer.id, status: 'all', limit: 10 })
      )
    )
  ).flatMap((result) => result.data);

  const ranked = subscriptions
    .filter((subscription) => ACTIVE_SUBSCRIPTION_STATUSES.has(subscription.status))
    .sort((a, b) => b.created - a.created);

  return ranked[0] || null;
}

export async function syncStripeSubscriptionForUser({
  userId,
  email,
  checkoutSessionId,
}: {
  userId: string;
  email: string;
  checkoutSessionId?: string;
}) {
  const stripeSubscription = checkoutSessionId
    ? await getSubscriptionFromCheckoutSession(checkoutSessionId, userId, email)
    : await findLatestStripeSubscriptionByEmail(email);

  if (!stripeSubscription) {
    return null;
  }

  const { planType, priceId } = await upsertStripeSubscription(userId, stripeSubscription);
  await syncStripeSubscriptionBenefits(userId, stripeSubscription);

  return {
    planType,
    priceId,
    status: stripeSubscription.status,
    subscriptionId: stripeSubscription.id,
  };
}
