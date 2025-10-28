# Setup and Installation Guide

## Quick Start

This guide will help you set up and run the Feedback Triage application.

## Prerequisites

- Node.js 18 or higher (LTS recommended)
- npm (comes with Node.js)
- PostgreSQL database (local or remote)

> Note: On Windows it's often easiest to perform database work using WSL2 or a dedicated Postgres client, but the instructions below work in native PowerShell too.

## Step-by-Step Setup

### 1. Clone and Install

```powershell
# The project is already set up in this directory
Set-Location -Path FeedbackTriage

# Install dependencies
npm install
```

### 2. Set Up Environment Variables

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**Linux / macOS:**

```bash
cp .env.example .env
```

Required environment variables (example):

```env
# Database Connection
DATABASE_URL=postgresql://username:password@localhost:5432/feedbacktriage

# AI Provider (optional - app runs in mock mode without a key)
OPENAI_API_KEY=sk-your-api-key-here

# Server Configuration
PORT=3000
NODE_ENV=development
```

Tip: If you want to run the app on a different port, update `PORT` in `.env` and restart the dev server.

### 3. Set Up PostgreSQL Database

#### Option A: Local PostgreSQL (native)

```powershell
# Create a new database (PowerShell)
# Using the createdb utility if available
createdb feedbacktriage

# Or using psql interactive shell
psql -U postgres
# then inside psql:
# CREATE DATABASE feedbacktriage;
```

If you're using Windows without `createdb`/`psql` in PATH, consider using the PostgreSQL installer GUI or WSL.

#### Option B: Use a Remote Database

Use services like:

- Supabase (free tier available)
- AWS RDS
- Heroku Postgres
- Any PostgreSQL hosting service

Set the `DATABASE_URL` accordingly in your `.env` file.

### 4. Initialize Database

```powershell
# Run the database initialization script provided by the project
npm run db:init
```

This will create the `feedback` table and appropriate indexes (including JSONB indexes used by queries).

### 5. Start the Development Server

```powershell
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- API: http://localhost:3000/api

If `PORT` is changed in `.env`, use that port instead.

### 6. Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Submit Feedback"
3. Enter feedback text
4. Submit and view the AI analysis
5. Navigate to "View Feedback" to see all entries

## Running Tests

```powershell
# Run all tests
npm test

# Run tests in watch mode (if configured)
npm run test:watch

# Run a specific test file
npm test -- ai-service.test.ts
```

Note: The project uses Jest for unit tests (see `jest.config.js`). If tests fail locally, ensure the `.env` and DB are set up or see the mock-mode notes below.

## Project Structure

```
FeedbackTriage/
├── app/                 # Next.js app directory (app router)
│   ├── api/             # Backend API routes
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # React components
├── lib/                 # Shared utilities
│   ├── ai-service.ts    # AI analysis service
│   ├── db.ts            # Database connection
│   └── types.ts         # TypeScript types
├── __tests__/           # Test files
├── scripts/             # Utility scripts (db init/create)
└── [config files]       # Configuration files
```

## Common Issues

### PostgreSQL Connection Errors

**Error**: `ECONNREFUSED` or `password authentication failed`

**Solution**:

1. Verify PostgreSQL is running: `pg_isready` (if available)
2. Check connection string format in `.env`
3. Ensure the user has proper permissions
4. Try connecting directly with psql:

```powershell
psql postgresql://user:password@localhost:5432/feedbacktriage
```

### OpenAI API Errors

The app runs in mock mode by default if no `OPENAI_API_KEY` is supplied. To use real AI analysis:

1. Get an OpenAI API key from https://platform.openai.com/api-keys
2. Add to `.env`: `OPENAI_API_KEY=sk-your-key`
3. Restart the server

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:

1. Use a different port in `.env`: `PORT=3001`
2. Or stop the process using the port
3. On Windows: `netstat -ano | findstr :3000` then kill the PID using Task Manager or `Stop-Process -Id <pid>` in PowerShell

### Database Not Initialized

**Error**: `relation "feedback" does not exist`

**Solution**:

```powershell
npm run db:init
```

## Development Workflow

### Making Changes

- Backend Changes: edit files in `app/api/` or `lib/`
- Frontend Changes: edit files in `components/` or `app/`
- Database Changes: modify `lib/db.ts` and run `npm run db:init`

### Testing Your Changes

```powershell
# Run tests to ensure nothing broke
npm test

# Start dev server to see changes
npm run dev
```

### Building for Production

```powershell
# Build the application
npm run build

# Start production server
npm start
```

## Configuration Options

### Database Options

- Local PostgreSQL: fast development, requires local setup
- Supabase: easy setup, free tier, cloud-hosted
- Docker: `docker run -e POSTGRES_PASSWORD=mypass -p 5432:5432 postgres`

### AI Provider

- OpenAI (recommended): GPT-3.5-turbo or newer
- Mock Mode: no API key required; deterministic responses useful for tests and demos

## Caching

- Currently uses in-memory cache for small-scale development
- For production, consider Redis for distributed caching

## Next Steps

1. Set up CI/CD for automated testing
2. Add monitoring (e.g., Sentry)
3. Implement authentication if needed
4. Deploy to production (Vercel, AWS, etc.)

## Getting Help

- Check `SOLUTION.md` for architecture documentation
- Review `README.md` for general information
- Open an issue for bugs or questions

---

Changelog:

- 2025-10-28: Clarified Windows/PowerShell instructions, added changelog line and minor wording updates.
