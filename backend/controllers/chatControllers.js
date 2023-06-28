const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Chat = require('./../models/chatSchema');


exports.getChats = catchAsync(async (req,res,next)=>{
    const buyingChats = await Chat.find({buyerId : req.user._id}).populate('latestMessage');
    const sellingChats  = await Chat.find({sellerId : req.user._id}).populate('latestMessage');
    res.status(200).json({
        status : 'success',
        data : {
            buyingChats,
            sellingChats
        }
    })
})

exports.getChatbyProduct = catchAsync(async (req,res,next)=>{
    //if user is seller
    let chat;
    if(req.product.sellerId.equals(req.user._id)){
        //give all chats with product_id
        chat = await Chat.find({productId : req.product._id});
    }
    else{//if buyer

        //check if chat exist for buyer and product 
        chat = await Chat.findOne({
            $and: [
                {buyerId:{$eq:req.user._id}},
                {productId:{$eq:req.product._id}}
            ]
        });
        //create chat if don't exist already
        if(!chat){
            if(! req.product.interestedViews)req.product.interestedViews = 0;
            req.product.interestedViews++;
            Product.findByIdAndUpdate(req.product._id,req.product);
            chat = await Chat.create({
                buyerId : req.user._id,
                productId : req.product._id,
                sellerId : req.product.sellerId
            })
        }
    }

    res.status(200).json({
        status : 'success',
        data : {
            chat
        }
    })
})

exports.blockChat = catchAsync(async (req,res,next)=>{
    const {chatId} = req.body;
    const chat = await Chat.findById(chatId);
    if(!chat || !chat.active || !(chat.buyerId.equals(req.user._id) || chat.sellerId.equals(req.user._id)))
        return next(new AppError('Forbidden',403));
    await Chat.findByIdAndUpdate(chat._id,{active : false})
    res.status(200).json({
        status : 'success'
    })
})