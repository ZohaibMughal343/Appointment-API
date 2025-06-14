const { getAvailableSlots, bookSlot, cancelSlotBooking, updateSlot, fetchUserAppointments, getAppointmentByIdService, } = require('../services/appointment.service');
const ApiResponse = require("../utilis/ApiResponse");


// Select Slot Controller

const slotController = async (req, res, next) => {
  try {
    const { date } = req.params;

    const slots = await getAvailableSlots(date);

    const response = new ApiResponse(200, `Available Slot(s) on ${date}`, slots);
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};

// Appontment Booking Controller

const bookAppointment = async (req, res, next) => {
  const { date, time, patientDetails } = req.body;

  try {
    const result = await bookSlot(date, time, patientDetails, req.user._id);

    const response = new ApiResponse(201, "Your appointment is pending. Please complete the payment to confirm", result);
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};

// Appontment Cancel Controller

const cancelAppointment = async (req, res, next) => {
  const slotId = req.params.id;
  const userId = req.user?._id;

  try {
    const result = await cancelSlotBooking(slotId, userId);
    const response = new ApiResponse(200, 'Appointment cancelled successfully', result);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Appontment Update Controller

const updateAppointment = async (req, res, next) => {
  const { id } = req.params;
  const { date, time, patientDetails } = req.body;

  try {
    const updatedSlot = await updateSlot(id, date, time, patientDetails, req.user._id);
    const response = new ApiResponse(200, 'Appointment updated successfully', updatedSlot);
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};

// See Appointments Controller

const getUserAppointments = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const appointments = await fetchUserAppointments(userId);

    const response = new ApiResponse(200, 'Your Appointments', appointments);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

// Get Signle Appointments

const getAppointmentById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const appointment = await getAppointmentByIdService(id);
    const response = new ApiResponse(200, 'Appointment fetched successfully', appointment);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  slotController,
  bookAppointment,
  cancelAppointment,
  updateAppointment,
  getUserAppointments,
  getAppointmentById
};
