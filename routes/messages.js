const express = require('express');
const router = express.Router();
const { Message, User } = require('../models');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Create message
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, text } = req.body;
    await Message.create({
      title,
      text,
      userId: req.user.id
    });
    req.flash('success', 'Message posted successfully');
    res.redirect('/');
  } catch (err) {
    req.flash('error', 'Error creating message');
    res.redirect('/');
  }
});

// Delete message (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await Message.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;