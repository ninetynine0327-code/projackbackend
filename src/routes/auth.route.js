const express = require("express");
const { register, loginCustomer, loginStaff } = require("../controllers/auth.controller");

const router = express.Router();

// กำหนด Path สำหรับระบบ Auth
router.post("/auth/register", register);
router.post("/auth/login/customer", loginCustomer);
router.post("/auth/login/staff", loginStaff);

module.exports = router;