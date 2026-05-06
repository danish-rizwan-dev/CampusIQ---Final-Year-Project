import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper to authenticate n8n requests
function authenticateN8n(request: Request) {
  const authHeader = request.headers.get('authorization');
  const secret = process.env.N8N_WEBHOOK_SECRET;

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  try {
    if (!authenticateN8n(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ error: 'Missing required fields (userId, type, data)' }, { status: 400 });
    }

    if (type === 'flashcard') {
      const flashcardDeck = await prisma.flashcardDeck.create({
        data: {
          userId,
          title: data.title || 'Generated Flashcards',
          description: data.description || '',
          subject: data.subject || 'General',
          cards: data.cards, // Array of { question, answer }
        }
      });
      return NextResponse.json({ success: true, message: 'Flashcards saved', deck: flashcardDeck });
    } 
    
    if (type === 'mock_exam') {
      const mockExam = await prisma.mockExam.create({
        data: {
          userId,
          subject: data.subject || 'General',
          syllabus: data.syllabus || '',
          examData: data.examData, // JSON of the exam structure
          totalMarks: data.totalMarks || 100,
          durationMinutes: data.durationMinutes || 60,
          status: 'PENDING'
        }
      });
      return NextResponse.json({ success: true, message: 'Mock Exam saved', exam: mockExam });
    }

    return NextResponse.json({ error: 'Unsupported type' }, { status: 400 });

  } catch (error) {
    console.error('Error saving content from n8n:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
