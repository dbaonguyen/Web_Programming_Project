const ProductController = require('../controllers/ProductController');
const router = require("express").Router();

router.put("/:id", ProductController.updateProduct);

module.exports = router;