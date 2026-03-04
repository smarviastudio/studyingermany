import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const pdfParseModule = (await import('pdf-parse')) as {
      default?: (data: Buffer) => Promise<{ text?: string }>;
    };
    const pdfParseFn = pdfParseModule.default ?? (pdfParseModule as unknown as (data: Buffer) => Promise<{ text?: string }>);
    const data = await pdfParseFn(buffer);

    const text = data.text?.trim() || '';

    if (!text) {
      return NextResponse.json({ error: 'Could not extract text from PDF. Make sure it is not a scanned image.' }, { status: 422 });
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error('CV parse error:', err);
    return NextResponse.json({
      error: 'Failed to parse PDF',
      message: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}
