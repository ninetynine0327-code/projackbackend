const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login/customer', authController.loginCustomer);
router.post('/login/staff', authController.loginStaff);

module.exports = router;