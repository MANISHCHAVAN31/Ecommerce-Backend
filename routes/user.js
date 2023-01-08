const express = require("express");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const router = express.Router();

const {
    getUserById,
    getUser,
    getAllUsers,
    updateUser,
    getUserPurchaseList,
} = require("../controllers/user");

router.param("userId", getUserById);
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.get("/user/all", getAllUsers);

// PENDING
// router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

router.get(
    "/orders/user/:userId",
    isSignedIn,
    isAuthenticated,
    getUserPurchaseList
);

module.exports = router;
