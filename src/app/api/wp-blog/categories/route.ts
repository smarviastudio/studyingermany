export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const wpUrl = process.env.WP_URL || 'http://localhost:8000';
    const wpUser = process.env.WP_USER || 'admin';
    const wpAppPassword = process.env.WP_APP_PASSWORD || '';

    if (!wpAppPassword) {
      return NextResponse.json(
        { error: 'WP_APP_PASSWORD not set in environment. Please add it to .env.local.' },
        { status: 500 }
      );
    }

    const credentials = Buffer.from(`${wpUser}:${wpAppPassword}`).toString('base64');

    const res = await fetch(
      `${wpUrl}/wp-json/wp/v2/categories?per_page=100&orderby=name&order=asc`,
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      }
    );

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
