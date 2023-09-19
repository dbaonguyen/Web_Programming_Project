// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const session = require("express-session");
const authController = require("../controllers/authController");
const checkAuthentication = require("../middleware/checkAuthentication");
const upload = require("../middleware/upload");
const Vendor = require("../model/Vendor");

// Homepage route (unchanged)
router.get("/", checkAuthentication.checkAuthenticated, (req, res) => {
  try {
    let name = req.isAuthenticated() ? req.user.username : undefined;
    req.session.name = name;
    if (req.user.role === "customer") {
      res.render("index", { name });
    } else if (req.user.role === "vendor") {
      try {
        const loggedInVendor = Vendor.findById(req.user._id)
          .populate("products")
          .exec();
        const products = loggedInVendor.products;
        res.render("vendor-page", { products });
      } catch (error) {
        res.json({ message: error.message });
      }
    } else if (req.user.role === "shipper") {
      res.render("shipper-page");
    } else {
      console.log("something went wrong!");
    }
  } catch (error) {
    console.log(error);
    res.render("index");
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
