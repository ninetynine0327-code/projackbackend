const prisma = require("../prisma");

exports.createAppointment = async (req, res) => {
  try {
    const { user_id, dentist_id, appointment_date, time_slot, notes, patientName, patientPhone, treatment } = req.body;

    let targetUserId = user_id ? Number(user_id) : null;
    let targetDentistId = dentist_id ? Number(dentist_id) : 1;

    // 1. สร้างทันตแพทย์อัตโนมัติหากยังไม่มี ป้องกัน Foreign Key Constraint Error
    await prisma.dentists.upsert({
      where: { id: targetDentistId },
      update: {},
      create: {
        id: targetDentistId,
        full_name: "ทพญ. พิมพ์ชนก วงศ์ทันตกรรม",
        specialization: "ทันตกรรมทั่วไป"
      }
    });

    // 2. สร้าง User ให้กรณีไม่ได้ล็อกอิน
    if (!targetUserId) {
      const phone = patientPhone || `08${Date.now().toString().slice(-8)}`;
      let user = await prisma.users.findUnique({
        where: { phone_number: phone }
      });

      if (!user) {
        user = await prisma.users.create({
          data: {
            full_name: patientName || "คนไข้ทั่วไป",
            phone_number: phone,
            password: "guest_password",
            role: "user"
          }
        });
      }
      targetUserId = user.id;
    }

    // 3. แปลงชนิดข้อมูลวันที่และเวลาให้ตรงกับ MySQL
    const appDate = new Date(`${appointment_date}T00:00:00.000Z`);
    const timeFormatted = new Date(`1970-01-01T${time_slot || "09:00"}:00.000Z`);

    const newAppointment = await prisma.appointments.create({
      data: {
        user_id: targetUserId,
        dentist_id: targetDentistId,
        appointment_date: appDate,
        time_slot: timeFormatted,
        notes: notes || treatment || "ตรวจสุขภาพฟัน",
        status: "PENDING"
      },
      include: {
        user: true,
        dentist: true
      }
    });

    return res.status(201).json({
      message: "จองคิวสำเร็จ",
      appointment: newAppointment
    });
  } catch (error) {
    console.error("Create Appointment Error:", error);
    return res.status(500).json({ message: "ไม่สามารถบันทึกคิวได้", error: error.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointments.findMany({
      include: {
        user: { select: { id: true, full_name: true, phone_number: true } },
        dentist: { select: { id: true, full_name: true, specialization: true } }
      },
      orderBy: { appointment_date: "asc" }
    });
    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(500).json({ message: "ดึงข้อมูลล้มเหลว", error: error.message });
  }
};