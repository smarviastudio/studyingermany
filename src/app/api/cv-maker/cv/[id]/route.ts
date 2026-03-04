import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/cv-maker/cv/[id] - Get a specific CV
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const cv = await prisma.cvDocument.findFirst({
      where: { id: params.id, userId: session.user.id }
    });

    if (!cv) {
      return NextResponse.json({ message: 'CV not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...cv,
      data: JSON.parse(cv.data)
    });
  } catch (error) {
    console.error('Failed to fetch CV:', error);
    return NextResponse.json({ message: 'Failed to fetch CV' }, { status: 500 });
  }
}

// PUT /api/cv-maker/cv/[id] - Update a CV
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    const { name, templateId, accent, fontFamily, fontSize, data, isDefault } = payload;

    // Verify ownership
    const existing = await prisma.cvDocument.findFirst({
      where: { id: params.id, userId: session.user.id }
    });

    if (!existing) {
      return NextResponse.json({ message: 'CV not found' }, { status: 404 });
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await prisma.cvDocument.updateMany({
        where: { userId: session.user.id, id: { not: params.id } },
        data: { isDefault: false }
      });
    }

    const updated = await prisma.cvDocument.update({
      where: { id: params.id },
      data: {
        name: name ?? existing.name,
        templateId: templateId ?? existing.templateId,
        accent: accent ?? existing.accent,
        fontFamily: fontFamily ?? existing.fontFamily,
        fontSize: fontSize ?? existing.fontSize,
        data: data ? JSON.stringify(data) : existing.data,
        isDefault: isDefault ?? existing.isDefault
      }
    });

    return NextResponse.json({
      ...updated,
      data: JSON.parse(updated.data)
    });
  } catch (error) {
    console.error('Failed to update CV:', error);
    return NextResponse.json({ message: 'Failed to update CV' }, { status: 500 });
  }
}

// DELETE /api/cv-maker/cv/[id] - Delete a CV
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const existing = await prisma.cvDocument.findFirst({
      where: { id: params.id, userId: session.user.id }
    });

    if (!existing) {
      return NextResponse.json({ message: 'CV not found' }, { status: 404 });
    }

    await prisma.cvDocument.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'CV deleted' });
  } catch (error) {
    console.error('Failed to delete CV:', error);
    return NextResponse.json({ message: 'Failed to delete CV' }, { status: 500 });
  }
}
