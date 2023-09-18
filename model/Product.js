const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ["Dresses","Skirts","Sweaters","Jeans","Hoodies","T-shirts","Jacket",
        "Short","Shoes","Sun Glasses","Bags", "Hats and Caps"],
        required: true
    },
    size: {
        type: String,
        enum: ["XL","L","XM","M","XS","S"],
        required: true
    }
});

const Product = mongoose.model("Product", productSchema);
module.exports = {Product};  