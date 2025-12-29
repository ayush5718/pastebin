import { Paste } from './db';
import { getCurrentTime } from './utils';

export function isPasteAvailable(paste: Paste, testMode: boolean, testHeader?: string): boolean {
  const now = getCurrentTime(testMode, testHeader);

  if (paste.ttlSeconds) {
    const expiresAt = paste.createdAt + paste.ttlSeconds * 1000;
    if (now >= expiresAt) {
      return false;
    }
  }

  if (paste.maxViews !== undefined) {
    if (paste.viewCount >= paste.maxViews) {
      return false;
    }
  }

  return true;
}

export function getExpiresAt(paste: Paste): string | null {
  if (!paste.ttlSeconds) {
    return null;
  }
  const expiresAt = paste.createdAt + paste.ttlSeconds * 1000;
  return new Date(expiresAt).toISOString();
}
