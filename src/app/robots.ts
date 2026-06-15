import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard',
          '/dashboard/',
          '/my-shortlist',
          '/my-applications',
          '/subscription',
          '/profile',
          '/credits',
          '/credits/',
          '/auth/',
          '/detail/',
          '/course-finder/',
          '/sample-page',
          '/uncategorized',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
