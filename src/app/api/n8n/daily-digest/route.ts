import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay, addDays } from 'date-fns';

// Helper to authenticate n8n requests
function authenticateN8n(request: Request) {
  const authHeader = request.headers.get('authorization');
  const secret = process.env.N8N_WEBHOOK_SECRET;

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return false;
  }
  return true;
}

export async function GET(request: Request) {
  try {
    if (!authenticateN8n(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    // Get today's dates for querying
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const currentDayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)

    // 1. Fetch upcoming pending tasks
    const upcomingTasks = await prisma.task.findMany({
      where: {
        userId,
        status: 'PENDING',
        dueDate: {
          gte: startOfDay(today),
          lte: endOfDay(addDays(today, 7)), // next 7 days
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    // 2. Fetch today's classes
    const todaysClasses = await prisma.classSchedule.findMany({
      where: {
        userId,
        dayOfWeek: currentDayOfWeek,
      },
      orderBy: { startTime: 'asc' },
    });

    // 3. Fetch upcoming exams
    const upcomingExams = await prisma.examPrep.findMany({
      where: {
        userId,
        targetDate: {
          gte: startOfDay(today),
        },
      },
      orderBy: { targetDate: 'asc' },
      take: 3,
    });

    // Fetch user details for the email greeting
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true }
    });

    return NextResponse.json({
      success: true,
      data: {
        user,
        summary: `You have ${upcomingTasks.length} upcoming tasks and ${todaysClasses.length} classes today.`,
        tasks: upcomingTasks,
        classes: todaysClasses,
        exams: upcomingExams,
      }
    });

  } catch (error) {
    console.error('Error fetching daily digest:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
