var express = require('express');
var router = express.Router();
var ContactsModel = require('../models/ContactsModel');

router.get('/', function(req, res){
    res.render('contacts/list');
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