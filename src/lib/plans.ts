export type RawPlanType = 'free' | 'starter' | 'essential' | 'student' | 'pro';
export type NormalizedPlanType = 'free' | 'starter' | 'essential' | 'pro';

const FREE_TEMPLATE_COUNT = 2;
const STARTER_TEMPLATE_COUNT = 10;

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
  const rawPlanType = getRawPlanType(planType);
  if (rawPlanType === 'student') return 'essential';
  return rawPlanType;
}

export function getPlanDisplayName(planType?: string | null): string {
  switch (getRawPlanType(planType)) {
    case 'starter':
      return 'Starter';
    case 'essential':
      return 'Essential';
    case 'student':
      return 'Student';
    case 'pro':
      return 'Pro';
    default:
      return 'Free';
  }
}

export function hasUnlimitedAi(planType?: string | null): boolean {
  const normalizedPlanType = normalizePlanType(planType);
  return normalizedPlanType === 'essential' || normalizedPlanType === 'pro';
}

export function getAiGenerationLimit(planType?: string | null): number {
  const normalizedPlanType = normalizePlanType(planType);

  switch (normalizedPlanType) {
    case 'starter':
      return 30;
    case 'essential':
    case 'pro':
      return 999;
    default:
      return 5;
  }
}

export function getIncludedAiCredits(planType?: string | null): number | null {
  return normalizePlanType(planType) === 'starter' ? 30 : null;
}

export function getAccessibleTemplateCount(planType?: string | null): number {
  const normalizedPlanType = normalizePlanType(planType);

  switch (normalizedPlanType) {
    case 'starter':
      return STARTER_TEMPLATE_COUNT;
    case 'essential':
    case 'pro':
      return Number.MAX_SAFE_INTEGER;
    default:
      return FREE_TEMPLATE_COUNT;
  }
}

export function canAccessCvTemplate(planType: string | null | undefined, templateIndex: number): boolean {
  return templateIndex < getAccessibleTemplateCount(planType);
}

export function getTemplateAccessLabel(templateIndex: number): string | null {
  if (templateIndex < FREE_TEMPLATE_COUNT) return null;
  if (templateIndex < STARTER_TEMPLATE_COUNT) return 'Starter+ plan';
  return 'Essential / Student / Pro';
}
