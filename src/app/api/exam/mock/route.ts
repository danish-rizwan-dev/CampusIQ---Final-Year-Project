import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { generateMockExam } from '@/lib/gemini';

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const exams = await prisma.mockExam.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ exams });
  } catch (error) {
    console.error('[MOCK_EXAM_GET_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { subject, syllabus } = await req.json();

    const examData = await generateMockExam(subject, syllabus);
    if (!examData) throw new Error("AI failed to generate exam");

    const mockExam = await prisma.mockExam.create({
      data: {
        userId: user.id,
        subject,
        syllabus,
        examData,
        totalMarks: examData.totalMarks || 35,
        durationMinutes: examData.durationMinutes || 60,
        status: 'PENDING'
      }
    });

    return NextResponse.json(mockExam);

  } catch (error) {
    console.error('Mock Exam AI Error:', error);
    return NextResponse.json({ error: 'AI service error' }, { status: 500 });
  }
}
