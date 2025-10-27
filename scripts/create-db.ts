import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
config();

async function createDatabase() {
  // Parse the DATABASE_URL to get connection details
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL not set');
  }

  // Extract database name from URL
  const url = new URL(databaseUrl);
  const dbName = url.pathname.slice(1); // Remove leading '/'
  
  // Connect to postgres database to create the new database
  const adminUrl = databaseUrl.replace(`/${dbName}`, '/postgres');
  
  console.log('Connecting to PostgreSQL...');
  const pool = new Pool({ connectionString: adminUrl });
  
  try {
    // Check if database exists
    const checkResult = await pool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );
    
    if (checkResult.rows.length > 0) {
      console.log(`✅ Database "${dbName}" already exists`);
    } else {
      console.log(`Creating database "${dbName}"...`);
      await pool.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database "${dbName}" created successfully`);
    }
  } catch (error) {
    console.error('Failed to create database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

async function main() {
  try {
    await createDatabase();
    console.log('\n✅ Setup complete! Now run: npm run db:init');
  } catch (error) {
    console.error('❌ Failed to create database:', error);
    process.exit(1);
  }
}

main();

