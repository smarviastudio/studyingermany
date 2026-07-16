import { buildBreadcrumbSchema, buildCanonicalUrl, buildFaqSchema, buildPageMetadata } from '@/lib/seo';
import { GPA_CONVERTER_FAQS } from './faqs';

export const metadata = buildPageMetadata({
  title: 'German GPA Calculator – Convert Your Grades to the German Scale',
  description:
    'Free German grade calculator using the Modified Bavarian Formula (the same one uni-assist uses). Convert your GPA, CGPA or percentage to the German 1.0–5.0 scale instantly — US, India, Pakistan, Nigeria, China, UK and more.',
  path: '/gpa-converter',
  keywords: [
    'german gpa calculator',
    'gpa converter germany',
    'german grade calculator',
    'modified bavarian formula calculator',
    'cgpa to german grade',
    'german grading system',
    'grade conversion germany',
    'uni-assist grade conversion',
  ],
  openGraphTitle: 'German GPA Calculator – Grade Converter',
  openGraphDescription:
    'Convert your grades to the German 1.0–5.0 scale with the Modified Bavarian Formula. Free, instant, no signup.',
});

const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'German GPA Calculator (Grade Converter)',
  url: buildCanonicalUrl('/gpa-converter'),
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  description:
    'Convert international grades (GPA, CGPA, percentage) to the German 1.0–5.0 grading scale using the Modified Bavarian Formula.',
};

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Free Tools', path: '/tools' },
  { name: 'German GPA Calculator', path: '/gpa-converter' },
]);

const faqSchema = buildFaqSchema([...GPA_CONVERTER_FAQS]);

export default function GPAConverterLayout({ children }: { children: React.ReactNode }) {
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
