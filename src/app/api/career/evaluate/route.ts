import { NextResponse } from 'next/server';
import { getAIResponse } from '@/lib/llm';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const prompt = `You are a Career Guidance AI specialized in the Indian tech market. Analyze a student profile and return the top 3 career recommendations with deep, localized insights.
Profile:
- Interests: ${data.interestsDetailed || data.interests}
- Skills: ${data.skills}
- Favorite Subjects: ${data.subjects}
- Expected Salary: ${data.salaryExpectation}
- Location Preference: ${data.locationPreference}
- Work Environment: ${data.workEnvironment} 

Respond strictly in JSON matching this schema. KEEP ALL TEXT EXTREMELY CONCISE (max 5-10 words per string field) to maximize generation speed:
{
  "recommendations": [
    {
      "title": "string",
      "confidence": number, // 0-100
      "reasoning": "string (max 10 words)",
      "skillGap": "string (max 10 words)",
      "details": {
        "summary": "string (max 15 words)", 
        "averageSalary": "string", // e.g. "₹12L - ₹25L"
        "topCountries": ["string"], 
        "jobVacanciesPerYear": "string", 
        "growthPotential": "string", 
        "growthTrajectory": "string (max 10 words)",
        "perks": ["string"],
        "whatToStudy": "string (max 10 words)",
        "commonTools": ["string"],
        "softSkills": ["string"],
        "careerLadder": [
          { "role": "string", "years": "string", "salary": "string" }
        ],
        "companiesInIndia": [
          { "name": "string", "type": "string", "salaryRange": "string" }
        ],
        "globalMarket": [
          { "country": "string", "demand": "string", "visaContext": "string" }
        ]
      }
    }
  ]
}`;

    const aiResponse = await getAIResponse(prompt, true);
    const parsed = JSON.parse(aiResponse);

    const { userId: clerkId } = await auth();
    if (clerkId) {
      const user = await prisma.user.findUnique({ where: { clerkId } });
      if (user) {
        // Save the new target course so it stops defaulting to old values
        if (data.targetCourse || data.durationYears) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              targetCourse: data.targetCourse || user.targetCourse,
              durationYears: data.durationYears ? Number(data.durationYears) : user.durationYears
            }
          });
        }

        await prisma.careerProfile.upsert({
          where: { userId: user.id },
          update: { 
            fullAssessmentResult: parsed,
            aiTopCareersRaw: parsed.recommendations,
            interests: data.interestsDetailed ? [data.interestsDetailed] : [],
            skills: data.skills ? data.skills.split(',').map((s: string) => s.trim()) : [],
            expectedSalary: data.salaryExpectation
          },
          create: { 
            userId: user.id, 
            fullAssessmentResult: parsed,
            aiTopCareersRaw: parsed.recommendations,
            interests: data.interestsDetailed ? [data.interestsDetailed] : [],
            skills: data.skills ? data.skills.split(',').map((s: string) => s.trim()) : [],
            expectedSalary: data.salaryExpectation,
            personalityTraits: [] 
          }
        });
      }
    }

    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Career AI Error:', error);
    return NextResponse.json({ error: 'Internal server error processing career test.' }, { status: 500 });
  }
}
