// controllers/authController.js
const bcrypt = require("bcrypt");
const passport = require("passport");
const Customer = require("../model/Customer");

const authController = {
  // Register a new user
  getRegister: (req, res) => {
    res.render("register");
  },
  getLogin: (req, res) => {
    res.render("login");
  },

  register: async (req, res) => {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

      const newUser = {
        username: req.body.username,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        password: hashedPassword,
      };

      if (req.file) {
        newUser.pfp = req.file.path;
      }

      // Create a new Customer instance with the data
      const newCustomer = new Customer(newUser);

      // Save the customer data to the database
      await newCustomer.save();
      res.redirect("/login");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  // Handle user login
  login: passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  }),

  // Handle user logout
  logout: (req, res) => {
    req.logout((err) => {
      if (err) return next();
      res.redirect("/");
    });
  },
};

module.exports = authController;
