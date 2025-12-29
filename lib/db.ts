import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export interface Paste {
  id: string;
  content: string;
  createdAt: number;
  ttlSeconds?: number;
  maxViews?: number;
  viewCount: number;
}

let dbInitialized = false;

async function ensureDatabaseInitialized(): Promise<void> {
  if (dbInitialized) {
    return;
  }
  
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS pastes (
        id VARCHAR(50) PRIMARY KEY,
        content TEXT NOT NULL,
        created_at BIGINT NOT NULL,
        ttl_seconds INTEGER,
        max_views INTEGER,
        view_count INTEGER NOT NULL DEFAULT 0
      )
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_created_at ON pastes(created_at)
    `;
    
    dbInitialized = true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export async function savePaste(paste: Paste): Promise<void> {
  await ensureDatabaseInitialized();
  
  await sql`
    INSERT INTO pastes (id, content, created_at, ttl_seconds, max_views, view_count)
    VALUES (${paste.id}, ${paste.content}, ${paste.createdAt}, ${paste.ttlSeconds ?? null}, ${paste.maxViews ?? null}, ${paste.viewCount})
    ON CONFLICT (id) DO UPDATE SET
      content = EXCLUDED.content,
      created_at = EXCLUDED.created_at,
      ttl_seconds = EXCLUDED.ttl_seconds,
      max_views = EXCLUDED.max_views,
      view_count = EXCLUDED.view_count
  `;
}

export async function getPaste(id: string): Promise<Paste | null> {
  await ensureDatabaseInitialized();
  
  const result = await sql`
    SELECT id, content, created_at, ttl_seconds, max_views, view_count
    FROM pastes
    WHERE id = ${id}
  `;
  
  if (result.length === 0) {
    return null;
  }
  
  const row = result[0] as any;
  return {
    id: row.id,
    content: row.content,
    createdAt: parseInt(row.created_at),
    ttlSeconds: row.ttl_seconds ? parseInt(row.ttl_seconds) : undefined,
    maxViews: row.max_views ? parseInt(row.max_views) : undefined,
    viewCount: parseInt(row.view_count),
  };
}

export async function incrementViewCount(id: string, currentTime: number): Promise<Paste | null> {
  const paste = await getPaste(id);
  
  if (!paste) {
    return null;
  }
  
  const newViewCount = paste.viewCount + 1;
  
  await sql`
    UPDATE pastes
    SET view_count = ${newViewCount}
    WHERE id = ${id}
  `;
  
  const updatedPaste: Paste = {
    ...paste,
    viewCount: newViewCount,
  };
  
  return updatedPaste;
}

export async function deleteExpiredPastes(currentTime: number): Promise<void> {
  await sql`
    DELETE FROM pastes
    WHERE ttl_seconds IS NOT NULL
    AND (created_at + ttl_seconds * 1000) < ${currentTime}
  `;
}