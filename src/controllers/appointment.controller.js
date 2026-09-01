const prisma = require("../prisma");

// จองคิวนัดหมาย
const createAppointment = async (req, res) => {
  try {
    const { user_id, dentist_id, appointment_date, time_slot, notes } = req.body;

    const targetDentistId = Number(dentist_id) || 1;
    const targetUserId = Number(user_id) || 1;

    // ตรวจสอบหรือสร้างข้อมูลทันตแพทย์อัตโนมัติป้องกัน Foreign Key Error
    await prisma.dentists.upsert({
      where: { id: targetDentistId },
      update: {},
      create: {
        id: targetDentistId,
        full_name: "ทพญ. พิมพ์ชนก วงศ์ทันตกรรม",
        specialization: "ทันตกรรมทั่วไป"
      }
    });

    const newAppointment = await prisma.appointments.create({
      data: {
        user_id: targetUserId,
        dentist_id: targetDentistId,
        appointment_date: new Date(appointment_date),
        time_slot: new Date(`1970-01-01T${time_slot}:00.000Z`),
        notes: notes || null,
        status: "PENDING"
      },
      include: {
        user: true,
        dentist: true
      }
    });

    res.status(201).json({
      message: "จองคิวสำเร็จ",
      appointment: newAppointment
    });
  } catch (error) {
    console.error("Appointment Error:", error);
    res.status(500).json({ message: "ไม่สามารถบันทึกนัดหมายได้", error: error.message });
  }
};

// ดึงรายการนัดหมายทั้งหมด
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointments.findMany({
      include: {
        user: { select: { id: true, full_name: true, phone_number: true } },
        dentist: { select: { id: true, full_name: true, specialization: true } }
      },
      orderBy: { appointment_date: "asc" }
    });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลนัดหมายได้", error: error.message });
  }
};

// อัปเดตสถานะนัดหมาย (PENDING, CONFIRMED, COMPLETED, CANCELLED)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.appointments.update({
      where: { id: Number(id) },
      data: { status }
    });

    res.status(200).json({ message: "อัปเดตสถานะสำเร็จ", appointment: updated });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถอัปเดตสถานะได้", error: error.message });
  }
};

module.exports = { createAppointment, getAllAppointments, updateAppointmentStatus };