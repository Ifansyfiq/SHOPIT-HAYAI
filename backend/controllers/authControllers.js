import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import User from '../models/user.js';
import { getResetPasswordTemplate } from '../utils/emailTemplates.js';
import ErrorHandler from '../utils/errorHandler.js';
import sendToken from '../utils/sendToken.js';
import sendEmail from '../utils/sendEmail.js';

// Register user => /api/auth/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password,
    })

    sendToken(user, 201, res);
});

// Login user => /api/auth/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // check if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400));
    }

    // finding user in database
    const user = await User.findOne({ email }).select('+password');

    // check if password is correct 
    const isPasswordMatched = await user.comparePassword(password);

    // if user not found
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user, 200, res);
});


// logout user => /api/auth/logout
export const logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        message: 'Logged out',
    });
});


// Forgot password => /api/auth/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    // finding user in database
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    // get reset password
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // create reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

    const message = getResetPasswordTemplate(user?.name, resetUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: "ShopIT-Hayai Password Recovery",
            message,
        });

        res.status(200).json({
            message: `Email sent to: ${user.email}`,
        });
    }
    catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        return next(new ErrorHandler(error?.message, 500));
    }

    sendToken(user, 200, res);
});