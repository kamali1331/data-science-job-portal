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

exports.updateJob = async (req, res) => {
    const { id } = req.params;
    const { title, company, type, location, role } = req.body;

    const fields = [];
    const values = [];
    let idx = 1;

    if (title)    { fields.push(`title = $${idx++}`);    values.push(title); }
    if (company)  { fields.push(`company = $${idx++}`);  values.push(company); }
    if (type)     { fields.push(`type = $${idx++}`);     values.push(type); }
    if (location) { fields.push(`location = $${idx++}`); values.push(location); }
    if (role)     { fields.push(`role = $${idx++}`);     values.push(role); }

    values.push(id);
    const sql = `UPDATE jobs SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;

    try {
        const result = await pool.query(sql, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error updating job:", err);
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
