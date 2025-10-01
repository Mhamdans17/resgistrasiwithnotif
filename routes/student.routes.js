const express = require('express');
const router = express.Router();
const studentController = require('../controller/student.controller');
const auth = require('../middleware/auth');
const verifyTeacher = require('../middleware/adminOnly');
const checkParentProfile = require("../middleware/checkParentProfile");

router.post('/add', auth, checkParentProfile, studentController.createStudent);
router.post('/assign-nis', auth, verifyTeacher, studentController.assignNis);
router.get("/incomplete", auth, verifyTeacher, studentController.getIncompleteStudents);
router.get('/list', auth, studentController.getStudents);

module.exports = router;
