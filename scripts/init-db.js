const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function initDatabase() {
  try {
    console.log('Initializing database...');
    
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
    
    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
