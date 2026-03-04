export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

const UNSPLASH_ENDPOINT = 'https://api.unsplash.com/search/photos';

export async function GET(request: NextRequest) {
  try {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      return NextResponse.json(
        { error: 'Unsplash access key not configured.' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();
    const page = Number(searchParams.get('page') || '1');

    if (!query) {
      return NextResponse.json({ error: 'Query is required.' }, { status: 400 });
    }

    const url = new URL(UNSPLASH_ENDPOINT);
    url.searchParams.set('query', query);
    url.searchParams.set('per_page', '12');
    url.searchParams.set('page', Math.max(page, 1).toString());
    url.searchParams.set('orientation', 'landscape');

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        'Accept-Version': 'v1',
      },
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Unsplash error:', err);
      return NextResponse.json({ error: 'Failed to fetch images.' }, { status: 502 });
    }

    const data = await response.json();

    const results = (data.results || []).map((item: any) => ({
      id: item.id,
      description: item.description,
      alt_description: item.alt_description,
      urls: item.urls,
      width: item.width,
      height: item.height,
      user: {
        name: item.user?.name,
        username: item.user?.username,
        profile_image: item.user?.profile_image,
      },
      links: {
        html: item.links?.html,
        download_location: item.links?.download_location,
      },
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Unsplash search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
