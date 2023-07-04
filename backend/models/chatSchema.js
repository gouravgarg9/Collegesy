const mongoose = require("mongoose");
const User = require("./userSchema");
const Product = require("./productSchema");
const Message = require("./messgaeSchema");

const chatSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      require: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      require: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Product,
      require: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: Message },
    
    sReveal: {
      type: Boolean,
      default: false,
    },
    bReveal: {
      type: Boolean,
      default: false,
    },
    bothReveal: {
      type: Boolean,
      deafult: false,
    },
    lastRecieveBySeller: Date,
    lastRecieveByBuyer: Date,
    lastSeenBySeller: Date,
    lastSeenByBuyer: Date,
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
