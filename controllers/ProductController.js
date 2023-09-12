const Product= require("../model/Product");

const productController = {
    updateAuthor: async (req, res) => {
        try {
          const product = await Product.findById(req.params.id);
          await product.updateOne({ $set: req.body });
          res.status(200).json("Updated successfully!");
        } catch (err) {
          res.status(500).json(err);
        }
      },    

    addProduct: async (req, res) =>{
        try {
          const newProduct = new Product(req.body);
          const savedProduct = await newProduct.save();
          res.status(200).json(savedProduct)
        } catch (err) {
          res.status(500).json(err);
        }
      },
    getAllProduct: async (req, res) =>{
        try{
          const products = await Product.find();
          res.status(200).json(products);
        } catch (err) {
          res.status(500).json(err);
        }
    },
    deleteProduct: async (req, res,) =>{
      try {
        const id = req.params.id;
        const product = await Product.findByIdAndRemove(id);
        if(!product) return res.status(404).send('Product with the given id not found');
        res.redirect('/');        
    } catch (err) {
        res.status(500).send(err);
    }
  },
}
module.exports = productController;