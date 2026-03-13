export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) {
    return unauthorized;
  }

  const body = await request.json().catch(() => null);
  const { postId } = body || {};

  if (!postId) {
    return NextResponse.json({ error: 'postId required' }, { status: 400 });
  }

  const wpUrl = process.env.WP_URL || 'https://cms.germanpath.com';
  const wpToken = process.env.WP_CUSTOM_API_TOKEN;

  if (!wpToken) {
    return NextResponse.json({ error: 'WP_CUSTOM_API_TOKEN missing' }, { status: 500 });
  }

  try {
    const res = await fetch(`${wpUrl}/wp-json/custom/v1/delete-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_token: wpToken,
        post_id: postId,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Failed to delete WordPress post:', err);
      return NextResponse.json({ error: `WordPress returned ${res.status}` }, { status: 502 });
    }

    const data = await res.json().catch(() => ({}));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('WP delete error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
