import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'employee_directory',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Auto-initialize schema on startup
export const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS employees (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(150) NOT NULL UNIQUE,
          role VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(name);
        CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role);
        CREATE INDEX IF NOT EXISTS idx_employees_created_at ON employees(created_at DESC);
      `);
      console.log('✅ PostgreSQL database connected & schema verified.');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Database connection/initialization error:', error.message);
  }
};

export const query = (text, params) => pool.query(text, params);
