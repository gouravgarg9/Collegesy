const catchAsync = require('./../utils/catchAsync');
const Product = require('../models/productSchema');
const AppError = require('../utils/appError');
const Chat = require('./../models/chatSchema');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

exports.checkIfSeller = catchAsync(async (req,res,next)=>{
    const sellerId = req.product.sellerId;
    if(! req.user._id.equals(sellerId))
        return next(new AppError('Access Denied',403));
    return next();
})

exports.putProductOnReq = catchAsync(async (req,res,next)=>{
    
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    
    if(!product) return next(new AppError('No Product with providede id',404));
    req.product = product;

    return next();
})

exports.getAllProducts = catchAsync(async (req,res,next)=>{
    const products = await Product.find();
    res.status(200).json({
        status:'success',
        data:{
            products
        }
    });
})

exports.getProduct = catchAsync(async (req,res,next)=>{
    res.status(200).json({
        status:'success',
        data:{
            product : req.product
        }
    });
})

const multerDestination = (req,file,cb)=>{
    cb(null,process.env.PRODUCT_IMAGES_LOCATION)
}
const multerFilename = (req,file,cb)=>{
    const ext = file.originalname.substr(file.originalname.lastIndexOf('.'))
    const filename = `${req.product._id}_${req.product.images.length}${ext}`;
    req.product.images.push(filename);
    cb(null,filename);
}
const multerFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith("image")) cb(null,true);
    else cb(null,false);
    //else cb(new AppError('not an image',404),false);
}

const multerStorage = multer.diskStorage({
    destination : multerDestination,
    filename : multerFilename
})
const multerUpload = multer({
    storage : multerStorage,
    fileFilter : multerFilter
})

exports.productPhotoUpload = multerUpload.array('productImages',10);
exports.productPhotoReOrg = catchAsync(async (req,res,next)=>{
    await Product.findByIdAndUpdate(req.product._id,req.product);
    return next();
})

exports.updateProduct = catchAsync(async (req,res,next)=>{
    req.product.title = req.body?.title || req.product.title;
    req.product.description = req.body?.description || req.product.description;
    req.product.price = req.body?.price || req.product.price;
    await Product.findByIdAndUpdate(req.product._id,req.product);
    res.status(200).json({
        status:'success',
        data:{
            product : req.product
        }
    });
})

exports.deleteAllProductImages = catchAsync(async (req,res,next)=>{
    for(const filename of req.product.images){
        const filePath = path.join(process.env.PRODUCT_IMAGES_LOCATION,filename);
        fs.unlink(filePath,(err)=>{if(err)console.log(err)});
    }
    req.product.images = [];
    await Product.findByIdAndUpdate(req.product._id,req.product);
    res.status(200).json({
        status:'success',
        data:{
            product : req.product
        }
    });
});;

exports.deleteOneProductImage = catchAsync(async (req,res,next)=>{
    if(!req.body?.filename)return next(new AppError('No file mentioned',404)); 
    req.product.images.splice(req.product.images.indexOf(req.body.filename),1);
    const filePath = path.join(process.env.PRODUCT_IMAGES_LOCATION,req.body.filename);
    fs.unlink(filePath,(err)=>{if(err)console.log(err)});
    Product.findByIdAndUpdate(req.product._id,req.product);
    res.status(200).json({
        status : 'success',
        data : {
            product : req.product        
        }
    })
});

exports.deleteProduct = catchAsync(async (req,res,next)=>{
    await Chat.updateMany({productId : req.product._id},{"$set":{"active": false}});
    await Product.findByIdAndDelete( req.product._id);
    res.status(200).json({
        status:'success'
    });
})

exports.createProduct = catchAsync(async (req,res,next)=>{
    const product = new Product({
        title : req.body.product.title,
        description : req.body.product.description,
        price : req.body.product.price,
        sellerId : req.user._id
    });

    await product.save();
    res.status(200).json({
        status:'success',
        data:{
            product
        }
    });
})

