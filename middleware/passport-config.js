/* RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023A
Assessment: Assignment 2
Author: Nguyen Danh Bao, Nguyen Huu Khoi, Nguyen Anh Tu, Duong Viet Hoang, Le Dac Duy
ID: Nguyen Danh Bao(s3978319), Nguyen Huu Khoi(S3979411), Nguyen Anh Tu(s3975032), Le Dac Duy(s3978210), Duong Viet Hoang(s3962514)
Acknowledgement: Acknowledge the resources that you use here. */

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
