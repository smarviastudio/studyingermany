import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  title: 'My Shortlist - German Path',
};

export default function ShortlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
