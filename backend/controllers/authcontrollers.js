const User = require("./../models/userSchema");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const Mail = require("./../utils/email");
const crypto = require("crypto");
const OTP = require("./../utils/otpGenerator");

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body?.email });
  if (user && user.verified)
    return next(new AppError("Account exists. Just Login to use", 404));
  if (user && !user.verified)
    return next(
      new AppError(
        "Account exists but not verfied. Verify by post request with email at /api/users/verifySignUpOTP",
        404
      )
    );

  const newUser = await User.create({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  if (!newUser) next(new AppError(`Account can't be created`), 404);
  req.body.email = newUser.email;
  next();
});

exports.sendSignUpOTP = catchAsync(async (req, res, next) => {
  const newUser = await User.findOne({ email: req.body?.email });

  if (!newUser)
    return next(new AppError("No Sign up request from this account", 404));
  if (newUser.verified)
    return next(new AppError(`Already Verified.Log in`, 404));

  try {
    await OTP.generateSendSaveOTP(newUser);
  } catch (err) {
    console.error(err);
    return next(new AppError(`Problem Generating OTP. Try Again.`, 500));
  }

  res.status(200).json({
    status: "success",
    message: "OTP sent",
  });
});

exports.verifySignUpOTP = catchAsync(async (req, res, next) => {
  let newUser = await User.findOne({ email: req.body?.email }).select("+password");

  if (!newUser)
    return next(new AppError("No Sign up request from this account", 404));
  if (newUser.verified)
    return next(new AppError(`Already Verified.Log in`, 404));

  const hashedCandidateOTP = crypto
    .createHash("sha256")
    .update(req.body.otp)
    .digest("hex");

  if (Date.now() > Date.parse(newUser.OTPExpires))
    return next(new AppError("OTP Expired,Try Again", 404));

  if (hashedCandidateOTP !== newUser.hashedOTP)
    return next(new AppError("Wrong OTP,Try Again", 404));

  await newUser.updateOne({
    verified: true,
    OTPExpires: undefined,
    hashedOTP: undefined,
  });

  new Mail(newUser).sendVerified();
  req.body.username = newUser.username;
  req.body.password = newUser.password;
  next(); //passport is next to it
});


// recieves mail in body and send resetkey
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("No user found", 404));

  //generate key and update user
  const resetKey = user.createPassResetKey();
  await user.save({ validateBeforeSave: false });

  //generate url and send mail
  const resetRoute = "api/users/resetPassword";
  const resetUrl = `${req.protocol}://${req.hostname}/${resetRoute}/${resetKey}`;
  try {
    await new Mail(user).sendResetPasswordURL({ resetUrl });
    res.status(200).json({
      status: "success",
      message: "Reset Link sent to mail id",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("Unable to send mail. Try later", 500));
  }
});

// recieves key verify it and set new passsword
exports.resetPassword = catchAsync(async (req, res, next) => {
  //hash token and ger user
  const hashtoken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({ passwordResetToken: hashtoken }).select("+password");

  if (!user) return next(new AppError("Token is invalid", 404));

  let message = null;
  if (Date.parse(user.passwordResetExpires) < Date.now())
    message = "Token Expired";
  else if (await user.verifyPassword(req.body.password, user.password))
    message = "Same as old password.Try new one.";
  else {
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
  }

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  if (message) {
    await user.save({ validateBeforeSave: false });
    return next(new AppError(message, 404));
  }

  await user.save();
  req.body.username = user.username;
  next(); //passport is next to it
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1.get user
  const user = await User.findById(req.user.id).select("+password");

  //2.checkforPassword
  const passwordCorrect = await user.verifyPassword(
    req.body.currentPassword,
    user.password
  );

  user.password = undefined;
  if (!user || !passwordCorrect)
    return next(new AppError("Wrong Password", 404));
  else if (req.body.currentPassword === req.body.newPassword)
    return next(new AppError("Same as old password.Try new one.", 404));

  //3.updateNewPassword
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.confirmNewPassword;
  await user.save();

  //4.log user in again
  req.body.username = user.username;
  req.body.password = user.password;
  next(); //passport
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  //find user
  const user = await User.findById(req.user.id).select("+password");
  const correct = user.verifyPassword(req.body.password, user.password);
  user.password = undefined;
  if (!user || !correct) return next(new AppError("Invalid credentials", 404));

  await user.update({ active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.checkVerified = catchAsync(async (req, res, next) => {
  const email = req.user?.email || req.body.user?.email || req.body.email;
  const username = req.user?.username || req.body.user?.username || req.body.username;
  let user = null;
  if(email)
    user = await User.findOne({ email });
  else
    user = await User.findOne({username})
  if (!user) return next(new AppError("Wrong Email", 404));

  if (!user.verified)
    return next(
      new AppError(
        "Incomplete Sign Up! First Verify yourself at /api/users/verifySignUpOTP",
        404
      )
    );
  next();
});
