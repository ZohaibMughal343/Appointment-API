const verifyOtpServices = require('../services/otpVerify.service');
const ApiResponse = require('../utilis/ApiResponse');
const verifyEmail = async (req, res) => {
    try {
        const { code } = req.body;
        const response = await verifyOtpServices(code);

        return res
            .status(200)
            .json(new ApiResponse(200, 'Email verified successfully', response));
    } catch (error) {
        console.error(error);

        return res
            .status(400)
            .json(new ApiResponse(400, error.message || 'Internal Server Error'));
    }
};

module.exports = verifyEmail;