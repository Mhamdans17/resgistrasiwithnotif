const express = require('express');
const router = express.Router();
const studentController = require('../controller/student.controller');
const auth = require('../middleware/auth');
const verifyTeacher = require('../middleware/adminOnly');
const checkParentProfile = require("../middleware/checkParentProfile");

router.post('/', auth, checkParentProfile, studentController.createStudent);
router.post('/:id/assign-nis', auth, verifyTeacher, studentController.assignNis);
router.get("/incomplete", auth, studentController.getIncompleteStudents);

module.exports = router;
