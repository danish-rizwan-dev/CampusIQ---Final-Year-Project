import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        roadmaps: {
          where: { status: 'COMPLETED' },
          orderBy: { semesterNumber: 'asc' },
        },
        careerProfile: true,
      },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const completedSemesters = user.roadmaps;
    
    // Fallback data if no semesters are completed yet
    if (completedSemesters.length === 0) {
      return NextResponse.json({
        hasData: false,
        careerReadiness: user.careerProfile?.careerReadinessScore || 0,
        message: "Complete your first semester evaluation to see detailed analytics."
      });
    }

    const chartData = completedSemesters.map((s: any) => ({
      sem: s.semesterNumber,
      gpa: s.gpa || 0, // GPA is already stored as percentage (0-100)
      assignments: s.assignmentRate || 0,
      consistency: s.timeConsistency || 0,
      concepts: s.conceptScore || 0,
      mock: s.mockTestScore || 0,
      score: s.performanceScore || 0,
    }));

    const latest = chartData[chartData.length - 1];
    const prev = chartData.length > 1 ? chartData[chartData.length - 2] : null;

    const summary = {
      hasData: true,
      chartData,
      latest,
      trend: {
        change: prev ? (latest.score - prev.score).toFixed(1) : "Base",
        improving: prev ? latest.score > prev.score : true,
        status: prev ? (latest.score > prev.score ? 'Up' : latest.score < prev.score ? 'Down' : 'Stable') : 'Baseline'
      },
      weakness: getWeakestMetric(latest),
      careerReadiness: user.careerProfile?.careerReadinessScore || 0,
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to aggregate analytics' }, { status: 500 });
  }
}

function getWeakestMetric(latest: any) {
  const metrics = [
    { name: 'GPA', value: latest.gpa },
    { name: 'Assignments', value: latest.assignments },
    { name: 'Consistency', value: latest.consistency },
    { name: 'Concept Mastery', value: latest.concepts },
    { name: 'Mock Exams', value: latest.mock }
  ];
  return metrics.sort((a, b) => a.value - b.value)[0];
}
