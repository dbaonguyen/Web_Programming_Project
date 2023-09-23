
const express = require("express");
const router = express.Router();
const checkAuthentication = require("../middleware/checkAuthentication"); // Assuming you have this middleware
const orderController = require("../controllers/orderController"); // Import the orderController

// Define your order-related routes here

router.get(
  "/shipper",
  checkAuthentication.checkAuthenticated,
  orderController.renderShipperPage
);

router.post("/checkout", orderController.checkoutOrder);

router.get(
  "/view-order/:orderId",
  checkAuthentication.checkAuthenticated,
  orderController.renderOrderDetailsPage
);

router.post(
  "/update-order/:orderId",
  checkAuthentication.checkAuthenticated,
  orderController.updateOrderStatus
);

module.exports = router;
