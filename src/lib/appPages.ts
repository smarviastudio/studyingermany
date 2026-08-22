import type { Metadata } from 'next';
import { buildCanonicalUrl, buildMetaDescription, buildTitle } from '@/lib/seo';
import type { AppContent, AppGuide } from '@/content/apps/types';

export function buildAppMetadata(app: AppContent): Metadata {
  const canonical = buildCanonicalUrl(`/${app.slug}`);
  return {
    title: buildTitle(app.metaTitle),
    description: buildMetaDescription(app.metaDescription),
    keywords: app.metaKeywords,
    openGraph: {
      title: app.metaTitle,
      description: app.metaDescription,
      url: canonical,
      type: 'website',
      locale: app.lang === 'de' ? 'de_DE' : 'en_US',
      images: [{ url: buildCanonicalUrl(app.icon), width: 512, height: 512, alt: `${app.storeName} app icon` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: app.metaTitle,
      description: app.metaDescription,
    },
    alternates: { canonical },
  };
}

export function buildGuideMetadata(app: AppContent, guide: AppGuide): Metadata {
  const canonical = buildCanonicalUrl(`/${app.slug}/guides/${guide.slug}`);
  return {
    title: buildTitle(guide.metaTitle),
    description: buildMetaDescription(guide.metaDescription),
    keywords: `${guide.keyword}, ${app.name}, ${app.metaKeywords}`,
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: canonical,
      type: 'article',
      locale: (guide.lang ?? app.lang) === 'de' ? 'de_DE' : 'en_US',
      images: [{ url: buildCanonicalUrl(app.icon), width: 512, height: 512, alt: `${app.storeName} app icon` }],
    },
    twitter: {
      card: 'summary',
      title: guide.metaTitle,
      description: guide.metaDescription,
    },
    alternates: { canonical },
  };
}
