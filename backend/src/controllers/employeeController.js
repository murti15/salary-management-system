const service = require('../services/employeeService');

const {
    employeeSchema,
    salarySchema
} = require('../validators/employeeSchemas');

function parse(schema, input) {
    const result = schema.safeParse(input);

    if (!result.success) {
        const error = new Error('Request validation failed');

        error.status = 400;
        error.details = result.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
        }));

        throw error;
    }

    return result.data;
}

function list(req, res, next) {
    try {
        res.json(service.listEmployees(req.query));
    } catch (err) {
        next(err);
    }
}

function getById(req, res, next) {
    try {
        const id = Number(req.params.id);
        res.json(service.getEmployee(id));
    } catch (err) {
        next(err);
    }
}

function create(req, res, next) {
    try {
        const input = parse(employeeSchema, req.body);
        res.status(201).json(service.createEmployee(input));
    } catch (err) {
        next(err);
    }
}

function updateSalary(req, res, next) {
    try {
        const input = parse(salarySchema, req.body);
        const id = Number(req.params.id);

        res.json(service.updateSalary(id, input));
    } catch (err) {
        next(err);
    }
}

function summary(req, res, next) {
    try {
        res.json(service.getDashboardSummary());
    } catch (err) {
        next(err);
    }
}

module.exports = {
    list,
    getById,
    create,
    updateSalary,
    summary
};