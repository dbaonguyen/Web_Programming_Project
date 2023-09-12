const mongoose = require('mongoose');
const Schema = mongoose.Schema

const customerSchema = new Schema({
    username : {
        type: String,
        unique : true
    },
    password : {
        type: String

    },
    // address : {
    //     type : String
    // },
    email : {
        type : String
    },
    // phone : {
    //     type : String
    // }
}); ({timestamps : true})

const Customer = mongoose.model('Customer',customerSchema);
module.exports = Customer;