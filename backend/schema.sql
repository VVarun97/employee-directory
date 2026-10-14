-- Database Creation (if not already created)
-- CREATE DATABASE employee_directory;

-- Connect to employee_directory database
-- \c employee_directory;

-- Drop table if exists (optional for reset)
-- DROP TABLE IF EXISTS employees;

-- Create Employees Table matching requirements:
-- id (Primary Key)
-- name (VARCHAR)
-- email (VARCHAR)
-- role (VARCHAR)
-- created_at (TIMESTAMP)
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast search by name, email, and role
CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(name);
CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role);
CREATE INDEX IF NOT EXISTS idx_employees_created_at ON employees(created_at DESC);
