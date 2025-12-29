const pool = require('../config/db');

exports.getAllJobs = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching jobs:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.createJob = async (req, res) => {
    const { title, company, type, location, role } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO jobs (title, company, type, location, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, company, type, location, role]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating job:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.deleteJob = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM jobs WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error("Error deleting job:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
