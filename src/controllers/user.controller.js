const prisma = require("../prisma");

// ดึงรายชื่อคนไข้ทั้งหมด
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
};

// ดึงข้อมูลคนไข้ตาม ID
const getUserById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.users.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "ไม่พบข้อมูลคนไข้" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
};

// เพิ่มคนไข้ใหม่
const createUser = async (req, res) => {
  try {
    const { full_name, phone_number, role } = req.body;

    if (!full_name || !phone_number) {
      return res.status(400).json({ message: "กรุณากรอกชื่อและเบอร์โทรศัพท์" });
    }

    const newUser = await prisma.users.create({
      data: {
        full_name,
        phone_number,
        role: role || "PATIENT"
      }
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถเพิ่มข้อมูลคนไข้ได้", error: error.message });
  }
};

// แก้ไขข้อมูลคนไข้
const updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { full_name, phone_number, role } = req.body;

    const updatedUser = await prisma.users.update({
      where: { id },
      data: { full_name, phone_number, role }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(404).json({ message: "ไม่พบข้อมูลที่ต้องการแก้ไข" });
  }
};

// ลบข้อมูลคนไข้
const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.users.delete({ where: { id } });
    res.json({ message: "ลบข้อมูลคนไข้สำเร็จ" });
  } catch (error) {
    res.status(404).json({ message: "ไม่พบข้อมูลที่ต้องการลบ" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};