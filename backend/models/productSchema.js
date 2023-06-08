const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title : {
        type : String,
        require : true
    },
    description : String,
    price : {
        type : String,
        require : true
    },
    sellerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        require : true
    },

    //categories -  Books/Vehicle/Calculator/Stationary/Mattress/Others


    images : [String]
},{timestamps:true});

const Product = mongoose.model('Product',productSchema);
module.exports = Product;   