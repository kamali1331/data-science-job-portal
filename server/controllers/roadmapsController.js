const pool = require('../config/db');

exports.getAllRoadmaps = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM roadmaps ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching roadmaps:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.createRoadmap = async (req, res) => {
    const { title, description, category } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const filePath = `assets/roadmaps/${file.filename}`;
        const query = `
            INSERT INTO roadmaps (title, description, category, file_path)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [title, description || '', category || 'General', filePath];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error uploading roadmap:", err);
        res.status(500).json({ error: "Database Error" });
    }
};
