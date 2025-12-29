const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const setupSecurity = (app) => {
    // 1. Secure HTTP Headers
    app.use(helmet());

    // 2. Rate Limiting (DDoS Protection)
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: "Too many requests from this IP, please try again later."
    });
    app.use(limiter);
};

module.exports = setupSecurity;
