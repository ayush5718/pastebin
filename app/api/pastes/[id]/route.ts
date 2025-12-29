import { NextRequest, NextResponse } from 'next/server';
import { getPaste, incrementViewCount } from '@/lib/db';
import { isPasteAvailable, getExpiresAt } from '@/lib/paste';
import { getCurrentTime } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const paste = await getPaste(id);

    if (!paste) {
      return NextResponse.json(
        { error: 'Paste not found' },
        { status: 404 }
      );
    }

    const testMode = process.env.TEST_MODE === '1';
    const testHeader = request.headers.get('x-test-now-ms') || undefined;
    const currentTime = getCurrentTime(testMode, testHeader);

    if (!isPasteAvailable(paste, testMode, testHeader)) {
      return NextResponse.json(
        { error: 'Paste not found' },
        { status: 404 }
      );
    }

    const updatedPaste = await incrementViewCount(id, currentTime);
    if (!updatedPaste) {
      return NextResponse.json(
        { error: 'Paste not found' },
        { status: 404 }
      );
    }

    const remainingViews = updatedPaste.maxViews !== undefined
      ? Math.max(0, updatedPaste.maxViews - updatedPaste.viewCount)
      : null;

    return NextResponse.json({
      content: updatedPaste.content,
      remaining_views: remainingViews,
      expires_at: getExpiresAt(updatedPaste),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
