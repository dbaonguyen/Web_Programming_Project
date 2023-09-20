const express = require("express");
const router = express.Router();
const Product = require("../model/Product");

router.get("/:categoryName", async (req, res) => {
  try {
    let name = req.isAuthenticated() ? req.user.username : undefined;
    const categoryName = req.params.categoryName;
    console.log(categoryName);

    // Get minimum and maximum prices from query parameters
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined; 

    // Get the selected sorting option from the request
    const sortByPrice = req.query.sortByPrice || 'asc'; // Default to 'asc' if not provided

    // Define a filter object based on query parameters
    const filter = {
      category: categoryName,
    };

    if (minPrice !== undefined && !isNaN(minPrice)) {
      filter.price = { $gte: minPrice };
    }

    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      if (!filter.price) filter.price = {};
      filter.price.$lte = maxPrice;
    }

      // Define a sort object based on the selected sorting option
      const sort = {};

      if (sortByPrice === 'asc' || sortByPrice === 'desc') {
        sort.price = sortByPrice === 'asc' ? 1 : -1;
      } else {
      // Default to ascending order if sortByPrice is not 'asc' or 'desc'
      sort.price = 1;
    }
    
    // Query the database to find products that match the filter, sorted as per the selected option
    const products = await Product.find(filter)
      .sort(sort)
      .exec();
    
    // Render an EJS template with the products and req object
    res.render("category-products", { categoryName, products, name, req, sortByPrice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
