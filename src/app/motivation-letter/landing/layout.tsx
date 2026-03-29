import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Motivation Letter Writer - German University Applications',
  description: 'Write compelling motivation letters for German university admissions with AI. Perfect for master\'s and bachelor\'s applications, scholarships, and study programs in Germany.',
  path: '/motivation-letter/landing',
  keywords: [
    'motivation letter Germany',
    'university application letter',
    'motivation letter for German university',
    'master application Germany',
    'scholarship motivation letter',
  ],
  openGraphTitle: 'Motivation Letter Writer',
  openGraphDescription: 'Write compelling motivation letters for German university admissions with AI assistance.',
});

export default function MotivationLetterLandingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
