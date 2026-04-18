import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { generateExamStrategy } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { examName, topics, targetDate } = await req.json();

    const plan = await generateExamStrategy(examName, topics, targetDate);
    if (!plan) throw new Error("AI failed to generate plan");

    // Persist to DB
    const examPrep = await prisma.examPrep.create({
      data: {
        userId: user.id,
        examName,
        targetDate: new Date(targetDate),
        importantTopics: plan.importantTopics,
        revisionPlan: plan.revisionPlan,
        mockTests: plan.mockTests
      }
    });

    return NextResponse.json(examPrep);

  } catch (error) {
    console.error('Exam AI Error:', error);
    return NextResponse.json({ error: 'AI service error' }, { status: 500 });
  }
}
