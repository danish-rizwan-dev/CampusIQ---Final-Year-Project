import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!apiKey) {
      // Mock Data if no API key
      return NextResponse.json({
        recommendations: [
          { title: "Software Engineer", confidence: 95, reasoning: "Matches your analytical interests.", skillGap: "Need advanced algorithms." },
          { title: "Data Scientist", confidence: 85, reasoning: "Strong problem solving overlap.", skillGap: "Need Python & Statistics." },
          { title: "Product Manager", confidence: 70, reasoning: "Good for balancing technical and lifestyle.", skillGap: "Need leadership experience." }
        ]
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview", generationConfig: { responseMimeType: "application/json" } });

    const prompt = `You are a Career Guidance AI. Analyze a student profile and return the top 3 career recommendations with deep insights.
Profile:
- Interests: ${data.interestsDetailed || data.interests}
- Skills: ${data.skills}
- Favorite Subjects: ${data.subjects}
- Expected Salary: ${data.salaryExpectation}
- Location Preference: ${data.locationPreference}
- Work Environment: ${data.workEnvironment} 
Respond strictly in JSON matching this schema:
{
  "recommendations": [
    {
      "title": "string",
      "confidence": number, // 0-100
      "reasoning": "string",
      "skillGap": "string",
      "details": {
        "summary": "string", // A 2-3 sentence overview of the career and daily life
        "averageSalary": "string", // e.g. "$100k - $150k" or "₹12L - ₹25L"
        "topCountries": ["string"], // Best countries for this job
        "jobVacanciesPerYear": "string", // Estimate of global or regional vacancies
        "growthPotential": "string", // e.g. "Excellent (15% YoY)"
        "perks": ["string"] // e.g. "Remote work", "Creative freedom", "High travel"
      }
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);

    const { userId: clerkId } = await auth();
    if (clerkId) {
      const user = await prisma.user.findUnique({ where: { clerkId } });
      if (user) {
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
