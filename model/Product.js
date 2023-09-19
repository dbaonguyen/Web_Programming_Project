const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: [5, "Product name can't be shorter than 10 characters"],
    maxlength: [20, "Product name can't be longer than 20 characters"],
  },
  description: {
    type: String,
    required: true,
    maxlength: [500, "Product description has the maximum of 500 characters"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Product price can't be below 0!"],
  },
  size: {
    type: String,
    enum: ["S", "XS", "M", "XM", "L", "XL"],
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Dresses",
      "Skirts",
      "Sweaters",
      "Jeans",
      "Hoodies",
      "T-shirts",
      "Jacket",
      "Short",
      "Shoes",
      "Sun Glasses",
      "Bags",
      "Hats and Caps",
    ],
    required: true,
  },
  image: {
    type: String,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
