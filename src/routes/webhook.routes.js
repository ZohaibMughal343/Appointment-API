const express = require('express');
const router = express.Router();
const { handleStripeWebhook } = require('../controllers/webhook.controller');
const bodyParser = require('body-parser');
router.post(
    '/stripe-webhook',
    bodyParser.raw({ type: 'application/json' }), handleStripeWebhook
);

module.exports = router;