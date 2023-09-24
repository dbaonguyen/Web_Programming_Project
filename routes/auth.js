/*RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023A
Assessment: Assignment 2
Author: Nguyen Danh Bao, Nguyen Huu Khoi, Nguyen Anh Tu, Duong Viet Hoang, Le Dac Duy
ID: Nguyen Danh Bao(s3978319), Nguyen Huu Khoi(S3979411), Nguyen Anh Tu(s3975032), Le Dac Duy(s3978210), Duong Viet Hoang(s3962514)
Acknowledgement: Acknowledge the resources that you use here.*/

// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const session = require("express-session");
const authController = require("../controllers/authController");
const checkAuthentication = require("../middleware/checkAuthentication");
const upload = require("../middleware/upload");
const Vendor = require("../model/Vendor");
const Product = require("../model/Product");
const Shipper = require("../model/Shipper");


// Homepage route (unchanged)
router.get("/", async (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;

  try {
    if (req.user.role === "customer") {
      try {
        const womenCategories = ["Dresses", "Skirts", "Sweaters", "Jeans"];
        const menCategories = ["Hoodies", "T-Shirts", "Jacket", "Short"];
        const kidsCategories = ["Shoes", "Sun Glasses", "Bags", "Hats & Caps"];

        // Fetch limited products for each category
        const womenCategoriesProducts = await Product.find({
          category: { $in: womenCategories },
        }).limit(10);

        const menCategoriesProducts = await Product.find({
          category: { $in: menCategories },
        }).limit(10);

        const kidsCategoriesProducts = await Product.find({
          category: { $in: kidsCategories },
        }).limit(10);

        res.render("./home/index", {
          products: [], // You can include all products here if needed.
          name,
          womenCategoriesProducts,
          menCategoriesProducts,
          kidsCategoriesProducts,
        });
      } catch (err) {
        res.json({ message: err.message });
      }
    } else if (req.user.role === "vendor") {
      try {
        let name = req.isAuthenticated() ? req.user.username : undefined;
        let shop = req.isAuthenticated() ? req.user.businessName : undefined;
        const vendor = await Vendor.findById(req.user._id).populate("products");
        // Extract the vendor's products
        const products = vendor.products;
        res.render("./home/vendor-page", { products, name, shop });
      } catch (err) {
        res.json({ message: err.message });
      }
    } else if (req.user.role === "shipper") {
      try {
        const name = req.isAuthenticated() ? req.user.username : undefined;

        // Find the shipper by ID and populate the associated distributionHub
        const shipper = await Shipper.findById(req.user._id).populate({
          path: "distributionHub",
          populate: {
            path: "orders",
            populate: [
              { path: "customer", select: "username address" }, // Populate the customer's username and address
              { path: "products.product" }, // Populate the products within orders
            ],
          },
        });

        // Extract the distribution hub and its associated orders
        const distributionHub = shipper.distributionHub;
        const distributionHubName = distributionHub
          ? distributionHub.name
          : undefined;
        const orders = distributionHub ? distributionHub.orders : [];

        res.render("./home/shipper-page", {
          name,
          distributionHub: distributionHubName,
          orders,
        });
      } catch (err) {
        res.json({ message: err.message });
      }
    } else {
      console.log("something went wrong!");
    }
  } catch (error) {
    console.log(error);
  }
  try {
    const womenCategories = ["Dresses", "Skirts", "Sweaters", "Jeans"];
    const menCategories = ["Hoodies", "T-Shirts", "Jacket", "Short"];
    const kidsCategories = ["Shoes", "Sun Glasses", "Bags", "Hats & Caps"];

    // Fetch limited products for each category
    const womenCategoriesProducts = await Product.find({
      category: { $in: womenCategories },
    }).limit(10);

    const menCategoriesProducts = await Product.find({
      category: { $in: menCategories },
    }).limit(10);

    const kidsCategoriesProducts = await Product.find({
      category: { $in: kidsCategories },
    }).limit(10);

    res.render("./home/index", {
      products: [], // You can include all products here if needed.
      name,
      womenCategoriesProducts,
      menCategoriesProducts,
      kidsCategoriesProducts,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Login route
router.get(
  "/login",
  checkAuthentication.checkNotAuthenticated,
  authController.getLogin
);

// Register route
router.get(
  "/register",
  checkAuthentication.checkNotAuthenticated,
  authController.getRegister
);
router.get(
  "/register-ship",
  checkAuthentication.checkNotAuthenticated,
  checkAuthentication.roleRedirect("shipper", "/"),
  authController.getRegisterShipper
);
router.get(
  "/register-ven",
  checkAuthentication.checkNotAuthenticated,
  checkAuthentication.roleRedirect("vendor", "/"),
  authController.getRegisterVendor
);
// Logout route
router.delete("/logout", authController.logout);

// Register POST route
router.post(
  "/register",
  upload.single("pfp"),
  checkAuthentication.checkNotAuthenticated,
  authController.register
);

// Login POST route
router.post(
  "/login",
  checkAuthentication.checkNotAuthenticated,
  authController.login
);

module.exports = router;
