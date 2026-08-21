import { buildBreadcrumbSchema, buildCanonicalUrl, buildFaqSchema, buildPageMetadata } from '@/lib/seo';
import { TAX_CALCULATOR_FAQS } from './faqs';

export const metadata = buildPageMetadata({
  title: 'German Tax Calculator 2026 – Brutto Netto Salary Calculator',
  description:
    'Free German tax calculator for 2026. Enter your gross salary and see your net take-home pay after tax and social contributions — all 6 tax classes.',
  path: '/netto-brutto-calculator',
  keywords: [
    'german tax calculator',
    'tax calculator germany',
    'brutto netto calculator',
    'german salary calculator',
    'salary calculator germany',
    'net salary germany',
    'gross to net germany',
    'brutto netto rechner english',
  ],
  openGraphTitle: 'German Tax Calculator 2026 – Brutto Netto',
  openGraphDescription:
    'See your real German net salary in seconds. 2026 tax rates, all 6 tax classes, health insurance and social contributions included. Free, no signup.',
});

const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'German Tax Calculator 2026 (Brutto Netto)',
  url: buildCanonicalUrl('/netto-brutto-calculator'),
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  description:
    'Calculate German net salary from gross salary with 2026 income tax, solidarity surcharge, church tax and social contributions for all 6 tax classes.',
};

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Free Tools', path: '/tools' },
  { name: 'German Tax Calculator', path: '/netto-brutto-calculator' },
]);

const faqSchema = buildFaqSchema([...TAX_CALCULATOR_FAQS]);

export default function SalaryCalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
