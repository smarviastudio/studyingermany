import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Salary Calculator Workspace',
  description: 'Calculate German net salary inside the German Path tax calculator.',
  path: '/netto-brutto-calculator',
  noIndex: true,
});

export default function SalaryCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
