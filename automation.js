require('dotenv').config();
const { Pool } = require('pg');

// Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Database Keep-Alive (Runs every 5 minutes)
setInterval(async () => {
    try {
        await pool.query('SELECT 1');
    } catch (err) {
        console.error('Automation DB Ping Failed:', err);
    }
}, 5 * 60 * 1000);

async function sendAlerts() {
    console.log(`[${new Date().toISOString()}] Checking for updates...`);

    try {
        // 1. Fetch Subscribers
        const subscribers = await pool.query('SELECT * FROM job_alerts');
        if (subscribers.rows.length === 0) {
            console.log("No subscribers found.");
            return;
        }

        // 2. Fetch Latest Updates
        const jobs = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC LIMIT 3');
        const blogs = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC LIMIT 2');
        const roadmaps = await pool.query('SELECT * FROM roadmaps ORDER BY created_at DESC LIMIT 2');
        const questions = await pool.query('SELECT * FROM interview_questions ORDER BY id DESC LIMIT 2');
        const mentors = await pool.query('SELECT * FROM mentors ORDER BY id DESC LIMIT 2');

        // 3. Send Alerts (Simulation)
        console.log(`Sending updates to ${subscribers.rows.length} subscribers...`);

        for (const sub of subscribers.rows) {
            console.log(`\n---------------------------------------------------`);
            console.log(`To: ${sub.email} (${sub.provider})`);
            console.log(`Subject: Your Weekly Data Science Update`);

            // Jobs
            if (jobs.rows.length > 0) {
                console.log(`🔥 LATEST JOBS:`);
                jobs.rows.forEach(job => console.log(` - ${job.title} at ${job.company} (via ${job.source || 'Direct'})`));
            }

            // Blogs
            if (blogs.rows.length > 0) {
                console.log(`📰 LATEST BLOGS:`);
                blogs.rows.forEach(blog => console.log(` - ${blog.title} (${blog.source})`));
            }

            // Roadmaps
            if (roadmaps.rows.length > 0) {
                console.log(`🗺️ NEW ROADMAPS:`);
                roadmaps.rows.forEach(map => console.log(` - ${map.title} (${map.category})`));
            }

            // Interview Questions
            if (questions.rows.length > 0) {
                console.log(`🧠 INTERVIEW PREP:`);
                questions.rows.forEach(q => console.log(` - Q: ${q.question}`));
            }

            // Mentors
            if (mentors.rows.length > 0) {
                console.log(`👨‍🏫 NEW MENTORS:`);
                mentors.rows.forEach(m => console.log(` - ${m.name} on ${m.platform}`));
            }
            console.log(`---------------------------------------------------\n`);
        }

    } catch (err) {
        console.error("Error in automation cycle:", err);
        // Don't exit process, just log error and wait for next cycle
    }
}

// Run immediately on start
sendAlerts();

// Then run every 24 hours (86400000 ms)
const INTERVAL = 24 * 60 * 60 * 1000;
console.log(`Automation service started. Running every ${INTERVAL / (60 * 60 * 1000)} hours.`);

setInterval(sendAlerts, INTERVAL);
