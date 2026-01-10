const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.getMe);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/?login=failed' }),
    authController.googleCallback
);

module.exports = router;
