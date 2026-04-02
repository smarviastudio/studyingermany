import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserUsageStats } from '@/lib/usage-tracker';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [subscription, stats] = await Promise.all([
      prisma.subscription.findUnique({ where: { userId: session.user.id } }),
      getUserUsageStats(session.user.id),
    ]);

    return NextResponse.json({
      subscription: subscription
        ? {
            planType: subscription.planType,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          }
        : null,
      planType: stats.planType,
      usage: stats.usage,
      limits: stats.limits,
    });
  } catch (error) {
    console.error('[Subscription API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}
