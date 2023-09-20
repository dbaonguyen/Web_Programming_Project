// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const session = require("express-session");
const authController = require("../controllers/authController");
const checkAuthentication = require("../middleware/checkAuthentication");
const upload = require("../middleware/upload");
const Vendor = require("../model/Vendor");
const Product = require("../model/Product");

// Homepage route (unchanged)
router.get("/", async (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;

  try {
    if (req.user.role === "customer") {
      try {
        const products = await Product.find().limit(10); // Fetch all products from the main product schema

        const womenCategories = ["Dresses", "Skirts", "Sweaters", "Jeans"];
        const menCategories = ["Hoodies", "T-Shirts", "Jacket", "Short"];
        const kidsCategories = ["Shoes", "Sun Glasses", "Bags", "Hats & Caps"];

        // Filter products into respective categories
        const womenCategoriesProducts = products.filter((product) =>
          womenCategories.includes(product.category)
        );
        const menCategoriesProducts = products.filter((product) =>
          menCategories.includes(product.category)
        );
        const kidsCategoriesProducts = products.filter((product) =>
          kidsCategories.includes(product.category)
        );

        res.render("index", {
          products,
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
        const vendor = await Vendor.findById(req.user._id).populate("products");
        // Extract the vendor's products
        const products = vendor.products;
        res.render("vendor-page", { products, name });
      } catch (err) {
        res.json({ message: err.message });
      }
    } else if (req.user.role === "shipper") {
      res.render("shipper-page", { name });
    } else {
      console.log("something went wrong!");
    }
  } catch (error) {
    console.log(error);
  }
  try {
    const products = await Product.find().limit(10); // Fetch all products from the main product schema

    const womenCategories = ["Dresses", "Skirts", "Sweaters", "Jeans"];
    const menCategories = ["Hoodies", "T-Shirts", "Jacket", "Short"];
    const kidsCategories = ["Shoes", "Sun Glasses", "Bags", "Hats & Caps"];

    // Filter products into respective categories
    const womenCategoriesProducts = products.filter((product) =>
      womenCategories.includes(product.category)
    );
    const menCategoriesProducts = products.filter((product) =>
      menCategories.includes(product.category)
    );
    const kidsCategoriesProducts = products.filter((product) =>
      kidsCategories.includes(product.category)
    );

    res.render("index", {
      products,
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
