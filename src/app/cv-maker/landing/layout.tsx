import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'AI CV Maker - Create German-Style CV (Lebenslauf)',
  description: 'Build a professional German CV (Lebenslauf) with AI assistance. Optimized for German university applications and job searches. Free templates, PDF export, and AI-powered suggestions.',
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
