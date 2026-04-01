import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hasUnlimitedAi } from '@/lib/plans';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        aiCredits: true,
        subscription: { select: { planType: true } }
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const planType = user.subscription?.planType ?? 'free';
    const hasUnlimited = hasUnlimitedAi(planType);

    return NextResponse.json({ 
      credits: user.aiCredits,
      hasUnlimited,
      planType,
    });
  } catch (err) {
    console.error('[Credits Balance]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
