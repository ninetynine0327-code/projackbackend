const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');

router.get('/appointments', appointmentController.getAllAppointments);
router.post('/appointments', appointmentController.createAppointment);

module.exports = router;