# Pastebin-Lite

A simple paste sharing app - basically like pastebin but simpler. You can paste some text, get a link to share it, and optionally set it to expire after a certain time or number of views.

## What it does

- Create text pastes and get a shareable link
- Set a time limit (TTL) - paste expires after X seconds
- Set a view limit - paste disappears after X people view it
- Simple web interface to create and view pastes
- REST API if you want to integrate it with something

## Getting Started

You'll need Node.js 18+ and a Neon DB account (free tier works fine).

### Installation

First, clone the repo and install dependencies:

```bash
git clone <repository-url>
cd pastebin-lite
npm install
```

### Database Setup

Create a `.env.local` file in the root directory with your Neon DB connection string:

```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

For example:
```
DATABASE_URL=postgresql://neondb_owner:password@ep-blue-butterfly-ahqg3yea-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

Then initialize the database (only need to do this once):

```bash
node scripts/init-db.js
```

Or if you prefer using psql directly:
```bash
psql $DATABASE_URL -f sql/schema.sql
```

### Running the app

```bash
npm run dev
```

Open http://localhost:3000 in your browser and you're good to go!

### Building for production

```bash
npm run build
npm start
```

## Database

I'm using Neon DB (PostgreSQL) for storing the pastes. It's serverless and works great with Next.js/Vercel. The schema is pretty straightforward - just a `pastes` table with columns for the content, timestamps, and view counts.

The table structure:
- `id` - unique identifier for each paste
- `content` - the actual text content
- `created_at` - when it was created (milliseconds timestamp)
- `ttl_seconds` - optional expiration time
- `max_views` - optional maximum number of views
- `view_count` - tracks how many times it's been viewed

Expired pastes are checked on read, so they'll just return 404 once they hit their limits.

## API Endpoints

**Health check:**
- `GET /api/healthz` - Returns `{ "ok": true }` if everything's working

**Create a paste:**
- `POST /api/pastes`
- Body: `{ "content": "your text here", "ttl_seconds": 60, "max_views": 5 }`
- Returns: `{ "id": "abc123", "url": "https://your-app.com/p/abc123" }`

**Get paste via API:**
- `GET /api/pastes/:id`
- Returns: `{ "content": "...", "remaining_views": 4, "expires_at": "2026-01-01T00:00:00.000Z" }`
- This increments the view count

**View paste in browser:**
- `GET /p/:id`
- Just opens the paste in your browser (also counts as a view)

## Tech Choices

- **Next.js App Router** - Using the latest Next.js setup with server components and API routes. Keeps things simple and modern.

- **Neon DB** - PostgreSQL database that works well with serverless. No need to manage a database server, and it scales nicely.

- **View Counting** - Both the API endpoint and the HTML page increment the view counter. Makes sense from a user perspective - if someone opens the link, that should count.

- **Test Mode** - There's a `TEST_MODE=1` env variable and an `x-test-now-ms` header you can use for testing TTL expiration. Useful for automated tests.

- **Error Handling** - Tries to return sensible HTTP status codes (400 for bad input, 404 for missing/expired pastes, 500 for server errors).

## Environment Variables

- `DATABASE_URL` - Your Neon DB connection string (required)
- `TEST_MODE` - Set to `1` to enable test mode for TTL testing (optional)

## Deploying to Vercel

1. Connect your GitHub repo to Vercel
2. Add the `DATABASE_URL` environment variable in the Vercel dashboard
3. Click deploy

The database tables will be created automatically on first use, though you might want to run the init script manually before deploying to production just to be safe.

That's pretty much it! Let me know if you run into any issues.
