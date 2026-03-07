export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';

async function registerUnsplashDownload(downloadLocation?: string) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey || !downloadLocation) return;

  try {
    await fetch(`${downloadLocation}?client_id=${accessKey}`, { method: 'GET' });
  } catch (error) {
    console.warn('Failed to register Unsplash download', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const unauthorizedResponse = await requireAdminApi();
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const body = await request.json();
    const { imageUrl, filename, credit, altText, downloadLocation } = body || {};

    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 });
    }

    const wpUrl = process.env.WP_URL || 'https://cms.germanpath.com';
    const wpCustomApiToken = process.env.WP_CUSTOM_API_TOKEN;

    if (!wpCustomApiToken) {
      return NextResponse.json({ error: 'WP_CUSTOM_API_TOKEN missing' }, { status: 500 });
    }
    const safeFilename = (filename || `unsplash-${Date.now()}.jpg`).replace(/[^a-z0-9.-]/gi, '-');

    const uploadRes = await fetch(`${wpUrl}/wp-json/custom/v1/upload-media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_token: wpCustomApiToken,
        image_url: imageUrl,
        filename: safeFilename,
        alt_text: altText || credit || '',
        caption: credit || '',
      }),
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      console.error('Media upload error:', err);
      return NextResponse.json({ error: 'Failed to upload media to WordPress' }, { status: 502 });
    }

    const media = await uploadRes.json();

    await registerUnsplashDownload(downloadLocation);

    return NextResponse.json({
      id: media.media_id,
      source_url: media.source_url,
    });
  } catch (error) {
    console.error('Upload featured image error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
