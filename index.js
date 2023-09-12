const express = require("express");
const cors = require('cors');
const path = require('path');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const err = require('./middleware/errors');
// const productRoute = require('./routes/product');
const session = require("express-session");
const passport = require("passport");
const PORT = process.env.PORT || 3000;
const app = express();

const AuthRoute = require('./routes/login')


mongoose
  .connect(
    "mongodb+srv://baond39:bao123@cluster0.jeatohh.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to mongo"))
  .catch((error) => console.log(error.message));


dotenv.config();
<<<<<<< HEAD
app.use('/', require('./routes/login'));

app.use(expressLayoutes);
=======

>>>>>>> e24642dfdade98e1bc60367cc16c982b5774b1aa
app.set("view engine", "ejs");

// app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));


// app.use(productRoute.routes);
// app.use(err);

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

<<<<<<< HEAD
=======
app.use('/api', AuthRoute);
app.use('/product', productRoute);
>>>>>>> e24642dfdade98e1bc60367cc16c982b5774b1aa

app.listen(PORT, console.log("Server start for port: " + PORT));



