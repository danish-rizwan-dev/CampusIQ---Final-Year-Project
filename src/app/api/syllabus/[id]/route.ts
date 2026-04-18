import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { subjectName, topicName, difficulty, subtopics, resources, youtubeSearchUrl, documentation, practiceQuestions } = await req.json();

    const topic = await prisma.syllabusTopic.update({
      where: { id, userId: user.id },
      data: {
        subjectName,
        topicName,
        difficulty,
        subtopics,
        resources,
        youtubeSearchUrl,
        documentation,
        practiceQuestions
      }
    });

    return NextResponse.json({ topic });
  } catch (error) {
    console.error('Syllabus PUT Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    await prisma.syllabusTopic.delete({
      where: { id, userId: user.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Syllabus DELETE Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
