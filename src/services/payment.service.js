const Stripe = require('stripe');
const Slot = require('../models/appointment.model');
const Payment = require('../models/payment.model');
const ApiError = require('../utilis/ApiError');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSessionService = async (slotId, userId) => {
  const slot = await Slot.findOne({ _id: slotId, userBookAppointment: userId });

  if (!slot) {
    throw new ApiError(404, 'Appointment not found for this user');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Appointment Booking',
          },
          unit_amount: 5000, // $50.00
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
    metadata: {
      slotId: slot._id.toString(),
      userId: userId.toString(),
    }
  });

  // Create a new payment record
  await Payment.create({
    userId,
    slotId: slot._id,
    amount: 5000,
    currency: 'usd',
    status: 'pending',
    stripeSessionId: session.id
  });

  return {
    sessionId: session.id,
    url: session.url,
  };
};

module.exports = {
  createCheckoutSessionService,
};
