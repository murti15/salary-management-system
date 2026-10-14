# Salary Management System — Architecture

## 1. Overview

The application follows a layered architecture with a React frontend, Node.js and Express.js backend, and SQLite relational database.

## 2. System Components

### Frontend
- React-based HR dashboard.
- Employee directory with search, filters, and pagination.
- Employee detail view and salary editing forms.
- Dashboard summaries and error/loading states.

### Backend
- Node.js and Express.js REST API.
- Routes define HTTP endpoints.
- Middleware handles request processing and errors.
- Controllers handle HTTP requests and responses.
- Services implement business rules.
- Repositories execute database queries.

### Database
- SQLite stores employee and salary information.
- Employee records have unique employee IDs and email addresses.
- Indexes support frequently used filters.
- Database constraints prevent invalid salary values and statuses.

## 3. Request Flow

1. The HR Manager performs an action in the React UI.
2. The frontend sends an HTTP request to the Express API.
3. Middleware processes the request.
4. The controller validates input and calls the service.
5. The service applies business rules.
6. The repository reads or updates SQLite.
7. The API returns a JSON response to the frontend.

## 4. Core Data Fields

- Employee ID
- First and last name
- Email
- Department
- Job title
- Country
- Currency
- Annual base salary
- Hire date
- Employment status

## 5. Salary Reporting Rules

Salary summaries will be grouped by currency and relevant dimensions, such as country and department. Values in different currencies will not be added together without an explicit exchange-rate policy.

## 6. Performance Considerations

- Use server-side pagination.
- Limit page size.
- Add indexes to commonly filtered columns.
- Use parameterized SQL queries.
- Avoid loading all 10,000 employees into the browser at once.

## 7. Security and Reliability

- Use synthetic employee data only.
- Keep environment variables and secrets out of Git.
- Validate incoming requests.
- Return consistent API errors without exposing internal stack traces.
- Add authentication before production use.
- Use persistent database storage in deployment.

## 8. Future Improvements

Authentication, role-based access control, audit logging, approval workflows, and payroll integrations can be added in future iterations.