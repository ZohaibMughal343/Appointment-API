const Slot = require('../models/appointment.model');
const Payment = require('../models/payment.model');

exports.processStripeEvent = async (event) => {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const stripeSessionId = session.id;

      // Find the Payment document by stripeSessionId
      const payment = await Payment.findOne({ stripeSessionId });

      if (!payment) {
        console.log('No payment record found for Stripe session ID:', stripeSessionId);
        break;
      }

      // Update payment record
      payment.status = 'succeeded';
      payment.paymentIntentId = session.payment_intent;
      payment.paymentMethod = session.payment_method_types?.[0] || 'card';
      payment.currency = session.currency || 'usd';
      payment.amount = session.amount_total;
      payment.paymentStatus = session.paymentStatus || 'paid'
      await payment.save();

      // Optionally update the corresponding slot
      const slot = await Slot.findById(payment.slotId);
      if (slot) {
        slot.booked = true;
        slot.holdUntil = null;
        await slot.save();
      }

      console.log('Payment and slot updated successfully:', payment._id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};
