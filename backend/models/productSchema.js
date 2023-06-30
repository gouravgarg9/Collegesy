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
        enum : ['Books','SmartPhones','Fashion','Health','Accessories','Fitness','Routers','Furniture','Elctronics','Vehicle','Calculator','Stationary','Others'],
        default : 'Others'
    },
    imgCount : {
        type : Number,
        default : 0
    },
    age : {
        type : Number
    },
    interestedViews : {
        type : Number,
        default : 0
    },
    images : [String]
},{timestamps:true});

const Product = mongoose.model('Product',productSchema);
module.exports = Product;   