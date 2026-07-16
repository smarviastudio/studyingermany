import type { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/content/blog';
import { ALL_APPS } from '@/content/apps';
import { buildCanonicalUrl, getWpBlogSitemapEntries, SITE_URL } from '@/lib/seo';

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: SITE_URL, changeFrequency: 'weekly', priority: 1.0 },
  { url: buildCanonicalUrl('/blog'), changeFrequency: 'daily', priority: 0.9 },
  { url: buildCanonicalUrl('/pricing'), changeFrequency: 'monthly', priority: 0.8 },
  { url: buildCanonicalUrl('/tools'), changeFrequency: 'monthly', priority: 0.9 },
  { url: buildCanonicalUrl('/cv-maker/landing'), changeFrequency: 'monthly', priority: 0.9 },
  { url: buildCanonicalUrl('/cv-maker'), changeFrequency: 'monthly', priority: 0.85 },
  { url: buildCanonicalUrl('/cover-letter/landing'), changeFrequency: 'monthly', priority: 0.8 },
  { url: buildCanonicalUrl('/cover-letter'), changeFrequency: 'monthly', priority: 0.75 },
  { url: buildCanonicalUrl('/motivation-letter/landing'), changeFrequency: 'monthly', priority: 0.8 },
  { url: buildCanonicalUrl('/motivation-letter'), changeFrequency: 'monthly', priority: 0.75 },
  { url: buildCanonicalUrl('/gpa-converter'), changeFrequency: 'monthly', priority: 0.85 },
  { url: buildCanonicalUrl('/netto-brutto-calculator'), changeFrequency: 'monthly', priority: 0.9 },
  { url: buildCanonicalUrl('/study-in-germany'), changeFrequency: 'weekly', priority: 0.9 },
  { url: buildCanonicalUrl('/masters-in-germany'), changeFrequency: 'weekly', priority: 0.8 },
  { url: buildCanonicalUrl('/bachelor-in-germany'), changeFrequency: 'weekly', priority: 0.8 },
  { url: buildCanonicalUrl('/english-taught-programs'), changeFrequency: 'weekly', priority: 0.8 },
  { url: buildCanonicalUrl('/study-in-germany-from-pakistan'), changeFrequency: 'monthly', priority: 0.8 },
  { url: buildCanonicalUrl('/study-in-germany-from-india'), changeFrequency: 'monthly', priority: 0.8 },
  { url: buildCanonicalUrl('/study-in-germany-from-nigeria'), changeFrequency: 'monthly', priority: 0.8 },
  { url: buildCanonicalUrl('/study-in-germany-from-bangladesh'), changeFrequency: 'monthly', priority: 0.8 },
  { url: buildCanonicalUrl('/study-in-germany-from-turkey'), changeFrequency: 'monthly', priority: 0.8 },
  { url: buildCanonicalUrl('/study-in-germany-from-nepal'), changeFrequency: 'monthly', priority: 0.8 },
  { url: buildCanonicalUrl('/apps'), changeFrequency: 'weekly', priority: 0.85 },
  { url: buildCanonicalUrl('/impressum'), changeFrequency: 'yearly', priority: 0.3 },
  { url: buildCanonicalUrl('/privacy-policy'), changeFrequency: 'yearly', priority: 0.3 },
  { url: buildCanonicalUrl('/terms'), changeFrequency: 'yearly', priority: 0.3 },
  { url: buildCanonicalUrl('/cookie-policy'), changeFrequency: 'yearly', priority: 0.3 },
];

function dedupeSitemap(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const seen = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of entries) {
    const existing = seen.get(entry.url);
    if (!existing) {
      seen.set(entry.url, entry);
      continue;
    }
    const existingDate = existing.lastModified ? new Date(existing.lastModified).getTime() : 0;
    const nextDate = entry.lastModified ? new Date(entry.lastModified).getTime() : 0;
    if (nextDate >= existingDate) {
      seen.set(entry.url, entry);
    }
  }
  return Array.from(seen.values());
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages = STATIC_PAGES.map((page) => ({
    ...page,
    lastModified: now,
  }));

  const staticBlogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: buildCanonicalUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: post.featured ? 0.8 : 0.7,
  }));

  const appPages: MetadataRoute.Sitemap = ALL_APPS.flatMap((app) => [
    {
      url: buildCanonicalUrl(`/${app.slug}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    ...app.guides.map((guide) => ({
      url: buildCanonicalUrl(`/${app.slug}/guides/${guide.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ]);

  const wpBlogPages = await getWpBlogSitemapEntries();

  return dedupeSitemap([...staticPages, ...staticBlogPages, ...appPages, ...wpBlogPages]);
}
