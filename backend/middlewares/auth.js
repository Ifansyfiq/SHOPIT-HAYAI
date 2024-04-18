import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

// check if users are authenticated or not
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const {token} = req.cookies;

    if(!token) {
        return next(new ErrorHandler("Login first to access this resource.", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
}); 