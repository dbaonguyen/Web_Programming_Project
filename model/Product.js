const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String
    },
});

const Product = mongoose.model("Product", productSchema);
module.exports = {Product};  