import { config } from 'dotenv';
import { initDatabase, closeDatabase } from '../lib/db';

// Load environment variables
config();

async function main() {
  console.log('Initializing database...');
  try {
    await initDatabase();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

main();

