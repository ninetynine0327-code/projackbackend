const prisma = require('../prisma');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        full_name: true,
        phone_number: true,
        role: true,
        created_at: true
      }
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "ดึงข้อมูลผู้ใช้ล้มเหลว", error: error.message });
  }
};