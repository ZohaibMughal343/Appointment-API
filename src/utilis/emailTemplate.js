const generateVerificationEmail = (otp) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 450px; margin: 40px auto; padding: 30px 25px; border-radius: 12px; background: linear-gradient(135deg, #f0f8ff, #ffffff); box-shadow: 0 6px 20px rgba(0,0,0,0.08); border: 1px solid #ddd; text-align: center;">
      <h1 style="color: #0081FB; font-size: 24px; margin-bottom: 20px;">🔐 Email Verification</h1>
      <p style="font-size: 16px; color: #555; margin: 10px 0;">Use the OTP below to verify your email address:</p>
      <div style="font-size: 32px; font-weight: 700; color: #0081FB; letter-spacing: 2px; margin: 20px 0; background: #e6f0fe; padding: 15px; border-radius: 8px; display: inline-block;">
        ${otp}
      </div>
      <p style="font-size: 13px; color: #a94442; font-weight: bold; margin-top: 20px;">⚠️ This OTP will expire in 5 minutes.</p>
      <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #888;">If you didn’t request this, you can safely ignore this email.</p>
    </div>
  `;
};

module.exports = generateVerificationEmail;