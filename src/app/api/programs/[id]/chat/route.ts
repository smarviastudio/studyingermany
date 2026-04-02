import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  _request: NextRequest,
  _context: { params: Promise<{ id: string }> }
) {
  return NextResponse.json({
    error: 'Unavailable',
    message: 'Course Assistant is disabled in the current version.',
  }, { status: 403 });
}
