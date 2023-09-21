const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }],
    totalPrice:{
        type: Number
    },
    receiverAddress:{
        type: Schema.Types.ObjectId,
        ref:"Customer"
    },
    status:{
        type: String,
        enum: ["active", "delivered", "canceled"]
    }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;