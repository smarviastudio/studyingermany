import { NextRequest, NextResponse } from 'next/server';
import { csvDataProvider } from '@/lib/data/CSVDataProvider';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      );
    }
    
    const program = await csvDataProvider.getProgram(id);
    
    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      program,
      id,
    });
    
  } catch (error) {
    console.error('Get program API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
