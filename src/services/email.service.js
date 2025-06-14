const nodemailer = require("nodemailer");
const generateVerificationEmail = require("../utilis/emailTemplate");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, otp) => {
  const mailOptions = {
    from: `"From Abdulislam" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email - OTP",
    html: generateVerificationEmail(otp),
  };


  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
