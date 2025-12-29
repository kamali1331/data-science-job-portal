const pool = require('../config/db');
let automationService;
try {
    automationService = require('../automation');
} catch (err) {
    console.log("Automation service import skipped in controller context.");
}

exports.getStats = async (req, res) => {
    try {
        const users = await pool.query('SELECT COUNT(*) FROM users');
        const jobs = await pool.query('SELECT COUNT(*) FROM jobs');
        const alerts = await pool.query('SELECT COUNT(*) FROM job_alerts');

        res.json({
            users: parseInt(users.rows[0].count),
            jobs: parseInt(jobs.rows[0].count),
            subscribers: parseInt(alerts.rows[0].count),
        });
    } catch (err) {
        console.error("Error fetching stats:", err);
        res.status(500).json({ error: "Database Error" });
    }
};

exports.getMentors = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM mentors ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching mentors:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getInterviewQuestions = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM interview_questions ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching questions:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.subscribeAlerts = async (req, res) => {
    const { email, provider } = req.body;

    if (!email || !provider) {
        return res.status(400).json({ error: "Email and Provider are required." });
    }

    try {
        const result = await pool.query(
            'INSERT INTO job_alerts (email, provider) VALUES ($1, $2) RETURNING *',
            [email, provider]
        );
        res.status(201).json({ message: "Subscription successful", data: result.rows[0] });
    } catch (err) {
        console.error("Error subscribing to alerts:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getAutomationStatus = (req, res) => {
    // Note: This relies on the automation service being a singleton or globally accessible, 
    // which might need refactoring. For now, we'll try to require it or store state in DB.
    // Ideally automation status should be in DB/Redis.
    const service = require('../automation'); // Re-require to get singleton if cached
    if (service && service.getLastRun) {
        res.json({ lastRun: service.getLastRun() });
    } else {
        res.json({ lastRun: null, message: "Service not available" });
    }
};
