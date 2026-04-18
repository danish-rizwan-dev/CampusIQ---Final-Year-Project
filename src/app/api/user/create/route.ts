import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateInitialRoadmap } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { name, targetCareer, skillLevel, availableHours } = await req.json();

    if (!name || !targetCareer || !skillLevel || !availableHours) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // 1. Generate the roadmap structure via Gemini AI
    const roadmapTemplate = await generateInitialRoadmap(targetCareer, skillLevel, availableHours);

    // 2. Create User transaction implicitly by creating User and its first roadmap
    const user = await prisma.user.create({
      data: {
        name,
        targetCareer,
        skillLevel,
        availableHours: parseInt(availableHours),
        roadmaps: {
          create: {
            semesterNumber: 1,
            status: 'ACTIVE',
            subjects: roadmapTemplate.subjects,
            skills: roadmapTemplate.skills,
            projects: roadmapTemplate.projects,
            weeklyBreakdown: roadmapTemplate.weeklyBreakdown,
            aiSuggestions: roadmapTemplate.aiSuggestions
          }
        }
      },
      include: {
        roadmaps: true
      }
    });

    return NextResponse.json({ user, roadmap: user.roadmaps[0] });

  } catch (error) {
    console.error('Error creating user/roadmap:', error);
    return NextResponse.json({ error: 'Internal server error processing request.' }, { status: 500 });
  }
}
