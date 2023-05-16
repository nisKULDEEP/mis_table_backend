const express = require('express');

const app = express();

const middleware = require('../middleware/middleware');
const reportModel = require('../models/reportModel');
const { addReport, getReports } = require('../controllers/report.controller');

// middleware
app.use(express.json());

app.post('/add', middleware.isValidToken, addReport);

app.get('/all', middleware.isValidToken, getReports);

module.exports = app;
