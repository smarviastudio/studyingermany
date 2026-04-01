import { prisma } from './prisma';
import { FREE_LIMITS, FREE_MONTHLY_TOTAL } from './stripe';
import { getAiGenerationLimit, getIncludedAiCredits, getRawPlanType, normalizePlanType } from './plans';

type FeatureType = 'cv' | 'motivation' | 'cover' | 'search';

const fieldMap: Record<FeatureType, string> = {
  cv: 'cvGenerations',
  motivation: 'motivationLetterGenerations',
  cover: 'coverLetterGenerations',
  search: 'programSearches',
};

function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7); // "2025-03"
}

async function getUserPlanType(userId: string): Promise<string> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });
  if (!subscription || subscription.status !== 'active') return 'free';
  return getRawPlanType(subscription.planType);
}

export async function checkUsageLimit(
  userId: string,
  feature: FeatureType
): Promise<{ allowed: boolean; current: number; limit: number; planType: string; credits?: number }> {
  const rawPlanType = await getUserPlanType(userId);
  const planType = normalizePlanType(rawPlanType);

  // Check AI credits first
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { aiCredits: true },
  });

  if (user && user.aiCredits > 0) {
    const limit = getIncludedAiCredits(planType) ?? -1;
    const current = limit > 0 ? Math.max(0, limit - user.aiCredits) : 0;
    return { allowed: true, current, limit, planType, credits: user.aiCredits };
  }

  const includedCredits = getIncludedAiCredits(planType);
  if (includedCredits !== null) {
    const limit = getAiGenerationLimit(planType);
    return { allowed: false, current: limit, limit, planType, credits: 0 };
  }

  const month = getCurrentMonth();
  const usage = await prisma.usageLimits.findUnique({
    where: { userId_month: { userId, month } },
  });

  // Use shared monthly pool across all AI tools
  const totalUsed = usage
    ? (usage.cvGenerations ?? 0) + (usage.motivationLetterGenerations ?? 0) + (usage.coverLetterGenerations ?? 0)
    : 0;
  const limit = FREE_MONTHLY_TOTAL;

  return { allowed: totalUsed < limit, current: totalUsed, limit, planType, credits: 0 };
}

export async function incrementUsage(userId: string, feature: FeatureType): Promise<void> {
  // Check if user has AI credits first
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { aiCredits: true },
  });

  if (user && user.aiCredits > 0) {
    // Deduct 1 credit and log transaction
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { aiCredits: { decrement: 1 } },
      });
      await tx.creditTransaction.create({
        data: {
          userId,
          amount: -1,
          type: 'use',
          description: `Used 1 credit for ${feature} generation`,
        },
      });
    });
    return;
  }

  // Otherwise use monthly free limit
  const month = getCurrentMonth();
  await prisma.usageLimits.upsert({
    where: { userId_month: { userId, month } },
    create: {
      userId,
      month,
      [fieldMap[feature]]: 1,
    },
    update: {
      [fieldMap[feature]]: { increment: 1 },
    },
  });
}

export async function getUserUsageStats(userId: string) {
  const month = getCurrentMonth();
  const [rawPlanType, usage] = await Promise.all([
    getUserPlanType(userId),
    prisma.usageLimits.findUnique({ where: { userId_month: { userId, month } } }),
  ]);
  const planType = normalizePlanType(rawPlanType);

  return {
    planType,
    month,
    usage: {
      cv: (usage?.cvGenerations ?? 0),
      motivation: (usage?.motivationLetterGenerations ?? 0),
      cover: (usage?.coverLetterGenerations ?? 0),
      search: (usage?.programSearches ?? 0),
    },
    limits: planType === 'free' ? FREE_LIMITS : null,
  };
}
