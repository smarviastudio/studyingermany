import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Salary Calculator Germany - Net vs Gross | German Path',
  description: 'Calculate your net salary in Germany after taxes and social contributions. Plan your finances before moving. Compare costs across German cities.',
  keywords: [
    'German salary calculator',
    'netto brutto calculator',
    'Germany tax calculator',
    'net salary Germany',
    'gross to net Germany',
  ],
  alternates: {
    canonical: 'https://germanpath.com/netto-brutto-calculator',
  },
  openGraph: {
    title: 'Salary Calculator Germany | German Path',
    description: 'Calculate your net salary in Germany after taxes and social contributions.',
    url: 'https://germanpath.com/netto-brutto-calculator',
  },
};

export default function SalaryCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
