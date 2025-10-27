import { NextRequest, NextResponse } from 'next/server';
import { getPool, initDatabase } from '@/lib/db';
import { aiService } from '@/lib/ai-service';
import { z } from 'zod';

// Request ID for logging
let requestIdCounter = 0;

// Middleware wrapper for logging and error handling
function withLogging(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const requestId = `req-${++requestIdCounter}`;
    const startTime = Date.now();
    const method = req.method;
    const path = req.nextUrl.pathname;

    try {
      console.log(`[${requestId}] ${method} ${path}`);
      const response = await handler(req);
      const duration = Date.now() - startTime;
      console.log(`[${requestId}] ${method} ${path} - ${response.status} - ${duration}ms`);
      response.headers.set('X-Request-ID', requestId);
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[${requestId}] ${method} ${path} - ERROR - ${duration}ms`, error);
      
      const errorResponse = NextResponse.json(
        {
          error: 'Internal server error',
          requestId,
        },
        { status: 500 }
      );
      errorResponse.headers.set('X-Request-ID', requestId);
      return errorResponse;
    }
  };
}

// POST /api/feedback
async function handlePOST(req: NextRequest) {
  const body = await req.json();

  // Validate input with Zod
  const schema = z.object({
    text: z.string().min(1, 'Text is required').max(10000, 'Text is too long'),
    email: z.preprocess(
      (val) => val === '' || val === null || val === undefined ? undefined : val,
      z.string().email('Invalid email').optional()
    ),
  });

  const validationResult = schema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: 'Invalid input',
        details: validationResult.error.errors,
      },
      { status: 400 }
    );
  }

  const { text, email } = validationResult.data;

  try {
    // Generate AI analysis
    const analysis = await aiService.analyzeFeedback(text);

    // Store in database
    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO feedback (text, email, analysis)
       VALUES ($1, $2, $3)
       RETURNING id, text, email, created_at, analysis`,
      [text, email || null, JSON.stringify(analysis)]
    );

    const feedback = result.rows[0];

    return NextResponse.json({
      id: feedback.id,
      text: feedback.text,
      email: feedback.email,
      createdAt: feedback.created_at,
      analysis: feedback.analysis,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        error: 'Failed to save feedback',
      },
      { status: 500 }
    );
  }
}

// GET /api/feedback
async function handleGET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get('search');
  const sentiment = searchParams.get('sentiment');
  const tag = searchParams.get('tag');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  if (page < 1) {
    return NextResponse.json({ error: 'Page must be >= 1' }, { status: 400 });
  }
  if (pageSize < 1 || pageSize > 100) {
    return NextResponse.json({ error: 'Page size must be between 1 and 100' }, { status: 400 });
  }

  try {
    const pool = getPool();
    const offset = (page - 1) * pageSize;

    let query = 'SELECT id, text, email, created_at, analysis FROM feedback';
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      // Search in both text and summary (analysis->>'summary')
      conditions.push(`(
        text ILIKE $${paramIndex} OR 
        analysis->>'summary' ILIKE $${paramIndex}
      )`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (sentiment) {
      conditions.push(`analysis->>'sentiment' = $${paramIndex}`);
      params.push(sentiment);
      paramIndex++;
    }

    if (tag) {
      conditions.push(`analysis->'tags' @> $${paramIndex}`);
      params.push(JSON.stringify([tag]));
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(pageSize, offset);

    const result = await pool.query(query, params);

    // Get total count with same conditions
    let countQuery = 'SELECT COUNT(*) as total FROM feedback';
    const countParams: any[] = [];
    let countParamIndex = 1;
    const countConditions: string[] = [];

    if (search) {
      countConditions.push(`(
        text ILIKE $${countParamIndex} OR 
        analysis->>'summary' ILIKE $${countParamIndex}
      )`);
      countParams.push(`%${search}%`);
      countParamIndex++;
    }

    if (sentiment) {
      countConditions.push(`analysis->>'sentiment' = $${countParamIndex}`);
      countParams.push(sentiment);
      countParamIndex++;
    }

    if (tag) {
      countConditions.push(`analysis->'tags' @> $${countParamIndex}`);
      countParams.push(JSON.stringify([tag]));
      countParamIndex++;
    }

    if (countConditions.length > 0) {
      countQuery += ' WHERE ' + countConditions.join(' AND ');
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    return NextResponse.json({
      data: result.rows.map(row => ({
        id: row.id,
        text: row.text,
        email: row.email,
        createdAt: row.created_at,
        analysis: row.analysis,
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch feedback',
      },
      { status: 500 }
    );
  }
}

// Export with middleware
export const POST = withLogging(handlePOST);
export const GET = withLogging(handleGET);

