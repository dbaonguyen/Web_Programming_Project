const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const Customer = require("../model/Customer");
const Vendor = require("../model/Vendor");
const Shipper = require("../model/Shipper");

function initialize(passport) {
  const authenticateUser = async (username, password, done) => {
    try {
      let user = await Customer.findOne({ username: username });

      if (!user) {
        user = await Vendor.findOne({ username: username });
      }

      if (!user) {
        user = await Shipper.findOne({ username: username });
      }

      if (!user) {
        return done(null, false, {
          message: "No user found with that username",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("here")
      if (isPasswordValid) {
        console.log("valid")
        return done(null, user);
      } else {
        console.log("Password Incorrect");
        return done(null, false, { message: "Password Incorrect" });
      }
    } catch (error) {
      console.error(
        `Error during authentication for username: ${username}`,
        error
      );
      return done(error);
    }
  };

  passport.use(
    new LocalStrategy({ usernameField: "username" }, authenticateUser)
  );

  passport.serializeUser((user, done) => {
    done(null, user._id); // Serialize user by their ID
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const customer = await Customer.findById(id);
      if (customer) {
        return done(null, customer);
      }

      const vendor = await Vendor.findById(id);
      if (vendor) {
        return done(null, vendor);
      }

      const shipper = await Shipper.findById(id);
      if (shipper) {
        return done(null, shipper);
      }

      return done(null, false); // User not found
    } catch (error) {
      console.error(error);
      done(error);
    }
  });
}

module.exports = initialize;
