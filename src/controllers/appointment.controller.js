const prisma = require("../prisma");

exports.createAppointment = async (req, res) => {
  try {
    const { user_id, dentist_id, appointment_date, time_slot, notes, patientName, patientPhone, treatment } = req.body;

    const targetDentistId = Number(dentist_id);
    let targetUserId = user_id ? Number(user_id) : null;
    
    if (!targetUserId) {
      const phone = patientPhone ? String(patientPhone).trim() : `08${Date.now().toString().slice(-8)}`;
      let guestUser = await prisma.users.findUnique({
        where: { phone_number: phone }
      });

      if (!guestUser) {
        guestUser = await prisma.users.create({
          data: {
            full_name: patientName ? String(patientName).trim() : "คนไข้ทั่วไป",
            phone_number: phone,
            password: "guest_password",
            role: "user"
          }
        });
      }
      targetUserId = guestUser.id;
    }

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
      include: { user: true, dentist: true }
    });

    return res.status(201).json({ message: "จองคิวสำเร็จ", appointment: newAppointment });
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