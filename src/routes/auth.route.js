const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// สมัครสมาชิกคนไข้
router.post("/register", authController.register);

// เข้าสู่ระบบคนไข้
router.post("/login/customer", authController.loginCustomer);

// เข้าสู่ระบบพนักงาน
router.post("/login/staff", authController.loginStaff);

module.exports = router;