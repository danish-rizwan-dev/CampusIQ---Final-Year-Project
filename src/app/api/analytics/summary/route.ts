import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = (await prisma.user.findUnique({
      where: { clerkId },
      include: {
        roadmaps: {
          where: { status: 'COMPLETED' },
          orderBy: { semesterNumber: 'asc' },
        },
        careerProfile: true,
        mockExams: {
          where: { status: 'COMPLETED' },
          orderBy: { updatedAt: 'desc' },
          take: 5
        }
      },
    })) as any;

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const completedSemesters = user.roadmaps;
    const gradedMocks = user.mockExams;
    
    // Compute mock average
    const mockAvg = gradedMocks.length > 0 
      ? Math.round(gradedMocks.reduce((acc: number, m: any) => {
          const percentage = ((m.score || 0) / (m.totalMarks || 75)) * 100;
          return acc + percentage;
        }, 0) / gradedMocks.length)
      : 0;

    // Fallback data if no semesters are completed yet
    if (completedSemesters.length === 0 && gradedMocks.length === 0) {
      return NextResponse.json({
        hasData: false,
        careerReadiness: user.careerProfile?.careerReadinessScore || 0,
        message: "Complete your first semester evaluation to see detailed analytics."
      });
    }

    // If we have mocks but no roadmap data yet, create a "Current" snapshot
    const currentSnapshot = {
        sem: 'Current',
        gpa: 0,
        assignments: 0,
        consistency: 0,
        concepts: 0,
        mock: mockAvg,
        score: mockAvg // Use mock score as performance score if nothing else exists
    };

    const chartData = completedSemesters.length > 0 
      ? completedSemesters.map((s: any) => ({
          sem: s.semesterNumber,
          gpa: s.gpa || 0,
          assignments: s.assignmentRate || 0,
          consistency: s.timeConsistency || 0,
          concepts: s.conceptScore || 0,
          mock: s.mockTestScore || 0,
          score: s.performanceScore || 0,
        }))
      : [currentSnapshot];

    const latest = chartData[chartData.length - 1];
    const prev = chartData.length > 1 ? chartData[chartData.length - 2] : null;

    const summary = {
      hasData: true,
      chartData,
      latest,
      mockExams: gradedMocks.map((m: any) => ({
        id: m.id,
        subject: m.subject,
        score: ((m.score || 0) / (m.totalMarks || 75)) * 100,
        date: m.updatedAt
      })),
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
