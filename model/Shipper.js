const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shipperSchema = new Schema(
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
    distributionHub: {
      type: Schema.Types.ObjectId,
      ref: 'DistributionHub'
    },
    pfp: {
      type: String,
      default: "default_user.png"
    },
    role: {
      type: String,
      enum: ["shipper"],
      default: "shipper",
    },
  },
  { timestamps: true }
);




const Shipper = mongoose.model("Shipper", shipperSchema);
module.exports = Shipper;
