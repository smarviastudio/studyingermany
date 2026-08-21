import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Cover Letter Generator - German Anschreiben',
  description: 'Generate professional German cover letters (Anschreiben) with AI — tailored for German employers and university applications. Free and instant.',
  path: '/cover-letter/landing',
  keywords: [
    'German cover letter',
    'Anschreiben generator',
    'cover letter Germany',
    'AI cover letter',
    'job application Germany',
  ],
  openGraphDescription: 'Generate professional German cover letters with AI. Free and optimized for German employers.',
});

export default function CoverLetterLandingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
