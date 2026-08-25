const prisma = require("../prisma");

// สร้างการนัดหมายใหม่
const createAppointment = async (req, res) => {
  try {
    const { user_id, dentist_id, appointment_date, time_slot, notes } = req.body;

    if (!user_id || !dentist_id || !appointment_date || !time_slot) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลการนัดหมายให้ครบถ้วน" });
    }

    const newAppointment = await prisma.appointments.create({
      data: {
        user_id: Number(user_id),
        dentist_id: Number(dentist_id),
        appointment_date: new Date(appointment_date),
        time_slot: new Date(`1970-01-01T${time_slot}:00Z`),
        notes: notes || "",
        status: "PENDING",
      },
      include: {
        dentist: true,
        user: true,
      },
    });

    res.status(201).json({ message: "จองคิวสำเร็จ", appointment: newAppointment });
  } catch (error) {
    console.error("APPOINTMENT ERROR:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการจองคิว", error: error.message });
  }
};

// ดึงรายการนัดหมายทั้งหมด (สำหรับ Dashboard / ตรวจสอบคิว)
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointments.findMany({
      include: {
        user: { select: { id: true, full_name: true, phone_number: true } },
        dentist: { select: { id: true, full_name: true, specialization: true } },
      },
      orderBy: { appointment_date: "asc" },
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลนัดหมาย" });
  }
};

module.exports = { createAppointment, getAllAppointments };