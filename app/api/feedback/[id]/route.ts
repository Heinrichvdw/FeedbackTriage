import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

// Request ID for logging
let requestIdCounter = 0;

function withLogging(handler: (req: NextRequest, context: { params: Promise<{ id: string }> }) => Promise<NextResponse>) {
  return async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const requestId = `req-${++requestIdCounter}`;
    const startTime = Date.now();
    const method = req.method;
    const path = req.nextUrl.pathname;

    try {
      console.log(`[${requestId}] ${method} ${path}`);
      const response = await handler(req, context);
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

async function handleGET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = parseInt(params.id);

  if (isNaN(id) || id < 1) {
    return NextResponse.json(
      { error: 'Invalid feedback ID' },
      { status: 400 }
    );
  }

  try {
    const pool = getPool();
    const result = await pool.query(
      'SELECT id, text, email, created_at, analysis FROM feedback WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

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
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

export const GET = withLogging(handleGET);

