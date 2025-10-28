# Feedback Triage Application

AI-powered feedback management system built with Next.js, TypeScript, PostgreSQL, and OpenAI.

## Features

- 🤖 **AI-Powered Analysis**: Automatically analyzes feedback for sentiment, priority, tags, and next actions
- 📊 **Dashboard**: View all feedback with filtering and pagination
- 🎨 **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- 🔍 **Smart Filtering**: Filter feedback by sentiment and tags
- 📝 **Detailed Views**: View complete feedback with AI analysis
- ✅ **Type-Safe**: Full TypeScript support throughout
- 🧪 **Tested**: Unit tests for critical components

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **AI**: OpenAI GPT-3.5 Turbo (or mock mode)
- **Styling**: Tailwind CSS
- **Testing**: Jest, React Testing Library

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key (optional — mock mode available)

## Setup

1. **Install dependencies**:

   ```powershell
   npm install
   ```

2. **Configure environment**:

   **Windows PowerShell:**

   ```powershell
   Copy-Item .env.example .env
   ```

   **Linux / macOS:**

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and set:

   - `DATABASE_URL`: Your PostgreSQL connection string
   - `OPENAI_API_KEY`: Your OpenAI API key (or leave empty for mock mode)
   - `PORT`: Server port (default: 3000)

3. **Initialize database**:

   ```powershell
   npm run db:init
   ```

   This will create the necessary tables and indexes in your PostgreSQL database.

4. **Start development server**:

   ```powershell
   npm run dev
   ```

5. **Open your browser**:
   Navigate to http://localhost:3000 (or the port set in `PORT`).

## Usage

### Submitting Feedback

1. Click "Submit Feedback" in the navigation
2. Enter optional email
3. Type your feedback
4. Click "Submit Feedback"
5. The AI will analyze your feedback and store it

### Viewing Feedback

1. Click "View Feedback" in the navigation
2. Use filters to search by sentiment or tag
3. Click "View Details" on any feedback to see full analysis
4. Use pagination to navigate through results

## Running Tests

```powershell
# Run all tests
npm test

# Run tests in watch mode (if configured)
npm run test:watch

# Run tests with coverage (if supported)
npm test -- --coverage
```

Note: The project uses Jest (see `jest.config.js`). If tests rely on a DB connection, ensure `.env` and the DB are available or run tests using the project's mock configuration.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── feedback/      # Feedback endpoints
│   │   └── init/          # Database initialization
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/             # React components
├── lib/                   # Shared utilities
├── __tests__/             # Test files
├── scripts/               # Utility scripts (db init/create)
└── README.md              # This file
```

## Architecture

The application follows a three-tier architecture:

1. **Data Layer**: PostgreSQL database with JSONB for flexible AI analysis storage
2. **Business Layer**: Next.js API routes handling CRUD operations and AI integration
3. **Presentation Layer**: React components for user interaction

See `SOLUTION.md` for detailed architecture documentation.

## Development

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/feedbacktriage
OPENAI_API_KEY=sk-your-api-key-here
PORT=3000
NODE_ENV=development
```

### Mock Mode

If you don't have an OpenAI API key, the application will run in mock mode, providing deterministic analysis outputs based on the feedback text. This is useful for local development and CI tests.

### Database Schema

```sql
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  analysis JSONB
);
```

## Production Deployment

1. Set up PostgreSQL database (e.g., AWS RDS, Supabase, etc.)
2. Configure environment variables
3. Run database migrations / `npm run db:init`
4. Build the application: `npm run build`
5. Start the production server: `npm start`

### Considerations

- Use a managed PostgreSQL service
- Set up proper monitoring and logging
- Implement rate limiting
- Use environment-specific configuration
- Consider using a caching layer (Redis)
- Set up CI/CD pipeline

## Testing

The application includes unit tests for:

- AI service (mock mode)
- API routes (input validation, error handling)
- Reusable components (Badge component)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

ISC

## Support

For issues or questions, please open an issue on the repository.

---

Changelog:

- 2025-10-28: Clarified Windows/PowerShell instructions and updated setup/test guidance to match `SETUP.md`.
