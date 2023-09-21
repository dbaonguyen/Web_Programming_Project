const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const distributionHubSchema = new Schema({
    name :{
      type:String,
      enum: ["Ho Chi Minh","Da Nang", "Ha Noi"]
    },
    orders: [
      {
          type: Schema.Types.ObjectId,
          ref: "Order"
      }
  ]
})



const DistributionHub = mongoose.model("DistributionHub", distributionHubSchema);
module.exports = DistributionHub;