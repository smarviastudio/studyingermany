import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Cover Letter Generator Workspace',
  description: 'Create and edit German-style cover letters inside the German Path builder.',
  path: '/cover-letter',
  noIndex: true,
});

export default function CoverLetterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
