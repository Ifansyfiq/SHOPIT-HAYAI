import express from "express";
import {
    getProducts,
    newProducts,
    getProductDetails,
    updateProduct,
    deleteProduct
}
    from "../controllers/productControllers.js";
import {
    isAuthenticatedUser,
    authorizeRoles
}
    from "../middlewares/auth.js";
const router = express.Router();

router.route("/products").get(getProducts);
router.route("/products/:id").get(getProductDetails);

router.route("/admin/products").post(isAuthenticatedUser, authorizeRoles("admin"), newProducts);
router.route("/admin/products/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
router.route("/admin/products/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

export default router;