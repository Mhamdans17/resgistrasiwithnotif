const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const auth = require("../middleware/auth");

router.post('/', userController.createUser);
router.post('/complete-profile', auth, userController.completeTeacherProfile);

module.exports = router;
