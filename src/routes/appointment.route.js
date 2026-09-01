const express = require("express");
const { 
  getAllAppointments, 
  createAppointment, 
  updateAppointmentStatus 
} = require("../controllers/appointment.controller");

const router = express.Router();

router.get("/appointments", getAllAppointments);
router.post("/appointments", createAppointment);
router.patch("/appointments/:id/status", updateAppointmentStatus);

module.exports = router;