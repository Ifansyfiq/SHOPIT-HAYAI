import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import User from '../models/user.js';
import ErrorHandler from '../utils/errorHandler.js';

// Register user => /api/auth/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password,
    })

    const token = user.getJwtToken();

    res.status(201).json({
        token,
    });
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



    // create token for user login session
    const token = user.getJwtToken();

    res.status(201).json({
        token,
    });
});