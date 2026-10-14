require('dotenv').config();

const express = require('express');
const cors = require('cors');
const api = require('./routes/api');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '100kb' }));

app.use('/api', api);

app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

app.use(errorHandler);

module.exports = app;