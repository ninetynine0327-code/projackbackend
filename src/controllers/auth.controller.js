const prisma = require("../prisma");

// ================= 1. สมัครสมาชิก (คนไข้) =================
const register = async (req, res) => {
  try {
    const { full_name, phone_number, password } = req.body;
    
    if (!full_name || !phone_number || !password) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const existingUser = await prisma.users.findFirst({
      where: { phone_number: String(phone_number) }
    });

    if (existingUser) {
      return res.status(400).json({ message: "เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว" });
    }

    // สร้างข้อมูลใหม่ (DB จะเติม role 'user' ให้อัตโนมัติ)
    const newUser = await prisma.users.create({
      data: {
        full_name: String(full_name),
        phone_number: String(phone_number),
        password: String(password)
      }
    });

    return res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ",
      user: { id: newUser.id, full_name: newUser.full_name, phone_number: newUser.phone_number }
    });

  } catch (err) {
    console.error("DB ERROR:", err.message);
    return res.status(500).json({ message: "Database Error", error: err.message });
  }
};

// ================= 2. เข้าสู่ระบบคนไข้ =================
const loginCustomer = async (req, res) => {
  try {
    const { phone_number, password } = req.body;

    // เปลี่ยนมาค้นหาด้วยคำว่า "user" ให้ตรงกับโครงสร้างฐานข้อมูลใหม่
    let user = await prisma.users.findFirst({
      where: { 
        phone_number: String(phone_number), 
        role: "user" 
      }
    });

    if (!user || user.password !== String(password)) {
      return res.status(401).json({ message: "เบอร์โทรศัพท์หรือรหัสผ่านไม่ถูกต้อง" });
    }

    const { password: _, ...userData } = user;
    return res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ", user: userData });
  } catch (err) {
    console.error("Login Error:", err.message);
    return res.status(500).json({ message: "Database Error", error: err.message });
  }
};

// ================= 3. เข้าสู่ระบบพนักงาน =================
const loginStaff = async (req, res) => {
  try {
    const { phone_number, password } = req.body;

    // เปลี่ยนมาค้นหาด้วยคำว่า "admin", "staff", "dentist" ให้ตรงกับโครงสร้างฐานข้อมูลใหม่
    let staff = await prisma.users.findFirst({
      where: { 
        phone_number: String(phone_number), 
        role: { in: ["admin", "staff", "dentist"] } 
      }
    });

    if (!staff || staff.password !== String(password)) {
      return res.status(401).json({ message: "ไม่มีสิทธิ์เข้าใช้งาน หรือรหัสผ่านไม่ถูกต้อง" });
    }

    const { password: _, ...staffData } = staff;
    return res.status(200).json({ message: "เข้าสู่ระบบพนักงานสำเร็จ", user: staffData });
  } catch (err) {
    console.error("Login Staff Error:", err.message);
    return res.status(500).json({ message: "Database Error", error: err.message });
  }
};

module.exports = { register, loginCustomer, loginStaff };