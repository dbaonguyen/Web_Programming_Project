const ProductController = require('../controllers/ProductController');
const router = require("express").Router();

router.put("/:id", ProductController.updateProduct);
router.post("/", ProductController.addProduct)
router.get("/", ProductController.getAllProduct)

module.exports = router;