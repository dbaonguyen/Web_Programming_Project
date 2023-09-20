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
