const mongoose = require('mongoose');
const Joi = require('joi');

const productSchema = new mongoose.Schema({
    productname: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    productdescription: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
    }, 
    price: {
        type: Number,
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

const validateProduct = (product) => {
    const schema = {
        productname: Joi.string().min(5).max(50).required(),
        productdescription: Joi.string().min(5).max(50).required(),
        price: Joi.number().required()
    }

    return Joi.validate(product, schema);
}


module.exports.Product = Product;
module.exports.validate = validateProduct;