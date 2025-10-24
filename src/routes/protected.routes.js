const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Route accessible by any authenticated user ('user' or 'administrator')
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: `Welcome user ${req.user.id}. This is your protected profile.`,
    user: req.user
  });
});

// Route accessible ONLY by administrators
router.get('/admin-dashboard', [verifyToken, isAdmin], (req, res) => {
  res.json({
    message: "Welcome to the Admin Dashboard. Only admins can see this."
  });
});

module.exports = router;