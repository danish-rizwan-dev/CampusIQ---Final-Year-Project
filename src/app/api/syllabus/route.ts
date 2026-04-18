import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const syllabusTopics = await prisma.syllabusTopic.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ syllabusTopics });
  } catch (error) {
    console.error('Syllabus GET Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { subjectName, topicName, difficulty, subtopics, resources, youtubeSearchUrl } = await req.json();

    if (!subjectName || !topicName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const topic = await prisma.syllabusTopic.create({
      data: {
        userId: user.id,
        subjectName,
        topicName,
        difficulty,
        subtopics,
        resources,
        youtubeSearchUrl
      }
    });

    return NextResponse.json({ topic });
  } catch (error) {
    console.error('Syllabus POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
