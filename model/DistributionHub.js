const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const distributionHubSchema = new Schema({
    name :{
      type:String,
      enum: ["Ho Chi Minh","Da Nang", "Ha Noi"]
    }
})



const DistributionHub = mongoose.model("DistributionHub", distributionHubSchema);
module.exports = DistributionHub;