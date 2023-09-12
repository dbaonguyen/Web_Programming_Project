const Customer = require('../model/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = (req, res, next) => {
    let customer = new Customer({
        username: req.body.username,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
    });

    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
        if (err) {
            res.json({
                error: err,
            });
        } else {
            customer.password = hashedPass; // Set the hashed password

            customer.save()
                .then((savedCustomer) => {
                    res.json({
                        message: 'Customer registered successfully!',
                        customer: savedCustomer,
                    });
                })
                .catch((error) => {
                    res.json({
                        message: 'An error occurred during registration!',
                        error: error,
                    });
                });
        }
    });
};

module.exports = {
    register,
};
