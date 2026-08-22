import type { Metadata, MetadataRoute } from 'next';

export const SITE_NAME = 'German Path';
export const SITE_URL = 'https://germanpath.com';

/**
 * Google truncates around 60 characters, and the root layout appends
 * ' | German Path' (14 chars) to every page title via its title template.
 * On a long title that suffix is what pushes it past the cut, so the brand
 * gets dropped rather than the keywords.
 */
export const TITLE_SUFFIX = ` | ${SITE_NAME}`;
export const MAX_TITLE_LENGTH = 60;

/**
 * Returns a title Next.js will render whole: a plain string when the brand
 * suffix still fits, or `{ absolute }` to opt out of the template when it
 * does not. Titles longer than the limit on their own are left to the caller
 * to shorten — silently truncating one would cut it mid-word.
 */
export function buildTitle(title: string): string | { absolute: string } {
  return title.length + TITLE_SUFFIX.length <= MAX_TITLE_LENGTH
    ? title
    : { absolute: title };
}

/** Google renders roughly 155-160 characters of a meta description. */
export const MAX_DESCRIPTION_LENGTH = 155;

/**
 * Normalises a description that may have come straight from a WordPress
 * auto-excerpt: those run ~55 words and begin with the post's own "Intro:"
 * label, which is how a 380 character description ends up in the <head>.
 *
 * Cuts at a sentence boundary when that leaves a usable description, and
 * otherwise at a word boundary with an ellipsis — never mid-word.
 */
export function buildMetaDescription(
  raw: string,
  maxLength: number = MAX_DESCRIPTION_LENGTH
): string {
  const text = raw
    .replace(/^\s*intro\s*:\s*/i, '')
    .replace(/\[&hellip;\]|\[…\]|\[\.\.\.\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLength) return text;

  const window = text.slice(0, maxLength + 1);

  // Prefer ending on a full sentence, but only if enough of one survives —
  // otherwise a description that opens with a short sentence gets gutted.
  const lastSentence = Math.max(
    window.lastIndexOf('. '),
    window.lastIndexOf('! '),
    window.lastIndexOf('? ')
  );
  if (lastSentence >= maxLength * 0.6) return text.slice(0, lastSentence + 1);

  // The ellipsis counts toward the limit, so search one character short of it.
  const wordWindow = text.slice(0, maxLength);
  const lastSpace = wordWindow.lastIndexOf(' ');
  const cut = lastSpace > 0 ? lastSpace : maxLength - 1;
  return `${text.slice(0, cut).replace(/[,;:.\s]+$/, '')}…`;
}
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
  // 100 is WordPress's per_page ceiling, so a single request silently drops every post
  // past the hundredth. Walk the pages instead of trusting one call to cover the lot.
  const WP_MAX_PER_PAGE = 100;
  const WP_MAX_PAGES = 20;

  try {
    const posts: Array<{ slug: string; modified: string }> = [];

    for (let page = 1; page <= WP_MAX_PAGES; page += 1) {
      const res = await fetch(
        `${getWpUrl()}/wp-json/wp/v2/posts?per_page=${WP_MAX_PER_PAGE}&page=${page}&status=publish&_fields=slug,modified`,
        { next: { revalidate: 3600 } }
      );
      // Requesting a page beyond the last returns 400; that is this loop's exit.
      if (!res.ok) break;

      const batch: Array<{ slug: string; modified: string }> = await res.json();
      if (!Array.isArray(batch) || batch.length === 0) break;

      posts.push(...batch);

      const totalPages = Number(res.headers.get('x-wp-totalpages') || '0');
      if (batch.length < WP_MAX_PER_PAGE) break;
      if (totalPages && page >= totalPages) break;
    }

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
  /** BCP-47 locale for og:locale, e.g. 'de_DE'. Defaults to English. */
  locale?: 'en_US' | 'de_DE';
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
  locale = 'en_US',
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
    title: buildTitle(title),
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
      locale,
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
