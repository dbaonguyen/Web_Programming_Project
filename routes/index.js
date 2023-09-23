// routes/index.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/", authController.checkAuthenticated, authController.renderIndex);
router.get("/login", authController.checkNotAuthenticated, authController.renderLogin);
router.get("/register", authController.checkNotAuthenticated, authController.renderRegister);
router.delete("/logout", authController.logout);
router.post("/register", authController.checkNotAuthenticated, authController.register);
router.post("/login", authController.checkNotAuthenticated, authController.login);

// Add other routes here...

module.exports = router;
