const express = require('express');
const router = express.Router();
const verifyAccessToken = require("../middlewares/verifyAccessToken");
const { slotController, bookAppointment, cancelAppointment, updateAppointment, getUserAppointments, getAppointmentById } = require('../controllers/slot.controller');



// @route GET /api/v1/patient/get-slots
router.get('/get-slots/:date', slotController);

// @route POST /api/v1/patient/book-appointment
router.post('/book-appointment', verifyAccessToken, bookAppointment);

// @route DELETE /api/v1/patient/cancel-appointment/:id
router.delete('/cancel-appointment/:id', verifyAccessToken, cancelAppointment);

// @route PUT /api/v1/patient/update-appointment/:id
router.put('/update-appointment/:id', verifyAccessToken, updateAppointment);

// @route GET /api/v1/patient/patient-appointments
router.get('/patient-appointments', verifyAccessToken, getUserAppointments);

// @route GET /api/v1/patient/appointment
router.get('/appointment/:id', verifyAccessToken, getAppointmentById);


module.exports = router;
