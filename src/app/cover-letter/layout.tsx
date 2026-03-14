import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cover Letter Generator - German Anschreiben | German Path',
  description: 'Generate professional German cover letters (Anschreiben) with AI. Tailored for German employers and university applications. Free, instant, and optimized for German business standards.',
  keywords: [
    'German cover letter',
    'Anschreiben generator',
    'cover letter Germany',
    'AI cover letter',
    'job application Germany',
  ],
  alternates: {
    canonical: 'https://germanpath.com/cover-letter',
  },
  openGraph: {
    title: 'Cover Letter Generator - German Anschreiben | German Path',
    description: 'Generate professional German cover letters with AI. Free and optimized for German employers.',
    url: 'https://germanpath.com/cover-letter',
  },
};

export default function CoverLetterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
