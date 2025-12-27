require('dotenv').config();
const { Pool } = require('pg');
const nodemailer = require('nodemailer');

// Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
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

let lastRunTime = null;

async function sendAlerts() {
    lastRunTime = new Date();
    console.log(`[${lastRunTime.toISOString()}] Checking for updates...`);

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

        // 3. Send Alerts
        console.log(`Sending updates to ${subscribers.rows.length} subscribers...`);

        // Prepare HTML Content
        let contentHtml = `<h2>Weekly Data Science Update</h2>`;

        if (jobs.rows.length > 0) {
            contentHtml += `<h3>🔥 Latest Jobs</h3><ul>`;
            jobs.rows.forEach(job => {
                contentHtml += `<li><strong>${job.title}</strong> at ${job.company} (${job.location})</li>`;
            });
            contentHtml += `</ul>`;
        }

        if (blogs.rows.length > 0) {
            contentHtml += `<h3>📰 New Blogs</h3><ul>`;
            blogs.rows.forEach(blog => {
                contentHtml += `<li>${blog.title}</li>`;
            });
            contentHtml += `</ul>`;
        }

        if (roadmaps.rows.length > 0) {
            contentHtml += `<h3>🗺️ New Roadmaps</h3><ul>`;
            roadmaps.rows.forEach(map => {
                contentHtml += `<li>${map.title} (${map.category})</li>`;
            });
            contentHtml += `</ul>`;
        }

        contentHtml += `<p>Visit <a href="https://data-science-job-portal.onrender.com">Data Science Job Portal</a> for more!</p>`;

        // Send to each subscriber
        for (const sub of subscribers.rows) {
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: sub.email,
                    subject: 'Your Weekly Data Science Update',
                    html: contentHtml
                });
                console.log(`Email sent to ${sub.email}`);
            } catch (emailErr) {
                console.error(`Failed to send email to ${sub.email}:`, emailErr.message);
            }
        }

    } catch (err) {
        console.error("Error in automation cycle:", err);
    }
}

// Run immediately on start
sendAlerts();

// Then run every 24 hours (86400000 ms)
const INTERVAL = 24 * 60 * 60 * 1000;
console.log(`Automation service started. Running every ${INTERVAL / (60 * 60 * 1000)} hours.`);

setInterval(sendAlerts, INTERVAL);

// Export for checking status
module.exports = {
    getLastRun: () => lastRunTime
};
