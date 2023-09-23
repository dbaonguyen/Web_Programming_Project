const express = require("express");
const router = express.Router();
const Product = require("../model/Product");
const Vendor = require("../model/Vendor");
const multer = require("multer");
const fs = require("fs");
const checkAuthention = require("../middleware/checkAuthentication");

// image upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image");

//add a product
router.post(
  "/add-product",
  upload,
  checkAuthention.checkAuthenticated,
  async (req, res) => {
    const name = req.isAuthenticated() ? req.user.username : undefined;

    req.session.name = name;
    try {
      const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: req.file.filename,
        category: req.body.category,
        vendor: req.user._id,
      });

      await product.save();

      const vendor = await Vendor.findById(req.user._id);

      // Push the newly created product's ID into the vendor's products array
      vendor.products.push(product._id);

      // Save the vendor with the updated products array
      await vendor.save();
      res.redirect("/vendor");
    } catch (err) {
      res.json({ message: err.message });
    }
  }
);

//Get all products
router.get("/vendor",checkAuthention.checkAuthenticated, async (req, res) => {
  try {
    let name = req.isAuthenticated() ? req.user.username : undefined;
    let shop = req.isAuthenticated() ? req.user.businessName : undefined;
    const vendor = await Vendor.findById(req.user._id).populate("products");
    // Extract the vendor's products
    const products = vendor.products;
    res.render("./home/vendor-page", { products, name, shop });
  } catch (err) {
    res.json({ message: err.message });
  }
});


router.get("/add-product", checkAuthention.checkAuthenticated, (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("add-product", { name });
});

//Update a product by finding id
router.get(
  "/update-product/:id",
  checkAuthention.checkAuthenticated,
  async (req, res) => {
    try {
      let name = req.isAuthenticated() ? req.user.username : undefined;
      const id = req.params.id;
      const product = await Product.findById(id).exec();

      if (product === null) {
        res.redirect("/vendor");
      } else {
        res.render("update-product", { product, name });
      }
    } catch (err) {
      res.redirect("/vendor");
    }
  }
);

//update product route
router.post(
  "/update-product/:id",
  checkAuthention.checkAuthenticated,
  upload,
  async (req, res) => {
    let name = req.isAuthenticated() ? req.user.username : undefined;
    req.session.name = name;
    const id = req.params.id;
    let new_image = "";

    if (req.file) {
      new_image = req.file.filename;
      try {
        fs.unlinkSync("./uploads/" + req.body.old_image);
      } catch (err) {
        console.log(err);
      }
    } else {
      new_image = req.body.old_image;
    }

    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: new_image,
        category: req.body.category,
      }).exec();

      if (!updatedProduct) {
        return res.json({ message: "Product not found" });
      }

      res.redirect("/vendor");
    } catch (err) {
      res.json({ message: err.message });
    }
  }
);

//Delete a product
router.get(
  "/delete-product/:id",
  checkAuthention.checkAuthenticated,
  async (req, res) => {
    const id = req.params.id;
    let name = req.isAuthenticated() ? req.user.username : undefined;
    req.session.name = name;

    try {
      const product = await Product.findById(id).exec();

      if (!product) {
        return res.json({ message: "Product not found" });
      }

      if (product.image !== "") {
        try {
          fs.unlinkSync("./uploads/" + product.image);
        } catch (err) {
          console.error(err);
        }
      }

      const result = await Product.findByIdAndDelete(id).exec();

      if (result) {
        res.redirect("/vendor");
      } else {
        res.json({ message: "Product deletion failed" });
      }
    } catch (err) {
      res.json({ message: err.message });
    }
  }
);

module.exports = router;
