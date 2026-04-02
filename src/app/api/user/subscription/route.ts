import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getAiGenerationLimit, normalizePlanType } from '@/lib/plans';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        aiCredits: true,
        subscription: {
          select: {
            planType: true,
            status: true,
            currentPeriodEnd: true,
            cancelAtPeriodEnd: true,
            stripePriceId: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const planType = normalizePlanType(user.subscription?.planType ?? 'free');
    const month = new Date().toISOString().slice(0, 7);
    const usage = await prisma.usageLimits.findUnique({
      where: { userId_month: { userId: user.id, month } },
    });
    const usedFreeCredits = usage
      ? (usage.cvGenerations ?? 0) +
        (usage.motivationLetterGenerations ?? 0) +
        (usage.coverLetterGenerations ?? 0)
      : 0;

    const includedCredits = getAiGenerationLimit(planType);
    const displayCredits = planType === 'pro'
      ? Math.max(0, user.aiCredits)
      : Math.max(0, user.aiCredits) + Math.max(0, includedCredits - usedFreeCredits);

    return NextResponse.json({
      ...user,
      displayCredits,
      normalizedPlanType: planType,
    });
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
