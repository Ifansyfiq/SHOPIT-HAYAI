import express from "express";
import {
    newOrder,
}
    from "../controllers/orderControllers.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";
const router = express.Router();


router.route("/orders/new").post(isAuthenticatedUser, newOrder);

export default router;