var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');

router.get('/', function(req, res){
    res.render('accounts/login');
});
router.get('/login', function(req, res){
    res.render('accounts/login');
})
router.get('/join', function(req, res){
    res.render('accounts/join');
})


module.exports = router;