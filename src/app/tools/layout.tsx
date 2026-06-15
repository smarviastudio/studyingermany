import { buildPageMetadata } from '@/lib/seo';
import { HubBreadcrumbs } from '@/components/HubBreadcrumbs';

export const metadata = buildPageMetadata({
  title: 'AI Tools for German University Applications',
  description:
    'AI-powered tools for studying in Germany: CV Maker, Cover Letter Generator, Motivation Letter Writer, GPA Converter, and Salary Calculator. Free tier available; Pro unlocks premium templates and more AI credits.',
  path: '/tools',
  keywords: [
    'AI CV maker Germany',
    'German cover letter generator',
    'motivation letter for German university',
    'GPA converter Germany',
    'German salary calculator',
    'study in Germany tools',
    'Lebenslauf generator Germany',
  ],
  openGraphDescription:
    'AI tools for German university applications: CV Maker, Cover Letter, Motivation Letter, GPA Converter, and more.',
});

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HubBreadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Tools' }]} />
      {children}
    </>
  );
}
