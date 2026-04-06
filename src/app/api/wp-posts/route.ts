import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tickerOnly = searchParams.get('ticker_only') === '1';
  const perPage = tickerOnly ? (searchParams.get('per_page') || '8') : (searchParams.get('per_page') || '6');
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  const wpUrl =
    process.env.WP_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://cms.germanpath.com'
      : 'http://localhost:8000');

  try {
    let url = `${wpUrl}/wp-json/wp/v2/posts?per_page=${perPage}&_embed=1&status=publish`;
    if (category) url += `&categories=${category}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (tickerOnly) {
      // Only show posts from "News" category in ticker
      url += '&category_name=news&orderby=date&order=desc';
    }

    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ posts: [] }, { status: 200 });
    }

    const posts = await res.json();

    const simplified = posts.map((post: Record<string, unknown>) => {
      const embedded = post._embedded as Record<string, unknown> | undefined;
      const featuredMediaCandidates = Array.isArray(embedded?.['wp:featuredmedia'])
        ? (embedded['wp:featuredmedia'] as Record<string, unknown>[])
        : [];
      const featuredMedia = featuredMediaCandidates.find((media) => {
        const sourceUrl = media?.source_url;
        const mediaType = media?.media_type;
        return typeof sourceUrl === 'string' && sourceUrl.length > 0 && mediaType !== 'site';
      }) || null;
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

      const featuredMediaDetails = featuredMedia?.media_details as Record<string, unknown> | undefined;
      const featuredSizes = featuredMediaDetails?.sizes as Record<string, Record<string, unknown>> | undefined;
      const featuredImage =
        (typeof featuredSizes?.medium_large?.source_url === 'string' && featuredSizes.medium_large.source_url) ||
        (typeof featuredSizes?.large?.source_url === 'string' && featuredSizes.large.source_url) ||
        (typeof featuredSizes?.full?.source_url === 'string' && featuredSizes.full.source_url) ||
        (typeof featuredSizes?.medium?.source_url === 'string' && featuredSizes.medium.source_url) ||
        (featuredMedia && typeof featuredMedia.source_url === 'string' ? featuredMedia.source_url : null);

      return {
        id: post.id,
        title: (post.title as Record<string, unknown>)?.rendered || '',
        excerpt: (post.excerpt as Record<string, unknown>)?.rendered || '',
        slug: post.slug,
        date: post.date,
        link: post.link,
        featuredImage,
        categories,
      };
    });

    return NextResponse.json({ posts: simplified });
  } catch {
    return NextResponse.json({ posts: [] }, { status: 200 });
  }
}
