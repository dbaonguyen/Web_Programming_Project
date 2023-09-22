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
const Shipper = require('./model/Shipper');
const PORT = process.env.PORT || 3000;
const app = express();
const initializePassport = require("./middleware/passport-config");
const checkAuthention = require("./middleware/checkAuthentication");
const { none } = require("./middleware/upload");

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
app.use("/product", productRoute);
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

app.get("/cart", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("cart", { name });
});
app.get("/product-details", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("product-details", { name });
});
app.get("/add-product", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("add-product", { name });
});
app.get("/checkout", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("checkout", { name });
});

app.get("/product-details", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("product-details", { name });
});

app.get("/add-product", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("add-product", { name });
});
app.get("/update-product", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("update-product", { name });
});

app.get("/profile", checkAuthention.profileRedirect);

app.get("/complain", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("footers-info/footer-complain", { name });
});
app.get("/contact", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("footers-info/footer-contact", { name });
});
app.get("/privacy", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("footers-info/footer-privacy", { name });
});
app.get("/property", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("footers-info/footer-property", { name });
});

async function getProduct(arg) {
  const item = await Product.find({ name: { $regex: arg, $options: "i" } });
  return item;
}

async function getCategoryProduct(arg1, arg2) {
  const item = await Product.find({ name: { $regex: arg1, $options: "i" }, category: arg2 });
  return item;
}


app.get("/shipper",checkAuthention.checkAuthenticated, async (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  const shipper = await Shipper.findById(req.user._id).populate(
    "distributionHub"
  );
  if (shipper && shipper.distributionHub) {
    distributionHubName = shipper.distributionHub.name;
    console.log(distributionHubName);
  }
  res.render("./home/shipper-page", { name, distributionHub: distributionHubName });
});

app.get("/products", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  getProduct().then(function (foundStuff) {
    res.render("found", { products: foundStuff, name });
  });

  /*Product.find({})
      .then(products => res.render('view-products', { products }))
      .catch(error => res.send(error));*/
});
app.post("/search", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  let searchThis = req.body.searchTerm;
  console.log(searchThis);
  getProduct(searchThis).then(function (foundStuff) {
    res.render("found", { products: foundStuff,name });
  });
});
app.listen(PORT, console.log("Server start for port: " + PORT));
