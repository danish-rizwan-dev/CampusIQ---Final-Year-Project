import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateInitialRoadmap } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetCareer, skillLevel, availableHours, overwrite } = await req.json();

    if (!targetCareer || !skillLevel || !availableHours) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Get the current user
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: 'User not found in database' }, { status: 404 });

    // Check if roadmap already exists for semester 1
    const existingRoadmap = await prisma.semesterRoadmap.findFirst({
      where: { userId: user.id, semesterNumber: 1 }
    });
    if (existingRoadmap && !overwrite) {
      return NextResponse.json({ error: 'Roadmap already exists' }, { status: 400 });
    }

    if (overwrite) {
      // Delete existing roadmaps to regenerate
      await prisma.semesterRoadmap.deleteMany({
        where: { userId: user.id }
      });
    }

    // Generate with AI
    const roadmapTemplate = await generateInitialRoadmap(targetCareer, skillLevel, availableHours);

    // Create roadmap + update careerProfile
    const [roadmap] = await prisma.$transaction([
      prisma.semesterRoadmap.create({
        data: {
          userId: user.id,
          semesterNumber: 1,
          status: 'ACTIVE',
          subjects: roadmapTemplate.subjects,
          skills: roadmapTemplate.skills,
          projects: roadmapTemplate.projects,
          weeklyBreakdown: roadmapTemplate.weeklyBreakdown,
          aiSuggestions: roadmapTemplate.aiSuggestions,
          environmentSetup: roadmapTemplate.environmentSetup,
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { profileCompleted: true }
      }),
      prisma.careerProfile.upsert({
        where: { userId: user.id },
        update: { selectedCareer: targetCareer },
        create: { userId: user.id, selectedCareer: targetCareer, interests: [], skills: [], personalityTraits: [] }
      })
    ]);

    return NextResponse.json({ roadmap });
  } catch (error) {
    console.error('Error generating roadmap:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
