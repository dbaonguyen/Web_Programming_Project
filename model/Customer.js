/* RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023A
Assessment: Assignment 2
Author: Nguyen Danh Bao, Nguyen Huu Khoi, Nguyen Anh Tu, Duong Viet Hoang, Le Dac Duy
ID: Nguyen Danh Bao(s3978319), Nguyen Huu Khoi(S3979411), Nguyen Anh Tu(s3975032), Le Dac Duy(s3978210), Duong Viet Hoang(s3962514)
Acknowledgement: Acknowledge the resources that you use here. */

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
    validate: {
      validator: function (value) {
        // Use a regular expression to validate the phone number
        return /^[0-9]{10}$/.test(value); // This regex assumes a 10-digit phone number
      },
      message: "Invalid phone number format, must be a 10-digit number.",
    },
  },
  pfp: {
    type: String,
    default: "default_user.png",
  },
  role: {
    type: String,
    enum: ["customer"],
    default: "customer",
  },
});
({ timestamps: true });

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
