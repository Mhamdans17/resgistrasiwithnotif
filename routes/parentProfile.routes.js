const express = require('express');
const router = express.Router();
const parentProfileController = require('../controller/parentProfile.controller');
const auth = require('../middleware/auth');
const parenOnly = require('../middleware/userOnly');
const adminOnly = require('../middleware/adminOnly')

router.post('/update-profile', auth, parenOnly, parentProfileController.completeParentProfile);
router.get('/get-profile', auth, parentProfileController.getParentProfile);
router.get('/:id', auth, adminOnly, parentProfileController.getParentProfileById);

module.exports = router;
