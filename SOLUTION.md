# Feedback Triage Application - Solution Documentation

## Architecture Overview

This application is a full-stack Next.js application that provides AI-powered feedback triage capabilities. The architecture demonstrates clear separation of concerns across three main layers:

### 1. **Data Access Layer**

- **Location**: `lib/db.ts`, PostgreSQL database
- **Responsibility**: Database connection management, schema initialization, and query execution
- **Model**:
  - Core fields: `id`, `text`, `email`, `created_at`
  - Analysis JSONB field storing AI-generated structured data

### 2. **Business Logic Layer**

- **Location**: `app/api/feedback/`, `lib/ai-service.ts`
- **Responsibility**:
  - REST API endpoints for CRUD operations
  - AI analysis integration using OpenAI
  - Request validation and error handling
  - Middleware for logging and correlation IDs

### 3. **Presentation Layer**

- **Location**: `app/`, `components/`
- **Responsibility**:
  - User interface for submitting and viewing feedback
  - Reusable components (Badge, FeedbackList, etc.)
  - State management using React hooks
  - Client-side filtering and pagination
  - Implemented full text search on the feedback history page, trade offs being constant connections to the database while typing and full text search normally being a slow and more compute heavy task, this was compensated for by adding a delay while typing to only start the search when the user has finished typing.

## Technology Stack

### Framework: Next.js 14

- **Rationale**:
  - Built-in API routes for backend functionality
  - Server-side rendering and static generation capabilities
  - Excellent TypeScript support
  - Optimal developer experience with hot reloading
  - Production-ready with built-in optimizations

### Database: PostgreSQL

- **Rationale**:
  - Chosen for relational data model with structured feedback records
  - JSONB support for flexible AI analysis storage
  - ACID compliance ensures data integrity
  - Excellent performance with proper indexing
  - Strong ecosystem and tooling support

### AI Provider: OpenAI

- **Rationale**:
  - Mature API with reliable JSON output
  - Cost-effective (using gpt-3.5-turbo)
  - Good prompt engineering capabilities
  - Alternative was Anthropic, but OpenAI has broader adoption and simpler integration

### Language: TypeScript

- **Rationale**:
  - Strong type safety reduces runtime errors
  - Better IDE support and developer experience
  - Self-documenting code through types
  - Industry standard for production applications

## Data Model

### Schema Design

```sql
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  analysis JSONB
);
```

### Design Decisions

#### Relational vs Non-Relational Database

**Chosen: PostgreSQL (Relational)**

**Rationale**:

1. **Structured Core Data**: Feedback entries have a consistent schema (text, email, created_at)
2. **JSONB for Flexibility**: PostgreSQL's JSONB type provides flexibility for AI analysis while maintaining query capabilities
3. **Query Performance**: Need for server-side filtering (sentiment, tags) benefits from relational indices
4. **Transaction Safety**: ACID properties ensure data consistency

**Trade-offs**:

- Could have used MongoDB for more flexible schema, but would lose query capabilities
- Could have normalized analysis into separate tables, but JSONB provides better performance for read-heavy workloads
- Future extensibility maintained through JSONB for new analysis fields

#### Analysis Storage

**Chosen: JSONB in PostgreSQL**

**Fields**:

- `summary` (string): Brief one-sentence summary
- `sentiment` (enum): positive, neutral, negative
- `tags` (array): 1-5 short nouns
- `priority` (enum): P0 (critical) to P3 (low)
- `nextAction` (string): Recommended action

**Rationale**:

- Single query retrieval of complete feedback record
- GIN index enables efficient filtering by sentiment and tags
- Flexible schema accommodates future AI enhancements
- Maintains referential integrity with core feedback record

## AI Integration

### Provider: OpenAI GPT-3.5 Turbo

### Prompt Engineering

The prompt is designed to:

1. **Return Strict JSON**: System message instructs model to return only valid JSON
2. **Consistent Structure**: Clear field definitions ensure predictable output
3. **Contextual Guidelines**: Priority guidelines help the model make consistent decisions
4. **Safety**: Limits on output tokens prevent verbose or irrelevant responses

### Analysis Pipeline

1. **Input**: Raw feedback text
2. **Cache Check**: Hash text for cache lookup (prevents redundant AI calls)
3. **AI Call**: Send to OpenAI with structured prompt
4. **Parse & Validate**: Extract JSON and validate structure
5. **Store**: Save to database with analysis

### Resilience Strategy

**Implemented: Caching**

**Why Caching?**

- Reduces API costs significantly (repeated feedback patterns)
- Improves response time for similar feedback
- Simpler to implement than retry logic
- Deterministic cache key (MD5 hash of text)

**How it works**:

- In-memory cache with text hash as key
- Cache persists for session lifetime
- Cache hit logged for monitoring
- Future: Could implement Redis for distributed cache

**Alternative (not implemented): Retries with Backoff**

- Would handle transient API failures better
- More complex error handling logic
- Better for high-reliability scenarios

### Production Evolution

**Current**: Synchronous AI analysis within POST request

**Production Recommendation**: Async background job processing

**Architecture**:

