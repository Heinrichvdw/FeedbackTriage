# Setup and Installation Guide

## Quick Start

This guide will help you set up and run the Feedback Triage application.

## Prerequisites

- **Node.js** 18 or higher
- **npm** (comes with Node.js)
- **PostgreSQL** database (local or remote)

## Step-by-Step Setup

### 1. Clone and Install

```bash
# The project is already set up in this directory
cd FeedbackTriage

# Install dependencies
npm install
```

### 2. Set Up Environment Variables

**Windows PowerShell:**
```powershell
Copy-Item .env.example .env
```

**Linux/Mac:**
```bash
cp .env.example .env
```

Required environment variables:

```env
# Database Connection
DATABASE_URL=postgresql://username:password@localhost:5432/feedbacktriage

# AI Provider (optional - runs in mock mode without key)
OPENAI_API_KEY=sk-your-api-key-here

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Set Up PostgreSQL Database

#### Option A: Local PostgreSQL

```bash
# Create a new database
createdb feedbacktriage

# Or use psql
psql -U postgres
CREATE DATABASE feedbacktriage;
```

#### Option B: Use a Remote Database

Use services like:
- Supabase (free tier available)
- AWS RDS
- Heroku Postgres
- Any PostgreSQL hosting service

Set the `DATABASE_URL` accordingly.

### 4. Initialize Database

```bash
# Run the database initialization script
npm run db:init
```

This will create:
- `feedback` table
- Indexes for performance
- JSONB indexes for querying

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api

### 6. Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Submit Feedback"
3. Enter some feedback text
4. Submit and view the AI analysis
5. Navigate to "View Feedback" to see all entries

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- ai-service.test.ts
```

## Project Structure

```
FeedbackTriage/
├── app/                 # Next.js app directory
│   ├── api/           # Backend API routes
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── components/         # React components
├── lib/               # Shared utilities
│   ├── ai-service.ts  # AI analysis service
│   ├── db.ts          # Database connection
│   └── types.ts       # TypeScript types
├── __tests__/         # Test files
├── scripts/           # Utility scripts
└── [config files]     # Configuration files
```

## Common Issues

### PostgreSQL Connection Errors

**Error**: `ECONNREFUSED` or `password authentication failed`

**Solution**:
1. Verify PostgreSQL is running: `pg_isready`
2. Check connection string format in `.env`
3. Ensure user has proper permissions
4. Try: `psql postgresql://user:password@localhost:5432/feedbacktriage`

### OpenAI API Errors

**Note**: The app runs in mock mode by default without an API key.

To use real AI analysis:
1. Get an OpenAI API key from https://platform.openai.com/api-keys
2. Add to `.env`: `OPENAI_API_KEY=sk-your-key`
3. Restart the server

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
1. Use a different port in `.env`: `PORT=3001`
2. Or stop the process using port 3000
3. On Windows: `netstat -ano | findstr :3000` then kill the process

### Database Not Initialized

**Error**: `relation "feedback" does not exist`

**Solution**:
```bash
npm run db:init
```

## Development Workflow

### Making Changes

1. **Backend Changes**: Edit files in `app/api/` or `lib/`
2. **Frontend Changes**: Edit files in `components/` or `app/`
3. **Database Changes**: Modify `lib/db.ts` and run `npm run db:init`

### Testing Your Changes

```bash
# Run tests to ensure nothing broke
npm test

# Start dev server to see changes
npm run dev
```

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Configuration Options

### Database Options

- **Local PostgreSQL**: Fast development, requires local setup
- **Supabase**: Easy setup, free tier, cloud-hosted
- **Docker**: `docker run -e POSTGRES_PASSWORD=mypass postgres`

### AI Provider

- **OpenAI (Recommended)**: GPT-3.5-turbo, cost-effective
- **Mock Mode**: No API key needed, deterministic responses

### Caching

- Currently uses in-memory cache
- Production: Consider Redis for distributed caching

## Next Steps

1. **Set up CI/CD** for automated testing
2. **Add monitoring** (e.g., Sentry)
3. **Implement authentication** if needed
4. **Deploy to production** (Vercel, AWS, etc.)

## Getting Help

- Check `SOLUTION.md` for architecture documentation
- Review `README.md` for general information
- Open an issue for bugs or questions

