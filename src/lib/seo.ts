import type { Metadata, MetadataRoute } from 'next';

export const SITE_NAME = 'German Path';
export const SITE_URL = 'https://germanpath.com';
export const SITE_TAGLINE = 'Study in Germany with AI tools and 20,000+ university programs';
export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: 'German Path - Study in Germany for International Students',
} as const;

type FaqItem = { q: string; a: string };

export type BreadcrumbItem = { name: string; path?: string };

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: buildCanonicalUrl(item.path) } : {}),
    })),
  };
}

export function buildFaqSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_TAGLINE,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    legalName: 'Smarvia Studio',
    url: SITE_URL,
    logo: `${SITE_URL}/opengraph-image`,
    description:
      'German Path helps international students study in Germany with AI-powered program search, CV tools, and step-by-step application guidance.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Schoeneggstrasse 45',
      postalCode: '8953',
      addressLocality: 'Dietikon',
      addressCountry: 'CH',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@germanpath.com',
      contactType: 'Customer Service',
    },
    sameAs: [SITE_URL, 'https://www.facebook.com/studyingermay1'],
  };
}

function getWpUrl() {
  return (
    process.env.WP_URL ||
    (process.env.NODE_ENV === 'production' ? 'https://cms.germanpath.com' : 'http://localhost:8000')
  );
}

export async function getWpBlogSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(
      `${getWpUrl()}/wp-json/wp/v2/posts?per_page=100&status=publish&_fields=slug,modified`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];

    const posts: Array<{ slug: string; modified: string }> = await res.json();
    return posts.map((post) => ({
      url: buildCanonicalUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.modified),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch {
    return [];
  }
}

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
