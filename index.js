const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const Customer = require("./model/Customer");
const productRoute = require("./routes/product");
const methodOverride = require("method-override");
const flash = require("express-flash");
const productImg = require("./middleware/product-img");
const authenticateUser = require('./middleware/checkAuthentication')
const authRoutes = require("./routes/auth");
const axios = require('axios');

const PORT = process.env.PORT || 3000;
const app = express();
const initializePassport = require("./middleware/passport-config");


if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

initializePassport(
  passport,
  async (username, userType) => {
    if (userType === 'customer') {
      return await Customer.findOne({ username: username });
    } else if (userType === 'vendor') {
      return await Vendor.findOne({ username: username });
    } else if (userType === 'shipper') {
      return await Shipper.findOne({ username: username });
    } else {
      return null; // Handle unrecognized roles appropriately
    }
  },
  async (id, userType) => {
    if (userType === 'customer') {
      return await Customer.findOne({ _id: id });
    } else if (userType === 'vendor') {
      return await Vendor.findOne({ _id: id });
    } else if (userType === 'shipper') {
      return await Shipper.findOne({ _id: id });
    } else {
      return null; // Handle unrecognized roles appropriately
    }
  }
);

// app.use(axios());
app.use(express.static(path.join(__dirname + "../public")));

mongoose
  .connect(
    "mongodb+srv://baond39:bao123@cluster0.jeatohh.mongodb.net/?retryWrites=true&w=majority"
  ,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to mongo"))
  .catch((error) => console.log(error.message));

dotenv.config();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static("public"));
app.use(morgan("common"));
app.use("/product", productRoute);
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use('/',require('./routes/product'));

app.use(authRoutes);

app.get("/cart", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("cart", { name });
});
app.get("/add-product",  (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("add-product", { name });
});
// app.post(
//   "/register",
//   productImg.single("product-img"),
// );
app.get("/checkout", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("checkout", { name });
});
app.get("/complain", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("footer-complain", { name });
});
app.get("/contact", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("footer-contact", { name });
});
app.get("/privacy", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("footer-privacy", { name });
});
app.get("/property", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("footer-property", { name });
});
app.get("/kid", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("kid-bags", { name });
});

app.get("/men", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("men-t-shirts", { name });
});

app.get("/product-details", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("product-details", { name });
});

app.get("/shipper",authenticateUser.checkAuthenticated, (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("shipper-page", { name });
});
/*  app.get("/vendor", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("vendor-page", { name });
});
app.get('/add-product',(req,res) =>{
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render('add-product',{name})
});
app.get('/update-product',(req,res) =>{
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render('update-product',{name})
}); */


app.get("/women", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("women-sweaters", { name });
});

app.listen(PORT, console.log("Server start for port: " + PORT));
