const productController = require("../controllers/productController");

const router = require("express").Router();

//add Product
router.post("/", productController.addProduct);

//get all Products
router.get("/", productController.getAllProducts);

//get Product by ID
router.get("/:id", productController.getAProduct);

//update a Product
router.put("/:id", productController.updateProduct);

//delete a Book
router.delete("/:id", productController.deleteProduct)
module.exports = router