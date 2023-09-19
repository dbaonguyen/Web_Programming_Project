const express = require('express');
const route = express.Router();
const services = require('../services/render');
const controller = require('../controllers/ProductController')
const checkAuthentication = require("../middleware/checkAuthentication");
const upload = require("../middleware/upload");
route.get("/vendor",checkAuthentication.checkAuthenticated, services.vendor);

route.get('/add-product',checkAuthentication.checkAuthenticated, services.add_product);

route.get('/update-product', services.update_product);


//api
route.post("/api/products",upload.single('product_image'),checkAuthentication.checkNotAuthenticated, controller.create);
route.get("/api/products", controller.find);
route.put("/api/products/:id", controller.update);
route.delete("/api/products/:id", controller.delete);

module.exports = route;
  