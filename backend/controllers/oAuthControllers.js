const passport = require("passport");
const User = require("../models/userSchema");

module.exports.getAuth = (strategy)=>{
  return passport.authenticate(strategy, {
    failureRedirect: `${process.env.OAUTH_FAILURE_REDIRECT}`,
    scope: ["email"]
  })
}

//google send info about user it got here
module.exports.getOAuthResponse = async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  //find user,if not create it and then tell you are done by done(err,user);
  try {
    let user = await User.findOne({ oauthId: profile.id });
    console.log(profile)
    if (!user)
      user = await User.create({
        oauthType: profile.provider,
        oauthId: profile.id,
        username: profile.id,
        email: profile.emails[0].value,
      });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
};

module.exports.getLocalResponse = async (username, password, done) => {
  try {
    let user = await User.findOne({ username }).select("+password");
    if (!user)
      user = await User.findOne({ email: username }).select("+password");

    if (!user) {
      return done(null, false);
    }
    if (!user.verifyPassword(password, user.password)) {
      return done(null, false);
    }
    user.password = undefined;
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

module.exports.afterLogin = (req, res) => {
  res.status(202).json({
    status: "success.Logged in.",
  });
};

module.exports.logout = (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).json({
    message: "logged out succesfully",
  });
};
