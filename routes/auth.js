// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const checkAuthentication = require("../middleware/checkAuthentication");
const upload = require("../middleware/upload");

// Homepage route (unchanged)
router.get("/", checkAuthentication.checkAuthenticated, (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("index", { name });
});

// Login route
router.get("/login", checkAuthentication.checkNotAuthenticated, authController.getLogin);

// Register route
router.get("/register", checkAuthentication.checkNotAuthenticated, authController.getRegister);

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
