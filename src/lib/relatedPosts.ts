import { BLOG_POSTS, type BlogPost } from '@/content/blog';

/**
 * Related-post selection.
 *
 * The previous implementation took the first N posts of the array for static
 * posts and the N most recent posts from WordPress. Both are constant: every
 * post on the site linked to the same handful of targets, so across a
 * 100+ post library only about six posts ever received an internal link and
 * everything else was effectively orphaned.
 *
 * This scores candidates by how much they actually share with the current post,
 * which both improves relevance and spreads internal links across the library.
 */

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'for', 'to', 'of', 'in', 'on', 'at',
  'is', 'are', 'was', 'were', 'be', 'been', 'your', 'you', 'my', 'it', 'its',
  'with', 'from', 'as', 'by', 'that', 'this', 'what', 'how', 'why', 'when',
  'germany', 'german', 'students', 'student', 'guide', 'complete', 'explained',
]);

/** Tokenises a title into meaningful comparison terms. */
function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9äöüß\s-]/g, ' ')
      .split(/[\s-]+/)
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
  );
}

function overlapCount<T>(a: Set<T>, b: Set<T>): number {
  let n = 0;
  for (const value of a) if (b.has(value)) n += 1;
  return n;
}

/**
 * Small deterministic value derived from the pair of slugs. Used only to break
 * ties, so two posts with identical scores do not both surface the same
 * candidate — that is what concentrated links onto a few posts before.
 */
function tieBreak(fromSlug: string, candidateSlug: string): number {
  const combined = `${fromSlug}:${candidateSlug}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i += 1) {
    hash = (hash * 31 + combined.charCodeAt(i)) >>> 0;
  }
  return (hash % 1000) / 1000;
}

const TAG_WEIGHT = 3;
const CATEGORY_WEIGHT = 2;
const TITLE_WEIGHT = 1;

export function scoreStaticPost(current: BlogPost, candidate: BlogPost): number {
  const sharedTags = overlapCount(
    new Set(current.tags ?? []),
    new Set(candidate.tags ?? [])
  );
  const sameCategory = current.category === candidate.category ? 1 : 0;
  const sharedTitle = overlapCount(tokenize(current.title), tokenize(candidate.title));

  return (
    sharedTags * TAG_WEIGHT +
    sameCategory * CATEGORY_WEIGHT +
    sharedTitle * TITLE_WEIGHT +
    tieBreak(current.slug, candidate.slug)
  );
}

/** Related static posts for a static post, most relevant first. */
export function getRelatedStaticPosts(slug: string, limit = 3): BlogPost[] {
  const current = BLOG_POSTS.find((post) => post.slug === slug);
  if (!current) return BLOG_POSTS.filter((post) => post.slug !== slug).slice(0, limit);

  return BLOG_POSTS.filter((post) => post.slug !== slug)
    .map((post) => ({ post, score: scoreStaticPost(current, post) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.post);
}

/**
 * Related static posts for a WordPress post, matched on title terms alone since
 * the two systems share no tag vocabulary. This is what links the WordPress
 * library across into the static one, which nothing did before.
 */
export function getRelatedStaticForTitle(title: string, limit = 2): BlogPost[] {
  const terms = tokenize(title);
  return BLOG_POSTS.map((post) => ({
    post,
    score: overlapCount(terms, tokenize(post.title)) + tieBreak(title, post.slug),
  }))
    .filter((entry) => entry.score >= 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.post);
}

/** Ranks a pool of WordPress posts against the current one. */
export function rankWpCandidates<T extends { slug: string; title: string; categories: number[] }>(
  current: { slug: string; title: string; categories: number[] },
  pool: T[],
  limit = 3
): T[] {
  const currentTerms = tokenize(current.title);
  const currentCategories = new Set(current.categories);

  return pool
    .filter((post) => post.slug !== current.slug)
    .map((post) => ({
      post,
      score:
        overlapCount(currentCategories, new Set(post.categories)) * CATEGORY_WEIGHT +
        overlapCount(currentTerms, tokenize(post.title)) * TITLE_WEIGHT +
        tieBreak(current.slug, post.slug),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.post);
}
