import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'German CV Maker – Free AI Lebenslauf Builder (PDF Export)',
  description: 'Create a German-style CV (Lebenslauf) in minutes with AI — try it free, no signup. ATS-friendly template that German employers and universities expect, with instant PDF download.',
  path: '/cv-maker/landing',
  keywords: [
    'German CV maker',
    'Lebenslauf generator',
    'CV for Germany',
    'German resume builder',
    'AI CV maker',
    'CV template Germany',
  ],
  openGraphTitle: 'AI CV Maker - Create German-Style CV',
  openGraphDescription: 'Build a professional German CV with AI. Free templates optimized for German university applications and jobs.',
});

export default function CVMakerLandingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
