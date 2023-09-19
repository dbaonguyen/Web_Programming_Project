// controllers/authController.js
const bcrypt = require("bcryptjs");
const passport = require("passport");
const Customer = require("../model/Customer");
const Vendor = require("../model/Vendor");
const Shipper = require("../model/Shipper");
const DistributionHub = require("../model/DistributionHub");

const authController = {
  // Register a new user
  getRegister: (req, res) => {
    const errorMessages = [];
    res.render("register", {
      errorMessages,
    });
  },
  getRegisterShipper: (req, res) => {
    const errorMessages = [];
    res.render("register_ship", {
      errorMessages,
    });
  },
  getRegisterVendor: (req, res) => {
    const errorMessages = [];
    res.render("register_ven", {
      errorMessages,
    });
  },
  getLogin: (req, res) => {
    res.render("login", { messages: "" });
  },

  register: async (req, res) => {
    try {
      const saltRounds = 10;
      const password = req.body.password;
      const passwordErrors = [];
  
      const registrationType = req.body.registrationType;
      if (password.length < 8 || password.length > 20) {
        passwordErrors.push("Password length must be between 8 and 20 characters");
      }
      if (!/^(?=.*[A-Z])/.test(password)) {
        passwordErrors.push("Password must contain at least one uppercase letter");
      }
      if (!/^(?=.*[a-z])/.test(password)) {
        passwordErrors.push("Password must contain at least one lowercase letter");
      }
      if (!/^(?=.*[0-9])/.test(password)) {
        passwordErrors.push("Password must contain at least one digit");
      }
      if (!/^(?=.*[!@#$%^&*])/.test(password)) {
        passwordErrors.push("Password must contain at least one special character from !@#$%^&*");
      }
  
      if (passwordErrors.length > 0) {
        return res.render("register", {
          errorMessages: passwordErrors,
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      let newUser;
  
      if (registrationType === "vendor") {
        // Create a new Vendor instance with the data
        newUser = new Vendor({
          username: req.body.username,
          password: hashedPassword,
          businessName: req.body.businessName,
          businessAddress: req.body.businessAddress,
          products: [], // Initialize the products array
        });
  
        // Validate the user input
        const validationError = newUser.validateSync();
        if (validationError) {
          const errorMessages = Object.values(validationError.errors).map((error) => error.message);
          return res.render("register-ven", {
            errorMessages,
          });
        }
  
        await newUser.save();
        const vendorId = newUser._id;
  
        // Check if req.body.products is an array before attempting to map it
        if (Array.isArray(req.body.products)) {
          const vendorProducts = req.body.products.map((productData) => ({
            ...productData,
            vendor: vendorId,
          }));
  
          const createdProducts = await Product.create(vendorProducts);
  
          // Update the vendor's products array with the created product IDs
          newUser.products = createdProducts.map((product) => product._id);
          await newUser.save();
        }
  
        res.redirect("/login");
      } else if (registrationType === "customer") {
        // Create a new Customer instance with the data
        newUser = new Customer({
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,
          address: req.body.address,
          phone: req.body.phone,
        });
  
        // Validate the user input
        const validationError = newUser.validateSync();
        if (validationError) {
          const errorMessages = Object.values(validationError.errors).map((error) => error.message);
          return res.render("register", {
            errorMessages,
          });
        }
  
        await newUser.save();
        res.redirect("/login");
      } else if (registrationType === "shipper") {
        const distributionHubName = req.body.distributionHub;
        // Find the 'DistributionHub' document that matches the provided name
        const distributionHub = await DistributionHub.findOne({
          name: distributionHubName,
        });
  
        // Create a new Shipper instance with the data
        newUser = new Shipper({
          username: req.body.username,
          password: hashedPassword,
          distributionHub: distributionHub._id,
        });
  
        // Validate the user input
        const validationError = newUser.validateSync();
        if (validationError) {
          const errorMessages = Object.values(validationError.errors).map((error) => error.message);
          return res.render("register-ship", {
            errorMessages,
          });
        }
  
        await newUser.save();
        res.redirect("/login");
      }
    } catch (error) {
      if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
        // Duplicate username error
        return res.render("register", {
          errorMessages: ["Username has already been used"],
        });
      } else {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    }
  },
  

  // Handle user login
  login: (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.render("login", { messages: "Wrong username or password" }); // Redirect to login page on authentication failure
      }

      // Determine the redirect URL based on the user's role
      let redirectURL = "/vendor";
      console.log("here");
      if (user.role === "customer") {
        redirectURL = "/"; // Redirect vendor to their home page
        console.log("cus here");
      } else if (user.role === "shipper") {
        redirectURL = "/shipper"; // Redirect shipper to their home page
        console.log("ship here");
      } else if (user.role === "vendor") {
        redirectURL = "/vendor";
        console.log("vendor here");
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect(redirectURL);
      });
    })(req, res, next);
  },

  // Handle user logout
  logout: (req, res) => {
    req.logout((err) => {
      if (err) return next();
      res.redirect("/");
    });
  },
};

module.exports = authController;
