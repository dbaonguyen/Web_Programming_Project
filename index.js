const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const err = require("./middleware/errors");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const Customer = require("./model/Customer");
const productRoute = require("./routes/product");
const upload = require('./middleware/upload')
const authController = require('./controllers/authController');
const LocalStrategy = require("passport-local");
const checkAuthention = require("./middleware/checkAuthentication");
const methodOverride = require("method-override");
const flash = require("express-flash");
const authRoutes = require("./routes/auth");

const PORT = process.env.PORT || 3000;
const app = express();
const initializePassport = require("./middleware/passport-config");


if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

initializePassport(
  passport,
  async (username) => await Customer.findOne({ username: username }),
  async (id) => await Customer.findOne({ _id: id })
);

app.use(express.static(path.join(__dirname + "../public")));

mongoose
  .connect(
    "mongodb+srv://baond39:bao123@cluster0.jeatohh.mongodb.net/?retryWrites=true&w=majority"
  ,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to mongo"))
  .catch((error) => console.log(error.message));

dotenv.config();

// app.use(expressLayoutes);
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

app.use(authRoutes);

app.get("/cart", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("cart", { name });
});
app.get("/add-product",  (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("add-product", { name });
});
app.post(
  "/register",
  productImg.single("product-img"),
);
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

app.get("/register-ship", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("register_ship", { name });
});
app.get("/register-ven", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("register_ven", { name });
});
app.get("/shipper", (req, res) => {
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
app.use('/',require('./routes/product'))

app.get("/women", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("women-sweaters", { name });
});

app.listen(PORT, console.log("Server start for port: " + PORT));
