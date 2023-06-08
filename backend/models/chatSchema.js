const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    buyerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        require : true
    },
    sellerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        require : true
    },
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product",
        require : true
    },
    active : {
        type : Boolean,
        default : true
    },
    latestMessage : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Message",
    },
    latestRecieveBySeller : Date,
    latestRecieveByBuyer : Date,
    latestSeenBySeller : Date,
    latestSeenByBuyer : Date,

},{timestamps : true});

const Chat = mongoose.model("Chat",chatSchema);
module.exports = Chat;
