import { NextRequest } from 'next/server';
import { POST as courseFinderPost } from './course-finder/route';

export async function POST(request: NextRequest) {
  return courseFinderPost(request);
}
