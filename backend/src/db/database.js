const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

const configuredPath =
    process.env.DATABASE_PATH || './data/salary-management.sqlite';

const dbPath = path.resolve(__dirname, '../../../', configuredPath);

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_code TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    department TEXT NOT NULL,
    job_title TEXT NOT NULL,
    country TEXT NOT NULL,
    currency TEXT NOT NULL,
    annual_salary REAL NOT NULL CHECK (annual_salary >= 0),
    hire_date TEXT NOT NULL,
    status TEXT NOT NULL
      CHECK (status IN ('active', 'inactive', 'on_leave')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_employees_country
    ON employees(country);

  CREATE INDEX IF NOT EXISTS idx_employees_department
    ON employees(department);

  CREATE INDEX IF NOT EXISTS idx_employees_status
    ON employees(status);

  CREATE INDEX IF NOT EXISTS idx_employees_last_name
    ON employees(last_name);
`);

module.exports = db;