const {Product} = require("../model/Product");

//create and save new product
exports.create = (req,res) => {
    //validate request
    if(!req.body){
        res.status(400).send({message: "Content can not be empty"});
        return;
    }
    //new product
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    })
    //save product in db
    product
        .save(product)
        .then(data => { 
            //res.send(data) 
            res.redirect('/vendor')
        })
        .catch(err => { res.status(500).send({message: err.message || "Some error occurred while creating a create operation"}) })
};

//get all products/ a product
exports.find = (req,res) => {
    if(req.query.id){
        const id = req.query.id;

        Product.findById(id)
            .then(data => {
                if(!data){
                    res.status(400).send({message:`Not found with specific id ${id}`})
                }else{
                    res.send(data)
                }
            })
            .catch(err=>{
                res.status(500).send({message:`Error getting product with id ${id}`})
            })
    
    }else{
    Product.find()
        .then(product => { res.send(product) })
        .catch(err => { res.status(500).send({message: err.message || "Error occurred while getting product information"}) })
    }
};

//update a product by id
exports.update = (req,res) => {
    if(!req.body){
        return res
            .status(400)
            .send({message: "Data to update can not be empty"})
    }
    const id = req.params.id;
    Product.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({message: `Cannot update product with id ${id}`})
            }else{
                res.send(data)
            }
        })
        .catch(err => { 
            res.status(500).send({message:"Error updare product information"})
        })
};

//delete a product by id
exports.delete = (req,res) => {
    const id = req.params.id;
    Product.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({message: `Cannot delete with id ${id} `})
            }else{
                res.send({
                    message: "Product was deleted successfully!"
                })
            }
        })
        .catch(err => {
            res.status(500).send({message:`Could not delete product with id ${id}`})
        })
};

