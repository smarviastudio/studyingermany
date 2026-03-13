export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';

export async function DELETE(request: NextRequest) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) {
    return unauthorized;
  }

  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get('postId');

  if (!idParam) {
    return NextResponse.json({ error: 'postId query param required' }, { status: 400 });
  }

  const postId = Number(idParam);
  if (!Number.isFinite(postId)) {
    return NextResponse.json({ error: 'Invalid postId' }, { status: 400 });
  }

  const wpUrl = process.env.WP_URL || 'https://cms.germanpath.com';
  const wpToken = process.env.WP_CUSTOM_API_TOKEN;

  if (!wpToken) {
    return NextResponse.json({ error: 'WP_CUSTOM_API_TOKEN missing' }, { status: 500 });
  }

  try {
    const res = await fetch(`${wpUrl}/wp-json/wp/v2/posts/${postId}?force=true`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${wpToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Failed to delete WordPress post:', err);
      return NextResponse.json({ error: `WordPress returned ${res.status}` }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('WP delete error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
