import { NextResponse } from 'next/server';
import { getAIResponse } from '@/lib/llm';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Missing syllabus text' }, { status: 400 });
    }

    const prompt = `You are a Senior Academic Counselor and Technical Writer. Analyze this raw syllabus text and extract a structured study curriculum.
    For each topic, you MUST provide:
    1. A Rank by difficulty.
    2. A technical 'documentation' summary (200-300 words) that explains the core concepts of the topic like a textbook.
    3. A list of 5-8 'practiceQuestions' that include both conceptual and numerical/practical questions.
    4. A direct YouTube search URL.

    Syllabus Content: ${text}

    Format exactly as JSON:
    {
      "topics": [
        {
          "name": "string",
          "difficulty": "Easy" | "Medium" | "Hard",
          "subtopics": ["string"],
          "resources": ["string"],
          "youtubeSearchUrl": "string",
          "documentation": "HTML-formatted string with <p>, <ul>, <li> tags explaining the core concepts in detail",
          "practiceQuestions": [
            { "question": "string", "type": "Concept" | "Numerical" | "Applied" }
          ]
        }
      ],
      "estimatedHours": number,
      "subjectName": "string"
    }`;

    const aiResponse = await getAIResponse(prompt, true);
    const response = JSON.parse(aiResponse);

    return NextResponse.json(response);

  } catch (error) {
    console.error('Syllabus analysis failed:', error);
    return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 });
  }
}
