import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import User from '../models/user.js';
import { getResetPasswordTemplate } from '../utils/emailTemplates.js';
import ErrorHandler from '../utils/errorHandler.js';
import sendToken from '../utils/sendToken.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

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
});

// Reset Password => /api/auth/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {

    // hash the URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400));
    }

    // setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

// get current user profile => /api/me
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req?.user?._id);

    res.status(200).json({
        user,
    });
});

// Update Password => /api/v1/password/update
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req?.user?._id).select('+password'); // select password to compare old password

    // check previous user password
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Old password is incorrect', 400));
    }

    user.password = req.body.password;
    await user.save();

    res.status(200).json({
        success: true,
    });
});


// Update User Profile => /api/v1/me/update
export const updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    const user = await User.findByIdAndUpdate(req.user._id, newUserData, { new: true, });

    res.status(200).json({
        user,
    });
});


// Get all users - ADMIN => /api/v1/admin/users
export const allUsers = catchAsyncErrors(async (req, res, next) => {

    const users = await User.find();


    res.status(200).json({
        users,
    });
});


// Get user details - ADMIN => /api/v1/admin/users/:id
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {

    const users = await User.findById(req.params.id);

    if (!users) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        users,
    });
});


// Update user details - ADMIN => /api/v1/admin/users/:id
export const updateUser = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true
    });

    res.status(200).json({
        user,
    });
});


// Delete user - ADMIN => /api/v1/admin/users/:id
export const deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`, 404));
    }

    // remove avatar from cloudinary - TODO
    

    await user.deleteOne();

    res.status(200).json({
        success: true,
    });
});