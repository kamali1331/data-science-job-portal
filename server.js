require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Security Middleware (Cloudflare-like protections) ---
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const nodemailer = require('nodemailer');

// --- PASSPORT CONFIGURATION ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
    callbackURL: "/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        // Simple User Find/Create Logic
        const email = profile.emails[0].value;
        try {
            // Check if user exists
            let res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            let user = res.rows[0];

            if (!user) {
                // Create new user (using googleId as password placeholder or handle separately)
                const insert = await pool.query(
                    'INSERT INTO users (email, password, google_id) VALUES ($1, $2, $3) RETURNING *',
                    [email, 'google-login', profile.id]
                );
                user = insert.rows[0];
            } else {
                // Update google_id if missing
                if (!user.google_id) {
                    await pool.query('UPDATE users SET google_id = $1 WHERE email = $2', [profile.id, email]);
                }
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        done(null, res.rows[0]);
    } catch (err) {
        done(err, null);
    }
});

// --- NODEMAILER CONFIGURATION ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

const sendEmail = async (to, subject, html) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
    };
    return transporter.sendMail(mailOptions);
};

// 1. Secure HTTP Headers
app.use(helmet());

// 2. Rate Limiting (DDoS Protection)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname)); // Serve static files (HTML, CSS, JS) from current directory
app.use('/uploads', express.static(path.join(__dirname, 'assets', 'roadmaps')));

// Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Database Keep-Alive (Runs every 5 minutes to prevent disconnection)
setInterval(async () => {
    try {
        await pool.query('SELECT 1');
        // console.log('DB Keep-Alive Ping: Success'); // Uncomment for debugging
    } catch (err) {
        console.error('DB Keep-Alive Ping: Failed', err);
    }
}, 5 * 60 * 1000); // 5 minutes

