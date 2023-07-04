const mongoose = require('mongoose');
const User = require('./userSchema');
const Product = require('./productSchema')
const Message = require('./messgaeSchema')
const messageSchema = new mongoose.Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    content : {
        type : String,
        require : true
    },
    chatId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Chat"
    }
},{timestamps : true});

const chatSchema = new mongoose.Schema({
    buyerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref :   User,
        require : true
    },
    sellerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : User,
        require : true
    },
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : Product,
        require : true
    },
    active : {
        type : Boolean,
        default : true
    },
    latestMessage : messageSchema,
    sReveal : {
        type : Boolean,
        default : false
    },
    bReveal : {
        type : Boolean,
        default : false
    },
    bothReveal : {
        type : Boolean,
        deafult : false
    },
    lastRecieveBySeller : Date,
    lastRecieveByBuyer : Date,
    lastSeenBySeller : Date,
    lastSeenByBuyer : Date,

},{timestamps : true});

const Chat = mongoose.model("Chat",chatSchema);
module.exports = Chat;
