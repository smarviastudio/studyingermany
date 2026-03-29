import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Salary Calculator Germany - Net vs Gross',
  description: 'Calculate your net salary in Germany after taxes and social contributions. Plan your finances before moving. Compare costs across German cities.',
  path: '/netto-brutto-calculator/landing',
  keywords: [
    'German salary calculator',
    'netto brutto calculator',
    'Germany tax calculator',
    'net salary Germany',
    'gross to net Germany',
  ],
  openGraphTitle: 'Salary Calculator Germany',
  openGraphDescription: 'Calculate your net salary in Germany after taxes and social contributions.',
});

export default function SalaryCalculatorLandingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
