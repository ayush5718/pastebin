import { NextRequest, NextResponse } from 'next/server';
import { validateCreatePaste } from '@/lib/validation';
import { generateId } from '@/lib/utils';
import { savePaste, Paste } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const errors = validateCreatePaste(body);

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Invalid input', details: errors },
        { status: 400 }
      );
    }

    const id = generateId();
    const now = Date.now();

    const paste: Paste = {
      id,
      content: body.content.trim(),
      createdAt: now,
      ttlSeconds: body.ttl_seconds,
      maxViews: body.max_views,
      viewCount: 0,
    };

    await savePaste(paste);

    const url = `${request.nextUrl.origin}/p/${id}`;

    return NextResponse.json(
      { id, url },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
