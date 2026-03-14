import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Motivation Letter Writer - German University Applications | German Path',
  description: 'Write compelling motivation letters for German university admissions with AI. Perfect for master\'s and bachelor\'s applications, scholarships, and study programs in Germany.',
  keywords: [
    'motivation letter Germany',
    'university application letter',
    'motivation letter for German university',
    'master application Germany',
    'scholarship motivation letter',
  ],
  alternates: {
    canonical: 'https://germanpath.com/motivation-letter',
  },
  openGraph: {
    title: 'Motivation Letter Writer | German Path',
    description: 'Write compelling motivation letters for German university admissions with AI assistance.',
    url: 'https://germanpath.com/motivation-letter',
  },
};

export default function MotivationLetterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
