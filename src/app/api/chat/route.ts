import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { messages, topic, mode } = await req.json();

    const lastMessage = messages[messages.length - 1].content.trim();
    const wordCount = lastMessage.split(/\s+/).length;
    const isGreeting = /^(hi|hello|hey|yo|sup|thanks|ok|okay|bye)$/i.test(lastMessage);

    // ---------------------------
    // GREETING / ONE-WORD FAST REPLY
    // ---------------------------
    if (isGreeting || wordCount === 1) {
      const quickModel = genAI.getGenerativeModel({
        model: "gemini-3-flash-preview"
      });

      const prompt = isGreeting
        ? `Reply with a single short friendly greeting. Max 10 words. Plain text only. No emojis.`
        : `Give a one-line plain-text definition of "${lastMessage}". No formatting. No symbols.`;

      const result = await quickModel.generateContent(prompt);
      return NextResponse.json({ reply: result.response.text().trim() });
    }

    // ---------------------------
    // SYSTEM PROMPT — Claude-style formatting
    // ---------------------------
    const systemPrompt = `
You are CampusIQ Study Assistant — a smart, precise academic tutor.

RESPONSE STYLE:
- Write like a knowledgeable teacher explaining clearly.
- Use plain text only. No **, no *, no markdown symbols, no emojis.
- For structure, use this exact format with plain labels:

  For SHORT answers (simple questions, definitions):
  - Answer in 2–4 clear sentences. No sections needed.

  For DETAILED answers (concepts, explanations, how/why questions):
  Use these plain-text sections:

  Definition:
  [1–2 sentence definition]

  Key Points:
  1. [Point one with brief explanation]
  2. [Point two with brief explanation]
  3. [Point three with brief explanation]
  (add more numbered points if needed)

  Example:
  [A concrete, relatable example]

  Quick Summary:
  [1 sentence takeaway for exams]

RULES:
- Never use bullet symbols like •, *, -.
- Use numbered lists (1. 2. 3.) for all points.
- Section labels end with a colon, on their own line.
- No extra blank lines between points.
- Keep language simple and exam-focused.
- Topic context: ${topic}
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    const chat = model.startChat({
      systemInstruction: {
        role: 'system',
        parts: [{ text: systemPrompt }],
      },
    });

    const finalPrompt =
      mode === 'short'
        ? `Answer briefly in 2-4 sentences:\n${lastMessage}`
        : `Give a full structured explanation:\n${lastMessage}`;

    const result = await chat.sendMessage(finalPrompt);
    const reply = result.response.text().trim();

    // ---------------------------
    // SAVE TO DB
    // ---------------------------
    const latestMessages = [...messages, { role: 'assistant', content: reply }];

    const existingSession = await prisma.chatSession.findFirst({
      where: { userId: user.id },
    });

    if (existingSession) {
      await prisma.chatSession.update({
        where: { id: existingSession.id },
        data: { messages: latestMessages, topicContext: topic },
      });
    } else {
      await prisma.chatSession.create({
        data: { userId: user.id, messages: latestMessages, topicContext: topic },
      });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}