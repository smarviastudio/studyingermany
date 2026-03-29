import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'GPA Converter - Convert Grades to German Scale',
  description: 'Convert your grades to the German grading system (1-5 scale). Essential for university applications and transcript evaluation. Supports multiple international grading systems.',
  path: '/gpa-converter/landing',
  keywords: [
    'GPA converter Germany',
    'German grading system',
    'grade conversion Germany',
    'CGPA to German grade',
    'university grade converter',
  ],
  openGraphTitle: 'GPA Converter - German Grading Scale',
  openGraphDescription: 'Convert your grades to the German grading system. Essential for university applications.',
});

export default function GPAConverterLandingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
