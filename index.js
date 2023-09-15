const express = require("express");
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const err = require('./middleware/errors');
const morgan = require("morgan")
const session = require("express-session");
const passport = require("passport");
const Customer = require('./model/Customer');
const productRoute = require("./routes/product");
const LocalStrategy = require("passport-local");
const methodOverride = require('method-override');
const flash = require('express-flash');
const PORT = process.env.PORT || 3000;
const app = express();
const initializePassport = require('./middleware/passport-config')
if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}




initializePassport(passport, 
  async (username) => await Customer.findOne({ username: username }),
  async (id) => await Customer.findOne({ _id: id })
);


app.use(express.static(path.join(__dirname + '../public')));


mongoose
  .connect(
    "mongodb+srv://baond39:bao123@cluster0.jeatohh.mongodb.net/?retryWrites=true&w=majority"
  ,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to mongo"))
  .catch((error) => console.log(error.message));


dotenv.config();


// app.use(expressLayoutes);
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(bodyParser.json({limit:"50mb"}));
app.use(express.static("public"));
app.use(morgan("common"));
app.use("/product", productRoute);
app.use(flash());
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))

app.get("/", checkAuthenticated,(req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("index",{name}) 
});

app.get('/login', checkNotAuthenticated, (req,res) => {
  res.render("login")
})

app.get("/register", checkNotAuthenticated, (req,res) =>{
  res.render('register')
})

app.delete("/logout", (req,res)=>{
    req.logout(req.user, err =>{
      if (err) return next()
      res.redirect("/")
    })
})

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const data = {
      username: req.body.username,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
      password: hashedPassword
    };

    await Customer.create(data);
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/login",checkNotAuthenticated,passport.authenticate("local",{
  successRedirect:"/",
  failureRedirect:"/login",
  failureFlash:true
}));

function checkAuthenticated(req,res,next){
  if (req.isAuthenticated()){
    return next()
  }
  res.redirect("/login")
}

function checkNotAuthenticated(req,res,next){
  if (req.isAuthenticated()){
    return res.redirect("/")
  }
  next()
}


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

app.get('/register', (req,res) =>{
  res.render('register');
})

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


app.listen(PORT, console.log("Server start for port: " + PORT));



