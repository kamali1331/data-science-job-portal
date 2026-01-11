const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
    callbackURL: "/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        try {
            let res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            let user = res.rows[0];

            if (!user) {
                const insert = await pool.query(
                    'INSERT INTO users (email, password, google_id) VALUES ($1, $2, $3) RETURNING *',
                    [email, 'google-login', profile.id]
                );
                user = insert.rows[0];
            } else {
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

const GitHubStrategy = require('passport-github2').Strategy;
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || 'YOUR_GITHUB_CLIENT_ID',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'YOUR_GITHUB_CLIENT_SECRET',
    callbackURL: "/auth/github/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || `${profile.username}@github.com`;
        try {
            let res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            let user = res.rows[0];

            if (!user) {
                const insert = await pool.query(
                    'INSERT INTO users (email, password, github_id) VALUES ($1, $2, $3) RETURNING *',
                    [email, 'github-login', profile.id]
                );
                user = insert.rows[0];
            } else {
                if (!user.github_id) {
                    await pool.query('UPDATE users SET github_id = $1 WHERE email = $2', [profile.id, email]);
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

module.exports = passport;
