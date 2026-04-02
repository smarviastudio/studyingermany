import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'My Shortlist',
  description: 'Review and manage your shortlisted German university programs.',
  path: '/my-shortlist',
  noIndex: true,
});

export default function ShortlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
