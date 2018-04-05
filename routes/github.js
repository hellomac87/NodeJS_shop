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
      /*
      console.log('accessToken : ', accessToken);
      console.log('refreshToken : ', refreshToken);
      console.log('profile : ', profile);
      console.log('cb : ', cb);
      */
    
     UserModel.findOne({ githubId: 'gh_' + profile.id }, function (err, user) {
        return cb(err, user);
    });
    
  }
));

router.get('/',
  passport.authenticate('github'));

router.get('/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.send(req.user);
  });


module.exports = router;