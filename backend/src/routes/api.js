const express = require('express');
const controller = require('../controllers/employeeController');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'salary-management-api'
    });
});

// Employee APIs
router.get('/employees', controller.list);
router.get('/employees/:id', controller.getById);
router.post('/employees', controller.create);
router.patch('/employees/:id/salary', controller.updateSalary);

// Dashboard API
router.get('/dashboard/summary', controller.summary);

module.exports = router;