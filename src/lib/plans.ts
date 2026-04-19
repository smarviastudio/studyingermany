export type RawPlanType = 'free' | 'starter' | 'essential' | 'student' | 'pro';
export type NormalizedPlanType = 'free' | 'pro';

const FREE_TEMPLATE_COUNT = 2;
const FREE_AI_CREDIT_LIMIT = 3;
const PRO_AI_CREDIT_LIMIT = 20;

/**
 * Launch promo — when true, every signed-in user gets access to all premium
 * CV templates for free. AI credit limits remain enforced server-side.
 * Flip to `false` to end the promo.
 */
export const PROMO_UNLOCK_PREMIUM_TEMPLATES_FOR_AUTH = true;

export function getRawPlanType(planType?: string | null): RawPlanType {
  switch (planType) {
    case 'starter':
      return 'starter';
    case 'essential':
      return 'essential';
    case 'student':
      return 'student';
    case 'pro':
      return 'pro';
    default:
      return 'free';
  }
}

export function normalizePlanType(planType?: string | null): NormalizedPlanType {
  return getRawPlanType(planType) === 'free' ? 'free' : 'pro';
}

export function getPlanDisplayName(planType?: string | null): string {
  return normalizePlanType(planType) === 'pro' ? 'Pro' : 'Free';
}

export function hasUnlimitedAi(planType?: string | null): boolean {
  return false;
}

export function getAiGenerationLimit(planType?: string | null): number {
  return normalizePlanType(planType) === 'pro' ? PRO_AI_CREDIT_LIMIT : FREE_AI_CREDIT_LIMIT;
}

export function getIncludedAiCredits(planType?: string | null): number | null {
  return normalizePlanType(planType) === 'pro' ? PRO_AI_CREDIT_LIMIT : null;
}

export function getShortlistLimit(planType?: string | null): number | null {
  return null;
}

export function getApplicationTrackingLimit(planType?: string | null): number | null {
  return 0;
}

export function getAiChatDailyLimit(planType?: string | null): number | null {
  return 0;
}

export function getAccessibleTemplateCount(planType?: string | null): number {
  return normalizePlanType(planType) === 'pro' ? Number.MAX_SAFE_INTEGER : FREE_TEMPLATE_COUNT;
}

export function canAccessCvTemplate(planType: string | null | undefined, templateIndex: number): boolean {
  return templateIndex < getAccessibleTemplateCount(planType);
}

export function getTemplateAccessLabel(templateIndex: number): string | null {
  if (templateIndex < FREE_TEMPLATE_COUNT) return null;
  return 'Pro plan';
}
