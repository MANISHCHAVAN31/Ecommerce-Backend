const express = require("express");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const {
    getProductById,
    createProduct,
    photo,
    getProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/product");
const { getUserById } = require("../controllers/user");
const router = express.Router();

router.param("productId", getProductById);
router.param("userId", getUserById);

router.post(
    "/product/create/:userId",
    isSignedIn,
    isAuthenticated,
    createProduct
);

router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

router.put(
    "/product/:productId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateProduct
);
router.delete(
    "/product/:productId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    deleteProduct
);

module.exports = router;
