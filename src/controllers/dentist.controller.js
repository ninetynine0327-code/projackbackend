const prisma = require("../prisma");

exports.getAllDentists = async (req, res) => {
  try {
    const dentists = await prisma.dentists.findMany();
    res.status(200).json(dentists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createDentist = async (req, res) => {
  try {
    const { full_name, specialization } = req.body;
    const newDentist = await prisma.dentists.create({
      data: {
        full_name: full_name,
        specialization: specialization || "ทันตกรรมทั่วไป"
      }
    });
    res.status(201).json({ message: "เพิ่มทันตแพทย์สำเร็จ", dentist: newDentist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};