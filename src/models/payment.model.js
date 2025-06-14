const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Slot",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'usd',
  },
  paymentIntentId: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
  status: {
    type: String,
    enum: ['succeeded', 'failed', 'pending','refunded'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded', 'partial_refund'],
    default: 'unpaid',
  },
  stripeSessionId: {
    type: String,
    default: null,
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
