const express = require('express');
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");


// Stripe Web Hook

const webhookRoutes = require('./src/routes/webhook.routes');
app.use('/webhook', webhookRoutes);


// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));


// Routes
const authRoutes = require("./src/routes/auth.routes");
const emailRoutes = require("./src/routes/email.routes");
const patientRoutes = require("./src/routes/patient.routes");
const paymentRoutes = require('./src/routes/payment.routes');
const messageRoutes = require('./src/routes/message.routes').default;

app.use('/api/v1/users', authRoutes);
app.use('/api/v1/email', emailRoutes);
app.use('/api/v1/patient', patientRoutes);
app.use('/api/v1/payment', paymentRoutes);

app.use('/api/v1/messages', messageRoutes);



// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
