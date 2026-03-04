import { NextRequest, NextResponse } from 'next/server';
import { csvDataProvider } from '@/lib/data/CSVDataProvider';

export async function POST(request: NextRequest) {
  try {
    // Only allow in development mode
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Reload endpoint only available in development' },
        { status: 403 }
      );
    }
    
    await csvDataProvider.reloadData();
    
    return NextResponse.json({
      message: 'CSV data reloaded successfully',
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Reload API error:', error);
    return NextResponse.json(
      { error: 'Failed to reload data' },
      { status: 500 }
    );
  }
}
