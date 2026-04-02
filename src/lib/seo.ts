import type { Metadata } from 'next';

export const SITE_NAME = 'German Path';
export const SITE_URL = 'https://germanpath.com';
export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/og-image.jpg`,
  width: 1200,
  height: 630,
  alt: 'German Path - Study in Germany for International Students',
} as const;

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  canonicalUrl?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  imageUrl?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
};

export function buildCanonicalUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  canonicalUrl,
  openGraphTitle,
  openGraphDescription,
  twitterTitle,
  twitterDescription,
  imageUrl,
  imageAlt,
  type = 'website',
  publishedTime,
  modifiedTime,
  noIndex = false,
}: MetadataInput): Metadata {
  const url = canonicalUrl ?? buildCanonicalUrl(path);
  const pageOpenGraphTitle = openGraphTitle ?? title;
  const pageOpenGraphDescription = openGraphDescription ?? description;
  const pageImage = imageUrl
    ? {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: imageAlt ?? pageOpenGraphTitle,
      }
    : DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
    openGraph: {
      siteName: SITE_NAME,
      locale: 'en_US',
      type,
      title: pageOpenGraphTitle,
      description: pageOpenGraphDescription,
      url,
      images: [pageImage],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: twitterTitle ?? pageOpenGraphTitle,
      description: twitterDescription ?? pageOpenGraphDescription,
      images: [pageImage.url],
    },
  };
}
