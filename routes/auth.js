var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new FacebookStrategy({
        // https://developers.facebook.com에서 appId 및 scretID 발급
        clientID: "565885197106966",
        clientSecret: "fe1ac28d01cbc56c1c8fc40274658b24", //입력하세요.
        callbackURL: "https://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email'] //받고 싶은 필드 나열    
    },
    function(accessToken, refreshToken, profile, done){
        //아래 하나씩 찍어보면서 데이터를 참고해주세요.
        console.log(profile);
        //console.log(profile.displayName);
        //console.log(profile.emails[0].value);
        //console.log(profile._raw);
        //console.log(profile._json);
        
    }
))





//로그인 성공시 이동할 주소
router.get('/facebook/success', function(req,res){
    res.send(req.user);
});
 
router.get('/facebook/fail', function(req,res){
    res.send('facebook login fail');
});

module.exports = router;