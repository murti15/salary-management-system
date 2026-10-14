
import { useEffect, useState } from 'react';
import {
    Users,
    DollarSign,
    Globe2,
    TrendingUp,
    Search,
    Plus,
    RefreshCw,
    AlertCircle,
    LoaderCircle
} from 'lucide-react';
import { employeeApi } from './api.js';

function formatCurrency(amount, currency = 'USD') {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            maximumFractionDigits: 0
        }).format(amount || 0);
    } catch {
        return `${currency} ${Number(amount || 0).toLocaleString()}`;
    }
}

const COUNTRIES = [
    'India',
    'United States',
    'United Kingdom',
    'Germany',
    'Canada',
    'Australia',
    'Singapore'
];

const DEPARTMENTS = [
    'Engineering',
    'Finance',
    'Human Resources',
    'Marketing',
    'Operations',
    'Sales',
    'Product'
];

const EMPTY_FORM = {
    firstName: '',
    lastName: '',
    email: '',
    department: 'Engineering',
    jobTitle: '',
    country: 'India',
    currency: 'INR',
    annualSalary: '',
    hireDate: '',
    status: 'active'
};

export default function App() {
    const [employees, setEmployees] = useState([]);
    const [summary, setSummary] = useState(null);

    const [search, setSearch] = useState('');
    const [country, setCountry] = useState('All');
    const [department, setDepartment] = useState('All');
    const [status, setStatus] = useState('All');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');
    const [form, setForm] = useState({ ...EMPTY_FORM });

    async function loadDashboard() {
        setLoading(true);
        setError('');

        try {
            const params = { limit: '100' };

            if (search.trim()) params.search = search.trim();
            if (country !== 'All') params.country = country;
            if (department !== 'All') params.department = department;
            if (status !== 'All') params.status = status;

            const [employeeBody, summaryBody] = await Promise.all([
                employeeApi.list(params),
                employeeApi.getSummary()
            ]);

            setEmployees(employeeBody.items || []);
            setSummary(summaryBody);
        } catch (err) {
            setError(
                err.message ||
                'Unable to load dashboard. Check that the backend is running.'
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            loadDashboard();
        }, 250);

        return () => clearTimeout(timer);
    }, [search, country, department, status]);

    function updateForm(field, value) {
        setForm((current) => ({
            ...current,
            [field]: value
        }));
    }

    function openCreateForm() {
        setForm({ ...EMPTY_FORM });
        setFormError('');
        setShowForm(true);
    }

    function closeCreateForm() {
        if (saving) return;

        setShowForm(false);
        setFormError('');
    }

    async function handleCreateEmployee(event) {
        event.preventDefault();
        setSaving(true);
        setFormError('');

        try {
            await employeeApi.create({
                ...form,
                annualSalary: Number(form.annualSalary)
            });

            setShowForm(false);
            setForm({ ...EMPTY_FORM });

            await loadDashboard();
        } catch (err) {
            setFormError(err.message || 'Could not create employee.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="brand">
                    <div className="brand-icon">
                        <DollarSign size={22} />
                    </div>

                    <div>
                        <strong>PayPilot</strong>
                        <span>People &amp; Payroll</span>
                    </div>
                </div>

                <div className="nav-label">WORKSPACE</div>

                <div className="nav-item active">
                    <Users size={18} />
                    <span>Employees</span>
                </div>

                <div className="nav-item">
                    <TrendingUp size={18} />
                    <span>Salary overview</span>
                </div>

                <div className="nav-item">
                    <Globe2 size={18} />
                    <span>Global workforce</span>
                </div>

                <div className="sidebar-bottom">
                    <div className="avatar">HR</div>

                    <div>
                        <strong>HR Manager</strong>
                        <span>Administrator</span>
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <header className="topbar">
                    <div className="breadcrumbs">
                        Workspace <span>/</span> Employees
                    </div>

                    <div className="topbar-right">
                        <span className="system-status">
                            <span className="status-dot" />
                            HR Workspace
                        </span>

                        <div className="avatar small">HR</div>
                    </div>
                </header>

                <section className="page-heading">
                    <div>
                        <div className="eyebrow">PEOPLE OPERATIONS</div>
                        <h1>Employee management</h1>
                        <p>
                            Manage your global workforce and compensation in one place.
                        </p>
                    </div>

                    <div className="heading-actions">
                        <button
                            className="button secondary"
                            onClick={loadDashboard}
                            disabled={loading}
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>

                        <button className="button primary" onClick={openCreateForm}>
                            <Plus size={17} />
                            Add employee
                        </button>
                    </div>
                </section>

                {error && (
                    <div className="error-banner" role="alert">
                        <AlertCircle size={18} />
                        <span>{error}</span>

                        <button onClick={loadDashboard}>Retry</button>
                    </div>
                )}

                <section className="metrics-grid">
                    <MetricCard
                        label="Total employees"
                        value={summary?.totalEmployees?.toLocaleString() ?? '—'}
                        note="Across all locations"
                        icon={<Users size={20} />}
                    />

                    <MetricCard
                        label="Active employees"
                        value={summary?.activeEmployees?.toLocaleString() ?? '—'}
                        note="Currently active"
                        icon={<TrendingUp size={20} />}
                    />

                    <MetricCard
                        label="Countries"
                        value={summary?.countryCount?.toLocaleString() ?? '—'}
                        note="Global workforce"
                        icon={<Globe2 size={20} />}
                    />

                    <MetricCard
                        label="Salary currencies"
                        value={summary?.currencyCount?.toLocaleString() ?? '—'}
                        note="Compensation currencies"
                        icon={<DollarSign size={20} />}
                    />
                </section>

                <section className="panel">
                    <div className="panel-heading">
                        <div>
                            <h2>Employee directory</h2>
                            <p>Search, filter and manage employee records.</p>
                        </div>

                        <span className="record-count">
                            {employees.length.toLocaleString()} records shown
                        </span>
                    </div>

                    <div className="filters">
                        <label className="search-box">
                            <Search size={18} />

                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search name, email or employee code..."
                                aria-label="Search employees"
                            />
                        </label>

                        <select
                            value={country}
                            onChange={(event) => setCountry(event.target.value)}
                            aria-label="Filter by country"
                        >
                            <option value="All">All countries</option>
                            {COUNTRIES.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                        <select
                            value={department}
                            onChange={(event) => setDepartment(event.target.value)}
                            aria-label="Filter by department"
                        >
                            <option value="All">All departments</option>
                            {DEPARTMENTS.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                        <select
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                            aria-label="Filter by status"
                        >
                            <option value="All">All statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="on_leave">On leave</option>
                        </select>
                    </div>

                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>EMPLOYEE</th>
                                    <th>DEPARTMENT</th>
                                    <th>LOCATION</th>
                                    <th>ANNUAL SALARY</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="empty-state">
                                            <LoaderCircle
                                                className="spinner"
                                                size={22}
                                                aria-hidden="true"
                                            />
                                            Loading employees...
                                        </td>
                                    </tr>
                                ) : employees.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="empty-state">
                                            No employees found. Try changing your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    employees.map((employee) => (
                                        <tr key={employee.id}>
                                            <td>
                                                <div className="employee-cell">
                                                    <div className="employee-avatar">
                                                        {employee.firstName?.[0]}
                                                        {employee.lastName?.[0]}
                                                    </div>

                                                    <div className="employee-info">
                                                        <strong>
                                                            {employee.firstName} {employee.lastName}
                                                        </strong>
                                                        <span>{employee.email}</span>
                                                        <small>{employee.employeeCode}</small>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="department-cell">
                                                    <strong>{employee.department}</strong>
                                                    <span>{employee.jobTitle}</span>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="location-cell">
                                                    <Globe2 size={15} />
                                                    {employee.country}
                                                </div>
                                            </td>

                                            <td className="salary-cell">
                                                {formatCurrency(
                                                    employee.annualSalary,
                                                    employee.currency
                                                )}
                                                <span>{employee.currency} / year</span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`status-badge ${employee.status}`}
                                                >
                                                    <span />
                                                    {employee.status?.replace('_', ' ')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="table-footer">
                        <span>Showing up to 100 employees per view</span>

                        <button className="text-button" onClick={loadDashboard}>
                            Refresh records <RefreshCw size={14} />
                        </button>
                    </div>
                </section>

                <footer className="page-footer">
                    <span>PayPilot · Salary Management System</span>
                    <span>Employee data is managed through the backend API.</span>
                </footer>
            </main>

            {showForm && (
                <div
                    className="modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeCreateForm();
                        }
                    }}
                >
                    <section
                        className="modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="form-title"
                    >
                        <div className="modal-header">
                            <div>
                                <h2 id="form-title">Add employee</h2>
                                <p>Create a new employee record.</p>
                            </div>

                            <button
                                className="close-button"
                                type="button"
                                onClick={closeCreateForm}
                                disabled={saving}
                                aria-label="Close form"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCreateEmployee}>
                            <div className="form-grid">
                                <FormField label="First name">
                                    <input
                                        required
                                        maxLength={100}
                                        value={form.firstName}
                                        onChange={(event) =>
                                            updateForm('firstName', event.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField label="Last name">
                                    <input
                                        required
                                        maxLength={100}
                                        value={form.lastName}
                                        onChange={(event) =>
                                            updateForm('lastName', event.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField label="Email address">
                                    <input
                                        required
                                        type="email"
                                        value={form.email}
                                        onChange={(event) =>
                                            updateForm('email', event.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField label="Job title">
                                    <input
                                        required
                                        maxLength={150}
                                        value={form.jobTitle}
                                        onChange={(event) =>
                                            updateForm('jobTitle', event.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField label="Department">
                                    <select
                                        required
                                        value={form.department}
                                        onChange={(event) =>
                                            updateForm('department', event.target.value)
                                        }
                                    >
                                        {DEPARTMENTS.map((item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField label="Country">
                                    <select
                                        required
                                        value={form.country}
                                        onChange={(event) =>
                                            updateForm('country', event.target.value)
                                        }
                                    >
                                        {COUNTRIES.map((item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField label="Annual salary">
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        max="100000000000"
                                        step="0.01"
                                        value={form.annualSalary}
                                        onChange={(event) =>
                                            updateForm('annualSalary', event.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField label="Currency">
                                    <select
                                        required
                                        value={form.currency}
                                        onChange={(event) =>
                                            updateForm('currency', event.target.value)
                                        }
                                    >
                                        {['INR', 'USD', 'GBP', 'EUR', 'CAD', 'AUD', 'SGD'].map(
                                            (item) => (
                                                <option key={item} value={item}>
                                                    {item}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </FormField>

                                <FormField label="Hire date">
                                    <input
                                        required
                                        type="date"
                                        value={form.hireDate}
                                        onChange={(event) =>
                                            updateForm('hireDate', event.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField label="Status">
                                    <select
                                        required
                                        value={form.status}
                                        onChange={(event) =>
                                            updateForm('status', event.target.value)
                                        }
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="on_leave">On leave</option>
                                    </select>
                                </FormField>
                            </div>

                            {formError && (
                                <div className="form-error" role="alert">
                                    {formError}
                                </div>
                            )}

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="button secondary"
                                    onClick={closeCreateForm}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="button primary"
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Create employee'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}

function MetricCard({ label, value, note, icon }) {
    return (
        <article className="metric-card">
            <div className="metric-top">
                <span>{label}</span>
                <div className="metric-icon">{icon}</div>
            </div>

            <strong className="metric-value">{value}</strong>
            <span className="metric-note">{note}</span>
        </article>
    );
}

function FormField({ label, children }) {
    return (
        <label className="form-field">
            <span>{label}</span>
            {children}
        </label>
    );
}
