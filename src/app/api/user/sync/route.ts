import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clerkId, email, name } = await req.json();

    if (!clerkId || !email) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // Upsert user in Prisma to sync with Clerk
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {
        name: name || undefined,
        email: email || undefined,
      },
      create: {
        clerkId,
        email,
        name: name || 'Student',
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('[SYNC_ERROR]', error);
    return NextResponse.json({ error: 'Sync failed', detail: error.message }, { status: 500 });
  }
}
