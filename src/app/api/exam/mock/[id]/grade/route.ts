import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { gradeMockExam } from '@/lib/gemini';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const exam = await prisma.mockExam.findUnique({
      where: { id, userId: user.id }
    });

    if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    if (exam.status === 'COMPLETED') return NextResponse.json({ error: 'Exam already completed' }, { status: 400 });

    const { answers } = await req.json();
    console.log('[EXAM_SUBMISSION]', { examId: id, answerCount: Object.keys(answers).length, answers });

    const gradingResults = await gradeMockExam(exam.examData, answers);
    if (!gradingResults) throw new Error("AI failed to grade exam");

    const updatedExam = await prisma.mockExam.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        results: gradingResults,
        score: gradingResults.score
      }
    });

    return NextResponse.json({ success: true, updatedExam });

  } catch (error) {
    console.error('Grading Error:', error);
    return NextResponse.json({ error: 'AI grading service error' }, { status: 500 });
  }
}
