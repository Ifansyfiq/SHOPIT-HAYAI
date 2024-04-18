import express from "express";
import {
    getProducts,
    newProducts,
    getProductDetails,
    updateProduct,
    deleteProduct
}
    from "../controllers/productControllers.js";
import  {isAuthenticatedUser, authorizeRoles}  from "../middlewares/auth.js";
const router = express.Router();

router.route("/products").get(isAuthenticatedUser, authorizeRoles("admin"), getProducts);
router.route("/admin/products").post(newProducts);

router.route("/products/:id").get(getProductDetails);

router.route("/admin/products/:id").put(updateProduct);
router.route("/admin/products/:id").delete(deleteProduct);

export default router;