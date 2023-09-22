const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number, // Quantity of the product
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
    type: Date, // Date field to store the checkout date
    default: Date.now, // Default value is the current date and time
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
