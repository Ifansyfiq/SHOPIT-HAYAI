import express from "express";
import {
    loginUser,
    registerUser,
    logout,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
    updateProfile,
    getUserDetails,
    allUsers,
}
    from "../controllers/authControllers.js";
const router = express.Router();

import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser, getUserProfile);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

// Admin Routes
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);
router.route("/admin/users/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails);

export default router;