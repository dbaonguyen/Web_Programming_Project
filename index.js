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
const Order = require('./model/Order');
const DistributionHub = require('./model/DistributionHub')
const Customer = require("./model/Customer");
const Product = require("./model/Product");
const productRoute = require("./routes/product");
const methodOverride = require("method-override");
const flash = require("express-flash");
const authRoutes = require("./routes/auth");
const categoryRouter = require("./routes/category");
const detailRouter = require("./routes/detail");
const Shipper = require("./model/Shipper");
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

app.get("/cart", checkAuthention.checkAuthenticated, (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("cart", { name });
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

app.get(
  "/shipper",
  checkAuthention.checkAuthenticated,
  async (req, res) => {
    try {
      const name = req.isAuthenticated() ? req.user.username : undefined;

      // Find the shipper by ID and populate the associated distributionHub
      const shipper = await Shipper.findById(req.user._id).populate({
        path: "distributionHub",
        populate: {
          path: "orders",
          populate: [
            { path: "customer", select: "username address" }, // Populate the customer's username and address
            { path: "products.product" }, // Populate the products within orders
          ],
        },
      });

      // Extract the distribution hub and its associated orders
      const distributionHub = shipper.distributionHub;
      const distributionHubName = distributionHub
        ? distributionHub.name
        : undefined;
      let orders = distributionHub ? distributionHub.orders : [];

      orders = orders.filter(
        (order) => order.status !== "delivered" && order.status !== "canceled"
      );

      res.render("./home/shipper-page", {
        name,
        distributionHub: distributionHubName,
        orders,
      });
    } catch (err) {
      res.json({ message: err.message });
    }
  }
);

app.post("/checkout", async (req, res) => {
  try {
    // Retrieve the cart data from the request body
    const { cartData } = req.body;

    // Parse the cart data (assuming it's in JSON format)
    const parsedCartData = JSON.parse(cartData);

    // Function to clean up the price values and convert them to numbers
    function cleanAndParsePrice(priceString) {
      // Remove non-numeric characters and convert to a number
      return parseFloat(priceString.replace(/[^0-9.]/g, ""));
    }

    // Clean up the price values in the cart data
    const cleanedCartData = parsedCartData.map((item) => ({
      ...item,
      price: cleanAndParsePrice(item.price),
    }));

    // Function to calculate the total price based on the cleaned cart data
    function calculateTotalPrice(cart) {
      return cart.reduce((total, item) => total + item.price, 0);
    }

    // Create a new order based on the cleaned cart data
    const newOrder = new Order({
      products: cleanedCartData,
      totalPrice: calculateTotalPrice(cleanedCartData),
      customer: req.user ? req.user._id : undefined,
      status: "active", // Set the initial status as needed
    });

    const distributionHubs = ["Ho Chi Minh", "Da Nang", "Ha Noi"];
    const selectedHub =
      distributionHubs[Math.floor(Math.random() * distributionHubs.length)];

    // Find the selected distribution hub and add the order to its orders array
    const distributionHub = await DistributionHub.findOne({
      name: selectedHub,
    });
    distributionHub.orders.push(newOrder);
    await distributionHub.save();

    // Capture the checkout date
    const checkoutDate = new Date().getTime();

    // Set the checkout date in the newOrder object
    newOrder.checkoutDate = checkoutDate;

    // Save the order to the database
    const order = await newOrder.save();

    // Respond with the created order
    res.status(201).json(order);
  } catch (error) {
    // Handle errors and respond with an error message
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.get(
  "/view-order/:orderId",
  checkAuthention.checkAuthenticated,
  async (req, res) => {
    try {
      const name = req.isAuthenticated() ? req.user.username : undefined;

      // Find the order by ID and populate the associated products and customer
      const order = await Order.findById(req.params.orderId).populate({
        path: "products.product", // Populate the "product" property within each product item
      });

      const productOrders = order.products;

      // Render the order details template with the order data
      res.render("view-order", { name, productOrders, order });
    } catch (err) {
      res.json({ message: err.message });
    }
  }
);

app.post(
  "/update-order/:orderId",
  checkAuthention.checkAuthenticated,
  async (req, res) => {
    try {
      // Get the order ID and status from the request parameters
      const orderId = req.params.orderId;
      const status = req.query.status; // "delivered" or "canceled"

      // Find the order by ID and update its status
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Update the order status
      order.status = status;
      await order.save();

      // Remove the order from the distribution hub
      const distributionHubId = order.distributionHub; // Replace with the actual field that stores the distribution hub ID in your Order schema

      if (status === "delivered") {
        // Handle order as "Delivered"
        // Remove the order ID from the distribution hub's list of orders
        await DistributionHub.findByIdAndUpdate(
          distributionHubId,
          {
            $pull: { orders: orderId },
          },
          { new: true }
        );
      } else if (status === "canceled") {
        // Handle order as "Canceled"
        // Remove the order ID from the distribution hub's list of orders
        await DistributionHub.findByIdAndUpdate(
          distributionHubId,
          {
            $pull: { orders: orderId },
          },
          { new: true }
        );
      }

      // Redirect to the shipper page after successfully updating and removing the order
      res.redirect("/shipper"); // Assuming "/shipper" is the route for the shipper page
    } catch (err) {
      res.json({ message: err.message });
    }
  }
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
