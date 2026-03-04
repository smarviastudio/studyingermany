import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

const ProfileSchema = z.object({
  targetDegreeLevel: z.string().optional(),
  targetSubjects: z.array(z.string()).optional(),
  preferredLanguage: z.string().optional(),
  germanLevel: z.string().optional(),
  englishLevel: z.string().optional(),
  ieltsScore: z.number().nullable().optional(),
  toeflScore: z.number().nullable().optional(),
  hasScholarship: z.boolean().optional(),
  academicBackground: z.string().optional(),
  backgroundSummary: z.string().optional(),
  experienceHighlights: z.string().optional(),
  skills: z.string().optional(),
  careerGoals: z.string().optional(),
  preferredCities: z.array(z.string()).optional(),
  maxTuitionEur: z.number().nullable().optional(),
  desiredIntake: z.string().optional(),
  desiredStartYear: z.number().optional(),
  constraints: z.string().optional(),
  budgetNotes: z.string().optional(),
  linkedinUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ profile: null });
    }

    // Parse JSON fields
    const profileData = {
      ...profile,
      targetSubjects: profile.targetSubjects ? JSON.parse(profile.targetSubjects) : [],
      preferredCities: profile.preferredCities ? JSON.parse(profile.preferredCities) : [],
    };

    return NextResponse.json({ profile: profileData });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = ProfileSchema.parse(body);

    // Convert arrays to JSON strings for SQLite
    const profileData = {
      ...data,
      targetSubjects: data.targetSubjects ? JSON.stringify(data.targetSubjects) : null,
      preferredCities: data.preferredCities ? JSON.stringify(data.preferredCities) : null,
    };

    const profile = await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      update: profileData,
      create: {
        userId: session.user.id,
        ...profileData,
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Save profile error:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
