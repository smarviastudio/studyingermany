import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI CV Maker - Create German-Style CV (Lebenslauf) | German Path',
  description: 'Build a professional German CV (Lebenslauf) with AI assistance. Optimized for German university applications and job searches. Free templates, PDF export, and AI-powered suggestions.',
  keywords: [
    'German CV maker',
    'Lebenslauf generator',
    'CV for Germany',
    'German resume builder',
    'AI CV maker',
    'CV template Germany',
  ],
  alternates: {
    canonical: 'https://germanpath.com/cv-maker',
  },
  openGraph: {
    title: 'AI CV Maker - Create German-Style CV | German Path',
    description: 'Build a professional German CV with AI. Free templates optimized for German university applications and jobs.',
    url: 'https://germanpath.com/cv-maker',
  },
};

export default function CVMakerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
