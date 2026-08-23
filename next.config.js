const consolidatedPosts = require('./src/lib/consolidated-posts.json');


// Content-Security-Policy.
//
// An equivalent policy sat in next.config.ts, but Next loads next.config.js when
// both exist, so it was never applied — production served no CSP at all.
//
// 'unsafe-inline' is unavoidable in script-src here: the App Router emits inline
// bootstrap scripts, and the nonce alternative forces every page to render
// dynamically, which would undo the static generation this site depends on.
// 'unsafe-eval' is deliberately NOT granted; nothing in the production bundle
// needs it.
//
// Stripe is server-side only — checkout is a top-level navigation to Stripe's
// hosted page, so no Stripe origin is needed in script-src or frame-src.
// OpenRouter is likewise only ever called from route handlers, never the browser.
// form-action is deliberately omitted so the Google OAuth sign-in flow cannot be
// broken by it.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline' https://*.googletagmanager.com https://va.vercel-scripts.com https://vercel.live",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-src 'self' https://vercel.live",
  "media-src 'self' https:",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join('; ');

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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
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
