const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("./../models/userSchema");
const multer = require("multer");
const FilterObject = require("./../utils/FilterObject");
const sharp = require("sharp");
const path = require("path");

// const multerStorage = multer.diskStorage({
//     destination: (req,file,cb)=>{
//         cb(null,'public/images/users');
//     },
//     filename: (req,file,cb)=>{
//         const extension = file.mimetype.split('/')[1];
//         cb(null,`user_${req.user._id}_at_${Date.now()}.${extension}`)
//     }
// })

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError("Please upload image only", 404), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.userPhotoUpload = upload.single("userImage");

exports.userPhotoReOrg = (req, res, next) => {
  if (!req.file) return next();
  const ext = req.file.originalname.substr(req.file.originalname.lastIndexOf('.'))
  req.file.filename = `${req.user._id}.${ext}`;
  const filePath = path.join(process.env.USER_IMAGE_LOCATION,req.file.filename);
  sharp(req.file.buffer)
    .resize(500, 500, { fit: "fill" })
    .jpeg({ quality: 90 })
    .toFile(filePath);

  next();
};


exports.updateMe = catchAsync(async (req, res, next) => {
  //filter fields applicable
  const applicableFieldsObj = FilterObject(req.body, false, "username");
  
  if (req.file) applicableFieldsObj.photo = req.file.filename;

  //change fields and update
  await User.findByIdAndUpdate(req.user._id, applicableFieldsObj);

  //send response
  res.status(200).json({
    status: "success",
    data: {
      message: "Field Changed",
      user: req.user
    },
  });
});
