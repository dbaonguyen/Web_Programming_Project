const express = require("express");
const cors = require('cors');
const path = require('path');
const expressLayoutes = require('express-ejs-layouts');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const config = require('./startup/config');
const winston = require('winston');
const err = require('./middleware/errors');
const customerRoutes = require('./routes/customer-routes');
const session = require("express-session");
const passport = require("passport");
const app = express();

const AuthRoute = require('./routes/auth')

require('./startup/db')();
require('./startup/logging')();
require('./startup/validations')();

app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose
  .connect(
    "mongodb+srv://baond39:bao123@cluster0.jeatohh.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to mongo"))
  .catch((error) => console.log(error.message));


dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(expressLayoutes);
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/cart", (req, res) => {
  res.render("cart");
});
app.get("/add-product", (req, res) => {
  res.render("add-product");
});
app.get("/checkout", (req, res) => {
  res.render("checkout");
});
app.get("/complain", (req, res) => {
  res.render("footer-complain");
});
app.get("/contact", (req, res) => {
  res.render("footer-contact");
});
app.get("/privacy", (req, res) => {
  res.render("footer-privacy");
});
app.get("/property", (req, res) => {
  res.render("footer-property");
});
app.get("/kid", (req, res) => {
  res.render("kid-bags");
});

// app.get("/login", (req, res) => {
//   res.render("login");
// });

// app.get("/register", (req, res) => {
//   res.render("register_cus");
// });

app.get("/men", (req, res) => {
  res.render("men-t-shirts");
});

app.get("/product-details", (req, res) => {
  res.render("product-details");
});

app.get("/register-ship", (req, res) => {
  res.render("register_ship");
});
app.get("/register-ven", (req, res) => {
  res.render("register_ven");
});
app.get("/shipper", (req, res) => {
  res.render("shipper-page");
});
app.get("/vendor", (req, res) => {
  res.render("vendor-page");
});
app.get("/women", (req, res) => {
  res.render("women-sweaters");
});

app.use('/api',AuthRoute);

app.listen(config.port, () => winston.info(`Server listening at url https://localhost:` + config.port));



