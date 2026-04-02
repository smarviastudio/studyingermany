import Link from 'next/link';
import { GraduationCap, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { BLOG_POSTS, CATEGORIES, type BlogPost } from '@/content/blog';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Blog & Guides',
  description: 'Free guides, tips, and resources for international students planning to study in Germany. Visa, costs, scholarships, student life, and more.',
  path: '/blog',
  openGraphDescription: 'Free guides, tips, and resources for international students planning to study in Germany.',
});

function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const cat = CATEGORIES[post.category];
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group block rounded-xl border border-white/[0.06] bg-[#0f0f23] hover:border-white/[0.12] hover:bg-[#12122a] transition-all overflow-hidden ${
        featured ? 'md:col-span-2 md:flex' : ''
      }`}
    >
      {/* Emoji cover */}
      <div className={`flex items-center justify-center bg-gradient-to-br from-white/[0.03] to-white/[0.01] ${
        featured ? 'md:w-64 md:flex-shrink-0 py-10 md:py-0' : 'py-10'
      }`}>
        <span className={`${featured ? 'text-7xl' : 'text-5xl'} group-hover:scale-110 transition-transform`}>{post.coverEmoji}</span>
      </div>

      {/* Content */}
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
        <p className={`text-white/35 leading-relaxed flex-1 ${featured ? 'text-sm' : 'text-xs'}`}>
          {post.excerpt}
        </p>
        <div className="flex items-center gap-1 mt-3 text-blue-400/60 group-hover:text-blue-400 text-xs font-medium transition-colors">
          Read more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const featured = BLOG_POSTS.filter(p => p.featured);
  const rest = BLOG_POSTS.filter(p => !p.featured);
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

        {/* Featured posts */}
        {featured.length > 0 && (
          <section className="mb-10">
            <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">Featured</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {featured.map(post => (
                <PostCard key={post.slug} post={post} featured />
              ))}
            </div>
          </section>
        )}

        {/* All posts */}
        <section>
          <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">All Articles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

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
