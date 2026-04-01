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
      select: { id: true, aiCredits: true, subscription: { select: { planType: true } } },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const month = new Date().toISOString().slice(0, 7); // "2025-06"
    const usage = await prisma.usageLimits.findUnique({
      where: { userId_month: { userId: user.id, month } },
    });

    const planType = normalizePlanType(user.subscription?.planType ?? 'free');
    const limit = getAiGenerationLimit(planType);

    const used = usage
      ? (usage.cvGenerations ?? 0) +
        (usage.motivationLetterGenerations ?? 0) +
        (usage.coverLetterGenerations ?? 0)
      : 0;

    if (planType === 'pro') {
      const remaining = Math.max(0, user.aiCredits);
      return NextResponse.json({
        used: Math.max(0, limit - remaining),
        limit,
        remaining,
        planType,
        month,
      });
    }

    return NextResponse.json({ used, limit, remaining: Math.max(0, limit - used), planType, month });
  } catch (err) {
    console.error('[ai-credits]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
