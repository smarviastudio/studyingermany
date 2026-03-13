import { NextResponse } from 'next/server';

const BASE_URL = 'https://germanpath.com';

async function fetchWPPosts() {
  try {
    const wpUrl = process.env.WP_URL;
    const wpToken = process.env.WP_CUSTOM_API_TOKEN;
    
    if (!wpUrl || !wpToken) {
      console.error('WordPress credentials missing');
      return [];
    }

    const response = await fetch(`${wpUrl}/wp-json/wp/v2/posts?per_page=100&status=publish`, {
      headers: {
        'Authorization': `Bearer ${wpToken}`,
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('Failed to fetch WordPress posts');
      return [];
    }

    const posts = await response.json() as Array<{ slug: string; modified: string }>;
    return posts.map((post) => ({
      slug: post.slug,
      modified: post.modified,
    }));
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    return [];
  }
}

export async function GET() {
  const wpPosts = await fetchWPPosts();

  // Static pages with their priorities and change frequencies
  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: '/pricing', priority: '0.9', changefreq: 'weekly' },
    { path: '/motivation-letter', priority: '0.8', changefreq: 'weekly' },
    { path: '/cover-letter', priority: '0.8', changefreq: 'weekly' },
    { path: '/cv-maker', priority: '0.8', changefreq: 'weekly' },
    { path: '/blocked-account-calculator', priority: '0.7', changefreq: 'weekly' },
    { path: '/netto-brutto-calculator', priority: '0.7', changefreq: 'weekly' },
    { path: '/profile', priority: '0.6', changefreq: 'weekly' },
    { path: '/impressum', priority: '0.5', changefreq: 'monthly' },
    { path: '/privacy-policy', priority: '0.5', changefreq: 'monthly' },
    { path: '/terms', priority: '0.5', changefreq: 'monthly' },
    { path: '/blog', priority: '0.8', changefreq: 'daily' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
${wpPosts
  .map(
    (post) => `  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.modified).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
