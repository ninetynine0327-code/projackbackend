const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");

// 1. สมัครสมาชิก (Register)
const register = async (req, res) => {
  try {
    const { full_name, phone_number, password, role } = req.body;

    if (!full_name || !phone_number || !password) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    // ตรวจสอบชื่อ-นามสกุล หรือเบอร์โทรศัพท์ซ้ำ
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { full_name: full_name.trim() },
          { phone_number: phone_number.trim() },
        ],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "ชื่อ-นามสกุลหรือเบอร์โทรศัพท์นี้ถูกใช้งานแล้ว" });
    }

    // แฮชรหัสผ่าน
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // บันทึกลงฐานข้อมูล
    const newUser = await prisma.users.create({
      data: {
        full_name: full_name.trim(),
        phone_number: phone_number.trim(),
        password: hashedPassword,
        role: role || "PATIENT",
      },
    });

    res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ",
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        phone_number: newUser.phone_number,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการสมัครสมาชิก", error: error.message });
  }
};

// 2. เข้าสู่ระบบ (Login ด้วย full_name)
const login = async (req, res) => {
  try {
    const { full_name, password } = req.body;

    if (!full_name || !password) {
      return res.status(400).json({ message: "กรุณากรอกชื่อ-นามสกุลและรหัสผ่าน" });
    }

    // ค้นหาผู้ใช้จากชื่อ-นามสกุล
    const user = await prisma.users.findFirst({
      where: { full_name: full_name.trim() },
    });

    if (!user) {
      return res.status(401).json({ message: "ชื่อ-นามสกุลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    // ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "ชื่อ-นามสกุลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    // สร้าง Token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" }
    );

    res.json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        phone_number: user.phone_number,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ", error: error.message });
  }
};

// ส่งออกทั้งสองฟังก์ชัน
module.exports = {
  register,
  login,
};