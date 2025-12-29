const pool = require('./db');

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

const initDB = async () => {
    try {
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
        await pool.query(`
            CREATE TABLE IF NOT EXISTS interview_questions (
                id SERIAL PRIMARY KEY,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                category VARCHAR(100) DEFAULT 'General',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
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
        await pool.query(`
            CREATE TABLE IF NOT EXISTS job_alerts (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                provider VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                google_id VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        try {
            await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);');
        } catch (e) {
            console.log("Column google_id might already exist or error adding it:", e.message);
        }

        console.log("Database tables verified.");
        await seedData();
    } catch (err) {
        console.error("Error initializing database:", err);
    }
};

module.exports = initDB;
