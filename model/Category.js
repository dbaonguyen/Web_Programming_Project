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