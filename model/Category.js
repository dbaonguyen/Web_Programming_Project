/* RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023A
Assessment: Assignment 2
Author: Nguyen Danh Bao, Nguyen Huu Khoi, Nguyen Anh Tu, Duong Viet Hoang, Le Dac Duy
ID: Nguyen Danh Bao(s3978319), Nguyen Huu Khoi(S3979411), Nguyen Anh Tu(s3975032), Le Dac Duy(s3978210), Duong Viet Hoang(s3962514)
Acknowledgement: Acknowledge the resources that you use here. */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name :{
      type:String,
      enum: ["Dresses","Skirts", "Sweaters","Jeans","Hoodies","T-Shirts","Jacket","Shorts","Shoes","Sun Glasses","Bags","Hats & Caps"]
    }
})



const Category = mongoose.model("Category", categorySchema);
module.exports = Category;