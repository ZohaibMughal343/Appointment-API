const express = require('express');
const router = express.Router();
const { createCheckoutSessionController } = require('../controllers/payment.controller');
const verifyAccessToken = require('../middlewares/verifyAccessToken');

router.post('/checkout/:slotId', verifyAccessToken, createCheckoutSessionController);

module.exports = router;
