const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');

router.post('/complete-registration', authController.completeRegistration);
router.post('/login', authController.login);

module.exports = router;
