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

    const { targetCourse, durationYears, targetCareer, skillLevel, availableHours, overwrite } = await req.json();

    if (!targetCareer || !skillLevel || !availableHours || !targetCourse || !durationYears) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const roadmapTemplate = await generateInitialRoadmap(targetCareer, skillLevel, Number(availableHours));

    const totalSemesters = Number(durationYears) * 2;

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

    // Create roadmap + update careerProfile in an ATOMIC transaction
    const [roadmap] = await prisma.$transaction(async (tx) => {
      if (overwrite) {
        // Delete existing roadmaps to regenerate
        await tx.semesterRoadmap.deleteMany({
          where: { userId: user.id }
        });
      } else {
        // Double check for existing roadmap inside transaction
        const existing = await tx.semesterRoadmap.findFirst({
          where: { userId: user.id, semesterNumber: 1 }
        });
        if (existing) throw new Error('Roadmap already exists');
      }

      const created = await tx.semesterRoadmap.create({
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
      });

      await tx.user.update({
        where: { id: user.id },
        data: { 
          profileCompleted: true,
          targetCourse,
          durationYears: Number(durationYears),
          totalSemesters
        }
      });

      await tx.careerProfile.upsert({
        where: { userId: user.id },
        update: { selectedCareer: targetCareer },
        create: { userId: user.id, selectedCareer: targetCareer, interests: [], skills: [], personalityTraits: [] }
      });

      return [created];
    });

    return NextResponse.json({ roadmap });
  } catch (error) {
    console.error('Error generating roadmap:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
