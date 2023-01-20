const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
var { expressjwt: expressJwt } = require("express-jwt");

// to create web token, we use jsonwebtoken

// express JWT -> everytime user using calls an api, we have to check
// whether he is logged in or not. For that we use express jwt.

exports.signup = async (req, res) => {
    // checking errors
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: errors.array()[0].msg,
            });
        }

        // new object of user with data
        const user = new User(req.body);

        await user.save((err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "Not able to save user",
                });
            }

            res.json({
                name: user.name,
                email: user.email,
                id: user.id,
            });
        });
    } catch (error) {
        console.log(error);
    }
};

exports.signin = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array()[0].msg,
            });
        }

        const { email, password } = req.body;

        User.findOne({ email }, (err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: "User does not exist",
                });
            }

            // user found
            console.log(user);
            if (!user.authenticate(password)) {
                return res.status(400).json({
                    error: "Email and password are not matching",
                });
            }

            // create token
            const token = jwt.sign({ _id: user._id }, process.env.SECRET);

            // put token in cookie
            res.cookie("token", token, { expire: new Date() + 999 });

            req.profile = user;

            const { _id, name, email, role } = user;
            res.status(200).json({
                token: token,
                _id: _id,
                name: name,
                email: email,
                role: role,
            });
        });
    } catch (error) {
        console.log(error);
    }
};

exports.signout = (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({
            message: "user signout successfully",
        });
    } catch (error) {
        console.log(error);
    }
};

exports.testRoute = (req, res) => {
    res.send("Protected route");
};

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
});

exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: "Access Denied",
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 1) {
        next();
    } else {
        return res.status(403).json({
            error: "You are not admin",
        });
    }
};
