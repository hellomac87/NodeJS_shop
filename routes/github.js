var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

//GitHubStrategy
passport.use(new GitHubStrategy({
    clientID: 'e9b7233d46debc6f19bd',
    clientSecret: '4c370b6f3c43f2ba107f1becfee10d7e92c65de3',
    callbackURL: "http://127.0.0.1:3000/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      
     UserModel.findOne({ 'username': 'gh_' + profile.id }, function (err, user) {
        if(!user){
            var regData = {
                username : "gh_" + profile.id,
                password: "github_login",
                displayName : profile.displayName
            };
            var User = new UserModel(regData);
            User.save(function(err){
                //done(null, regData);
                return cb(err, regData);
            });
        }else{
            //done(null, user);
            return cb(err, user);
        }
        
    });
    
  }
));

router.get('/',
  passport.authenticate('github'));

router.get('/callback', 
  passport.authenticate('github',
        { 
            successRedirect: '/',
            failureRedirect: '/accounts/login'
        }
    )
);


module.exports = router;