const Product = require("../models/productModel");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = async (req, res, next, id) => {
    await Product.findById(id).exec((err, product) => {
        if (err) {
            return res.status(404).json({
                error: "Product not found in database",
            });
        }

        req.product = product;
        next();
    });
};

exports.createProduct = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Problem with image",
            });
        }

        const { name, description, price, category, stock } = fields;

        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: "Please include all fields",
            });
        }

        let product = new Product(fields);

        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size is too big",
                });
            }

            // set photo in object
            product.photo.data = fs.readFileSync(file.photo.filepath);
            product.photo.contentType = file.photo.type;
        }

        // save in database
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Not able to create product",
                });
            }

            res.status(200).json(product);
        });
    });
};

/*
NOTE:
    photo is a media file and will take more time to travel to client side.
    We are sending data and file seperately so that data will reach first.

    THIS WILL MAKE APPLICATION VERY FAST.
*/

exports.getProduct = async (req, res) => {
    req.product = undefined;
    res.status(200).json(req.product);
};

// middleware
exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }

    next();
};

exports.updateProduct = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Problem with image",
            });
        }

        let product = req.product;
        product = _.extend(product, fields);

        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size is too big",
                });
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;

            product.save((err, product) => {
                if (err) {
                    return res.status(400).json({
                        error: "Updation of product failed",
                    });
                }

                res.status(200).json(product);
            });
        }
    });
};

exports.deleteProduct = async (req, res) => {
    let product = req.product;

    await Product.deleteOne({ _id: product._id }).exec((err, product) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to delete product",
            });
        }

        res.status(200).json({
            message: "Product deleted successfully",
        });
    });
};

// get all products
// but limiting till 10 products only

exports.getAllProducts = async (req, res) => {
    let limit = req.query.limit ? req.query.limit : 10;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    await Product.find()
        .select("-photo")
        .populate("category")
        .sort([sortBy, "asc"])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "No product found",
                });
            }

            res.json(products);
        });
};

exports.updateStock = async (req, res, next) => {
    let myOperations = req.body.order.products.map((prod) => {
        return {
            updateOne: {
                filter: { _id: prod._id },
                update: { $inc: { stock: -prod.count, sold: +prod.count } },
            },
        };
    });

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if (err) {
            return res.status(400).json({
                error: "Bulk operations failed",
            });
        }

        next();
    });
};
