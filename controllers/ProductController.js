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
}


module.exports = productController; 