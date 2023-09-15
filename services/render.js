const axios = require('axios');

exports.vendor = (req,res) => {
    //make a get reques to api/products
    axios.get('http://localhost:3000/api/products')
        .then(function(respone){
            res.render("vendor-page", {products: respone.data})
        })
        .catch(err =>{
            res.send(err);
        })
}

exports.add_product = (req,res) =>{
    res.render("add-product")
}

exports.update_product = (req,res) =>{
    axios.get('http://localhost:3000/api/products', {params : {id: req.query.id}})
        .then(function(productData){
            res.render("update-product", {product: productData.data})
        })
    //res.render("update-product")
        .catch(err => {
            res.send(err);
        })
}