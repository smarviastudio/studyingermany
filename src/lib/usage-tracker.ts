import { prisma } from './prisma';
import { FREE_MONTHLY_TOTAL } from './stripe';

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

async function getUserPlanType(userId: string): Promise<'free' | 'student' | 'pro'> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });
  if (!subscription || subscription.status !== 'active') return 'free';
  return subscription.planType as 'free' | 'student' | 'pro';
}

export async function checkUsageLimit(
  userId: string,
  feature: FeatureType
): Promise<{ allowed: boolean; current: number; limit: number; planType: string }> {
  const planType = await getUserPlanType(userId);

  if (planType !== 'free') {
    return { allowed: true, current: 0, limit: -1, planType };
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

  return { allowed: totalUsed < limit, current: totalUsed, limit, planType };
}

export async function incrementUsage(userId: string, feature: FeatureType): Promise<void> {
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
  const [planType, usage] = await Promise.all([
    getUserPlanType(userId),
    prisma.usageLimits.findUnique({ where: { userId_month: { userId, month } } }),
  ]);

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
