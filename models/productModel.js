const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      maxlength: 32,
      trim: true,
    },

    category: {
      type: ObjectId,
      ref: "category",
      required: true,
    },

    stock: {
      type: Number,
    },

    sold: {
      type: Number,
      default: 0,
    },

    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("product", productSchema);
