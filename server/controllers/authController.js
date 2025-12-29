const pool = require('../config/db');

exports.register = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and Password are required." });
    }
    try {
        // In a real app, hash the password!
        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, password]
        );
        res.status(201).json({ message: "User created", user: result.rows[0] });
    } catch (err) {
        console.error("Error registering user:", err);
        if (err.code === '23505') { // Unique violation
            return res.status(400).json({ error: "Email already exists." });
        }
        res.status(500).json({ error: "Registration Error: " + err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and Password are required." });
    }
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const user = result.rows[0];
        // In a real app, compare hashed password!
        if (user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        res.json({ message: "Login successful", user: { id: user.id, email: user.email } });
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).json({ error: "Login Error: " + err.message });
    }
};

exports.googleCallback = (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/?login=success&user=' + encodeURIComponent(JSON.stringify(req.user)));
};
