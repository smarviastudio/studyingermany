import { buildPageMetadata } from '@/lib/seo';
import { HubBreadcrumbs } from '@/components/HubBreadcrumbs';

export const metadata = buildPageMetadata({
  title: 'AI Tools for German University Applications',
  description:
    'Free AI tools for studying in Germany: CV Maker, cover letter and motivation letter writers, GPA converter and salary calculator.',
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
