const prisma = require("../prisma");

// สมัครสมาชิก (ค่าเริ่มต้น Role: user)
const register = async (req, res) => {
  try {
    const { full_name, phone_number, password } = req.body;

    if (!full_name || !phone_number || !password) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const existingUser = await prisma.users.findUnique({
      where: { phone_number: String(phone_number).trim() }
    });

    if (existingUser) {
      return res.status(400).json({ message: "เบอร์โทรศัพท์นี้ถูกลงทะเบียนแล้ว" });
    }

    const newUser = await prisma.users.create({
      data: {
        full_name: String(full_name).trim(),
        phone_number: String(phone_number).trim(),
        password: String(password),
        role: "user"
      }
    });

    res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ",
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        phone_number: newUser.phone_number,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "ไม่สามารถสมัครสมาชิกได้", error: error.message });
  }
};

// เข้าสู่ระบบคนไข้ (Role: user)
const loginCustomer = async (req, res) => {
  try {
    const { phone_number, password } = req.body;

    const user = await prisma.users.findFirst({
      where: {
        phone_number: String(phone_number).trim(),
        password: String(password),
        role: "user"
      }
    });

    if (!user) {
      return res.status(401).json({ message: "เบอร์โทรศัพท์หรือรหัสผ่านไม่ถูกต้อง" });
    }

    res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      user: {
        id: user.id,
        full_name: user.full_name,
        phone_number: user.phone_number,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ", error: error.message });
  }
};

// เข้าสู่ระบบเจ้าหน้าที่ (Role: staff, admin, dentist)
const loginStaff = async (req, res) => {
  try {
    const { phone_number, password } = req.body;

    const staffUser = await prisma.users.findFirst({
      where: {
        phone_number: String(phone_number).trim(),
        password: String(password),
        role: { in: ["staff", "admin", "dentist"] }
      }
    });

    if (!staffUser) {
      return res.status(401).json({ message: "ข้อมูลเข้าสู่ระบบเจ้าหน้าที่ไม่ถูกต้อง" });
    }

    res.status(200).json({
      message: "เข้าสู่ระบบเจ้าหน้าที่สำเร็จ",
      user: {
        id: staffUser.id,
        full_name: staffUser.full_name,
        phone_number: staffUser.phone_number,
        role: staffUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ", error: error.message });
  }
};

module.exports = { register, loginCustomer, loginStaff };