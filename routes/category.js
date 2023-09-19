const express = require("express");
const router = express.Router();
const Product = require("../model/Product");

router.get("/:categoryName", async (req, res) => {
  try {
    let name = req.isAuthenticated() ? req.user.username : undefined;
    const categoryName = req.params.categoryName;
    console.log(categoryName);
    // Query the database to find all products in the specified category
    const products = await Product.find({
      category: categoryName,
    }).exec();

    // Render an EJS template with the products
    res.render("category-products", { categoryName, products,name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
