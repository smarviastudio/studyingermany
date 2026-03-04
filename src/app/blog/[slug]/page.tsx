import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GraduationCap, Clock, ChevronRight, ArrowLeft, Calendar } from 'lucide-react';
import { BLOG_POSTS, CATEGORIES, getPostBySlug, type BlogPost } from '@/content/blog';
import type { Metadata } from 'next';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return BLOG_POSTS.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Not Found' };
  return {
    title: `${post.title} — StudyGermany`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  };
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

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const cat = CATEGORIES[post.category];
  const related = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3);
  const bodyHtml = renderMarkdown(post.body);

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0a1a]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6 h-14">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-semibold text-sm">StudyGermany</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-white/40 hover:text-white/70 text-sm transition-colors">Dashboard</Link>
            <Link href="/blog" className="text-white/40 hover:text-white/70 text-sm transition-colors">Blog</Link>
            <Link href="/auth/signin" className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/70 hover:text-white text-xs font-medium transition-all hover:bg-white/[0.1]">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-10">
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
            <div className="grid sm:grid-cols-3 gap-3">
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
