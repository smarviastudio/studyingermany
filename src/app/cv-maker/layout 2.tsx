import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'AI CV Maker Workspace',
  description: 'Create and edit your German-style CV inside the German Path builder.',
  path: '/cv-maker',
  noIndex: true,
});

export default function CVMakerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
