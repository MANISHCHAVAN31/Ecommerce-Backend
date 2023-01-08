const User = require("../models/userModel");
const { Order } = require("../models/orderModel");

exports.getUserById = async (req, res, next, id) => {
    await User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(404).json({
                error: "User not found in database",
            });
        }

        req.profile = user;
        next();
    });
};

exports.getUser = (req, res) => {
    req.profile.encry_password = undefined;
    req.profile.salt = undefined;
    res.status(200).json(req.profile);
};

exports.getAllUsers = async (req, res) => {
    await User.find().exec((err, users) => {
        if (err || !users) {
            return res.status(400).json({
                error: "No users found",
            });
        }

        return res.status(200).json(users);
    });
};

// TODO: Update is pending
// exports.updateUser = async (req, res) => {
//     await User.update({ _id: req.profile._id }, req.body, (err, user) => {
//         if (err) {
//             console.log(err);
//         }

//         res.json(user);
//     });
// };

// Populate -> Populate allows you to reference documents in other collections.

exports.getUserPurchaseList = async (req, res) => {
    await Order.find({ user: req.profile._id })
        .populate("user", "_id name")
        .exec((err, order) => {
            if (err) {
                return res.status(404).json({
                    error: "No order in this account",
                });
            }

            res.status(200).json(order);
        });
};

exports.pushOrderInPurchaseList = async (req, res, next) => {
    let purchases = [];

    req.body.order.products.froEach((product) => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id,
        });
    });

    // store array in database
    await User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { purchases: purchases } },
        { new: true },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "Unable to update purchase list",
                });
            }

            next();
        }
    );
};
