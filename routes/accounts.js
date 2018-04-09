var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');
var passwordHash = require('../libs/passwordHash');
//passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var loginRequired = require('../libs/loginRequired');

//passport serializeUser, deserializeUser
passport.serializeUser(function (user, done) {
    console.log('serializeUser');
    done(null, user);
});
 
passport.deserializeUser(function (user, done) {
    //이 시점에서 user가 req에 담김
    var result = user;
    result.password = ''; //passowrd 지우기
    console.log('deserializeUser');
    done(null, result); 
});

//passport LocalStrategy 정책 작성
passport.use(new LocalStrategy({
        usernameField:'username',
        passwordField:'password',
        passReqToCallback:true
    },
    function(req, username, password, done){
        UserModel.findOne({ 
            username : username ,
            password : passwordHash(password)},
            function(err, user){
                if(!user){
                    return done(null, false,{ message:'아이디 또는 비밀번호 오류 입니다'});
                }else{
                    return done(null, user);
                }
            }
        );
    }
));

router.get('/', function(req, res){
    res.render('accounts/login');
});

// Router 회원가입
router.get('/join', function(req, res){
    res.render('accounts/join');
});

router.post('/join', function(req, res){
    var User = new UserModel({
        username: req.body.username,
        password:passwordHash(req.body.password), //암호화
        displayname : req.body.displayname
    });

    User.save(function(err){
        res.send('<script>alert("회원가입 성공");\
        location.href="/accounts/login";</script>')
    })
});

// Router 로그인
router.get('/login', function(req, res){
    res.render('accounts/login', { flashMessage : req.flash().error });
})

router.post('/login',
    passport.authenticate('local', { //passport 미들웨어 추가
        failureRedirect:'/accounts/login', //실패시 리다이렉트
        failureFlash:true //실패시 플래시 메세지
    }),
    function(req, res){
        res.send('<script>alert("로그인 성공");\
        location.href="/";</script>');
    }
);

router.get('/success', function(req, res){
    res.send(req.user);
});
 
 
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/accounts/login');
});

//my profile
router.get('/profile', loginRequired, function(req, res){
    
    res.render('accounts/profile', {user:req.user});

});
//my profile edit
router.get('/profile/edit', function(req, res){
    res.render('accounts/profile_edit', {user:req.user});
});

module.exports = router;