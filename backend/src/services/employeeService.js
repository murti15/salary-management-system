const repository = require('../repositories/employeeRepository');

const { HttpError } = require('../utils/httpError');

function listEmployees(query) {
    const page = Number.parseInt(query.page || '1', 10);
    const limit = Number.parseInt(query.limit || '20', 10);

    if (!Number.isInteger(page) || page < 1) {
        throw new HttpError(400, 'page must be a positive integer');
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw new HttpError(
            400,
            'limit must be between 1 and 100'
        );
    }

    const status = query.status || undefined;

    if (
        status &&
        !['active', 'inactive', 'on_leave'].includes(status)
    ) {
        throw new HttpError(
            400,
            'status must be active, inactive, or on_leave'
        );
    }

    return repository.list({
        page,
        limit,
        search: query.search?.trim() || undefined,
        country: query.country?.trim() || undefined,
        department: query.department?.trim() || undefined,
        status
    });
}

function getEmployee(id) {
    if (!Number.isInteger(id) || id < 1) {
        throw new HttpError(400, 'Invalid employee ID');
    }

    const employee = repository.findById(id);

    if (!employee) {
        throw new HttpError(404, 'Employee not found');
    }

    return employee;
}

function createEmployee(input) {
    try {
        return repository.create({
            employeeCode:
                `EMP-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email.toLowerCase(),
            department: input.department,
            jobTitle: input.jobTitle,
            country: input.country,
            currency: input.currency,
            annualSalary: input.annualSalary,
            hireDate: input.hireDate,
            status: input.status
        });
    } catch (err) {
        if (String(err.code).includes('CONSTRAINT')) {
            throw new HttpError(409, 'Employee email or code already exists');
        }

        throw err;
    }
}

function updateSalary(id, input) {
    if (!Number.isInteger(id) || id < 1) {
        throw new HttpError(400, 'Invalid employee ID');
    }

    const employee = repository.updateSalary(
        id,
        input.annualSalary,
        input.currency
    );

    if (!employee) {
        throw new HttpError(404, 'Employee not found');
    }

    return employee;
}

function getDashboardSummary() {
    return repository.dashboardSummary();
}

module.exports = {
    listEmployees,
    getEmployee,
    createEmployee,
    updateSalary,
    getDashboardSummary
};