// Init Database
// Init Database
const initDB = async () => {
    try {
        // Roadmaps Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS roadmaps (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(100),
                file_path VARCHAR(500) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Interview Questions Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS interview_questions (
                id SERIAL PRIMARY KEY,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                category VARCHAR(100) DEFAULT 'General',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Mentors Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS mentors (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                platform VARCHAR(100),
                description TEXT,
                link VARCHAR(500) NOT NULL,
                icon_class VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Blogs Table
        await pool.query('DROP TABLE IF EXISTS blogs CASCADE');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS blogs (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                excerpt TEXT,
                author VARCHAR(100),
                date VARCHAR(50),
                image_url VARCHAR(500),
                link VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Jobs Table - DROP to ensure schema update for this task
        await pool.query('DROP TABLE IF EXISTS jobs CASCADE');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS jobs (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                company VARCHAR(255) NOT NULL,
                location VARCHAR(100),
                type VARCHAR(50),
                role VARCHAR(50),
                source VARCHAR(50) DEFAULT 'Direct',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Job Alerts Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS job_alerts (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                provider VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Users Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                google_id VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Migration: Add google_id if it doesn't exist
        try {
            await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);');
        } catch (e) {
            console.log("Column google_id might already exist or error adding it:", e.message);
        }

        console.log("Database tables verified.");
        seedData(); // Check and seed initial data
    } catch (err) {
        console.error("Error initializing database:", err);
    }
};



// Seed Initial Data
// ... (existing seedData) ...

// ... (existing endpoints) ...

// POST: Register User
app.post('/api/register', async (req, res) => {
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
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// --- GOOGLE OAUTH ROUTES ---
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/?login=failed' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/?login=success&user=' + encodeURIComponent(JSON.stringify(req.user)));
    }
);

// --- EMAIL ALERT TEST ROUTE ---
app.post('/api/test-email', async (req, res) => {
    const { email } = req.body;
    try {
        await sendEmail(email, "Test Alert", "<h1>It Works!</h1><p>Email alerts are configured correctly.</p>");
        res.json({ message: "Test email sent" });
    } catch (err) {
        res.status(500).json({ error: "Failed to send email: " + err.message });
    }
});

// POST: Login User
app.post('/api/login', async (req, res) => {
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
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Seed Initial Data
const seedData = async () => {
    try {
        // Seed Interview Questions
        const qCheck = await pool.query('SELECT COUNT(*) FROM interview_questions');
        if (parseInt(qCheck.rows[0].count) === 0) {
            console.log("Seeding Interview Questions...");
            const questions = [
                { q: "What is the difference between Supervised and Unsupervised Learning?", a: "Supervised learning uses labeled data (input-output pairs) to train algorithms (e.g., Regression, Classification), while Unsupervised learning deals with unlabeled data to find hidden patterns (e.g., Clustering, PCA)." },
                { q: "Explain the Bias-Variance Tradeoff.", a: "Bias is the error due to overly simplistic assumptions (underfitting). Variance is the error due to excessive sensitivity to the training data (overfitting). The tradeoff involves finding the sweet spot where both are minimized to achieve good generalization." },
                { q: "What is a p-value?", a: "The p-value is the probability of obtaining test results at least as extreme as the results actually observed, assuming that the null hypothesis is true. A p-value < 0.05 typically indicates statistical significance." },
                { q: "Difference between INNER JOIN and LEFT JOIN?", a: "INNER JOIN returns only rows with a match in both tables. LEFT JOIN returns all rows from the left table and matched rows from the right table; unmatched rows get NULL values." },
                { q: "What are Python decorators?", a: "Decorators are functions that modify the behavior of other functions or methods. They are defined with the @symbol and are commonly used for logging, access control, and instrumentation." }
            ];
            for (const item of questions) {
                await pool.query('INSERT INTO interview_questions (question, answer) VALUES ($1, $2)', [item.q, item.a]);
            }
        }

        // Seed Mentors
        const mCheck = await pool.query('SELECT COUNT(*) FROM mentors');
        if (parseInt(mCheck.rows[0].count) === 0) {
            console.log("Seeding Mentors...");
            const mentors = [
                { name: "1:1 Mentorship", platform: "Topmate", description: "Book a slot for Resume Review, Mock Interviews, or Career Guidance.", link: "https://topmate.io/ds_kamali", icon: "fas fa-video" },
                { name: "Long-term Mentorship", platform: "Preplaced", description: "End-to-end guidance to help you land your dream data role.", link: "https://preplaced.in/profile/d-s-kamali", icon: "fas fa-chalkboard-teacher" }
            ];
            for (const item of mentors) {
                await pool.query('INSERT INTO mentors (name, platform, description, link, icon_class) VALUES ($1, $2, $3, $4, $5)', [item.name, item.platform, item.description, item.link, item.icon]);
            }
        }

        // Seed Blogs
        const bCheck = await pool.query('SELECT COUNT(*) FROM blogs');
        if (parseInt(bCheck.rows[0].count) === 0) {
            console.log("Seeding Blogs...");
            const blogs = [
                { title: "Breaking into Data Science in 2025", excerpt: "Navigate the current job market with essential skills and strategies to land your first role.", author: "Kamali S.", date: "Jan 15, 2025", image: "https://cdn-icons-png.flaticon.com/512/3067/3067254.png" },
                { title: "Top Data Science Tools & Technologies", excerpt: "Stay ahead with our guide to the most in-demand software, from Python to Power BI.", author: "Kamali S.", date: "Jan 15, 2025", image: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png" },
                { title: "A Day in the Life of a Data Scientist", excerpt: "Get an inside look at the daily responsibilities and challenges of a modern data professional.", author: "Kamali S.", date: "Jan 15, 2025", image: "https://cdn-icons-png.flaticon.com/512/9324/9324706.png" }
            ];
            for (const blog of blogs) {
                await pool.query(
                    'INSERT INTO blogs (title, excerpt, author, date, image_url) VALUES ($1, $2, $3, $4, $5)',
                    [blog.title, blog.excerpt, blog.author, blog.date, blog.image]
                );
            }
        }

        // Seed Jobs
        const jCheck = await pool.query('SELECT COUNT(*) FROM jobs');
        if (parseInt(jCheck.rows[0].count) === 0) {
            console.log("Seeding Jobs...");
            const jobs = [
                { title: "Data Analyst", company: "Tech Corp", type: "Full-time", location: "Bangalore", role: "Entry Level", source: "LinkedIn" },
                { title: "Sr. Data Scientist", company: "AI Innovators", type: "Full-time", location: "Hyderabad", role: "Senior", source: "MyJob AI" },
                { title: "Python Developer", company: "Web Solutions", type: "Remote", location: "Remote", role: "Fresher", source: "Hiring Cafe" },
                { title: "Machine Learning Intern", company: "Future AI", type: "Internship", location: "Pune", role: "Intern", source: "LinkedIn" },
                { title: "Power BI Developer", company: "DataViz Inc.", type: "Full-time", location: "Mumbai", role: "Mid Level", source: "Google Jobs" },
                { title: "Big Data Engineer", company: "Cloud Systems", type: "Full-time", location: "Gurgaon", role: "Senior", source: "MyJob AI" }
            ];
            for (const job of jobs) {
                await pool.query('INSERT INTO jobs (title, company, type, location, role, source) VALUES ($1, $2, $3, $4, $5, $6)', [job.title, job.company, job.type, job.location, job.role, job.source]);
            }
        }
    } catch (err) {
        console.error("Error seeding data:", err);
    }
};

initDB();

// Configure Multer for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'assets', 'roadmaps');
        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Use original name or timestamp-based name
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// --- API Endpoints ---

// GET: Fetch all roadmaps
app.get('/api/roadmaps', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM roadmaps ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching roadmaps:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET: Fetch all blogs
app.get('/api/blogs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching blogs:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET: Fetch interview questions
app.get('/api/interview-questions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM interview_questions ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching questions:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET: Fetch mentors
app.get('/api/mentors', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM mentors ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching mentors:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET: Fetch all jobs
app.get('/api/jobs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching jobs:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST: Create a new job
app.post('/api/jobs', async (req, res) => {
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
});

// DELETE: Remove a job
app.delete('/api/jobs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM jobs WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error("Error deleting job:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST: Upload a new roadmap
app.post('/api/roadmaps', upload.single('roadmapFile'), async (req, res) => {
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
});

// POST: Subscribe to Job Alerts
app.post('/api/job-alerts', async (req, res) => {
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
});

// --- Admin Stats Endpoints ---

// GET: System Stats
app.get('/api/stats', async (req, res) => {
    try {
        const users = await pool.query('SELECT COUNT(*) FROM users');
        const jobs = await pool.query('SELECT COUNT(*) FROM jobs');
        const alerts = await pool.query('SELECT COUNT(*) FROM job_alerts');
        const blogs = await pool.query('SELECT COUNT(*) FROM blogs'); // Assuming blogs table exists or will exist

        // Handle case where blog table might not exist yet safely if wanted, but assuming standard schema

        res.json({
            users: parseInt(users.rows[0].count),
            jobs: parseInt(jobs.rows[0].count),
            subscribers: parseInt(alerts.rows[0].count),
            // blogs: parseInt(blogs.rows[0].count) 
        });
    } catch (err) {
        console.error("Error fetching stats:", err);
        res.status(500).json({ error: "Database Error" });
    }
});

// GET: Automation Status
app.get('/api/automation-status', (req, res) => {
    if (automationService && automationService.getLastRun) {
        res.json({ lastRun: automationService.getLastRun() });
    } else {
        res.json({ lastRun: null, message: "Service not available" });
    }
});

// Start Automation Service (Background 24/7)
let automationService;
try {
    automationService = require('./automation');
    console.log("Automation service integrated.");
} catch (err) {
    console.error("Failed to start automation service:", err);
}

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
