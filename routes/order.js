const express = require("express");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const {
    getOrderById,
    createOrder,
    getAllOrders,
    getOrderStatus,
    updateStatus,
} = require("../controllers/order");
const { updateStock } = require("../controllers/product");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const router = express.Router();

router.param("userId", getUserById);
router.param("orderId", getOrderById);

router.post(
    "/order/create/:userId",
    isSignedIn,
    isAuthenticated,
    pushOrderInPurchaseList,
    updateStock,
    createOrder
);

router.get(
    "/order/all/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    getAllOrders
);

router.get(
    "/order/status/:userId",
    isSignedIn,
    isAuthenticated,
    getOrderStatus
);
router.put(
    "/order/:orderId/status/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateStatus
);
module.exports = router;
