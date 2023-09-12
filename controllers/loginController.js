const Customer = require("../model/Customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const register = (req, res, next) => {
//     let customer = new Customer({
//         username: req.body.username,
//         address: req.body.address,
//         email: req.body.email,
//         phone: req.body.phone,
//     });

//     bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
//         if (err) {
//             res.json({
//                 error: err,
//             });
//         } else {
//             customer.password = hashedPass; // Set the hashed password

//             customer.save()
//                 .then((savedCustomer) => {
//                     res.json({
//                         message: 'Customer registered successfully!',
//                         customer: savedCustomer,
//                     });
//                 })
//                 .catch((error) => {
//                     res.json({
//                         message: 'An error occurred during registration!',
//                         error: error,
//                     });
//                 });
//         }

//     });

// };

const registerView = (req, res) => {
  res.render("register", {});
};
// For View
const loginView = (req, res) => {
  res.render("login", {});
};

//js
//Post Request that handles Register
const registerUser = (req, res) => {
  const { username, email, phone, password, confirm } = req.body;
  if (!username || !email || !password || !confirm) {
    console.log("Fill empty fields");
  }
  //Confirm Passwords
  if (password !== confirm) {
    console.log("Password must match");
  } else {
    //Validation
    User.findOne({ email: email }).then((user) => {
      if (user) {
        console.log("email exists");
        res.render("register", {
          username,
          email,
          password,
          confirm,
        });
      } else {
        //Validation
        const newUser = new User({
          username,
          email,
          location,
          password,
        });
        //Password Hashing
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(res.redirect("/login"))
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
};

module.exports = {
  registerView,
  loginView,
};
