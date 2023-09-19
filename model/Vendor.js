const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vendorSchema = new Schema(
  {
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
    // Add other fields specific to Vendor registration
    businessName: {
      type: String,
      // Add validation rules as needed
    },
    businessAddress: {
      type: String,
      // Add validation rules as needed
    },
    pfp: {
      type: String,
    },
    role: {
      type: String,
      enum: ["vendor"],
      default: "vendor",
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;
