const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const router = Router();

// Routes for user authentication
router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);
router.get('/logout', authController.logoutUser);

module.exports = router;
