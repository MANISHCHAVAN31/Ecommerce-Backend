const express = require("express");
const {
    signup,
    signin,
    signout,
    isSignedIn,
    testRoute,
    isAuthenticated,
    isAdmin,
} = require("../controllers/auth");
const router = express.Router();
const { check } = require("express-validator");

router.post(
    "/register",
    [
        check("name", "Name should be at least 3 characters").isLength({
            min: 3,
        }),
        check("email", "Email is required").isEmail(),
        check("password", "Password should be at least 3 characters").isLength({
            min: 3,
        }),
    ],
    signup
);

router.post(
    "/login",
    [
        check("email", "Email is required").isEmail(),
        check("password", "Password is required").isLength({
            min: 3,
        }),
    ],
    signin
);

router.get("/logout", signout);

router.get("/test", isSignedIn, testRoute);

module.exports = router;
