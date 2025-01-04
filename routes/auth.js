const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');

// Validation middleware
const validateSignup = [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    })
];

// Render login page
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Render signup page
router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign Up' });
});

// Render join club page
router.get('/join-club', (req, res) => {
    if (!req.user) {
        req.flash('error', 'Please login first');
        return res.redirect('/auth/login');
    }
    res.render('join-club', { title: 'Join Club' });
});

// Process signup
router.post('/signup', validateSignup, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { firstName, lastName, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            req.flash('error', 'Email already registered');
            return res.redirect('/auth/signup');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        req.flash('success', 'Registration successful. Please log in.');
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Registration failed. Please try again.');
        res.redirect('/auth/signup');
    }
});

// Process login
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
    })
);

// Process join club request
router.post('/join-club', async (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }

    const { passcode } = req.body;
    if (passcode === process.env.CLUB_PASSCODE) {
        await User.update({ isMember: true }, { where: { id: req.user.id } });
        req.flash('success', 'Welcome to the club!');
    } else {
        req.flash('error', 'Incorrect passcode');
    }
    res.redirect('/');
});

// Logout
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully logged out');
        res.redirect('/');
    });
});

module.exports = router;