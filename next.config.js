const consolidatedPosts = require('./src/lib/consolidated-posts.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.germanpath.com',
          },
        ],
        destination: 'https://germanpath.com/:path*',
        permanent: true,
      },
      // Calculator landing pages merged into the tools themselves (SEO consolidation)
      {
        source: '/netto-brutto-calculator/landing',
        destination: '/netto-brutto-calculator',
        permanent: true,
      },
      {
        source: '/gpa-converter/landing',
        destination: '/gpa-converter',
        permanent: true,
      },
      // Near-duplicate blog posts folded into the page that should own each
      // query. The destination is always the one with more Search Console
      // impressions, so no redirect sends traffic to a weaker page.
      // Source of truth: src/lib/consolidated-posts.json
      ...consolidatedPosts.map((entry) => ({
        source: `/blog/${entry.from}`,
        destination: `/blog/${entry.to}`,
        permanent: true,
      })),
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.germanpath.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
