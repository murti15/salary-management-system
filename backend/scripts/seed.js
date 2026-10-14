require('dotenv').config();

const db = require('../src/db/database');

const firstNames = [
    'Aarav', 'Aanya', 'Vihaan', 'Diya', 'Arjun',
    'Anaya', 'Rohan', 'Isha', 'Kabir', 'Meera',
    'Liam', 'Olivia', 'Noah', 'Emma', 'Lucas',
    'Amelia', 'Mateo', 'Sofia', 'Ethan', 'Mia'
];

const lastNames = [
    'Sharma', 'Singh', 'Patel', 'Kumar', 'Gupta',
    'Das', 'Roy', 'Mehta', 'Brown', 'Wilson',
    'Taylor', 'Martin', 'Clark', 'Lewis', 'Walker'
];

const departments = [
    'Engineering', 'Product', 'Human Resources',
    'Finance', 'Sales', 'Marketing', 'Operations',
    'Customer Support', 'Security', 'Legal'
];

const titles = [
    'Software Engineer', 'Senior Engineer',
    'Product Manager', 'Data Analyst',
    'HR Specialist', 'Finance Analyst',
    'Sales Manager', 'Operations Associate',
    'QA Engineer', 'Engineering Manager'
];

const locations = [
    { country: 'India', currency: 'INR', min: 700000, max: 4200000 },
    { country: 'United States', currency: 'USD', min: 55000, max: 210000 },
    { country: 'United Kingdom', currency: 'GBP', min: 35000, max: 130000 },
    { country: 'Germany', currency: 'EUR', min: 40000, max: 145000 },
    { country: 'Canada', currency: 'CAD', min: 50000, max: 170000 },
    { country: 'Australia', currency: 'AUD', min: 60000, max: 180000 },
    { country: 'Singapore', currency: 'SGD', min: 45000, max: 160000 }
];

// Seeded random generator makes data reproducible.
function seededRandom(seed) {
    let value = seed >>> 0;

    return () => {
        value = (value * 1664525 + 1013904223) >>> 0;
        return value / 4294967296;
    };
}

const random = seededRandom(20261014);

function pick(items) {
    return items[Math.floor(random() * items.length)];
}

function randomHireDate() {
    const start = Date.UTC(2010, 0, 1);
    const end = Date.UTC(2026, 9, 1);

    return new Date(
        start + Math.floor(random() * (end - start))
    ).toISOString().slice(0, 10);
}

const insertEmployee = db.prepare(`
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
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const seedEmployees = db.transaction(() => {
    db.prepare('DELETE FROM employees').run();

    for (let i = 1; i <= 10000; i++) {
        const firstName = pick(firstNames);
        const lastName = pick(lastNames);
        const location = pick(locations);

        const annualSalary = Math.round(
            (location.min +
                random() * (location.max - location.min)) / 100
        ) * 100;

        const status = random() < 0.91
            ? 'active'
            : random() < 0.5
                ? 'inactive'
                : 'on_leave';

        insertEmployee.run(
            `EMP-${String(i).padStart(5, '0')}`,
            firstName,
            lastName,
            `employee${String(i).padStart(5, '0')}@example.test`,
            pick(departments),
            pick(titles),
            location.country,
            location.currency,
            annualSalary,
            randomHireDate(),
            status
        );
    }
});

try {
    seedEmployees();

    const count = db.prepare(
        'SELECT COUNT(*) AS count FROM employees'
    ).get().count;

    console.log(`Seeded ${count} synthetic employees.`);

    if (count !== 10000) {
        process.exitCode = 1;
    }
} finally {
    db.close();
}