import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Free AI Tools for German Applications',
  description: 'Free AI-powered tools for studying in Germany: CV Maker, Cover Letter Generator, Motivation Letter Writer, GPA Converter, and Salary Calculator. All aligned with German standards.',
  path: '/tools',
  keywords: [
    'AI CV maker Germany',
    'German cover letter generator',
    'motivation letter for German university',
    'GPA converter Germany',
    'German salary calculator',
    'study in Germany tools',
  ],
  openGraphDescription: 'Free AI-powered tools for studying in Germany: CV Maker, Cover Letter, Motivation Letter, GPA Converter.',
});

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
