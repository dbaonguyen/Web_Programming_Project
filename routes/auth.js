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
        const vendor = await Vendor.findById(req.user._id).populate("products");
        // Extract the vendor's products
        const products = vendor.products;
        res.render("./home/vendor-page", { products, name });
      } catch (err) {
        res.json({ message: err.message });
      }
    } else if (req.user.role === "shipper") {
      res.render("./home/shipper-page", { name });
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
