import type { LucideIcon } from 'lucide-react';

export interface AppScreenshot {
  src: string;
  alt: string;
}

export interface AppFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export interface AppAudience {
  badge: string;
  title: string;
  description: string;
  color: string;
}

export interface AppStep {
  title: string;
  description: string;
}

export interface AppFaq {
  question: string;
  answer: string;
  /** Slug of the guide this FAQ links to via "Learn more" */
  learnMoreSlug?: string;
}

export interface GuideSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  numbered?: string[];
}

export interface GuideHowToStep {
  title: string;
  text: string;
}

export interface AppGuide {
  slug: string;
  /** The search query this guide targets */
  keyword: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** Short teaser used on the landing page guide cards */
  excerpt: string;
  /** Opening paragraphs that answer the searcher's question directly */
  intro: string[];
  sections: GuideSection[];
  howToHeading: string;
  howToSteps: GuideHowToStep[];
  faqs?: { question: string; answer: string }[];
  /** Index into app.screenshots to illustrate the how-to (defaults to 0) */
  screenshotIndex?: number;
}

export interface AppPricingPro {
  name: string;
  bullets: string[];
  note: string;
}

export interface AppContent {
  /** Landing page route segment, e.g. "lesenlab-german-reading-app" */
  slug: string;
  appId: string;
  name: string;
  storeName: string;
  subtitle: string;
  lang: 'en' | 'de';
  appStoreUrl: string;
  icon: string;
  accent: string;
  accentDark: string;
  heroTitle: { pre: string; highlight: string; post: string };
  heroDescription: string;
  heroBenefits: string[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  screenshots: AppScreenshot[];
  audience: AppAudience[];
  features: AppFeature[];
  steps: AppStep[];
  platforms: string[];
  pricingFree: string;
  pricingPro?: AppPricingPro;
  guides: AppGuide[];
  faqs: AppFaq[];
  ctaHeading: string;
  ctaText: string;
  ratingValue?: string;
  ratingCount?: string;
  /** schema.org applicationCategory, e.g. "EducationApplication" */
  category: string;
  downloadNote: string;
}
