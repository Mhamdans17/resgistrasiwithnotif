const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const loginLimiter = require('../middleware/rateLimiter');

router.post('/complete-registration', authController.completeRegistration);
router.post('/login', loginLimiter, authController.login);

module.exports = router;
