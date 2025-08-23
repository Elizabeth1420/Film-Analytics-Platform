const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../utils/apiUtils');

const router = Router();
router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);

// Test route to verify authentication middleware - this only returns if we successfully authenticated the logged in user using their access_token.
// This method will be removed after additional protected endpoints are added.
router.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'You are authenticated!', user: req.user });
});

module.exports = router;
