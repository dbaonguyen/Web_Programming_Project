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

// route.get ("/api/products", async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) - 1 || 0;
// 		const limit = parseInt(req.query.limit) || 2;
//         const search = req.query.search || "";
//         let sort = req.query.sort || "Best Match";
//         let size = req.query.size || "All";
//         const sizeOptions = [
//             "XL",
// 			"L",
// 			"XM",
// 			"M",
// 			"XS",
// 			"S",
//         ];
//         size === "All"
// 			? (size = [...sizeOptions])
// 			: (size = req.query.size.split(","));
//         req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
//         let sortBy = {};
// 		if (sort[1]) {
// 			sortBy[sort[0]] = sort[1];
// 		} else {
// 			sortBy[sort[0]] = "Best Match";
// 		}
//         const products = await Product.find({ name: { $regex: search, $options: "i" } })
// 			.where("size")
// 			.in([...size])
// 			.sort(sortBy)
// 			.skip(page * limit)
// 			.limit(limit);
//         const total = await Product.countDocuments({
// 			size: { $in: [...size] },
// 			name: { $regex: search, $options: "i" },
// 		});
//         const response = {
// 			error: false,
// 			total,
// 			page: page + 1,
// 			limit,
// 			size: sizeOptions,
// 			products,
// 		};

// 		res.status(200).json(response);
//     } catch (err) {
// 		console.log(err);
// 		res.status(500).json({ error: true, message: "Internal Server Error" });
//     }
// });

//api
route.post("/api/products", controller.create);
route.get("/api/products", controller.find);
route.put("/api/products/:id", controller.update);
route.delete("/api/products/:id", controller.delete);

module.exports = route;
  