const db = require('../db/database');

function toEmployee(row) {
    if (!row) return null;

    return {
        id: row.id,
        employeeCode: row.employee_code,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        department: row.department,
        jobTitle: row.job_title,
        country: row.country,
        currency: row.currency,
        annualSalary: row.annual_salary,
        hireDate: row.hire_date,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

function list({
    page,
    limit,
    search,
    country,
    department,
    status
}) {
    const where = [];
    const params = {};

    if (search) {
        where.push(`(
      first_name LIKE @search
      OR last_name LIKE @search
      OR email LIKE @search
      OR employee_code LIKE @search
    )`);
        params.search = `%${search}%`;
    }

    if (country) {
        where.push('country = @country');
        params.country = country;
    }

    if (department) {
        where.push('department = @department');
        params.department = department;
    }

    if (status) {
        where.push('status = @status');
        params.status = status;
    }

    const clause = where.length
        ? `WHERE ${where.join(' AND ')}`
        : '';

    const total = db.prepare(
        `SELECT COUNT(*) AS count FROM employees ${clause}`
    ).get(params).count;

    const rows = db.prepare(`
    SELECT * FROM employees
    ${clause}
    ORDER BY last_name, first_name
    LIMIT @limit OFFSET @offset
  `).all({
        ...params,
        limit,
        offset: (page - 1) * limit
    });

    return {
        items: rows.map(toEmployee),
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    };
}

function findById(id) {
    const row = db.prepare(
        'SELECT * FROM employees WHERE id = ?'
    ).get(id);

    return toEmployee(row);
}

function create(employee) {
    const statement = db.prepare(`
    INSERT INTO employees (
      employee_code,
      first_name,
      last_name,
      email,
      department,
      job_title,
      country,
      currency,
      annual_salary,
      hire_date,
      status
    )
    VALUES (
      @employeeCode,
      @firstName,
      @lastName,
      @email,
      @department,
      @jobTitle,
      @country,
      @currency,
      @annualSalary,
      @hireDate,
      @status
    )
  `);

    const result = statement.run(employee);

    return findById(result.lastInsertRowid);
}

function updateSalary(id, annualSalary, currency) {
    const result = db.prepare(`
    UPDATE employees
    SET annual_salary = ?,
        currency = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(annualSalary, currency, id);

    return result.changes ? findById(id) : null;
}

function dashboardSummary() {
    const employeeCount = db.prepare(`
    SELECT COUNT(*) AS count FROM employees
  `).get().count;

    const byCurrency = db.prepare(`
    SELECT
      currency,
      COUNT(*) AS employeeCount,
      ROUND(AVG(annual_salary), 2) AS averageSalary,
      ROUND(SUM(annual_salary), 2) AS totalAnnualSalary
    FROM employees
    GROUP BY currency
    ORDER BY currency
  `).all();

    const byCountry = db.prepare(`
    SELECT
      country,
      currency,
      COUNT(*) AS employeeCount,
      ROUND(AVG(annual_salary), 2) AS averageSalary,
      ROUND(SUM(annual_salary), 2) AS totalAnnualSalary
    FROM employees
    GROUP BY country, currency
    ORDER BY country, currency
  `).all();

    const byDepartment = db.prepare(`
    SELECT
      department,
      currency,
      COUNT(*) AS employeeCount,
      ROUND(AVG(annual_salary), 2) AS averageSalary,
      ROUND(SUM(annual_salary), 2) AS totalAnnualSalary
    FROM employees
    GROUP BY department, currency
    ORDER BY department, currency
  `).all();

    return {
        employeeCount,
        byCurrency,
        byCountry,
        byDepartment
    };
}

module.exports = {
    list,
    findById,
    create,
    updateSalary,
    dashboardSummary
};