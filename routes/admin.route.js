// routes/admin.route.js
const express = require('express');
const router = express.Router();

const { addAdmin, listAdmins } = require('../controller/admin.controller');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// proteksi dengan auth lalu adminOnly
router.post('/add', auth, adminOnly, addAdmin);
router.get('/list', auth, adminOnly, listAdmins);

module.exports = router;
