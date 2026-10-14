
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

// Use a separate temporary database for tests.
const testDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'salary-management-test-')
);

process.env.DATABASE_PATH = path.join(
    testDirectory,
    'test.sqlite'
);

const db = require('../src/db/database');
const app = require('../src/app');

let server;
let baseUrl;

before(async () => {
    server = app.listen(0);

    await new Promise((resolve) => {
        server.once('listening', resolve);
    });

    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    if (server) {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) reject(error);
                else resolve();
            });
        });
    }

    db.close();
    fs.rmSync(testDirectory, { recursive: true, force: true });
});

test('GET /api/health returns service status', async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, 'ok');
    assert.equal(body.service, 'salary-management-api');
});

test('GET /api/employees returns an empty list initially', async () => {
    const response = await fetch(`${baseUrl}/api/employees`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.data.length, 0);
});

test('POST /api/employees creates an employee', async () => {
    const employee = {
        firstName: 'Aarav',
        lastName: 'Sharma',
        email: 'aarav.sharma@example.com',
        department: 'Engineering',
        jobTitle: 'Software Engineer',
        country: 'India',
        currency: 'INR',
        annualSalary: 1200000,
        hireDate: '2024-01-15',
        status: 'active'
    };

    const response = await fetch(`${baseUrl}/api/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
    });

    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.data.firstName, 'Aarav');
    assert.equal(body.data.email, employee.email);
    assert.equal(body.data.annualSalary, 1200000);
    assert.ok(body.data.id);
});

test('POST /api/employees rejects an invalid email', async () => {
    const response = await fetch(`${baseUrl}/api/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            firstName: 'Test',
            lastName: 'User',
            email: 'not-an-email',
            department: 'Engineering',
            jobTitle: 'Developer',
            country: 'India',
            currency: 'INR',
            annualSalary: 500000,
            hireDate: '2024-01-15',
            status: 'active'
        })
    });

    assert.equal(response.status, 400);
});

test('GET /api/employees/:id returns an existing employee', async () => {
    const createResponse = await fetch(`${baseUrl}/api/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            firstName: 'Priya',
            lastName: 'Verma',
            email: 'priya.verma@example.com',
            department: 'Finance',
            jobTitle: 'Analyst',
            country: 'India',
            currency: 'INR',
            annualSalary: 800000,
            hireDate: '2023-06-01',
            status: 'active'
        })
    });

    const created = await createResponse.json();

    const response = await fetch(
        `${baseUrl}/api/employees/${created.data.id}`
    );

    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.data.email, 'priya.verma@example.com');
});

test('PATCH /api/employees/:id/salary updates annual salary', async () => {
    const createResponse = await fetch(`${baseUrl}/api/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            firstName: 'Rohan',
            lastName: 'Kumar',
            email: 'rohan.kumar@example.com',
            department: 'Engineering',
            jobTitle: 'Developer',
            country: 'India',
            currency: 'INR',
            annualSalary: 700000,
            hireDate: '2024-03-10',
            status: 'active'
        })
    });

    const created = await createResponse.json();

    const response = await fetch(
        `${baseUrl}/api/employees/${created.data.id}/salary`,
        {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                annualSalary: 900000,
                currency: 'INR'
            })
        }
    );

    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.data.annualSalary, 900000);
});

test('GET /api/dashboard/summary returns dashboard data', async () => {
    const response = await fetch(`${baseUrl}/api/dashboard/summary`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(body.data);
});
