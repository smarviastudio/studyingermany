import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/cv-maker/cv - Get all CVs for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const cvs = await prisma.cvDocument.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(cvs);
  } catch (error) {
    console.error('Failed to fetch CVs:', error);
    return NextResponse.json({ message: 'Failed to fetch CVs' }, { status: 500 });
  }
}

// POST /api/cv-maker/cv - Create a new CV
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    const { name, templateId, accent, fontFamily, fontSize, data, isDefault } = payload;

    // If this is set as default, unset other defaults
    if (isDefault) {
      await prisma.cvDocument.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false }
      });
    }

    const cv = await prisma.cvDocument.create({
      data: {
        userId: session.user.id,
        name: name || 'Untitled CV',
        templateId: templateId || 'professional',
        accent: accent || '#2563EB',
        fontFamily: fontFamily || 'Inter',
        fontSize: fontSize || 'normal',
        data: JSON.stringify(data),
        isDefault: isDefault || false
      }
    });

    return NextResponse.json(cv, { status: 201 });
  } catch (error) {
    console.error('Failed to create CV:', error);
    return NextResponse.json({ message: 'Failed to create CV' }, { status: 500 });
  }
}
