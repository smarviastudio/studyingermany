import { NextRequest, NextResponse } from 'next/server';
import { templates } from '@/lib/cv-maker/templates';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const template = templates.find((tpl) => tpl.id === id);
  
  if (!template) {
    return NextResponse.json({ message: 'Template not found' }, { status: 404 });
  }
  
  return NextResponse.json(template);
}
