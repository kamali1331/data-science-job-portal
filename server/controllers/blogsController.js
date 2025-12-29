const pool = require('../config/db');

exports.getAllBlogs = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching blogs:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
