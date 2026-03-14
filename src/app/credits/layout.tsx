import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  title: 'AI Credits - German Path',
};

export default function CreditsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
