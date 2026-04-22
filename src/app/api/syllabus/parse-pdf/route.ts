import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const ACCEPTED_TYPES: Record<string, string> = {
  'application/pdf': 'application/pdf',
  'image/png': 'image/png',
  'image/jpeg': 'image/jpeg',
  'image/webp': 'image/webp',
  'image/gif': 'image/gif',
  'image/heic': 'image/heic',
  'image/heif': 'image/heif',
};

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const OCR_PROMPT = `You are an expert academic document OCR and extraction system.
This file contains a university syllabus, course outline, or study material.
Extract ALL readable text exactly as it appears — preserve unit headings, topic names, subtopic lists, and any structured content.
Return ONLY the extracted text. Do NOT add commentary, formatting, or anything that is not in the source document.`;

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const mimeType = ACCEPTED_TYPES[file.type];
    if (!mimeType) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Upload a PDF or an image (PNG, JPG, WEBP, GIF).` },
        { status: 415 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size must be under 10 MB.' }, { status: 413 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured on the server.');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    const result = await model.generateContent([
      { inlineData: { data: base64, mimeType } },
      OCR_PROMPT,
    ]);

    const text = result.response.text().trim();

    if (!text || text.length < 20) {
      return NextResponse.json(
        { error: 'Could not read any text from this file. Make sure the content is clearly visible and not blurry.' },
        { status: 422 }
      );
    }

    return NextResponse.json({
      text,
      fileName: file.name,
      fileType: file.type.startsWith('image/') ? 'image' : 'pdf',
    });
  } catch (error: any) {
    console.error('File parse error:', error);
    return NextResponse.json({ 
      error: 'Failed to extract text from file.',
      details: error.message || String(error)
    }, { status: 500 });
  }
}
