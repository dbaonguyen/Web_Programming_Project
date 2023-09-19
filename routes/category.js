const express = require("express");
const router = express.Router();
const Product = require("../model/Product");

router.get("/category/:categoryName", async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    console.log(categoryName)
    // Query the database to find all products in the specified category
    const productsInCategory = await Product.find({
      category: categoryName,
    }).exec();

    // Render an EJS template with the products
    res.render("category-products", { categoryName, productsInCategory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
