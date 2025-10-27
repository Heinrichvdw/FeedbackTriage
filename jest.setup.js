import '@testing-library/jest-dom'

// Set test environment variables before modules load
process.env.OPENAI_API_KEY = '';
process.env.DATABASE_URL = '';
process.env.NODE_ENV = 'test';

