const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title : {
        type : String,
        require : true
    },
    description : String,
    price : {
        type : Number,
        require : true,
        minimum: [0, 'Not a valid price.']
    },
    sellerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        require : true
    },
    category : {
        type : String,
        enum : ['Books','Vehicle','Calculator','Stationary','Mattress','Others'],
        default : 'Others'
    },
    images : [String]
},{timestamps:true});

const Product = mongoose.model('Product',productSchema);
module.exports = Product;   