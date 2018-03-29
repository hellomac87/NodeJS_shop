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
    res.render('contacts/form',{ contact : "" });
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

//contacts/detail/:id 상세글보기
router.get('/detail/:id', function(req, res){
    ContactsModel.findOne({'id':req.params.id},function(err, result){
        if(err){
            console.log(err);
        }
        res.render('contacts/detail', {contact : result});
    });
});

//contacts/edit/:id 글수정하기
router.get('/edit/:id', function(req, res){
    ContactsModel.findOne({'id':req.params.id},function(err, result){
        if(err){
            console.log(err);
        }
        res.render('contacts/form', {contact : result});
    });
});

router.post('/edit/:id', function(req, res){
    var query = {
        title:req.body.title, 
        email:req.body.email, 
        description:req.body.description
    }
    ContactsModel.update({ id : req.params.id}, { $set : query },function(err){
        res.redirect('/contacts')
    });
});

//contacts/delete/:id 글삭제하기
router.get('/delete/:id', function(req, res){
    ContactsModel.remove({ id : req.params.id}, function(err){
        if(err){
            console.log(err);
        }
        res.redirect('/contacts');
    });
});
/*
URL

*/

module.exports = router;