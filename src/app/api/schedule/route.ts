import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const schedule = await prisma.classSchedule.findMany({
      where: { userId: user.id },
      orderBy: { dayOfWeek: 'asc' },
    });

    return NextResponse.json({ schedule });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { subjectName, dayOfWeek, startTime, endTime, location } = await req.json();

    const entry = await prisma.classSchedule.create({
      data: {
        userId: user.id,
        subjectName,
        dayOfWeek: Number(dayOfWeek),
        startTime,
        endTime,
        location,
      },
    });

    return NextResponse.json({ entry });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create schedule entry' }, { status: 500 });
  }
}
