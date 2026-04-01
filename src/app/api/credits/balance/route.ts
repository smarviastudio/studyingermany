import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getAiGenerationLimit, normalizePlanType } from '@/lib/plans';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        aiCredits: true,
        subscription: { select: { planType: true } }
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const planType = normalizePlanType(user.subscription?.planType ?? 'free');
    const month = new Date().toISOString().slice(0, 7);
    const usage = await prisma.usageLimits.findUnique({
      where: { userId_month: { userId: session.user.id, month } },
    });

    const usedFreeCredits = usage
      ? (usage.cvGenerations ?? 0) +
        (usage.motivationLetterGenerations ?? 0) +
        (usage.coverLetterGenerations ?? 0)
      : 0;

    const includedCredits = getAiGenerationLimit(planType);
    const freeCreditsRemaining = planType === 'free' ? Math.max(0, includedCredits - usedFreeCredits) : 0;
    const credits = planType === 'pro'
      ? Math.max(0, user.aiCredits)
      : Math.max(0, user.aiCredits) + freeCreditsRemaining;

    return NextResponse.json({ 
      credits,
      hasUnlimited: false,
      planType,
      freeCreditsRemaining,
      purchasedCredits: user.aiCredits,
      includedCredits,
    });
  } catch (err) {
    console.error('[Credits Balance]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
