const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
      name: String, // Add a field for product name
      image: String, // Add a field for product image
      price: Number, // Add a field for product price
    },
  ],
  totalPrice: {
    type: Number,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
  },
  status: {
    type: String,
    enum: ["active", "delivered", "canceled"],
  },
  checkoutDate: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
