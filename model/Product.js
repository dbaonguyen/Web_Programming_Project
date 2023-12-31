/* RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023A
Assessment: Assignment 2
Author: Nguyen Danh Bao, Nguyen Huu Khoi, Nguyen Anh Tu, Duong Viet Hoang, Le Dac Duy
ID: Nguyen Danh Bao(s3978319), Nguyen Huu Khoi(S3979411), Nguyen Anh Tu(s3975032), Le Dac Duy(s3978210), Duong Viet Hoang(s3962514)
Acknowledgement: Acknowledge the resources that you use here. */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: [10, "Product name can't be shorter than 10 characters"],
    maxlength: [40, "Product name can't be longer than 40 characters"],
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
      "Hats & Caps",
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
