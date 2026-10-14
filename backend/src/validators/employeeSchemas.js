const { z } = require('zod');

const currencies = [
    'USD',
    'INR',
    'EUR',
    'GBP',
    'CAD',
    'AUD',
    'SGD'
];

const employeeSchema = z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.string().trim().email().max(180),
    department: z.string().trim().min(1).max(100),
    jobTitle: z.string().trim().min(1).max(120),
    country: z.string().trim().min(2).max(80),
    currency: z.enum(currencies),
    annualSalary: z.number().finite().min(0).max(100000000),
    hireDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    status: z.enum([
        'active',
        'inactive',
        'on_leave'
    ]).default('active')
});

const salarySchema = z.object({
    annualSalary: z.number().finite().min(0).max(100000000),
    currency: z.enum(currencies)
});

module.exports = {
    employeeSchema,
    salarySchema
};