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
const Product = require("./model/Product");
const productRoute = require("./routes/product");
const methodOverride = require("method-override");
const flash = require("express-flash");
const productImg = require("./middleware/product-img");
const authenticateUser = require('./middleware/checkAuthentication')
const authRoutes = require("./routes/auth");




const PORT = process.env.PORT || 3000;
const app = express();
const initializePassport = require("./middleware/passport-config");
const authController = require("./controllers/authController");
const checkAuthention = require("./middleware/checkAuthentication");


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
app.use(bodyParser.json({ }));
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
app.use("",require('./routes/product'));
app.use(express.static('uploads'));

app.use(authRoutes);


app.get("/cart", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("cart", { name });
});
app.get("/add-product", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("add-product", { name });
});
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

// app.get("/product-details", (req, res) => {
//   let name = req.isAuthenticated() ? req.user.username : undefined;
//   res.render("product-details", { name });
// });

app.get("/shipper",authenticateUser.checkAuthenticated, (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("shipper-page", { name });
});
  app.get("/vendor", (req, res) => {
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
}); 


app.get("/women", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("women-sweaters", { name });
});

// app.get("/customer-profile", (req,res) => {
//   let photo = '1.png';
//   res.render("my-profile-cus", {photo : photo})
// })

// app.get("/shipper-profile", (req,res) => {
//   let name = "Unga Bunga1";
//   let photolink = '1.png';
//   let photo = `/img/icon-img/${photolink}`;
//   res.render("my-profile-ship", {photo : photo, name:name})
// })
app.get('/profile', checkAuthention.profileRedirect);
/*app.get("/search", (req,res) => {
  //let searchTerm = req.body.searchTerm;
  //matchedProducts = 
  Product.find({}, function(error, products){
    res.render('found', { products: products }))}
  
  //.then(products => res.render('found', { products: products }))
  //.catch(error => res.send(error));
  //productArray = matchedProducts.toArray();
  //res.redirect("/found");
  
})*/

async function getProduct(arg){
  const item = await Product.find({name: {$regex: arg, $options: 'i'}});
  return item;
}

app.get('/products', (req, res) => {
    getProduct().then(function(foundStuff) {
      res.render('found', { products : foundStuff })
    })
  
  /*Product.find({})
      .then(products => res.render('view-products', { products }))
      .catch(error => res.send(error));*/
  });
app.post("/search", (req, res) => {
  let searchThis = req.body.searchTerm;
  console.log(searchThis);
  getProduct(searchThis).then(function(foundStuff) {
    res.render('found', { products : foundStuff })
  })
})
app.listen(PORT, console.log("Server start for port: " + PORT));
