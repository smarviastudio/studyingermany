import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Add a simple GET endpoint for testing
export async function GET() {
  let pdfParseAvailable = false;
  try {
    const pdfParseModule = await import('pdf-parse');
    pdfParseAvailable = !!pdfParseModule;
  } catch (err) {
    console.error('Failed to import pdf-parse:', err);
  }
  
  return NextResponse.json({ 
    message: 'CV Parser API is working',
    pdfParseAvailable,
    nodeVersion: process.version,
    platform: process.platform
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('[CV Parser] Starting CV parse request');
    
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      console.log('[CV Parser] No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('[CV Parser] File received:', file.name, 'Type:', file.type, 'Size:', file.size);

    if (file.type !== 'application/pdf') {
      console.log('[CV Parser] Invalid file type:', file.type);
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      console.log('[CV Parser] File too large:', file.size);
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log('[CV Parser] Buffer created, size:', buffer.length);

    try {
      // Import pdf-parse dynamically
      const pdfParseModule = await import('pdf-parse');
      const pdfParse = pdfParseModule as any;
      
      console.log('[CV Parser] Using pdf-parse to parse buffer');
      const data = await pdfParse(buffer);
      console.log('[CV Parser] PDF parsed successfully, text length:', data.text?.length || 0);

      const text = data.text?.trim() || '';

      if (!text) {
        console.log('[CV Parser] No text extracted from PDF');
        return NextResponse.json({ 
          error: 'Could not extract text from PDF. Make sure it is not a scanned image or contains selectable text.' 
        }, { status: 422 });
      }

      console.log('[CV Parser] Successfully extracted text, returning response');
      return NextResponse.json({ text });
    } catch (parseErr) {
      console.error('[CV Parser] PDF parsing error:', parseErr);
      return NextResponse.json({
        error: 'Failed to parse PDF content',
        message: parseErr instanceof Error ? parseErr.message : 'Unknown parsing error'
      }, { status: 500 });
    }
  } catch (err) {
    console.error('[CV Parser] General error:', err);
    return NextResponse.json({
      error: 'Failed to parse PDF',
      message: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}
