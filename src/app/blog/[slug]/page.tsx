import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, ChevronRight, ArrowLeft, Calendar } from 'lucide-react';
import { BLOG_POSTS, CATEGORIES, getPostBySlug, type BlogPost } from '@/content/blog';
import type { Metadata } from 'next';
import { SiteNav } from '@/components/SiteNav';
import { buildPageMetadata, SITE_URL } from '@/lib/seo';

type WpPost = {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  slug: string;
  date: string;
  modified: string;
  categories: number[];
  featuredImage: string | null;
  seo: {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    openGraphTitle?: string;
    openGraphDescription?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    image?: string;
    imageAlt?: string;
  };
};

function asObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || undefined;
  }

  if (Array.isArray(value) && value.length > 0) {
    return asString(value[0]);
  }

  return undefined;
}

function pickString(...values: Array<string | undefined>): string | undefined {
  return values.find((value) => Boolean(value?.trim()));
}

function getNestedString(
  source: Record<string, unknown> | null,
  ...keys: string[]
): string | undefined {
  let current: unknown = source;

  for (const key of keys) {
    const record = asObject(current);
    if (!record) return undefined;
    current = record[key];
  }

  return asString(current);
}

function getFieldString(source: Record<string, unknown> | null, key: string): string | undefined {
  return source ? asString(source[key]) : undefined;
}

function extractWpSeo(post: Record<string, unknown>) {
  const yoast = asObject(post.yoast_head_json);
  const meta = asObject(post.meta);
  const acf = asObject(post.acf);
  const ogImageEntries = Array.isArray(yoast?.og_image) ? yoast.og_image : [];
  const firstOgImage = asObject(ogImageEntries[0]);

  return {
    title: pickString(
      getNestedString(yoast, 'title'),
      getFieldString(meta, 'seo_title'),
      getFieldString(meta, 'meta_title'),
      getFieldString(meta, 'germanpath_seo_title'),
      getFieldString(meta, 'rank_math_title'),
      getFieldString(acf, 'seo_title'),
      getFieldString(acf, 'meta_title'),
    ),
    description: pickString(
      getNestedString(yoast, 'description'),
      getFieldString(meta, 'meta_description'),
      getFieldString(meta, 'seo_description'),
      getFieldString(meta, 'germanpath_meta_description'),
      getFieldString(meta, 'rank_math_description'),
      getFieldString(acf, 'meta_description'),
      getFieldString(acf, 'seo_description'),
    ),
    canonicalUrl: pickString(
      getNestedString(yoast, 'canonical'),
      getFieldString(meta, 'canonical_url'),
      getFieldString(meta, 'seo_canonical_url'),
      getFieldString(meta, 'germanpath_canonical_url'),
      getFieldString(meta, 'rank_math_canonical_url'),
      getFieldString(acf, 'canonical_url'),
    ),
    openGraphTitle: pickString(
      getNestedString(yoast, 'og_title'),
      getFieldString(meta, 'open_graph_title'),
      getFieldString(meta, 'og_title'),
      getFieldString(meta, 'germanpath_og_title'),
      getFieldString(acf, 'open_graph_title'),
      getFieldString(acf, 'og_title'),
    ),
    openGraphDescription: pickString(
      getNestedString(yoast, 'og_description'),
      getFieldString(meta, 'open_graph_description'),
      getFieldString(meta, 'og_description'),
      getFieldString(meta, 'germanpath_og_description'),
      getFieldString(acf, 'open_graph_description'),
      getFieldString(acf, 'og_description'),
    ),
    twitterTitle: pickString(
      getNestedString(yoast, 'twitter_title'),
      getFieldString(meta, 'twitter_title'),
      getFieldString(meta, 'germanpath_twitter_title'),
      getFieldString(acf, 'twitter_title'),
    ),
    twitterDescription: pickString(
      getNestedString(yoast, 'twitter_description'),
      getFieldString(meta, 'twitter_description'),
      getFieldString(meta, 'germanpath_twitter_description'),
      getFieldString(acf, 'twitter_description'),
    ),
    image: pickString(
      getFieldString(firstOgImage, 'url'),
      getFieldString(meta, 'open_graph_image'),
      getFieldString(meta, 'og_image'),
      getFieldString(acf, 'open_graph_image'),
      getFieldString(acf, 'og_image'),
    ),
    imageAlt: pickString(
      getFieldString(firstOgImage, 'alt'),
      getFieldString(meta, 'open_graph_image_alt'),
      getFieldString(acf, 'open_graph_image_alt'),
    ),
  };
}

