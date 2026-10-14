
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

async function request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(body.message || `Request failed (${response.status})`);
    }

    return body;
}

export const employeeApi = {
    list(params = {}) {
        const query = new URLSearchParams(params);
        return request(`/employees?${query.toString()}`);
    },

    getById(id) {
        return request(`/employees/${id}`);
    },

    create(employee) {
        return request('/employees', {
            method: 'POST',
            body: JSON.stringify(employee)
        });
    },

    updateSalary(id, salary) {
        return request(`/employees/${id}/salary`, {
            method: 'PATCH',
            body: JSON.stringify(salary)
        });
    },

    getSummary() {
        return request('/dashboard/summary');
    },

    health() {
        return request('/health');
    }
};
