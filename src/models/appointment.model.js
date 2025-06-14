const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  booked: {
    type: Boolean,
    default: false,
  },
  AppointmentStatus: {
    type: String,
    default: "pending",
    enum: ["pending", "approved", "cancelled"]
  },
  patientDetails: {
    name: { type: String, trim: true },
    phone: { type: String },
    address: { type: String, trim: true },
  },
  userBookAppointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  holdUntil: {
    type: Date,
    default: null,
  }
}, { timestamps: true });

module.exports = mongoose.model('slot', slotSchema);
