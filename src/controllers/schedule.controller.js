const prisma = require('../prisma');

// ดึงตารางเวรทั้งหมด
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await prisma.doctor_Schedules.findMany({
      include: { dentist: true },
      orderBy: { work_date: 'asc' }
    });
    return res.status(200).json(schedules);
  } catch (error) {
    return res.status(500).json({ message: "ดึงข้อมูลตารางแพทย์ล้มเหลว", error: error.message });
  }
};

// เพิ่มตารางเวรใหม่
exports.createSchedule = async (req, res) => {
  try {
    const { dentist_id, work_date, start_time, end_time } = req.body;
    
    if (!dentist_id || !work_date || !start_time || !end_time) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const newSchedule = await prisma.doctor_Schedules.create({
      data: {
        dentist_id: Number(dentist_id),
        work_date: new Date(`${work_date}T00:00:00.000Z`),
        start_time: start_time,
        end_time: end_time
      }
    });

    return res.status(201).json({ message: "เพิ่มตารางเวรสำเร็จ", schedule: newSchedule });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "บันทึกข้อมูลล้มเหลว", error: error.message });
  }
};