import { NextResponse } from 'next/server';
import { templates } from '@/lib/cv-maker/templates';

export async function GET() {
  return NextResponse.json(templates);
}
