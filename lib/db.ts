import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }
  return pool;
}

export async function initDatabase() {
  console.log('Attempting to connect to database...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
  
  const pool = getPool();
  
  try {
    const client = await pool.connect();
    console.log('Database connection successful!');
    // Create feedback table
    await client.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        analysis JSONB
      )
    `);
    
    // Create index for created_at for better query performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC)
    `);
    
    // Create GIN index for JSONB analysis field for better search performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_feedback_analysis ON feedback USING GIN(analysis)
    `);
    
    console.log('Database initialized successfully');
    client.release();
  } catch (error) {
    console.error('Database connection or initialization failed:', error);
    throw error;
  }
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

