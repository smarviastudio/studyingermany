import { NextRequest, NextResponse } from 'next/server';
import { stripe, getPlanTypeFromPriceId, getStripeWebhookSecret } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { getIncludedAiCredits } from '@/lib/plans';
import {
  syncStripeSubscriptionBenefits,
  upsertStripeSubscription,
} from '@/lib/stripe-subscription-sync';

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      getStripeWebhookSecret()
    );
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get userId from metadata or find by email
        let userId = session.metadata?.userId;
        
        if (!userId && session.customer_details?.email) {
          const user = await prisma.user.findUnique({
            where: { email: session.customer_details.email },
            select: { id: true },
          });
          userId = user?.id;
        }
        
        if (!userId) {
          console.error('[Webhook] No userId found for session:', session.id);
          break;
        }

        // Handle credit purchases (one-time payments)
        if (session.mode === 'payment' && session.metadata?.credits) {
          const credits = parseInt(session.metadata.credits, 10);
          if (credits > 0) {
            await prisma.$transaction(async (tx) => {
              await tx.user.update({
                where: { id: userId },
                data: { aiCredits: { increment: credits } },
              });
              await tx.creditTransaction.create({
                data: {
                  userId,
                  amount: credits,
                  type: 'purchase',
                  description: `Purchased ${credits} AI credits`,
                  stripeSessionId: session.id,
                },
              });
            });
            console.log(`[Webhook] Added ${credits} credits to user ${userId}`);
          }
          break;
        }

        // Handle subscription purchases
        if (session.mode === 'subscription') {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          
          // Add userId to subscription metadata for future webhook events
          await stripe.subscriptions.update(subscription.id, {
            metadata: { userId },
          });
          
          await upsertStripeSubscription(userId, subscription);
          await syncStripeSubscriptionBenefits(userId, subscription);
          
          console.log(`[Webhook] Subscription created for user ${userId}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (!userId) {
          // Try to find user by stripeCustomerId
          const existing = await prisma.subscription.findFirst({
            where: { stripeCustomerId: subscription.customer as string },
          });
          if (existing) {
            await upsertStripeSubscription(existing.userId, subscription);
          }
          break;
        }
        await upsertStripeSubscription(userId, subscription);
        console.log(`[Webhook] Subscription updated for user ${userId}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const existing = await prisma.subscription.findFirst({
          where: {
            OR: [
              { stripeSubscriptionId: subscription.id },
              { stripeCustomerId: subscription.customer as string },
            ],
          },
        });
        if (existing) {
          await prisma.subscription.update({
            where: { id: existing.id },
            data: {
              status: 'canceled',
              planType: 'free',
              updatedAt: new Date(),
            },
          });
          console.log(`[Webhook] Subscription canceled for user ${existing.userId}`);
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        if ((invoice as any).subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            (invoice as any).subscription as string
          );
          const existing = await prisma.subscription.findFirst({
            where: { stripeSubscriptionId: subscription.id },
          });
          if (existing) {
            await upsertStripeSubscription(existing.userId, subscription);
            await syncStripeSubscriptionBenefits(existing.userId, subscription);
          }
        }
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('[Webhook] Handler error:', error);
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
