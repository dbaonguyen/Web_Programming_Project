const express = require('express');
const route = express.Router();
const passport = require('passport');
const Product = require("../model/Product");

const services = require('../services/render');
const controller = require('../controllers/ProductController')
const checkAuthentication = require("../middleware/checkAuthentication");

route.get("/vendor",checkAuthentication.checkAuthenticated, services.vendor);

route.get('/add-product', services.add_product);

route.get('/update-product', services.update_product);

// route.get('/api/products', async (req, res) => {
//     try {
//       const { size, price } = req.query;
//       const filter = {};
//       if (size) filter.size = size;
//       if (price) filter.price = price;
//       const products = await Product.find(filter);
//       res.status(200).json(products);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: true, message: 'Internal Server Error' });
//     }
//   });

//api
route.post("/api/products", controller.create);
route.get("/api/products", controller.find);
route.put("/api/products/:id", controller.update);
route.delete("/api/products/:id", controller.delete);

module.exports = route;