1. POST /api/feedback returns immediately with status "pending"
2. Background worker (e.g., Bull queue) processes analysis
3. WebSocket/SSE push update when analysis completes
4. Benefits:
   - Faster API response time
   - Better handling of AI API rate limits
   - Scales independently
   - Fault tolerance (retry failed analyses)

## API Design

### Endpoints

#### POST /api/feedback

- **Input**: `{ text: string, email?: string }`
- **Output**: Complete feedback record with AI analysis
- **Validation**: Zod schema validation
- **Errors**: 400 for invalid input, 500 for server errors

#### GET /api/feedback

- **Query Parameters**:
  - `sentiment`: Filter by sentiment
  - `tag`: Filter by tag
  - `page`: Pagination page (default: 1)
  - `pageSize`: Items per page (default: 10, max: 100)
- **Output**: Paginated list with metadata
- **Filtering**: SQL WHERE clauses on JSONB fields

#### GET /api/feedback/:id

- **Output**: Single feedback record
- **Errors**: 404 if not found

### Middleware

- **Logging**: Request ID, method, path, status, latency
- **Error Handling**: Structured error responses
- **Validation**: Type-safe input validation with Zod

## Component Architecture

### Reusable Components

**Badge Component** (`components/Badge.tsx`)

- Used for sentiments, priorities, and tags
- Color-coded variants based on semantic meaning
- Demonstrates component reusability and DRY principles

### State Management

- React hooks for local state
- Client-side filtering and pagination
- Modal state for detail views

## Testing Strategy

### Unit Tests

**Backend Tests** (`__tests__/`)

1. **AI Service Tests** (`ai-service.test.ts`)
   - Mock mode testing for deterministic outputs
   - Cache behavior verification
   - Input validation testing
2. **API Route Tests** (`api.feedback.test.ts`)
   - Input validation (happy path and error cases)
   - Pagination logic
   - Filter functionality
   - Error handling

**Frontend Tests** (`Badge.test.tsx`)

- Component rendering
- Variant rendering
- Custom styling

### Test Coverage

- AI service: Core analysis logic, validation, caching
- API routes: Input validation, error handling, database operations
- Components: UI rendering, accessibility

## Runbook - Production Debugging

### AI Rate Limit or Timeout Errors

**Symptoms**:

- High error rate from AI service
- Requests timing out
- API returning 500 errors

**Debugging Steps**:

1. Check logs for `[requestId]` to trace failed requests
2. Look for OpenAI API error messages in structured logs
3. Monitor request rate and compare against API limits
4. Check cache hit rate - low cache hits may indicate unique feedback patterns

**Resolution**:

- Implement exponential backoff retry logic
- Add request queuing for rate limit compliance
- Consider moving to async processing with background workers
- Upgrade to higher OpenAI tier if consistent volume

### Database Connection Exhaustion or Connectivity Issues

**Symptoms**:

- Database query timeouts
- Connection pool errors
- Slow API responses

**Debugging Steps**:

1. Check PostgreSQL logs for connection errors
2. Monitor connection pool metrics (active, idle connections)
3. Verify database is accessible (network, credentials)
4. Review slow query logs for inefficient queries

**Resolution**:

- Increase connection pool size in `lib/db.ts`
- Add connection pooling middleware (PgBouncer)
- Optimize slow queries (check indexes are being used)
- Implement connection retry logic
- Scale PostgreSQL instance if connection limit is too low
- Check for connection leaks (ensure `client.release()` is called)

### General Troubleshooting

**Request Correlation**:

- All logs include `[requestId]` for tracing requests across layers
- Check logs for timing information to identify slow operations

**Structured Logging**:

- Timestamp, request ID, method, path, status, duration
- Avoid logging sensitive data (PII, full prompts)

**Health Checks**:

- Monitor: `/api/health` endpoint (if added)
- Database connection health
- AI service availability
- Response time SLAs

## Deployment Considerations

### Environment Variables

See `.env.example` for required configuration:

- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API authentication
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode

### Database Migration

Run `npm run migrate` (if added) or execute `lib/db.ts` initialization on first deploy.

### Performance

- Consider Redis for distributed caching
- Implement CDN for static assets
- Use database read replicas for GET endpoints
- Horizontal scaling with load balancer

## Future Enhancements

1. **Full-text Search**: Implement PostgreSQL text search or Elasticsearch
2. **User Authentication**: Add user management and role-based access
3. **Export Functionality**: CSV/JSON export of feedback
4. **Analytics Dashboard**: Aggregate insights across feedback
5. **Real-time Updates**: WebSocket integration for live updates
6. **Feedback Replies**: Allow team to respond to feedback
7. **Integration Webhooks**: Notify external systems of high-priority issues

## Conclusion

This application demonstrates production-ready patterns:

- Clear separation of concerns
- Type-safe development with TypeScript
- Comprehensive error handling
- Testable architecture
- Scalable component design
- Performance optimizations (caching, indexing)
- Production-grade logging and monitoring

The modular design allows for independent evolution of each layer without affecting others, making it maintainable and extensible for future requirements.
