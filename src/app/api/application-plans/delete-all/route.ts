import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete all application plans for this user
    const result = await prisma.applicationPlan.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ 
      success: true, 
      deleted: result.count,
      message: `Deleted ${result.count} application plans` 
    });
  } catch (error) {
    console.error('Delete plans error:', error);
    return NextResponse.json({ error: 'Failed to delete plans' }, { status: 500 });
  }
}
