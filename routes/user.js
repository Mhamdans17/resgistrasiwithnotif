const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const auth = require("../middleware/auth");
const verifyTeacher = require('../middleware/adminOnly');

router.post('/', userController.createUser);
router.post('/complete-profile', auth, verifyTeacher, userController.completeTeacherProfile);

module.exports = router;
