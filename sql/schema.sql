CREATE TABLE IF NOT EXISTS pastes (
  id VARCHAR(50) PRIMARY KEY,
  content TEXT NOT NULL,
  created_at BIGINT NOT NULL,
  ttl_seconds INTEGER,
  max_views INTEGER,
  view_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_created_at ON pastes(created_at);
