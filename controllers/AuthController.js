const Customer =  require('../model/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function(err,hashedPass) {
        if (err){
            res.json({
                error:err
            })
        }
        let customer = new Customer({
            username : req.body.username,
            password : hashedPass,
            address: req.body.address,
            email: req.body.email,
            phone: req.body.phone
        
        })
        customer.save().then(customer =>{
            res.json({
                message : 'User Added Successfully!'
            })
        }).catch(error => {
            res.json({
                message: 'An Error occured'
            })
        })
    })

   
    
}



module.exports = {
    register
}