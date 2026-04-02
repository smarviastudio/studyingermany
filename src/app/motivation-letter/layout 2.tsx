import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Motivation Letter Workspace',
  description: 'Create and edit German university motivation letters inside the German Path builder.',
  path: '/motivation-letter',
  noIndex: true,
});

export default function MotivationLetterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
