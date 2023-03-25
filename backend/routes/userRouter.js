const express = require("express");

const userControllers = require("./../controllers/userControllers");
const authControllers = require("./../controllers/authControllers");
const oAuthControllers = require("./../controllers/oAuthControllers");
const router = express.Router();
const passport = require("passport");

require("./../utils/passportUtil");

router.get("/oauth/google", oAuthControllers.getAuth('google'));
router.get(
  "/oauth/google/callback",
  passport.authenticate("google"),
  oAuthControllers.afterLogin
);

router.get('/oauth/facebook',
oAuthControllers.getAuth('facebook'));

router.get('/oauth/facebook/callback',
  passport.authenticate('facebook'),
  oAuthControllers.afterLogin
);


const localStrategy = require("passport-local");
passport.use(new localStrategy(oAuthControllers.getLocalResponse));
router.post(
  "/oauth/local",
  authControllers.checkVerified,
  passport.authenticate("local"),
  oAuthControllers.afterLogin
);

router.get("/logout", oAuthControllers.logout);

///////for testing
router.get("/curr", (req, res) => {
  res.status(202).json(req.user);
});
router.get("/:email", userControllers.getuser);
//

router.post("/signup", authControllers.signup, authControllers.sendSignUpOTP);
router.post("/sendSignUpOTP", authControllers.sendSignUpOTP);
router.post(
  "/verifySignUpOTP",
  authControllers.verifySignUpOTP,
  passport.authenticate("local"),
  oAuthControllers.afterLogin
);

router.post("/forgotPassword", authControllers.forgotPassword);
router.patch(
  "/resetPassword/:token",
  authControllers.resetPassword,
  passport.authenticate("local"),
  oAuthControllers.afterLogin
);

router.patch(
  "/updatePassword",
  authControllers.checkVerified,
  authControllers.updatePassword,
  passport.authenticate("local"),
  oAuthControllers.afterLogin
);

router.delete(
  "/deleteUser",
  authControllers.checkVerified,
  authControllers.deleteUser
);
router.patch(
  "/updateMe",
  authControllers.checkVerified,
  userControllers.userPhotoUpload,
  userControllers.userPhotoResize,
  userControllers.updateMe
);

//router.get('/logout', authController.logout);

module.exports = router;
