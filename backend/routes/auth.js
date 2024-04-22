import express from "express";
import {
    loginUser,
    registerUser,
    logout,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
}
    from "../controllers/authControllers.js";
const router = express.Router();

import { isAuthenticatedUser } from "../middlewares/auth.js";

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser, getUserProfile);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

export default router;