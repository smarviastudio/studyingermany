import { buildPageMetadata } from '@/lib/seo';
import PricingClient from './PricingClient';

export const metadata = buildPageMetadata({
  title: 'German Path Pricing - AI Tools for Studying in Germany',
  description:
    'Compare German Path plans for international students. Start free, then unlock AI CV templates, cover letters and credits when you need them.',
  path: '/pricing',
  keywords: [
    'German Path pricing',
    'AI CV maker pricing',
    'study in Germany tools pricing',
    'motivation letter generator Germany',
    'cover letter generator Germany',
    'German university application tools',
  ],
  openGraphTitle: 'German Path Pricing - Free & Premium AI Study Tools',
  openGraphDescription:
    'See German Path plans for AI-powered CVs, cover letters, motivation letters, saved programs, and application tools for studying in Germany.',
  twitterTitle: 'German Path Pricing',
  twitterDescription:
    'Free and premium AI tools for international students applying to German universities.',
});

export default function PricingPage() {
  return <PricingClient />;
}
