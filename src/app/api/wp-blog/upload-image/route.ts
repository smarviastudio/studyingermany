export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

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
    const body = await request.json();
    const { imageUrl, filename, credit, altText, downloadLocation } = body || {};

    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 });
    }

    const wpUrl = process.env.WP_URL || 'http://localhost:8000';
    const wpUser = process.env.WP_USER || 'admin';
    const wpAppPassword = process.env.WP_APP_PASSWORD;

    if (!wpAppPassword) {
      return NextResponse.json({ error: 'WP_APP_PASSWORD missing' }, { status: 500 });
    }

    const credentials = Buffer.from(`${wpUser}:${wpAppPassword}`).toString('base64');

    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
      return NextResponse.json({ error: 'Failed to download image' }, { status: 400 });
    }

    const arrayBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
    const safeFilename = (filename || `unsplash-${Date.now()}.jpg`).replace(/[^a-z0-9.-]/gi, '-');

    const uploadRes = await fetch(`${wpUrl}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Content-Type': contentType,
      },
      body: buffer,
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      console.error('Media upload error:', err);
      return NextResponse.json({ error: 'Failed to upload media to WordPress' }, { status: 502 });
    }

    const media = await uploadRes.json();

    if (credit || altText) {
      try {
        await fetch(`${wpUrl}/wp-json/wp/v2/media/${media.id}`, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            caption: credit || undefined,
            alt_text: altText || credit || undefined,
            description: credit || undefined,
          }),
        });
      } catch (error) {
        console.warn('Failed to set media metadata', error);
      }
    }

    await registerUnsplashDownload(downloadLocation);

    return NextResponse.json({
      id: media.id,
      source_url: media.source_url,
    });
  } catch (error) {
    console.error('Upload featured image error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
