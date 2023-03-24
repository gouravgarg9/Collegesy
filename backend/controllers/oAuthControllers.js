const passport = require("passport");
const User = require("../models/userSchema");
const googleStrategy = require("passport-google-oauth20").Strategy;

module.exports.googleAuthOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET_KEY,
  callbackURL: "http://localhost:3000/api/users/oauth/google/callback",
};

//google send info about user it got here
module.exports.getGoogleAuthResponse = async (accessToken,refreshToken,profile,done) => {
    //find user,if not create it and then tell you are done by done(err,user);

    const user = await User.findOne({googleID : profile.id});
    if(user)
      done(null,user);
    else{
      await User.create({oauth : "google",googleID : profile.id})
    }
};

module.exports.getLocalResp = async (username, password, done) =>{
    const user = await User.findOne({ username: username });
    if (!user) return done(null, false);
    if (!user.verifyPassword(password)) return done(null, false);
    return done(null, user);
}

module.exports.afterLogin = (req,res) => {
  console.log(req.body);
  res.status(202).json({
    status : "success"
  })
}