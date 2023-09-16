const express = require('express');
const route = express.Router();
const passport = require('passport');

const services = require('../services/render');
const controller = require('../controllers/ProductController')
const checkAuthentication = require("../middleware/checkAuthentication");

route.get("/vendor",checkAuthentication.checkAuthenticated, services.vendor);

route.get('/add-product', services.add_product);

route.get('/update-product', services.update_product);

// route.post('/login', (req, res, next) => {
//     passport.authenticate('local', {
//       successRedirect: '/vendor', 
//       failureRedirect: '/login', 
//     })(req, res, next);
//   });

//api
route.post("/api/products", controller.create);
route.get("/api/products", controller.find);
route.put("/api/products/:id", controller.update);
route.delete("/api/products/:id", controller.delete);

module.exports = route;
  