import data from './consolidated-posts.json';

/**
 * Blog post consolidation.
 *
 * The library had grown several near-duplicate articles competing for the same
 * query — seven on student jobs, four on health insurance, and so on. Google has
 * to pick one and frequently ranks none of them well.
 *
 * Each entry redirects a superseded post to the one that should own the query.
 * The winner is always the page with more Search Console impressions over the
 * trailing 90 days, so no redirect ever points traffic at a weaker page.
 *
 * These are WordPress posts and we have no write access to the CMS, so
 * consolidation happens at the routing layer: the slug redirects, and the post is
 * dropped from the sitemap and the blog index so nothing links to a URL that only
 * 301s.
 *
 * The data lives in consolidated-posts.json because next.config.ts also reads it,
 * and the config loader cannot resolve a bare relative .ts import — doing so makes
 * the whole config fail silently, taking the CSP headers with it.
 *
 * To undo one, delete its entry from the JSON. Nothing here touches the CMS.
 */
export type Consolidation = {
  from: string;
  to: string;
  /** Trailing-90-day impressions when the decision was made: from -> to. */
  impressions: [number, number];
};

export const CONSOLIDATED_POSTS = data as Consolidation[];

/** Slugs that now redirect and must not appear in the sitemap or the index. */
export const CONSOLIDATED_SLUGS: ReadonlySet<string> = new Set(
  CONSOLIDATED_POSTS.map((entry) => entry.from)
);