async function fetchWpPost(slug: string): Promise<WpPost | null> {
  const wpUrl = process.env.WP_URL || (process.env.NODE_ENV === 'production' ? 'https://cms.germanpath.com' : 'http://localhost:8000');
  try {
    const res = await fetch(`${wpUrl}/wp-json/wp/v2/posts?slug=${slug}&_embed=1`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const posts = await res.json();
    const post = posts[0];
    if (!post) return null;

    // Extract featured image from _embedded
    const embedded = post._embedded as Record<string, unknown> | undefined;
    const featuredMediaCandidates = Array.isArray(embedded?.['wp:featuredmedia'])
      ? (embedded['wp:featuredmedia'] as Record<string, unknown>[])
      : [];
    const featuredMedia = featuredMediaCandidates.find((media) => {
      const sourceUrl = media?.source_url;
      const mediaType = media?.media_type;
      return typeof sourceUrl === 'string' && sourceUrl.length > 0 && mediaType !== 'site';
    }) || null;

    const featuredMediaDetails = featuredMedia?.media_details as Record<string, unknown> | undefined;
    const featuredSizes = featuredMediaDetails?.sizes as Record<string, Record<string, unknown>> | undefined;
    const featuredImage =
      (typeof featuredSizes?.large?.source_url === 'string' && featuredSizes.large.source_url) ||
      (typeof featuredSizes?.full?.source_url === 'string' && featuredSizes.full.source_url) ||
      (typeof featuredSizes?.medium_large?.source_url === 'string' && featuredSizes.medium_large.source_url) ||
      (featuredMedia && typeof featuredMedia.source_url === 'string' ? featuredMedia.source_url : null);
    const seo = extractWpSeo(post);

    return {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      categories: post.categories,
      featuredImage,
      seo,
    };
  } catch {
    return null;
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[#A-Za-z0-9]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return BLOG_POSTS.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const staticPost = getPostBySlug(slug);
  if (staticPost) {
    return buildPageMetadata({
      title: staticPost.title,
      description: staticPost.excerpt,
      path: `/blog/${staticPost.slug}`,
      type: 'article',
      publishedTime: staticPost.publishedAt,
      modifiedTime: staticPost.updatedAt || staticPost.publishedAt,
    });
  }
  const wpPost = await fetchWpPost(slug);
  if (!wpPost) return { title: 'Not Found' };
  const title = stripHtml(wpPost.title.rendered);
  const excerpt = stripHtml(wpPost.excerpt.rendered);
  const seoTitle = wpPost.seo.title ?? title;
  const seoDescription = wpPost.seo.description ?? excerpt;
  return buildPageMetadata({
    title: seoTitle,
    description: seoDescription,
    path: `/blog/${slug}`,
    canonicalUrl: wpPost.seo.canonicalUrl,
    type: 'article',
    publishedTime: wpPost.date,
    modifiedTime: wpPost.modified,
    openGraphTitle: wpPost.seo.openGraphTitle ?? seoTitle,
    openGraphDescription: wpPost.seo.openGraphDescription ?? seoDescription,
    twitterTitle: wpPost.seo.twitterTitle ?? wpPost.seo.openGraphTitle ?? seoTitle,
    twitterDescription: wpPost.seo.twitterDescription ?? wpPost.seo.openGraphDescription ?? seoDescription,
    imageUrl: wpPost.seo.image ?? wpPost.featuredImage ?? undefined,
    imageAlt: wpPost.seo.imageAlt ?? title,
  });
}

function renderMarkdown(md: string): string {
  let html = md;

  // Tables
  html = html.replace(/^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)+)/gm, (_match, header: string, _sep: string, body: string) => {
    const headers = header.split('|').filter((c: string) => c.trim()).map((c: string) => `<th class="px-3 py-2 text-left text-white/60 text-xs font-semibold border-b border-white/[0.08]">${c.trim()}</th>`).join('');
    const rows = body.trim().split('\n').map((row: string) => {
      const cells = row.split('|').filter((c: string) => c.trim()).map((c: string) => `<td class="px-3 py-2 text-white/45 text-xs border-b border-white/[0.04]">${c.trim()}</td>`).join('');
      return `<tr class="hover:bg-white/[0.02]">${cells}</tr>`;
    }).join('');
    return `<div class="overflow-x-auto my-4 rounded-lg border border-white/[0.06]"><table class="w-full"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
  });

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-white mt-6 mb-2">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-white mt-8 mb-3 pb-2 border-b border-white/[0.06]">$1</h2>');

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-blue-500/40 pl-4 py-1 my-3 text-white/40 text-sm italic">$1</blockquote>');

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">$1</a>');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li class="text-white/45 text-sm pl-1">$1</li>');
  html = html.replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul class="space-y-1.5 my-3 ml-4 list-disc list-outside marker:text-white/20">$1</ul>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="text-white/45 text-sm pl-1">$1</li>');

  // Paragraphs
  html = html.replace(/^(?!<[a-z]|$)(.+)$/gm, '<p class="text-white/40 text-sm leading-relaxed my-2">$1</p>');

  // Clean up empty paragraphs
  html = html.replace(/<p[^>]*>\s*<\/p>/g, '');

  return html;
}

function renderWordPressHtml(html: string): string {
  let out = html;

  out = out.replace(/<section class="sig-faqs">([\s\S]*?)<\/section>/gi, (_match, inner: string) => {
    const headingMatch = inner.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    const heading = headingMatch?.[1]?.trim() || 'Frequently Asked Questions';
    const items = Array.from(
      inner.matchAll(/<article class="sig-faq( open)?">[\s\S]*?<h3>([\s\S]*?)<\/h3>[\s\S]*?<div class="sig-faq__answer">\s*<p>([\s\S]*?)<\/p>\s*<\/div>\s*<\/article>/gi)
    );

    if (!items.length) {
      return `<section class="my-12 rounded-[28px] border border-[#f1e3a6] bg-gradient-to-br from-[#fffdf5] via-white to-[#fff8e8] p-6 md:p-8 shadow-[0_18px_50px_rgba(17,24,39,0.08)]"><div class="mb-5 flex items-start gap-4"><div class="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ffce00]/20 text-xl">?</div><div><span class="inline-flex rounded-full bg-[#fff3c4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a3412]">FAQ</span><h2 class="mt-3 text-[28px] font-bold leading-tight text-gray-900" style="font-family: 'Space Grotesk', sans-serif;">${heading}</h2><p class="mt-2 text-sm text-gray-600">Quick answers to the most common questions about this topic.</p></div></div></section>`;
    }

    const itemsHtml = items
      .map((item, index) => {
        const isOpen = Boolean(item[1]);
        const question = item[2].trim();
        const answer = item[3].trim();

        return `<details class="group rounded-2xl border border-[#eadfd0] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-200 hover:border-[#ffce00] hover:shadow-[0_14px_30px_rgba(221,0,0,0.08)]"${isOpen || index === 0 ? ' open' : ''}><summary class="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 text-left"><span class="pr-2 text-[19px] font-semibold leading-snug text-gray-900" style="font-family: 'Space Grotesk', sans-serif;">${question}</span><span class="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff6d6] text-lg font-bold text-[#dd0000]">+</span></summary><div class="px-5 pb-5"><div class="h-px w-full bg-gradient-to-r from-[#ffce00]/60 via-[#f4e7b5] to-transparent"></div><p class="mt-4 text-[16px] leading-8 text-gray-700">${answer}</p></div></details>`;
      })
      .join('');

    return `<section class="my-12 rounded-[28px] border border-[#f1e3a6] bg-gradient-to-br from-[#fffdf5] via-white to-[#fff8e8] p-6 md:p-8 shadow-[0_18px_50px_rgba(17,24,39,0.08)]"><div class="mb-6 flex items-start gap-4"><div class="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ffce00]/20 text-xl">?</div><div><span class="inline-flex rounded-full bg-[#fff3c4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a3412]">FAQ</span><h2 class="mt-3 text-[28px] font-bold leading-tight text-gray-900" style="font-family: 'Space Grotesk', sans-serif;">${heading}</h2><p class="mt-2 text-sm text-gray-600">Quick answers to the most common questions readers ask.</p></div></div><div class="space-y-3">${itemsHtml}</div></section>`;
  });

  // Light theme styles matching original WordPress theme
  out = out.replace(/<h2([^>]*)>/gi, '<h2$1 class="text-2xl font-bold text-gray-900 mt-10 mb-3 pb-2 border-b-2 border-[#ffce00]" style="font-family: \'Space Grotesk\', sans-serif;">');
  out = out.replace(/<h3([^>]*)>/gi, '<h3$1 class="text-xl font-semibold text-gray-900 mt-8 mb-2.5" style="font-family: \'Space Grotesk\', sans-serif;">');
  out = out.replace(/<p([^>]*)>/gi, '<p$1 class="text-gray-700 mb-5">');
  out = out.replace(/<ul([^>]*)>/gi, '<ul$1 class="my-3 ml-2 pl-6 list-disc list-outside space-y-2">');
  out = out.replace(/<ol([^>]*)>/gi, '<ol$1 class="my-3 ml-2 pl-6 list-decimal list-outside space-y-2">');
  out = out.replace(/<li([^>]*)>/gi, '<li$1 class="text-gray-700 mb-2">');
  out = out.replace(/<blockquote([^>]*)>/gi, '<blockquote$1 class="my-7 py-4 px-5 bg-[#fff9e6] border-l-4 border-[#ffce00] rounded-r-lg italic text-gray-700">');
  out = out.replace(/<a([^>]*?)>/gi, (_match, attrs: string) => {
    const hasClass = /class\s*=/.test(attrs);
    const hasTarget = /target\s*=/.test(attrs);
    const nextAttrs = `${attrs}${hasClass ? '' : ' class="text-[#dd0000] underline underline-offset-2 hover:text-[#bb0000] transition-colors"'}${hasTarget ? '' : ' target="_blank" rel="noopener noreferrer"'}`;
    return `<a${nextAttrs}>`;
  });
  out = out.replace(/<strong([^>]*)>/gi, '<strong$1 class="font-semibold text-gray-900">');
  out = out.replace(/<img([^>]*)>/gi, '<img$1 class="w-full h-auto rounded-xl my-6" loading="lazy" />');
  out = out.replace(/<figure([^>]*)>/gi, '<figure$1 class="my-6">');
  out = out.replace(/<figcaption([^>]*)>/gi, '<figcaption$1 class="text-gray-500 text-sm mt-2 text-center">');
  out = out.replace(/<table([^>]*)>/gi, '<div class="overflow-x-auto my-4 rounded-lg border border-gray-200"><table$1 class="w-full">');
  out = out.replace(/<\/table>/gi, '</table></div>');
  out = out.replace(/<th([^>]*)>/gi, '<th$1 class="px-3 py-2 text-left text-gray-700 text-sm font-semibold border-b border-gray-200 bg-gray-50">');
  out = out.replace(/<td([^>]*)>/gi, '<td$1 class="px-3 py-2 text-gray-600 text-sm border-b border-gray-100">');

  return out;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const staticPost = getPostBySlug(slug);
  
  if (staticPost) {
    const cat = CATEGORIES[staticPost.category];
    const related = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3);
    const bodyHtml = renderMarkdown(staticPost.body);
    const post = staticPost;

    return (
      <div className="min-h-screen bg-[#0a0a1a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            image: `${SITE_URL}/og-image.jpg`,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt || post.publishedAt,
            author: {
              '@type': 'Organization',
              name: 'German Path',
              url: SITE_URL,
            },
            publisher: {
              '@type': 'Organization',
              name: 'German Path',
              url: SITE_URL,
              logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/logo.png`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${SITE_URL}/blog/${post.slug}`,
            },
          }),
        }}
      />
      <SiteNav />

      <article className="blog-static-article max-w-3xl mx-auto px-6 pt-24 pb-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-white/30 text-xs mb-6">
          <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/blog" className="hover:text-white/60 transition-colors">Blog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white/50 truncate max-w-[200px]">{post.title}</span>
        </div>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${cat.bg} ${cat.color}`}>
              {cat.label}
            </span>
            <span className="text-white/20 text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.readTime} min read
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">{post.title}</h1>
          <p className="text-white/40 text-sm leading-relaxed">{post.excerpt}</p>

          <div className="flex items-center gap-4 mt-4 text-white/20 text-xs">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Published {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {post.updatedAt && (
              <span>
                Updated {new Date(post.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
          </div>
        </header>

        {/* Body */}
        <div
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        {/* Back to blog */}
        <div className="mt-12 pt-8 border-t border-white/[0.06]">
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">More articles</h2>
            <div className="blog-static-related-grid grid sm:grid-cols-3 gap-3">
              {related.map(p => {
                const rCat = CATEGORIES[p.category];
                return (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group p-4 rounded-xl border border-white/[0.06] bg-[#0f0f23] hover:border-white/[0.12] transition-all"
                  >
                    <span className="text-2xl mb-2 block">{p.coverEmoji}</span>
                    <span className={`text-[9px] font-semibold uppercase tracking-wider ${rCat.color}`}>{rCat.label}</span>
                    <h3 className="text-white text-xs font-medium mt-1 group-hover:text-blue-300 transition-colors line-clamp-2">{p.title}</h3>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-10 p-6 rounded-xl border border-white/[0.06] bg-gradient-to-br from-blue-500/[0.04] to-purple-500/[0.04] text-center">
          <h3 className="text-white font-bold mb-1">Ready to apply?</h3>
          <p className="text-white/35 text-xs mb-4">Use our free AI tools to find programs, build your CV, and write motivation letters.</p>
          <Link href="/dashboard" className="inline-flex px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
            Get Started Free
          </Link>
        </div>
      </article>
    </div>
    );
  }

  // Fallback to WordPress
  const wpPost = await fetchWpPost(slug);
  if (!wpPost) notFound();

  const title = wpPost.title.rendered;
  const content = renderWordPressHtml(wpPost.content.rendered);
  const seoDescription = wpPost.seo.description || stripHtml(wpPost.excerpt.rendered);
  const seoImage = wpPost.seo.image || wpPost.featuredImage || `${SITE_URL}/og-image.jpg`;
  const publishedAt = new Date(wpPost.date);
  const updatedAt = wpPost.modified ? new Date(wpPost.modified) : null;
  const wordCount = wpPost.content.rendered.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen" style={{ background: '#f8f8f6' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
	          __html: JSON.stringify({
	            '@context': 'https://schema.org',
	            '@type': 'Article',
	            headline: stripHtml(title),
	            description: seoDescription,
	            image: seoImage,
	            datePublished: wpPost.date,
            dateModified: wpPost.modified,
            author: {
              '@type': 'Organization',
              name: 'German Path',
              url: SITE_URL,
            },
            publisher: {
              '@type': 'Organization',
              name: 'German Path',
              url: SITE_URL,
              logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/logo.png`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${SITE_URL}/blog/${slug}`,
            },
          }),
        }}
      />
      <SiteNav />

      {/* Header */}
      <header className="blog-wp-header max-w-[1100px] mx-auto px-6 pt-24 pb-7 border-b-2 border-[#ffce00]">
        <h1 className="text-[clamp(28px,4vw,46px)] font-bold text-gray-900 leading-[1.15] tracking-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }} dangerouslySetInnerHTML={{ __html: title }} />
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{publishedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span className="text-gray-400">·</span>
          <span>{readTime} min read</span>
        </div>
      </header>

      {/* Hero Image */}
      {wpPost.featuredImage && (
        <figure className="blog-wp-hero-img max-w-[1100px] mx-auto px-6">
          <img
            src={wpPost.featuredImage}
            alt={stripHtml(title)}
            className="w-full h-[420px] object-cover rounded-xl mt-7"
            loading="eager"
          />
        </figure>
      )}

      {/* Body Grid */}
      <div className="blog-wp-body-grid max-w-[1100px] mx-auto px-6 py-9">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 items-start">

          {/* Main Prose */}
          <article className="blog-wp-article bg-white rounded-2xl p-10 shadow-sm" style={{ fontSize: '17px', lineHeight: '1.8', color: '#262626' }}>
            <div
              className="wp-prose"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Share Row */}
            <div className="mt-10 pt-7 border-t border-gray-200">
              <span className="block text-xs uppercase tracking-wider text-gray-500 mb-3">Share this article</span>
              <div className="flex flex-wrap gap-2">
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://germanpath.com/blog/${slug}`)}&text=${encodeURIComponent(stripHtml(title))}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm font-semibold hover:bg-[#e7f0f9] hover:border-[#b3cfe8] hover:text-[#1d9bf0] transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.255 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Twitter
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://germanpath.com/blog/${slug}`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm font-semibold hover:bg-[#e8f0f8] hover:border-[#b3cfe8] hover:text-[#0a66c2] transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="blog-wp-sidebar flex flex-col gap-5 lg:sticky lg:top-6">
            {/* Meta Widget */}
            <div className="bg-gradient-to-br from-white to-[#f8f8ff] rounded-2xl p-5 shadow-lg border border-gray-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#dd0000] mb-3">Snapshot</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="bg-[#ffce00]/20 text-gray-900 rounded-full px-3 py-1 text-xs font-semibold">📅 {publishedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="bg-[#ffce00]/20 text-gray-900 rounded-full px-3 py-1 text-xs font-semibold">⏱ {readTime} min read</span>
              </div>

              <div className="mt-4">
                <h5 className="text-[13px] uppercase tracking-wide text-gray-500 mb-2">Helpful resources</h5>
                <ul className="space-y-2">
                  <li>
                    <Link href="/dashboard" className="block p-2.5 rounded-lg border border-gray-100 bg-white/90 hover:border-[#dd0000] transition-all">
                      <strong className="block text-[13px] text-[#dd0000]">Free AI tools</strong>
                      <span className="text-xs text-gray-600">Automate CVs, motivation letters, and visa prep.</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="block p-2.5 rounded-lg border border-gray-100 bg-white/90 hover:border-[#dd0000] transition-all">
                      <strong className="block text-[13px] text-[#dd0000]">Course finder</strong>
                      <span className="text-xs text-gray-600">Search 20,000+ German programs with filters.</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Link href="/blog" className="flex justify-center items-center rounded-lg px-4 py-2.5 font-semibold text-sm bg-gradient-to-r from-[#11132c] to-[#191f4a] text-white">
                  Browse all guides
                </Link>
              </div>
            </div>

            {/* CTA Widget */}
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-5 text-white shadow-lg">
              <span className="inline-block px-2.5 py-1 bg-[#ffce00] text-gray-900 text-[11px] font-bold uppercase tracking-wide rounded mb-3">Free tools</span>
              <h4 className="text-lg font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Plan your move to Germany</h4>
              <p className="text-sm text-white/75 mb-5 leading-relaxed">AI tools for visa, housing, CV, and motivation letters — all in one place.</p>
              <Link href="/dashboard" className="block text-center py-3 px-5 bg-[#dd0000] text-white font-bold text-sm rounded-lg hover:bg-[#bb0000] transition-all">
                Explore tools →
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
