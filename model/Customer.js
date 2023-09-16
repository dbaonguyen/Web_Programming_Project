const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  username: {
    type: String,
    unique: [true, "Username has already been used"],
    required: [true, "Username is required"],
    minLength: [8, "Username can't be shorter than 8 characters"],
    maxLength: [15, "Username can't be longer than 15 characters"],
    match: [/^[a-zA-Z0-9]+$/, "Username contains only letters and digits"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  address: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  pfp: {
    type: String,
  },
  role: {
    type: String,
    enum: ["customer"],
    default: "customer",
  }
});
({ timestamps: true });

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
