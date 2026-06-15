import { buildFaqSchema, buildPageMetadata } from '@/lib/seo';

const PRICING_FAQS = [
  {
    q: 'Can I switch plans anytime?',
    a: 'Yes, upgrade or downgrade at any time. Changes take effect immediately.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'Visa, Mastercard, PayPal, iDEAL, and more via Stripe.',
  },
  {
    q: 'What do I get on the free plan?',
    a: 'After signing in, Free users get 3 AI credits, can save programs to their shortlist, and can use the free templates and calculators.',
  },
  {
    q: 'What happens when I run out of AI credits?',
    a: 'You can buy credit packs anytime or upgrade to Pro for 20 monthly AI credits and all premium templates.',
  },
  {
    q: 'Do you offer refunds?',
    a: "Yes, we offer a 7-day money-back guarantee if you're not satisfied.",
  },
];

const pricingProductSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'German Path Pro',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  url: 'https://germanpath.com/pricing',
  offers: [
    {
      '@type': 'Offer',
      name: 'Pro Monthly',
      price: '9.99',
      priceCurrency: 'EUR',
      url: 'https://germanpath.com/pricing',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Pro Yearly',
      price: '79.99',
      priceCurrency: 'EUR',
      url: 'https://germanpath.com/pricing',
      availability: 'https://schema.org/InStock',
    },
  ],
};

export const metadata = buildPageMetadata({
  title: 'Pricing — Free & Pro Plans for International Students',
  description:
    'Simple student-friendly pricing for German Path. Free plan includes 3 AI credits and core tools. Pro unlocks 20 monthly AI credits, all CV templates, and premium document generators.',
  path: '/pricing',
  keywords: [
    'German Path pricing',
    'study in Germany tools pricing',
    'AI CV maker Germany price',
    'German university application tools',
    'international student subscription',
  ],
  openGraphDescription:
    'Free and Pro plans for studying in Germany. AI CV maker, motivation letters, cover letters, and 20,000+ program search.',
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(PRICING_FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingProductSchema) }}
      />
      {children}
    </>
  );
}
