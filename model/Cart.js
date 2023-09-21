const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product", // Reference to the product model
        required: true,
    },
    quantity: {
        type: Number,
        default: 1, // Default quantity is 1, you can adjust this as needed
    },
});

const CartItem = mongoose.model("CartItem", cartItemSchema);

module.exports = CartItem;
