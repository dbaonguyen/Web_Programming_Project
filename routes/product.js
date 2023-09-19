const express = require('express');
const router = express.Router();
const Product = require('../model/Product');
const multer = require('multer');
const fs = require('fs')

// image upload
var storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null, './uploads');
  },
  filename: function(req,file,cb) {
    cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname)
  }
});

var upload = multer({
  storage: storage,
}).single('image');

//add a product
router.post("/add-product", upload, async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.file.filename,
      category: req.body.category,
      size: req.body.size
    });

    await product.save();
    res.redirect("/vendor");
  } catch (err) {
    res.json({ message: err.message});
  }
});

//Get all products
router.get("/vendor", async (req, res) => {
  try {
    const products = await Product.find().exec();
    res.render("vendor-page", { products });
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.get("/add-product", (req,res) => {
  res.render('add-product')
});

//Update a product by finding id
router.get('/update-product/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).exec();

    if (product === null) {
      res.redirect("/vendor");
    } else {
      res.render("update-product", { product });
    }
  } catch (err) {
    res.redirect("/vendor");
  }
});

//update product route
router.post('/update-product/:id', upload, async (req, res) => {
  const id = req.params.id;
  let new_image = '';

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync('./uploads/' + req.body.old_image);
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
      size: req.body.size
    }).exec();

    if (!updatedProduct) {
      return res.json({ message: 'Product not found' });
    }

    res.redirect("/vendor");
  } catch (err) {
    res.json({ message: err.message });
  }
});

//Delete a product
router.get("/delete-product/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Product.findById(id).exec();

    if (!product) {
      return res.json({ message: "Product not found" });
    }

    if (product.image !== "") {
      try {
        fs.unlinkSync('./uploads/' + product.image);
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
});


module.exports = router;












/*const express = require('express');
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
route.get('/api/products', async (req, res) => {
    try {
      const { size, price } = req.query;
      const filter = {};
      if (size) filter.size = size;
      if (price) filter.price = price;
      const products = await Product.find(filter);
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
  });
route.put("/api/products/:id", controller.update);
route.delete("/api/products/:id", controller.delete);

module.exports = route; */