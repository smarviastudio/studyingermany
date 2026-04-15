import Link from 'next/link';
import { GraduationCap, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { BLOG_POSTS, CATEGORIES, type BlogPost } from '@/content/blog';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Study in Germany Blog — Visa, Costs, Scholarships & Student Life',
  description: 'Free guides for international students planning to study in Germany. Step-by-step articles on student visa, blocked account, DAAD scholarships, costs, and student life.',
  path: '/blog',
  keywords: [
    'study in Germany guide',
    'Germany student visa guide',
    'blocked account Germany',
    'DAAD scholarship guide',
    'cost of studying in Germany',
    'student life Germany',
  ],
  openGraphDescription: 'Free guides for international students — student visa, DAAD scholarships, costs, and life in Germany.',
});

type WpPostCard = {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  featuredImage: string | null;
  categories: { id: number; name: string; slug: string }[];
  source: 'wp';
};

type StaticPostCard = BlogPost & { source: 'static' };
type AnyPost = WpPostCard | StaticPostCard;

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').replace(/&[#A-Za-z0-9]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

async function fetchWpPosts(): Promise<WpPostCard[]> {
  const wpUrl =
    process.env.WP_URL ||
    (process.env.NODE_ENV === 'production' ? 'https://cms.germanpath.com' : 'http://localhost:8000');
  try {
    const res = await fetch(`${wpUrl}/wp-json/wp/v2/posts?per_page=20&_embed=1&status=publish`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const posts = await res.json();

    return posts.map((post: Record<string, unknown>) => {
      const embedded = post._embedded as Record<string, unknown> | undefined;
      const featuredMediaCandidates = Array.isArray(embedded?.['wp:featuredmedia'])
        ? (embedded['wp:featuredmedia'] as Record<string, unknown>[])
        : [];
      const featuredMedia =
        featuredMediaCandidates.find((m) => typeof m?.source_url === 'string' && m?.media_type !== 'site') || null;
      const sizes = (featuredMedia?.media_details as Record<string, unknown> | undefined)
        ?.sizes as Record<string, Record<string, unknown>> | undefined;
      const featuredImage =
        (typeof sizes?.medium_large?.source_url === 'string' && sizes.medium_large.source_url) ||
        (typeof sizes?.large?.source_url === 'string' && sizes.large.source_url) ||
        (featuredMedia && typeof featuredMedia.source_url === 'string' ? featuredMedia.source_url : null);

      const terms = Array.isArray(embedded?.['wp:term'])
        ? (embedded['wp:term'] as unknown[][]).flat()
        : [];
      const categories = terms
        .filter((t: unknown) => (t as Record<string, unknown>).taxonomy === 'category')
        .map((t: unknown) => ({
          id: (t as Record<string, unknown>).id as number,
          name: (t as Record<string, unknown>).name as string,
          slug: (t as Record<string, unknown>).slug as string,
        }));

      return {
        id: post.id as number,
        title: stripHtml(((post.title as Record<string, unknown>)?.rendered as string) || ''),
        excerpt: stripHtml(((post.excerpt as Record<string, unknown>)?.rendered as string) || '').slice(0, 150) + '...',
        slug: post.slug as string,
        date: post.date as string,
        featuredImage: featuredImage || null,
        categories,
        source: 'wp' as const,
      };
    });
  } catch {
    return [];
  }
}

function StaticCard({ post, featured = false }: { post: StaticPostCard; featured?: boolean }) {
  const cat = CATEGORIES[post.category];
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group block rounded-xl border border-white/[0.06] bg-[#0f0f23] hover:border-white/[0.12] hover:bg-[#12122a] transition-all overflow-hidden ${
        featured ? 'md:col-span-2 md:flex' : ''
      }`}
    >
      <div className={`flex items-center justify-center bg-gradient-to-br from-white/[0.03] to-white/[0.01] ${
        featured ? 'md:w-64 md:flex-shrink-0 py-10 md:py-0' : 'py-10'
      }`}>
        <span className={`${featured ? 'text-7xl' : 'text-5xl'} group-hover:scale-110 transition-transform`}>{post.coverEmoji}</span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${cat.bg} ${cat.color}`}>
            {cat.label}
          </span>
          <span className="text-white/20 text-[10px] flex items-center gap-1">
            <Clock className="w-3 h-3" /> {post.readTime} min read
          </span>
        </div>
        <h3 className={`font-bold text-white group-hover:text-blue-300 transition-colors mb-2 ${featured ? 'text-lg' : 'text-sm'}`}>
          {post.title}
        </h3>
        <p className={`text-white/35 leading-relaxed flex-1 ${featured ? 'text-sm' : 'text-xs'}`}>{post.excerpt}</p>
        <div className="flex items-center gap-1 mt-3 text-blue-400/60 group-hover:text-blue-400 text-xs font-medium transition-colors">
          Read more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

function WpCard({ post }: { post: WpPostCard }) {
  const categoryName = post.categories[0]?.name || 'Article';
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-xl border border-white/[0.06] bg-[#0f0f23] hover:border-white/[0.12] hover:bg-[#12122a] transition-all overflow-hidden"
    >
      {post.featuredImage ? (
        <div className="w-full h-40 overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="py-10 flex items-center justify-center bg-gradient-to-br from-white/[0.03] to-white/[0.01]">
          <span className="text-5xl">📖</span>
        </div>
      )}
      <div className="p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
            {categoryName}
          </span>
          <span className="text-white/20 text-[10px]">
            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <h3 className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors mb-2 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-white/35 text-xs leading-relaxed line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center gap-1 mt-3 text-blue-400/60 group-hover:text-blue-400 text-xs font-medium transition-colors">
          Read more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export default async function BlogPage() {
  const wpPosts = await fetchWpPosts();

  const staticWithSource: StaticPostCard[] = BLOG_POSTS.map(p => ({ ...p, source: 'static' as const }));
  const featuredStatic = staticWithSource.filter(p => p.featured);
  const restStatic = staticWithSource.filter(p => !p.featured);

  // Deduplicate WP posts against static slugs
  const staticSlugs = new Set(BLOG_POSTS.map(p => p.slug));
  const uniqueWpPosts = wpPosts.filter(p => !staticSlugs.has(p.slug));

  const categories = Object.entries(CATEGORIES);

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0a1a]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 h-14">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-semibold text-sm">German Path</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-white/40 hover:text-white/70 text-sm transition-colors">Dashboard</Link>
            <Link href="/blog" className="text-white text-sm font-medium">Blog</Link>
            <Link href="/auth/signin" className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/70 hover:text-white text-xs font-medium transition-all hover:bg-white/[0.1]">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-white/30 text-xs mb-3">
            <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/50">Blog & Guides</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Blog & Guides</h1>
          <p className="text-white/40 text-sm max-w-xl">
            Everything you need to know about studying in Germany — from applications to student life. Written for international students, by people who&apos;ve been through it.
          </p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-white text-xs font-medium">All</span>
          {categories.map(([key, cat]) => (
            <span key={key} className={`px-3 py-1.5 rounded-full ${cat.bg} ${cat.color} text-xs font-medium border border-transparent`}>
              {cat.label}
            </span>
          ))}
        </div>

        {/* Featured static posts */}
        {featuredStatic.length > 0 && (
          <section className="mb-10">
            <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">Featured</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {featuredStatic.map(post => (
                <StaticCard key={post.slug} post={post} featured />
              ))}
            </div>
          </section>
        )}

        {/* All static posts */}
        {restStatic.length > 0 && (
          <section className="mb-10">
            <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">All Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {restStatic.map(post => (
                <StaticCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* WordPress posts */}
        {uniqueWpPosts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">
              More Guides {uniqueWpPosts.length > 0 && <span className="text-white/20 ml-1">({uniqueWpPosts.length})</span>}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {uniqueWpPosts.map(post => (
                <WpCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-14 text-center">
          <div className="inline-flex flex-col items-center gap-3 p-8 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-blue-500/[0.04] to-purple-500/[0.04]">
            <span className="text-3xl">🚀</span>
            <h3 className="text-white font-bold text-lg">Ready to start your journey?</h3>
            <p className="text-white/35 text-sm max-w-md">Use our free AI-powered tools to find programs, build your CV, and write motivation letters.</p>
            <Link href="/dashboard" className="mt-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
