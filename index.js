/*
RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023A
Assessment: Assignment 2
Author: Nguyen Danh Bao, Nguyen Huu Khoi, Nguyen Anh Tu, Duong Viet Hoang, Le Dac Duy
ID: Nguyen Danh Bao(s3978319), Nguyen Huu Khoi(S3979411), Nguyen Anh Tu(s3975032), Le Dac Duy(s3978210), Duong Viet Hoang(s3962514)
Acknowledgement: Acknowledge the resources that you use here.
*/

const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const url = require("url");
const Customer = require("./model/Customer");
const Product = require("./model/Product");
const productRoute = require("./routes/product");
const methodOverride = require("method-override");
const flash = require("express-flash");
const authRoutes = require("./routes/auth");
const categoryRouter = require("./routes/category");
const detailRouter = require("./routes/detail");
const Shipper = require("./model/Shipper");
const upload = require("./middleware/upload");
const PORT = process.env.PORT || 3000;
const app = express();
const initializePassport = require("./middleware/passport-config");
const checkAuthention = require("./middleware/checkAuthentication");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

initializePassport(
  passport,
  async (username, userType) => {
    if (userType === "customer") {
      return await Customer.findOne({ username: username });
    } else if (userType === "vendor") {
      return await Vendor.findOne({ username: username });
    } else if (userType === "shipper") {
      return await Shipper.findOne({ username: username });
    } else {
      return null; // Handle unrecognized roles appropriately
    }
  },
  async (id, userType) => {
    if (userType === "customer") {
      return await Customer.findOne({ _id: id });
    } else if (userType === "vendor") {
      return await Vendor.findOne({ _id: id });
    } else if (userType === "shipper") {
      return await Shipper.findOne({ _id: id });
    } else {
      return null; // Handle unrecognized roles appropriately
    }
  }
);

app.use(express.static(path.join(__dirname + "../public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
mongoose
  .connect(
    "mongodb+srv://baond39:bao123@cluster0.jeatohh.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to mongo"))
  .catch((error) => console.log(error.message));

dotenv.config();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json({}));
app.use(express.static("public"));
app.use(morgan("common"));

app.use(flash());
app.use(express.json());
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
app.use("", require("./routes/product"));
app.use(express.static("uploads"));
app.use("/category", categoryRouter);
app.use("/", detailRouter);
app.use(authRoutes);
app.use("/product", productRoute);
app.use("", require("./routes/footer-info"));
app.use("", require("./routes/order"));

app.get("/cart", checkAuthention.checkAuthenticated, (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("cart", { name });
});

app.get("/profile", checkAuthention.profileRedirect);

// Handle the profile picture update
app.post(
  "/profile/update-profile",
  upload.single("pfp"),
  checkAuthention.updateProfilePicture
);

async function getProduct(arg) {
  const item = await Product.find({ name: { $regex: arg, $options: "i" } });
  return item;
}

app.get("/products", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  getProduct().then(function (foundStuff) {
    res.render("found", { products: foundStuff, name });
  });
});
app.post("/search", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  let searchThis = req.body.searchTerm;
  console.log(searchThis);
  getProduct(searchThis).then(function (foundStuff) {
    res.render("found", { products: foundStuff, name });
  });
});
app.listen(PORT, console.log("Server start for port: " + PORT));
