var express = require('express');
var router = express.Router();
 
router.get('/', function(req,res){
    if(!req.isAuthenticated()){ //passport에서 제공하는 로그인 체크 함수
        res.send('<script>alert("로그인이 필요한 서비스입니다.");\
        location.href="/accounts/login";</script>')
    }else{
        res.render('chat/index');
    }
});
 
module.exports = router;