const express = require('express');
const router = express.Router();
const parentProfileController = require('../controller/parentProfile.controller');
const auth = require('../middleware/auth'); // Middleware autentikasi

router.post('/', auth, parentProfileController.completeParentProfile);
router.get('/', auth, parentProfileController.getParentProfile);
router.get('/:id', auth, parentProfileController.getParentProfileById);

module.exports = router;
