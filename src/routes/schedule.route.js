const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller');

router.get('/schedules', scheduleController.getAllSchedules);
router.post('/schedules', scheduleController.createSchedule); // เพิ่มบรรทัดนี้

module.exports = router;