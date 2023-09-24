/* RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023A
Assessment: Assignment 2
Author: Nguyen Danh Bao, Nguyen Huu Khoi, Nguyen Anh Tu, Duong Viet Hoang, Le Dac Duy
ID: Nguyen Danh Bao(s3978319), Nguyen Huu Khoi(S3979411), Nguyen Anh Tu(s3975032), Le Dac Duy(s3978210), Duong Viet Hoang(s3962514)
Acknowledgement: Acknowledge the resources that you use here. */

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