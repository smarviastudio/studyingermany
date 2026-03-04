import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

const AddToShortlistSchema = z.object({
  programId: z.string(),
  programName: z.string(),
  university: z.string(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const shortlists = await prisma.shortlist.findMany({
      where: { userId: session.user.id },
      orderBy: { addedAt: 'desc' },
    });

    return NextResponse.json({ shortlists });
  } catch (error) {
    console.error('Get shortlist error:', error);
    return NextResponse.json({ error: 'Failed to fetch shortlist' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { programId, programName, university, notes } = AddToShortlistSchema.parse(body);

    const shortlist = await prisma.shortlist.create({
      data: {
        userId: session.user.id,
        programId,
        programName,
        university,
        notes,
      },
    });

    return NextResponse.json({ shortlist });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Add to shortlist error:', error);
    return NextResponse.json({ error: 'Failed to add to shortlist' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const programId = searchParams.get('programId');

    if (!programId) {
      return NextResponse.json({ error: 'Program ID required' }, { status: 400 });
    }

    await prisma.shortlist.deleteMany({
      where: {
        userId: session.user.id,
        programId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove from shortlist error:', error);
    return NextResponse.json({ error: 'Failed to remove from shortlist' }, { status: 500 });
  }
}
