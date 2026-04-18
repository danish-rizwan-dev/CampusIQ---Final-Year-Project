import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Missing syllabus text' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
      generationConfig: { responseMimeType: "application/json" } 
    });

    const prompt = `You are a Senior Academic Counselor. Analyze this raw syllabus text and extract a structured study curriculum.
    Rank topics by difficulty (Hard topics usually involve math/logic/complex systems).
    Suggest a direct YouTube search URL for each topic.

    Syllabus Content: ${text}

    Format exactly as JSON:
    {
      "topics": [
        {
          "name": "string",
          "difficulty": "Easy" | "Medium" | "Hard",
          "subtopics": ["string"],
          "resources": ["string"],
          "youtubeSearchUrl": "string" 
        }
      ],
      "estimatedHours": number,
      "subjectName": "string"
    }`;

    const result = await model.generateContent(prompt);
    const response = JSON.parse(result.response.text());

    return NextResponse.json(response);

  } catch (error) {
    console.error('Syllabus analysis failed:', error);
    return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 });
  }
}
