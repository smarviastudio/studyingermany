import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GPA Converter - Convert Grades to German Scale | German Path',
  description: 'Convert your grades to the German grading system (1-5 scale). Essential for university applications and transcript evaluation. Supports multiple international grading systems.',
  keywords: [
    'GPA converter Germany',
    'German grading system',
    'grade conversion Germany',
    'CGPA to German grade',
    'university grade converter',
  ],
  alternates: {
    canonical: 'https://germanpath.com/gpa-converter',
  },
  openGraph: {
    title: 'GPA Converter - German Grading Scale | German Path',
    description: 'Convert your grades to the German grading system. Essential for university applications.',
    url: 'https://germanpath.com/gpa-converter',
  },
};

export default function GPAConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
