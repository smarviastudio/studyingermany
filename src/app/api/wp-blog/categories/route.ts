export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';

type WpCategory = {
  id: number;
  name: string;
  count: number;
  slug: string;
};

export async function GET() {
  try {
    const unauthorizedResponse = await requireAdminApi();
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const wpUrl = process.env.WP_URL || 'https://cms.germanpath.com';

    const baseUrl = new URL(`${wpUrl}/wp-json/wp/v2/categories`);
    baseUrl.searchParams.set('per_page', '100');
    baseUrl.searchParams.set('orderby', 'name');
    baseUrl.searchParams.set('order', 'asc');
    baseUrl.searchParams.set('hide_empty', 'false');
    baseUrl.searchParams.set('page', '1');

    const firstRes = await fetch(baseUrl.toString());

    if (!firstRes.ok) {
      const err = await firstRes.text();
      console.error('Categories fetch error:', err);
      return NextResponse.json({ error: 'Failed to load categories' }, { status: 502 });
    }

    const totalPages = Number(firstRes.headers.get('x-wp-totalpages') || '1');
    const firstPage = (await firstRes.json()) as WpCategory[];
    const pages: WpCategory[][] = [firstPage];

    if (totalPages > 1) {
      const remainingResponses = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) => {
          const pageUrl = new URL(baseUrl.toString());
          pageUrl.searchParams.set('page', String(index + 2));
          return fetch(pageUrl.toString());
        })
      );

      for (const res of remainingResponses) {
        if (!res.ok) {
          const err = await res.text();
          console.error('Categories fetch error:', err);
          return NextResponse.json({ error: 'Failed to load categories' }, { status: 502 });
        }

        pages.push((await res.json()) as WpCategory[]);
      }
    }

    const categories = pages
      .flat()
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        count: cat.count,
        slug: cat.slug,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
