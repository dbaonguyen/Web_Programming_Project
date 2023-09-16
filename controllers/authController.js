// controllers/authController.js
const bcrypt = require("bcryptjs");
const passport = require("passport");
const Customer = require("../model/Customer");
const Vendor = require("../model/Vendor");
const Shipper = require("../model/Shipper");

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
    res.render("login", { messages: ""});
  },

  register: async (req, res) => {
    try {
      const saltRounds = 10;
      const password = req.body.password;
      const passwordErrors = [];

      const registrationType = req.body.registrationType;
      if (password.length < 8 || password.length > 20) {
        passwordErrors.push(
          "Password length must be between 8 and 20 characters"
        );
      }
      if (!/^(?=.*[A-Z])/.test(password)) {
        passwordErrors.push(
          "Password must contain at least one uppercase letter"
        );
      }
      if (!/^(?=.*[a-z])/.test(password)) {
        passwordErrors.push(
          "Password must contain at least one lowercase letter"
        );
      }
      if (!/^(?=.*[0-9])/.test(password)) {
        passwordErrors.push("Password must contain at least one digit");
      }
      if (!/^(?=.*[!@#$%^&*])/.test(password)) {
        passwordErrors.push(
          "Password must contain at least one special character from !@#$%^&*"
        );
      }

      if (passwordErrors.length > 0) {
        return res.render("register", {
          errorMessages: passwordErrors,
        });
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      let newUser;
      if (registrationType === "vendor") {
        newUser = new Vendor({
          username: req.body.username,
          password: hashedPassword,
          businessName: req.body.businessName,
          businessAddress: req.body.businessAddress,
        });
      } else if (registrationType === "customer") {
        newUser = new Customer({
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,
          address: req.body.address,
          phone: req.body.phone,
        });
      } else if (registrationType === "shipper") {
        newUser = new Shipper({
          username: req.body.username,
          password: hashedPassword,
          distributionHub: req.body.distributionHub,
        });
      }

      if (req.file) {
        newUser.pfp = req.file.path;
      }

      if (registrationType === "customer") {
        // Create a new Customer instance with the data
        const newCustomer = new Customer(newUser);

        // Validate the user input
        const validationError = newCustomer.validateSync();
        if (validationError) {
          // Extract the error messages from the validation error
          const errorMessages = Object.values(validationError.errors).map(
            (error) => error.message
          );

          return res.render("register", {
            errorMessages,
          });
        }
        // Save the customer data to the database
        await newCustomer.save();
        res.redirect("/login");
      } else if (registrationType === "vendor") {
        // Create a new Customer instance with the data
        const newVendor = new Vendor(newUser);

        // Validate the user input
        const validationError = newVendor.validateSync();
        if (validationError) {
          // Extract the error messages from the validation error
          const errorMessages = Object.values(validationError.errors).map(
            (error) => error.message
          );

          return res.render("register-ven", {
            errorMessages,
          });
        }
        await newVendor.save();
        res.redirect("/login");
      } else {
        // Create a new Customer instance with the data
        const newShipper = new Shipper(newUser);

        // Validate the user input
        const validationError = newShipper.validateSync();
        if (validationError) {
          // Extract the error messages from the validation error
          const errorMessages = Object.values(validationError.errors).map(
            (error) => error.message
          );

          return res.render("register-ship", {
            errorMessages,
          });
        }
        await newShipper.save();
        res.redirect("/login");
      }
    } catch (error) {
      if (
        error.code === 11000 &&
        error.keyPattern &&
        error.keyPattern.username
      ) {
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
        return res.render("login", {messages:"Wrong username or password"}); // Redirect to login page on authentication failure
      }
  
      // Determine the redirect URL based on the user's role
      let redirectURL = "/vendor";
      console.log('here')
      if (user.role === "customer") {
        redirectURL = "/"; // Redirect vendor to their home page
        console.log('cus here')
      } else if (user.role === "shipper") {
        redirectURL = "/shipper"; // Redirect shipper to their home page
        console.log('ship here')
      } else if (user.role === "vendor"){
        redirectURL = "/vendor"
        console.log('vendor here')
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
