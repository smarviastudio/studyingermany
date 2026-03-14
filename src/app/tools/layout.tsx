import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free AI Tools for German Applications | German Path',
  description: 'Free AI-powered tools for studying in Germany: CV Maker, Cover Letter Generator, Motivation Letter Writer, GPA Converter, and Salary Calculator. All aligned with German standards.',
  keywords: [
    'AI CV maker Germany',
    'German cover letter generator',
    'motivation letter for German university',
    'GPA converter Germany',
    'German salary calculator',
    'study in Germany tools',
  ],
  alternates: {
    canonical: 'https://germanpath.com/tools',
  },
  openGraph: {
    title: 'Free AI Tools for German Applications | German Path',
    description: 'Free AI-powered tools for studying in Germany: CV Maker, Cover Letter, Motivation Letter, GPA Converter.',
    url: 'https://germanpath.com/tools',
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
