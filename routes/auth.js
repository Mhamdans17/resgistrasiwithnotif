const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const userhController = require('../controller/user.controller');
const loginLimiter = require('../middleware/rateLimiter');
const auth = require("../middleware/auth");

router.post('/complete-registration', authController.completeRegistration);
router.post('/login', loginLimiter, authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
