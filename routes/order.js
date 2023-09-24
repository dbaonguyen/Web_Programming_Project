/*RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023A
Assessment: Assignment 2
Author: Nguyen Danh Bao, Nguyen Huu Khoi, Nguyen Anh Tu, Duong Viet Hoang, Le Dac Duy
ID: Nguyen Danh Bao(s3978319), Nguyen Huu Khoi(S3979411), Nguyen Anh Tu(s3975032), Le Dac Duy(s3978210), Duong Viet Hoang(s3962514)
Acknowledgement: Acknowledge the resources that you use here.*/

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
