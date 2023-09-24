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

router.get("/:categoryName", async (req, res) => {
  try {
    let name = req.isAuthenticated() ? req.user.username : undefined;
    const categoryName = req.params.categoryName;
    console.log(categoryName);

    // Get minimum and maximum prices from query parameters
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined; 

    // Get the selected sorting option from the request
    const sortByPrice = req.query.sortByPrice || 'none';

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
    } else if (sortByPrice === 'none') {
      // No sorting, keep the order as is
    } else {
      // Default to ascending order if sortByPrice is not 'asc', 'desc', or 'none'
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
