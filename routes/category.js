const express = require("express");
const router = express.Router();
const Product = require("../model/Product");

router.get("/:categoryName", async (req, res) => {
  try {
    let name = req.isAuthenticated() ? req.user.username : undefined;
    const categoryName = req.params.categoryName;
    const size = req.query.size; // Get the size from the query parameter

    // Build the query object
    const query = { category: categoryName };
    if (size && size !== "all") {
      query.size = size;
    }

    // Query the database to find products based on category and size
    const products = await Product.find(query).exec();

    // Render the EJS template with the products, selected size, and category name
    res.render("category-products", { categoryName, products, name, selectedSize: size });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
