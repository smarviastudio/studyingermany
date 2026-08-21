import { CountryGuidePage } from '@/components/CountryGuidePage';
import { COUNTRY_GUIDES } from '@/lib/country-guides';
import { buildPageMetadata } from '@/lib/seo';

const guide = COUNTRY_GUIDES.pakistan;

export const metadata = buildPageMetadata({
  title: guide.seo.title,
  description: guide.seo.description,
  path: guide.seo.path,
  keywords: [...guide.seo.keywords],
});

export default function StudyFromPakistanPage() {
  return <CountryGuidePage guide={guide} />;
}
