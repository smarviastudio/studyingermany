import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'AI Credits',
  description: 'Manage AI credits for German Path tools.',
  path: '/credits',
  noIndex: true,
});

export default function CreditsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
