const UserModel = require('../models/user.model');
const ApiError = require('../utilis/ApiError'); 
const verifyEmail = async (code) => {
    const user = await UserModel.findOne({ verficationCode: code });

    if (!user) {
        throw new ApiError(400, 'OTP Invalid or Expired.');
    }

    // Check if OTP expired
    if (user.verficationTokenExpiresAt < new Date()) {
        await UserModel.deleteOne({ _id: user._id }); 
        throw new ApiError(400, 'OTP Expired.');
    }

    user.isEmailVerified = true;
    user.verficationCode = null;
    user.verficationTokenExpiresAt = null;
    await user.save();

    return { success: true, message: 'Email Verified Successfully' };
};

module.exports = verifyEmail;
