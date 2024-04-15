import express from "express";
import { getProducts } from "../controllers/productControllers.js";
import { newProducts } from "../controllers/productControllers.js";
import { getProductDetails } from "../controllers/productControllers.js";
const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products").post(newProducts);
router.route("/products/:id").get(getProductDetails);

export default router;