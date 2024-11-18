const User = require("../models/userModel");

// Create token and saving in cookies
const sendToken = (user, statusCode, res) => {
    const token = user.getJWTTOKEN();

    // Options for cookies
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // Change into days, minutes, seconds, milliseconds
        ),
        httpOnly: true,
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user,
    });
};

module.exports = sendToken;
