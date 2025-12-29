const express = require('express');
const router = express.Router();
const miscController = require('../controllers/miscController');

router.get('/stats', miscController.getStats);
router.get('/mentors', miscController.getMentors);
router.get('/interview-questions', miscController.getInterviewQuestions);
router.post('/job-alerts', miscController.subscribeAlerts);
router.get('/automation-status', miscController.getAutomationStatus);

module.exports = router;
