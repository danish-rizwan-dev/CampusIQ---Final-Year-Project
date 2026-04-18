import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateNextSemester } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roadmapId, gpa, assignmentRate, conceptScore, timeConsistency, mockTestScore } = await req.json();

    if (!roadmapId) {
      return NextResponse.json({ error: 'Missing roadmapId' }, { status: 400 });
    }

    // Weighted performance score - Normalize GPA to 100-point scale (gpa * 10)
    const normalizedGpa = Number(gpa) * 10;
    const performanceScore =
      (normalizedGpa * 0.30) +
      (Number(timeConsistency) * 0.20) +
      (Number(conceptScore) * 0.25) +
      (Number(assignmentRate) * 0.15) +
      (Number(mockTestScore) * 0.10);

    // Update the current roadmap
    const currentRoadmap = await prisma.semesterRoadmap.update({
      where: { id: roadmapId },
      data: {
        status: 'COMPLETED',
        gpa: Number(gpa),
        assignmentRate: Number(assignmentRate),
        conceptScore: Number(conceptScore),
        timeConsistency: Number(timeConsistency),
        mockTestScore: Number(mockTestScore),
        performanceScore,
      },
    });

    if (currentRoadmap.semesterNumber >= 8) {
      return NextResponse.json({
        message: 'Congratulations! All 8 semesters completed!',
        finished: true,
        performanceScore,
      });
    }

    const subjectsArray = Array.isArray(currentRoadmap.subjects)
      ? (currentRoadmap.subjects as string[])
      : [];

    const weaknesses = performanceScore < 70 ? subjectsArray.slice(0, 2) : [];

    // Generate next semester with AI adaptive logic
    const nextSemesterData = await generateNextSemester(
      currentRoadmap.semesterNumber,
      performanceScore,
      subjectsArray,
      weaknesses
    );

    const nextRoadmap = await prisma.semesterRoadmap.create({
      data: {
        userId: currentRoadmap.userId,
        semesterNumber: currentRoadmap.semesterNumber + 1,
        status: 'ACTIVE',
        subjects: nextSemesterData.subjects,
        skills: nextSemesterData.skills,
        projects: nextSemesterData.projects,
        weeklyBreakdown: nextSemesterData.weeklyBreakdown,
        aiSuggestions: nextSemesterData.aiSuggestions,
        environmentSetup: nextSemesterData.environmentSetup,
      },
    });

    // Update career readiness score on user's career profile
    const allRoadmaps = await prisma.semesterRoadmap.findMany({
      where: { userId: currentRoadmap.userId, status: 'COMPLETED' },
      select: { performanceScore: true },
    });

    const avgScore = allRoadmaps.reduce((acc: number, r: { performanceScore: number | null }) => acc + (r.performanceScore || 0), 0) / (allRoadmaps.length || 1);

    await prisma.careerProfile.upsert({
      where: { userId: currentRoadmap.userId },
      update: { careerReadinessScore: Math.min(avgScore, 98) },
      create: {
        userId: currentRoadmap.userId,
        interests: [],
        skills: [],
        personalityTraits: [],
        careerReadinessScore: Math.min(avgScore, 98),
      },
    });

    return NextResponse.json({
      previousRoadmap: currentRoadmap,
      nextRoadmap,
      performanceScore,
      trend: performanceScore > 80 ? 'ADVANCED' : performanceScore >= 50 ? 'BALANCED' : 'FOUNDATION',
    });
  } catch (error) {
    console.error('Error evaluating roadmap:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
