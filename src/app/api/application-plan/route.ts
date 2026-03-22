import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - Fetch the master application plan
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const record = await prisma.applicationPlan.findUnique({
      where: {
        userId_programId: {
          userId: session.user.id,
          programId: 'master-plan',
        },
      },
    });

    if (!record) {
      return NextResponse.json({ plan: null });
    }

    const plan = JSON.parse(record.planData);
    const checklistState = record.checklistState ? JSON.parse(record.checklistState) : {};

    // Apply checklist state to weekly tasks
    if (plan.weeklyTasks) {
      plan.weeklyTasks = plan.weeklyTasks.map((week: any) => ({
        ...week,
        tasks: week.tasks.map((task: any) => ({
          ...task,
          completed: checklistState[task.id] ?? task.completed ?? false,
        })),
      }));
    }

    // Apply checklist state to documents
    if (plan.documents?.shared) {
      plan.documents.shared = plan.documents.shared.map((doc: any) => ({
        ...doc,
        completed: checklistState[`doc-${doc.id}`] ?? false,
      }));
    }
    if (plan.documents?.perProgram) {
      plan.documents.perProgram = plan.documents.perProgram.map((prog: any) => ({
        ...prog,
        documents: prog.documents.map((doc: any) => ({
          ...doc,
          completed: checklistState[`doc-${prog.programId}-${doc.id}`] ?? false,
        })),
      }));
    }

    return NextResponse.json({
      plan,
      updatedAt: record.updatedAt,
      createdAt: record.createdAt,
    });

  } catch (error) {
    console.error('Fetch plan error:', error);
    return NextResponse.json({ error: 'Failed to fetch plan' }, { status: 500 });
  }
}

// PATCH - Update task completion status
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId, completed } = await request.json();

    if (!taskId || typeof completed !== 'boolean') {
      return NextResponse.json({ error: 'taskId and completed are required' }, { status: 400 });
    }

    const record = await prisma.applicationPlan.findUnique({
      where: {
        userId_programId: {
          userId: session.user.id,
          programId: 'master-plan',
        },
      },
    });

    if (!record) {
      return NextResponse.json({ error: 'No plan found' }, { status: 404 });
    }

    const checklistState = record.checklistState ? JSON.parse(record.checklistState) : {};
    checklistState[taskId] = completed;

    await prisma.applicationPlan.update({
      where: {
        userId_programId: {
          userId: session.user.id,
          programId: 'master-plan',
        },
      },
      data: {
        checklistState: JSON.stringify(checklistState),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, taskId, completed });

  } catch (error) {
    console.error('Update plan error:', error);
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
  }
}
