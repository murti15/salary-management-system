# Salary Management System — Requirements

## 1. Goal

Build a web-based application that enables ACME's HR Manager to manage salary records for 10,000 employees across multiple countries and understand the organization's salary distribution.

## 2. User Persona

**HR Manager:** Needs to view, search, filter, and update employee salary information and review salary summaries.

## 3. Scope and Features

- Employee directory containing 10,000 synthetic employee records.
- Employee details: ID, name, email, department, job title, country, currency, annual base salary, hire date, and employment status.
- Search, filters, and server-side pagination.
- Employee detail view and salary updates with input validation.
- Dashboard summaries for employee counts and salary distribution by country, department, and currency.
- Node.js and Express.js backend with a React frontend.
- Relational database and deterministic seed script.
- Automated tests for core functionality.
- Documentation, incremental Git commits, deployment, and demo video.

## 4. Deliberately Out of Scope

- Payroll processing, tax calculations, payslips, and bank transfers because these require country-specific rules.
- Benefits, stock compensation, and complex compensation approval workflows.
- AI chatbot and natural-language salary questions.
- Real employee information.
- Currency conversion. Salaries in different currencies will not be combined into misleading totals.

## 5. Technical Approach

- Frontend: React
- Backend: Node.js and Express.js
- Database: SQLite
- Testing: Node.js test runner and API tests

## 6. Acceptance Criteria

- The application can be installed and run using documented instructions.
- The seed script generates exactly 10,000 synthetic employees.
- Employee records can be searched, filtered, and paginated.
- Salary updates validate the amount, currency, and employee existence.
- Dashboard summaries group salaries by currency.
- Automated tests cover core API behavior and validation.
- The repository contains setup instructions and architecture documentation.
- The application is deployed and a demo video is available before submission.

## 7. Assumptions

- Salary means annual base salary.
- All seeded data is fictional.
- The initial user persona is an HR Manager.
- Production deployment will require authentication and persistent database storage.