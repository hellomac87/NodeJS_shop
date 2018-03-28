var express = require('express');
var router = express.Router();
var ContactsModel = require('../models/ContactsModel');


// contacts  글리스트
router.get('/', function(req, res){
    ContactsModel.find(function(err, contacts){
        res.render('contacts/list',{contacts:contacts});
    });
});

// contacts/write 글작성
router.get('/write', function(req, res){
    res.render('contacts/form');
});
router.post('/write', function(req, res){
    var contacts = new ContactsModel({
        title:req.body.title, 
        email:req.body.email, 
        description:req.body.description
    });
    contacts.save(function(err){
        res.redirect('/contacts')
    });
});
/*
URL
/contacts  글리스트
/contacts/write 글작성
/contacts/detail/:id  상세글보기
/contacts/edit/:id 글수정하기
/contacts/delete/:id 글삭제하기
*/

module.exports = router;