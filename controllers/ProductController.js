const {Product} = require("../model/Product");

const productController = {
    // add Product
    addProduct: async(req,res) =>{
        try{
            const newProduct = new Product(req.body);
            const savedProduct = await newProduct.save();
            res.status(200).json(savedProduct);
        }catch(err) {
            res.status(500).json(err);
        }
    },
    // get all Product
    getAllProducts: async(req,res) =>{
        try{
            const products = await Product.find();
            res.status(200).json(products);
        }catch(err) {
            res.status(500).json(err);
        }
    },
    // get Product by ID
    getAProduct: async(req,res) =>{
        try{
            const product = await Product.findById(req.params.id);
            res.status(200).json(product);
        }catch(err) {
            res.status(500).json(err);
        }
    },
    // update a Product
    updateProduct: async(req,res) =>{
        try{
            const product = await Product.findById(req.params.id);
            await product.updateOne({ $set: req.body});
            res.status(200).json("Updated Successfully!");
        }catch(err) {
            res.status(500).json(err);
        }
    },
    // delete Product
    deleteProduct: async(req,res) =>{
        try{
            const product = await Product.findByIdAndDelete(req.params.id);
            if(!product) return res.status(404).send('Customer with the given id not found');
            res.redirect('/');
            res.status(200).json("Deleted Successfully");
        }catch(err) {
            res.status(500).json(err);
        }
    }
};
module.exports = productController;