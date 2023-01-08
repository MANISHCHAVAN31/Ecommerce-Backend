const Category = require("../models/categoryModel");

exports.getCategoryById = async (req, res, next, id) => {
    await Category.findById(id).exec((err, category) => {
        if (err) {
            return res.status(404).json({
                error: "Category not found n database",
            });
        }

        req.category = category;
        next();
    });
};

exports.createCategory = async (req, res) => {
    const category = new Category(req.body);

    await category.save((err, category) => {
        if (err) {
            return res.status(400).json({
                error: "Not able to create category",
            });
        }

        res.status(200).json(category);
    });
};

exports.getCategory = async (req, res) => {
    res.status(200).json(req.category);
};

exports.getAllCategories = async (req, res) => {
    await Category.find().exec((err, categories) => {
        if (err) {
            return res.status(404).json({
                error: "No category found in database",
            });
        }

        res.status(200).json(categories);
    });
};

exports.updateCategory = async (req, res) => {
    let category = req.category;
    category.name = req.body.name;

    await category.save((err, updatedCategory) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to update category",
            });
        }

        res.status(200).json(updatedCategory);
    });
};

exports.deleteCategory = async (req, res) => {
    const category = req.category;

    await Category.deleteOne({ _id: category._id }).exec((err, category) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to delete category",
            });
        }

        res.status(200).json({
            message: "Category deleted successfully",
        });
    });
};
