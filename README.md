# Pastebin-Lite

A simple paste sharing service built with Next.js. Users can create text pastes with optional time-to-live (TTL) and view count limits.

## Features

- Create text pastes with shareable URLs
- Optional TTL (time-to-live) expiration
- Optional view count limits
- Safe HTML rendering
- RESTful API endpoints
- Health check endpoint

## Running Locally

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon DB PostgreSQL database

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd pastebin-lite
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

Example (replace with your actual connection string):
```
DATABASE_URL=postgresql://neondb_owner:password@ep-blue-butterfly-ahqg3yea-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

4. Initialize the database (first time only):
```bash
node scripts/init-db.js
```

Alternatively, you can run the SQL schema manually:
```bash
psql $DATABASE_URL -f sql/schema.sql
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Persistence Layer

This application uses **Neon DB** (PostgreSQL) for data persistence. Neon provides:

- Serverless PostgreSQL database
- Persistent storage that survives across serverless function invocations
- SQL-based data operations with ACID guarantees
- Efficient querying and indexing
- Works seamlessly with Next.js and Vercel deployments

Pastes are stored in a `pastes` table with the following schema:
- `id` (VARCHAR): Unique paste identifier
- `content` (TEXT): Paste content
- `created_at` (BIGINT): Timestamp in milliseconds
- `ttl_seconds` (INTEGER): Optional time-to-live in seconds
- `max_views` (INTEGER): Optional maximum view count
- `view_count` (INTEGER): Current view count

TTL expiration is handled by checking expiration time on read operations.

## API Endpoints

### Health Check
- `GET /api/healthz` - Returns `{ "ok": true }` if service is healthy

### Create Paste
- `POST /api/pastes`
- Body: `{ "content": "string", "ttl_seconds": 60, "max_views": 5 }`
- Returns: `{ "id": "string", "url": "string" }`

### Get Paste (API)
- `GET /api/pastes/:id`
- Returns: `{ "content": "string", "remaining_views": 4, "expires_at": "ISO string" }`
- Each API fetch counts as a view

### View Paste (HTML)
- `GET /p/:id`
- Returns HTML page with paste content

## Design Decisions

1. **Next.js App Router**: Used for modern React server components and API routes
2. **Neon DB (PostgreSQL)**: Chosen for reliable SQL-based persistence with serverless support, perfect for production deployments
3. **View Counting**: Only API fetches (`GET /api/pastes/:id`) increment view counts. HTML views check constraints but don't increment to match requirements
4. **Test Mode**: Supports `TEST_MODE=1` environment variable and `x-test-now-ms` header for deterministic testing of TTL constraints
5. **Safe Rendering**: HTML content is rendered safely using React's built-in escaping in the `<pre>` tag
6. **Error Handling**: All errors return appropriate HTTP status codes with JSON error messages

## Environment Variables

- `DATABASE_URL`: Neon DB PostgreSQL connection string (required)
- `TEST_MODE`: Set to `1` to enable test mode for deterministic TTL testing

## Deployment

The application can be deployed to Vercel:

1. Connect your repository to Vercel
2. Add the `DATABASE_URL` environment variable in Vercel dashboard with your Neon DB connection string
3. Deploy

The database schema will be automatically initialized on first use. For production, it's recommended to run the schema initialization manually before deploying.
