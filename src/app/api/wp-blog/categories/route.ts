export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';

export async function GET() {
  try {
    const unauthorizedResponse = await requireAdminApi();
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const wpUrl = process.env.WP_URL || 'https://cms.germanpath.com';

    const res = await fetch(`${wpUrl}/wp-json/wp/v2/categories?per_page=100&orderby=name&order=asc`);

    if (!res.ok) {
      const err = await res.text();
      console.error('Categories fetch error:', err);
      return NextResponse.json({ error: 'Failed to load categories' }, { status: 502 });
    }

    const data = await res.json();
    const categories = (data || []).map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      count: cat.count,
      slug: cat.slug,
    }));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
