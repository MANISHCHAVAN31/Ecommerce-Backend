const { Order } = require("../models/orderModel");

exports.getOrderById = async (req, res, next, id) => {
    await Order.findById(id)
        .populate("products.product", "name price")
        .exec((err, order) => {
            if (err) {
                return res.status(404).json({
                    error: "No order found in database",
                });
            }

            req.order = order;
            next();
        });
};

exports.createOrder = async (req, res) => {
    req.body.order.user = req.profile;

    const order = new Order(req.body.order);

    order.save((err, order) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to save order in database",
            });
        }

        res.status(200).json(order);
    });
};

exports.getAllOrders = async (req, res) => {
    await Order.find()
        .populate("user", "_id name")
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: "No order found",
                });
            }

            res.status(200).json(orders);
        });
};

exports.getOrderStatus = async (req, res) => {
    res.status(200).json(Order.status.path("status").enumValues);
};

exports.updateStatus = async (req, res) => {
    await Order.update(
        { _id: req.body.orderId },
        { $set: { status: req.body.status } },
        (err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "Cannot update order status",
                });
            }

            res.status(200).json(order);
        }
    );
};
