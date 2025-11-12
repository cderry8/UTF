const express = require('express');
const router = express.Router();
const { loginManager, loginStaff } = require('../controllers/AuthController');

router.post('/login/manager', loginManager);
router.post('/login/staff', loginStaff);

module.exports = router;
