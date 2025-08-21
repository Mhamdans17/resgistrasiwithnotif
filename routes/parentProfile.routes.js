const express = require('express');
const router = express.Router();
const parentProfileController = require('../controller/parentProfile.controller');
const auth = require('../middleware/auth'); // Middleware autentikasi
const parenOnly = require('../middleware/userOnly');

router.post('/', auth, parenOnly, parentProfileController.completeParentProfile);
router.get('/', auth, parentProfileController.getParentProfile);
router.get('/:id', auth, parentProfileController.getParentProfileById);

module.exports = router;
