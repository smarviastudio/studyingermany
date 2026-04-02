import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'GPA Converter Workspace',
  description: 'Convert grades to the German scale inside the German Path calculator.',
  path: '/gpa-converter',
  noIndex: true,
});

export default function GPAConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
