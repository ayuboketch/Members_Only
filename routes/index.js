// File: routes/index.js
const express = require('express');
const router = express.Router();
const { Message, User } = require('../models');

// Home page
router.get('/', async (req, res) => {
    try {
        const messages = await Message.findAll({
            include: [{
                model: User,
                attributes: ['firstName', 'lastName']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.render('index', {
            title: 'Home',
            messages: messages,
            showAuthor: req.user && req.user.isMember
        });
    } catch (err) {
        console.error(err);
        res.render('index', {
            title: 'Home',
            messages: [],
            showAuthor: false,
            error: 'Error loading messages'
        });
    }
});

// Redirect /login to /auth/login
router.get('/login', (req, res) => {
    res.redirect('/auth/login');
});

// Redirect /signup to /auth/signup
router.get('/signup', (req, res) => {
    res.redirect('/auth/signup');
});

// Redirect /join-club to /auth/join-club
router.get('/join-club', (req, res) => {
    res.redirect('/auth/join-club');
});

module.exports = router;