import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const perPage = searchParams.get('per_page') || '6';
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  const wpUrl = process.env.WP_URL || 'http://localhost:8000';

  try {
    let url = `${wpUrl}/wp-json/wp/v2/posts?per_page=${perPage}&_embed=1&status=publish`;
    if (category) url += `&categories=${category}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ posts: [] }, { status: 200 });
    }

    const posts = await res.json();

    const simplified = posts.map((post: Record<string, unknown>) => {
      const embedded = post._embedded as Record<string, unknown> | undefined;
      const featuredMedia = Array.isArray(embedded?.['wp:featuredmedia'])
        ? (embedded['wp:featuredmedia'] as Record<string, unknown>[])[0]
        : null;
      const terms = Array.isArray(embedded?.['wp:term'])
        ? (embedded['wp:term'] as unknown[][]).flat()
        : [];
      const categories = terms
        .filter((t: unknown) => (t as Record<string, unknown>).taxonomy === 'category')
        .map((t: unknown) => ({
          id: (t as Record<string, unknown>).id,
          name: (t as Record<string, unknown>).name,
          slug: (t as Record<string, unknown>).slug,
        }));

      return {
        id: post.id,
        title: (post.title as Record<string, unknown>)?.rendered || '',
        excerpt: (post.excerpt as Record<string, unknown>)?.rendered || '',
        slug: post.slug,
        date: post.date,
        link: post.link,
        featuredImage: featuredMedia ? (featuredMedia.source_url as string) : null,
        categories,
      };
    });

    return NextResponse.json({ posts: simplified });
  } catch {
    return NextResponse.json({ posts: [] }, { status: 200 });
  }
}
