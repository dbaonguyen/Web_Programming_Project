// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const checkAuthentication = require("../middleware/checkAuthentication");
const upload = require("../middleware/upload");

// Homepage route (unchanged)
router.get("/", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("index", { name });
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
