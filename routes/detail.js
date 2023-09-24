/*RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023A
Assessment: Assignment 2
Author: Nguyen Danh Bao, Nguyen Huu Khoi, Nguyen Anh Tu, Duong Viet Hoang, Le Dac Duy
ID: Nguyen Danh Bao(s3978319), Nguyen Huu Khoi(S3979411), Nguyen Anh Tu(s3975032), Le Dac Duy(s3978210), Duong Viet Hoang(s3962514)
Acknowledgement: Acknowledge the resources that you use here.*/

const express = require("express");
const router = express.Router();
const Product = require("../model/Product");

router.get("/product-details/:productId", async (req, res) => {
  try {
    let name = req.isAuthenticated() ? req.user.username : undefined;
    const productId = req.params.productId;
    const product = await Product.findById(productId).exec();
    res.render("product-details", { product, name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
