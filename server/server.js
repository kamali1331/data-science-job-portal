require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const passport = require('./config/passport');
const setupSecurity = require('./middleware/security');
const initDB = require('./config/initDB');

// Routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const blogRoutes = require('./routes/blogRoutes');
const miscRoutes = require('./routes/miscRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
setupSecurity(app);

// Standard Middleware
app.use(cors({
    origin: 'http://localhost:3001', // Allow Next.js Client
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Static Files (Serving Legacy Web for now)
app.use(express.static(path.join(__dirname, '..', 'legacy_web')));
// Uploads directory
app.use('/uploads', express.static(path.join(__dirname, '..', 'assets', 'roadmaps')));

// API Routes
app.use('/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api', miscRoutes); // For everything else under /api (stats, mentors, etc) 

// Automation Service
try {
    require('./automation');
    console.log("Automation service integrated.");
} catch (err) {
    console.error("Failed to start automation service:", err);
}

// Initialize Database
initDB();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
